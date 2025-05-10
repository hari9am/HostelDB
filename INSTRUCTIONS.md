# Hostel Management System - Instructions

## Quick Start

1. **Run the API with authentication disabled:**
   ```
   python auth_api.py
   ```
   or double-click the `start_api.bat` file (Windows)
   
2. **Add sample data (do this once):**
   ```
   python add_sample_data.py
   ```

3. **Access the API:**
   - Browse to http://localhost:5001 for information about available endpoints
   - API endpoints will be available at http://localhost:5001/api/...
   - No authentication token is required for development purposes

## Available Options

### Option 1: Simple Application (No Authentication)
```
python simple_app.py
```
- Runs on http://localhost:5000
- Provides a nice dashboard with statistics
- No authentication required
- Simple SQLite database

### Option 2: API with Authentication Disabled (Recommended)
```
python auth_api.py
```
- Runs on http://localhost:5001
- Mimics the original API but with authentication disabled
- Great for frontend development

### Option 3: API Proxy (Advanced)
```
python api_proxy.py
```
- Run this alongside simple_app.py to proxy requests
- Requires that simple_app.py is running on port 5000

## API Endpoints

The following endpoints are available in the API:

### Authentication
- POST `/api/login` - Get a dummy token (authentication disabled)

### Rooms
- GET `/api/rooms` - List all rooms
- POST `/api/rooms` - Create a new room

### Members
- GET `/api/members` - List all members
- POST `/api/members` - Add a new member

### Reports
- GET `/api/reports/occupancy` - Get room occupancy report
- GET `/api/reports/payments` - Get payments report (dummy data)

## Troubleshooting

If you encounter issues:

1. **Token errors:**
   The system is designed to bypass token authentication. If you still see token errors, make sure you're running the correct script:
   ```
   python auth_api.py
   ```

2. **Database errors:**
   Make sure SQLite is working correctly. No external database is required.

3. **Missing data:**
   Run the sample data script:
   ```
   python add_sample_data.py
   ``` 