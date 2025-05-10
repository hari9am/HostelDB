@echo off
echo Hostel Management System Frontend Reinstaller
echo ==========================================
echo.

cd frontend

echo Cleaning npm cache and node_modules...
rmdir /s /q node_modules
del package-lock.json
call npm cache clean --force
echo.

echo Reinstalling dependencies with compatible versions...
call npm install --legacy-peer-deps
echo.

echo Done! Now you can run the frontend with:
echo start_frontend.bat
echo.

pause 