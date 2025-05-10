from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS  # Import CORS
import os
import sqlite3
from datetime import datetime, timedelta
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

# Create Flask app
app = Flask(__name__)
# Add CORS support
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(32)

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'simple_hostel.db')

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # For development environment, skip token check completely
        # Create a dummy admin object for compatibility
        class DummyAdmin:
            id = 1
            username = "admin"
        
        # Pass the dummy admin to the wrapped function
        return f(DummyAdmin(), *args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login attempt with username: {data.get('username')}")
    
    # Check for the specific admin credentials
    if data.get('username') == 'svce' and data.get('password') == '1234':
        token = secrets.token_hex(16)  # Generate a random token
        return jsonify({
            'token': token, 
            'message': 'Authentication successful',
            'user': {
                'username': 'svce',
                'role': 'admin'
            }
        })
    else:
        print(f"Login failed: Invalid credentials")
        return jsonify({'message': 'Invalid username or password'}), 401

# Room routes
@app.route('/api/rooms', methods=['GET'])
@token_required
def get_rooms(current_admin):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM room")
    rooms = cursor.fetchall()
    
    conn.close()
    return jsonify(rooms)

@app.route('/api/rooms', methods=['POST'])
@token_required
def create_room(current_admin):
    data = request.get_json()
    print(f"Received room creation data: {data}")
    
    # Validate the data
    required_fields = ['room_number', 'capacity', 'room_type', 'price_per_month']
    for field in required_fields:
        if field not in data:
            print(f"Missing required field: {field}")
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    try:
        # Ensure capacity and price are numeric
        capacity = int(data['capacity'])
        price = float(data['price_per_month'])
        
        # Ensure values are valid
        if capacity <= 0:
            return jsonify({'message': 'Capacity must be greater than 0'}), 400
        if price <= 0:
            return jsonify({'message': 'Price must be greater than 0'}), 400
        
        # Check if room number already exists
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM room WHERE room_number = ?", (data['room_number'],))
        existing_room = cursor.fetchone()
        if existing_room:
            conn.close()
            return jsonify({'message': 'Room number already exists'}), 400
        
        print(f"Inserting new room: {data['room_number']}, capacity: {capacity}, type: {data['room_type']}, price: {price}")
        
        cursor.execute(
            "INSERT INTO room (room_number, capacity, current_occupancy, room_type, price_per_month, status) VALUES (?, ?, ?, ?, ?, ?)",
            (data['room_number'], capacity, 0, data['room_type'], price, 'available')
        )
        
        room_id = cursor.lastrowid
        conn.commit()
        
        # Return the created room
        cursor.execute("SELECT * FROM room WHERE id = ?", (room_id,))
        created_room = cursor.fetchone()
        
        conn.close()
        print(f"Room created successfully: {created_room}")
        return jsonify({'message': 'Room created successfully', 'room': created_room}), 201
    except ValueError as e:
        print(f"Value error: {str(e)}")
        return jsonify({'message': f'Invalid numeric value: {str(e)}'}), 400
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"Error creating room: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Member routes
@app.route('/api/members', methods=['GET'])
@token_required
def get_members(current_admin):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT m.*, r.room_number 
    FROM member m
    LEFT JOIN room r ON m.room_id = r.id
    """)
    members = cursor.fetchall()
    
    conn.close()
    return jsonify(members)

@app.route('/api/members', methods=['POST'])
@token_required
def create_member(current_admin):
    data = request.get_json()
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        # Check if room is full
        cursor.execute("SELECT current_occupancy, capacity FROM room WHERE id = ?", (data['room_id'],))
        room = cursor.fetchone()
        if room['current_occupancy'] >= room['capacity']:
            conn.close()
            return jsonify({'message': 'Room is full'}), 400
        
        cursor.execute(
            "INSERT INTO member (name, email, phone, room_id, emergency_contact) VALUES (?, ?, ?, ?, ?)",
            (data['name'], data['email'], data['phone'], data['room_id'], data.get('emergency_contact', ''))
        )
        
        # Update room occupancy
        cursor.execute(
            "UPDATE room SET current_occupancy = ? WHERE id = ?",
            (room['current_occupancy'] + 1, data['room_id'])
        )
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Member added successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 400

# Reports
@app.route('/api/reports/occupancy', methods=['GET'])
@token_required
def occupancy_report(current_admin):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    cursor.execute("SELECT room_number, capacity, current_occupancy FROM room")
    rooms = cursor.fetchall()
    
    # Calculate occupancy rate for each room
    for room in rooms:
        room['occupancy_rate'] = (room['current_occupancy'] / room['capacity']) * 100 if room['capacity'] > 0 else 0
    
    conn.close()
    return jsonify(rooms)

@app.route('/api/reports/payments', methods=['GET'])
@token_required
def payments_report(current_admin):
    # Just return dummy data for now since we don't have a payments table
    return jsonify({
        'payments': [],
        'total_amount': 0
    })

# Payments routes
@app.route('/api/payments', methods=['GET'])
@token_required
def get_payments(current_admin):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    
    # Check if the payments table exists, create it if it doesn't
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payment'")
    if not cursor.fetchone():
        cursor.execute('''
        CREATE TABLE payment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id INTEGER,
            amount REAL,
            payment_type TEXT,
            payment_date TEXT,
            due_date TEXT,
            status TEXT,
            description TEXT,
            FOREIGN KEY (member_id) REFERENCES member (id)
        )
        ''')
        conn.commit()
        conn.close()
        return jsonify([])
    
    cursor.execute("SELECT * FROM payment ORDER BY payment_date DESC")
    payments = cursor.fetchall()
    
    conn.close()
    return jsonify(payments)

@app.route('/api/payments', methods=['POST'])
@token_required
def create_payment(current_admin):
    data = request.get_json()
    print(f"Received payment data: {data}")
    
    # Validate the data
    required_fields = ['member_id', 'amount', 'payment_type']
    for field in required_fields:
        if field not in data:
            print(f"Missing required field: {field}")
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    try:
        # Ensure amount is numeric
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'message': 'Amount must be greater than 0'}), 400
        
        # Check if member exists
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = dict_factory
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM member WHERE id = ?", (data['member_id'],))
        member = cursor.fetchone()
        if not member:
            conn.close()
            return jsonify({'message': 'Member not found'}), 400
        
        # Set payment date to current date if not provided
        payment_date = data.get('payment_date', datetime.now().strftime('%Y-%m-%d'))
        
        # Set default status to 'completed'
        status = data.get('status', 'completed')
        
        print(f"Creating payment: {amount} for member {data['member_id']}, type: {data['payment_type']}")
        
        # Check if payments table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payment'")
        if not cursor.fetchone():
            cursor.execute('''
            CREATE TABLE payment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                member_id INTEGER,
                amount REAL,
                payment_type TEXT,
                payment_date TEXT,
                due_date TEXT,
                status TEXT,
                description TEXT,
                FOREIGN KEY (member_id) REFERENCES member (id)
            )
            ''')
        
        cursor.execute(
            "INSERT INTO payment (member_id, amount, payment_type, payment_date, due_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                data['member_id'], 
                amount,
                data['payment_type'],
                payment_date,
                data.get('due_date', None),
                status,
                data.get('description', '')
            )
        )
        
        payment_id = cursor.lastrowid
        conn.commit()
        
        # Return the created payment
        cursor.execute("SELECT * FROM payment WHERE id = ?", (payment_id,))
        created_payment = cursor.fetchone()
        
        conn.close()
        print(f"Payment created successfully: {created_payment}")
        return jsonify({'message': 'Payment recorded successfully', 'payment': created_payment}), 201
    except ValueError as e:
        print(f"Value error: {str(e)}")
        return jsonify({'message': f'Invalid numeric value: {str(e)}'}), 400
    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print(f"Error creating payment: {str(e)}")
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/')
def home():
    return '''
    <h1>Hostel Management System API</h1>
    <p>This is a simplified API with token authentication disabled for development.</p>
    <h2>Available Endpoints:</h2>
    <ul>
        <li><code>POST /api/login</code> - Login (automatically succeeds)</li>
        <li><code>GET /api/rooms</code> - Get all rooms</li>
        <li><code>POST /api/rooms</code> - Create new room</li>
        <li><code>GET /api/members</code> - Get all members</li>
        <li><code>POST /api/members</code> - Add new member</li>
        <li><code>GET /api/reports/occupancy</code> - Get occupancy report</li>
        <li><code>GET /api/reports/payments</code> - Get payments report</li>
        <li><code>GET /api/payments</code> - Get all payments</li>
        <li><code>POST /api/payments</code> - Create new payment</li>
    </ul>
    <p>Note: Authentication is disabled for development purposes.</p>
    '''

if __name__ == '__main__':
    print("Starting Hostel Management System API...")
    print("API available at http://localhost:5001")
    app.run(debug=True, port=5001) 