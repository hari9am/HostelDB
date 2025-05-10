@echo off
echo Hostel Management System - Project Cleanup
echo =========================================
echo.
echo This script will remove unwanted files from your project.
echo Essential files for the system to work will be preserved.
echo.
echo Press any key to continue with cleanup or Ctrl+C to cancel...
pause > nul

echo.
echo Creating backup of database and essential files...
echo.

mkdir backup_essential 2>nul
copy simple_hostel.db backup_essential\ > nul
copy auth_api.py backup_essential\ > nul
copy db_info.py backup_essential\ > nul
copy view_db.bat backup_essential\ > nul
copy export_database.bat backup_essential\ > nul
copy start_with_login.bat backup_essential\ > nul
copy add_sample_data.py backup_essential\ > nul
copy requirements.txt backup_essential\ > nul

echo Backup created in 'backup_essential' folder.
echo.
echo Removing redundant batch files...

del create_simple_frontend.bat 2>nul
del fix_frontend.bat 2>nul
del start_all.bat 2>nul
del start_all_fixed.bat 2>nul
del start_api.bat 2>nul
del start_frontend.bat 2>nul
del start_simplified.bat 2>nul
del restart_with_payments.bat 2>nul
del run.bat 2>nul
del simple_install.py 2>nul
del install_dependencies.py 2>nul
del install_jwt.py 2>nul
del view_database.bat 2>nul

echo.
echo Removing old/duplicate database files...

del hostel.db 2>nul

echo.
echo Removing old backend implementations...

del api_proxy.py 2>nul
del simple_app.py 2>nul
del init_database.py 2>nul
del runapp.py 2>nul
del run_all.py 2>nul
del run_backend.py 2>nul
del proxy.py 2>nul

echo.
echo Removing PowerShell scripts...

del *.ps1 2>nul

echo.
echo Removing simple-frontend directory...
rmdir /s /q simple-frontend 2>nul

echo.
echo Removing backend directory (replaced by auth_api.py)...
rmdir /s /q backend 2>nul

echo.
echo Cleanup complete!
echo Your essential files are preserved in the main directory
echo and backed up in the 'backup_essential' folder.
echo.
echo The following components remain:
echo - Frontend (React application)
echo - Backend API (auth_api.py)
echo - Database (simple_hostel.db)
echo - Database utilities (db_info.py, export_database.bat, view_db.bat)
echo - Sample data script (add_sample_data.py)
echo - Main startup script (start_with_login.bat)
echo.
echo You can now run 'start_with_login.bat' to start the application.
echo.
echo Press any key to exit...
pause > nul 