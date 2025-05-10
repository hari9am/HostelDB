import os
import sys
import subprocess

def main():
    print("Welcome to Hostel Management System Quickstart")
    print("==============================================")
    
    # Install required packages
    print("Installing required packages...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    
    # Explicitly install PyJWT to ensure it's available
    print("Ensuring PyJWT is installed...")
    subprocess.run([sys.executable, "-m", "pip", "install", "PyJWT==2.8.0"], check=True)
    print("Packages installed successfully!")
    
    # Check if SQLite database exists, if not initialize it
    if not os.path.exists("hostel.db"):
        print("Database not found. Creating a new database...")
        subprocess.run([sys.executable, "init_database.py"], check=True)
        print("Database created successfully!")
    else:
        print("Database found!")
    
    # Run the backend
    print("\nStarting the backend server...")
    print("API will be available at http://localhost:5000")
    subprocess.run([sys.executable, "run_backend.py"], check=True)

if __name__ == "__main__":
    main() 