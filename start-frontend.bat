@echo off
setlocal EnableDelayedExpansion

echo =====================================================================
echo Cognevance Technologies - Starting StudentHub Frontend (React/Vite)
echo =====================================================================
echo.

cd /d "%~dp0frontend"

echo [INFO] Launching Vite development server on port 5173...
echo [INFO] Access the web UI at: http://localhost:5173
echo.

npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Frontend failed to start.
    pause
)
