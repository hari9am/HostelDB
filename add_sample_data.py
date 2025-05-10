import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'simple_hostel.db')

def add_sample_data():
    """Add sample rooms and members to the database"""
    
    # Check if database exists
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        print("Please run simple_app.py first to create the database.")
        return False
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Add sample rooms
    sample_rooms = [
        ('101', 2, 0, 'Single', 250.00, 'available'),
        ('102', 2, 0, 'Single', 250.00, 'available'),
        ('201', 3, 0, 'Double', 350.00, 'available'),
        ('202', 3, 0, 'Double', 350.00, 'available'),
        ('301', 4, 0, 'Dormitory', 200.00, 'available'),
        ('302', 4, 0, 'Dormitory', 200.00, 'available'),
    ]
    
    # Check if rooms already exist
    cursor.execute("SELECT COUNT(*) FROM room")
    room_count = cursor.fetchone()[0]
    
    if room_count == 0:
        cursor.executemany(
            "INSERT INTO room (room_number, capacity, current_occupancy, room_type, price_per_month, status) VALUES (?, ?, ?, ?, ?, ?)",
            sample_rooms
        )
        print(f"Added {len(sample_rooms)} sample rooms to the database.")
    else:
        print(f"Rooms already exist in the database ({room_count} rooms found).")
    
    # Add sample members
    sample_members = [
        ('John Doe', 'john@example.com', '555-1234', 1, 'Jane Doe (Mother) 555-5678'),
        ('Jane Smith', 'jane@example.com', '555-4321', 2, 'John Smith (Father) 555-8765'),
        ('Mike Johnson', 'mike@example.com', '555-6789', 3, 'Lisa Johnson (Sister) 555-9876'),
    ]
    
    # Check if members already exist
    cursor.execute("SELECT COUNT(*) FROM member")
    member_count = cursor.fetchone()[0]
    
    if member_count == 0:
        for name, email, phone, room_id, emergency_contact in sample_members:
            # Update room occupancy
            cursor.execute("SELECT current_occupancy FROM room WHERE id = ?", (room_id,))
            current_occupancy = cursor.fetchone()[0]
            
            cursor.execute(
                "INSERT INTO member (name, email, phone, room_id, emergency_contact) VALUES (?, ?, ?, ?, ?)",
                (name, email, phone, room_id, emergency_contact)
            )
            
            cursor.execute(
                "UPDATE room SET current_occupancy = ? WHERE id = ?",
                (current_occupancy + 1, room_id)
            )
        
        print(f"Added {len(sample_members)} sample members to the database.")
    else:
        print(f"Members already exist in the database ({member_count} members found).")
    
    conn.commit()
    conn.close()
    
    print("Sample data added successfully!")
    return True

if __name__ == "__main__":
    print("Adding sample data to the Hostel Management System...")
    add_sample_data()
    print("\nYou can now access the data at:")
    print("- http://127.0.0.1:5000/api/rooms")
    print("- http://127.0.0.1:5000/api/members") 