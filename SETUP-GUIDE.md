# Hostel Management System - Setup Guide

This guide provides instructions for setting up and running the Hostel Management System.

## Quick Start

### Using PowerShell (Recommended)

1. **Start everything in one command:**
   ```powershell
   .\start_all.ps1
   ```
   This script will:
   - Install backend dependencies
   - Start the backend API on port 5001
   - Start the frontend on port 3000

2. **Or start components individually:**
   - For backend only:
     ```powershell
     python auth_api.py
     ```
   - For frontend only:
     ```powershell
     .\start_frontend.ps1
     ```

### Using Command Prompt (Batch Files)

1. **Start everything in one command:**
   ```
   start_all.bat
   ```

2. **Or start components individually:**
   - For backend only:
     ```
     python auth_api.py
     ```
   - For frontend only:
     ```
     start_simplified.bat
     ```

## Troubleshooting

### Backend Issues

If the backend fails to start:

1. Make sure you have all dependencies installed:
   ```
   python simple_install.py
   ```

2. Check SQLite database:
   ```
   python add_sample_data.py
   ```

### Frontend Issues

If the frontend fails to start:

1. Try fixing the frontend packages:
   ```
   fix_frontend.bat
   ```
   Then start the frontend again.

2. If still having issues, create a new simple frontend:
   ```
   create_simple_frontend.bat
   ```
   Then navigate to the simple-frontend directory and run:
   ```
   npm start
   ```

## Accessing the Application

- Backend API: http://localhost:5001
- Frontend: http://localhost:3000

## Default Login

Since the authentication is disabled for development, you don't need to login with real credentials.

## API Endpoints

- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create new room
- `GET /api/members` - List all members
- `POST /api/members` - Add new member
- `GET /api/reports/occupancy` - Get room occupancy report
- `GET /api/reports/payments` - Get payments report 