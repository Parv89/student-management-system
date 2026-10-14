@echo off
setlocal EnableDelayedExpansion

echo =====================================================================
echo Cognevance Technologies - StudentHub Database Setup
echo =====================================================================
echo.

set /p DB_HOST="Enter MySQL Host [localhost]: "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="Enter MySQL Port [3306]: "
if "%DB_PORT%"=="" set DB_PORT=3306

set /p DB_USER="Enter MySQL Username [root]: "
if "%DB_USER%"=="" set DB_USER=root

echo.
echo Please enter the password for user '%DB_USER%' (input will be masked if prompted by MySQL):
set /p DB_PASS="Password (or leave blank if none): "

echo.
echo Executing schema.sql...
if "%DB_PASS%"=="" (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% < database\schema.sql
) else (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < database\schema.sql
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to execute database\schema.sql. Please verify credentials and that MySQL is running.
    pause
    exit /b %ERRORLEVEL%
)

echo Executing sample-data.sql...
if "%DB_PASS%"=="" (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% < database\sample-data.sql
) else (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% < database\sample-data.sql
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to execute database\sample-data.sql.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] Database 'student_management_db' created and initialized with sample data!
echo.
pause
