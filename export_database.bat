@echo off
echo Hostel Management System - Database Exporter
echo ==========================================
echo.

echo This script will export all database tables to CSV files
echo in a 'database_export' folder.
echo.

mkdir database_export 2>nul

python -c "import sqlite3, csv, os; conn = sqlite3.connect('simple_hostel.db'); cursor = conn.cursor(); cursor.execute('SELECT name FROM sqlite_master WHERE type=\"table\"'); tables = cursor.fetchall(); print(f'Found {len(tables)} tables to export.'); for table in tables: print(f'Exporting {table[0]}...'); cursor.execute(f'SELECT * FROM {table[0]}'); rows = cursor.fetchall(); cursor.execute(f'PRAGMA table_info({table[0]})'); columns = [col[1] for col in cursor.fetchall()]; export_file = os.path.join('database_export', f'{table[0]}.csv'); with open(export_file, 'w', newline='') as f: writer = csv.writer(f); writer.writerow(columns); writer.writerows(rows); print(f'Exported {table[0]} to {export_file}'); conn.close(); print('\nAll tables exported to database_export folder.')"

echo.
echo Tables exported to the 'database_export' folder.
echo You can open these CSV files with Excel or any text editor.
echo.

pause 