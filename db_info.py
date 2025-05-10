import sqlite3
import os

def show_database_info(db_path):
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found.")
        return
    
    print(f"Database file: {db_path} (Size: {os.path.getsize(db_path)/1024:.2f} KB)")
    print("-" * 50)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print(f"Found {len(tables)} tables:")
    print("-" * 50)
    
    for table in tables:
        table_name = table[0]
        print(f"\nTABLE: {table_name}")
        
        # Get table structure
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        print("  Columns:")
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, is_pk = col
            print(f"    - {col_name} ({col_type})", end="")
            if is_pk:
                print(" PRIMARY KEY", end="")
            if not_null:
                print(" NOT NULL", end="")
            print()
        
        # Count rows in table
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        row_count = cursor.fetchone()[0]
        print(f"  Records: {row_count}")
        
        # Show sample data (first 5 rows)
        if row_count > 0:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
            rows = cursor.fetchall()
            if rows:
                print("  Sample data:")
                for row in rows:
                    print(f"    {row}")
    
    conn.close()

if __name__ == "__main__":
    db_files = ["simple_hostel.db", "hostel.db"]
    
    for db_file in db_files:
        if os.path.exists(db_file):
            show_database_info(db_file)
            print("\n" + "=" * 80 + "\n") 