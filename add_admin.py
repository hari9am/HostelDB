import sqlite3
import secrets
import hashlib
import os

def create_password_hash(password):
    """Create a simple password hash using SHA-256."""
    salt = secrets.token_hex(8)
    hash_obj = hashlib.sha256((password + salt).encode())
    return f"sha256${salt}${hash_obj.hexdigest()}"

def add_admin_user(username, password, email):
    """Add a new admin user to the database."""
    db_path = os.path.join(os.path.dirname(__file__), 'simple_hostel.db')
    
    # Check if database exists
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if admin table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin'")
    if not cursor.fetchone():
        print("Creating admin table...")
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            email TEXT NOT NULL
        )
        ''')
    
    # Check if username already exists
    cursor.execute("SELECT id FROM admin WHERE username = ?", (username,))
    if cursor.fetchone():
        print(f"Admin user '{username}' already exists. Choose a different username.")
        conn.close()
        return False
    
    # Create password hash
    password_hash = create_password_hash(password)
    
    try:
        # Insert new admin user
        cursor.execute(
            "INSERT INTO admin (username, password_hash, email) VALUES (?, ?, ?)",
            (username, password_hash, email)
        )
        conn.commit()
        print(f"Admin user '{username}' added successfully!")
        print(f"Login with username: {username} and your chosen password")
        conn.close()
        return True
    except Exception as e:
        print(f"Error adding admin user: {str(e)}")
        conn.close()
        return False

if __name__ == "__main__":
    print("Add New Admin User")
    print("==================")
    print("This script will add a new admin user to the database.")
    print("Current default admin: svce / 1234")
    print()
    
    username = input("Enter username: ")
    password = input("Enter password: ")
    email = input("Enter email: ")
    
    if not username or not password or not email:
        print("All fields are required.")
    else:
        add_admin_user(username, password, email) 