# Hostel Management System

A comprehensive hostel management solution with admin login, room management, member management, and payment tracking.

## System Overview

This system consists of:

1. **React Frontend**: Modern UI for hostel administration
2. **Flask Backend API**: Handles data operations and authentication
3. **SQLite Database**: Stores all hostel data locally

## Getting Started

### Prerequisites

- Python 3.6 or higher
- Node.js and npm

### Installation

#### Option 1: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/yourusername/hostel-management-system.git
cd hostel-management-system

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..
```

#### Option 2: Direct Download

No complex installation required. All necessary components are included.

### Starting the System

Run the main startup script:

```
start_with_login.bat
```

This will:
1. Start the backend API server
2. Start the React frontend application
3. Open the application in your browser

### Login Credentials

- **Username**: svce
- **Password**: 1234

## Features

- **Dashboard**: View overall statistics of the hostel
- **Rooms Management**: Add, view, and manage rooms
- **Members Management**: Track hostel residents
- **Payments**: Record and track payments
- **Reports**: View occupancy and payment reports

## Database Management

The system uses SQLite for data storage. To view or manage the database:

1. Run `view_db.bat` to see database structure and sample data
2. Run `export_database.bat` to export all data to CSV files

## Project Structure

- `auth_api.py` - Backend API with authentication
- `simple_hostel.db` - SQLite database
- `frontend/` - React frontend application
- `start_with_login.bat` - Main startup script
- Database utilities:
  - `db_info.py` - Database information script
  - `view_db.bat` - Database viewer
  - `export_database.bat` - Database exporter
- `add_sample_data.py` - Script to add sample data

## Deployment

### Deploying to GitHub

1. Create a new GitHub repository
2. Initialize Git in your project folder:
   ```bash
   git init
   ```
3. Add all files to Git:
   ```bash
   git add .
   ```
4. Commit your changes:
   ```bash
   git commit -m "Initial commit"
   ```
5. Add the remote repository URL:
   ```bash
   git remote add origin https://github.com/hari9am/HostelDB.git
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## Cleanup

If you want to clean up the project and remove unnecessary files:

```
cleanup.bat
```

This will remove temporary files while preserving essential components.

## Troubleshooting

- **Login Issues**: Ensure the backend API is running on port 5001
- **Database Errors**: Run `add_sample_data.py` to reset sample data
- **Frontend Issues**: Check browser console for errors 
