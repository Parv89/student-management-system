@echo off
setlocal EnableDelayedExpansion

echo =====================================================================
echo Cognevance Technologies - Starting StudentHub Backend (Spring Boot)
echo =====================================================================
echo.

set "PROJECT_ROOT=%~dp0"
if exist "%PROJECT_ROOT%.env" (
    echo [INFO] Loading database credentials from .env...
    for /f "usebackq tokens=1* delims==" %%A in ("%PROJECT_ROOT%.env") do (
        set "key=%%A"
        set "val=%%B"
        if not "!key:~0,1!"=="#" (
            set "!key!=!val!"
        )
    )
)

if not defined DB_USERNAME set DB_USERNAME=root

if not defined DB_PASSWORD (
    echo [INFO] DB_PASSWORD environment variable is not set.
    set /p DB_PASSWORD="Enter MySQL password for user '%DB_USERNAME%' (press Enter if none): "
)

cd /d "%PROJECT_ROOT%backend"

if defined JAVA_HOME (
    echo [INFO] Using JAVA_HOME: %JAVA_HOME%
) else (
    echo [WARNING] JAVA_HOME is not set. Looking for default java in PATH...
)

echo [INFO] Launching Spring Boot server on port 8080...
echo [INFO] Connecting to MySQL database 'student_management_db' as '%DB_USERNAME%'...
echo [INFO] Press Ctrl+C at any time to stop the server.
echo.

call .\mvnw.cmd spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Spring Boot backend failed to run.
    echo Ensure JDK 17+ is installed and MySQL server is running.
    pause
)
