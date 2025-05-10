@echo off
echo Hostel Management System - With Login Support
echo =======================================
echo.

echo Stopping any existing processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul

echo.
echo Starting the backend API...
start cmd /k "python auth_api.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak

echo.
echo Login Information:
echo Username: svce
echo Password: 1234
echo.

echo Starting the frontend...
cd frontend
set NODE_OPTIONS=--openssl-legacy-provider
call npm start

pause 