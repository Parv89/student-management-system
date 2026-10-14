@echo off
setlocal EnableDelayedExpansion

echo =====================================================================
echo Cognevance Technologies - Starting StudentHub Backend (Spring Boot)
echo =====================================================================
echo.

cd /d "%~dp0backend"

if defined JAVA_HOME (
    echo [INFO] Using JAVA_HOME: %JAVA_HOME%
) else (
    echo [WARNING] JAVA_HOME is not set. Looking for default java in PATH...
)

echo [INFO] Launching Spring Boot server on port 8080...
echo [INFO] Press Ctrl+C at any time to stop the server.
echo.

call .\mvnw.cmd spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Spring Boot backend failed to run.
    echo Ensure JDK 17+ is installed and MySQL server is running.
    pause
)
