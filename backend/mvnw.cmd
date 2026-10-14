@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@REM set %HOMEDRIVE%%HOMEPATH% to the directory this script is in
setlocal EnableExtensions EnableDelayedExpansion

set "EXEC_DIR=%~dp0"
if "%EXEC_DIR:~-1%"=="\" set "EXEC_DIR=%EXEC_DIR:~0,-1%"
set "WRAPPER_JAR=%EXEC_DIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%EXEC_DIR%\.mvn\wrapper\maven-wrapper.properties"

@REM Locate java executable
if defined JAVA_HOME (
    set "JAVACMD=%JAVA_HOME%\bin\java.exe"
    if not exist "!JAVACMD!" (
        echo [ERROR] java.exe not found at %JAVA_HOME%\bin\java.exe
        exit /b 1
    )
) else (
    set "JAVACMD=java.exe"
    where "!JAVACMD!" >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Java not found in PATH. Please install JDK 17+ and set JAVA_HOME.
        exit /b 1
    )
)

@REM If wrapper jar does not exist, download maven binary zip or wrapper jar
if not exist "%WRAPPER_JAR%" (
    echo [INFO] Downloading Maven Wrapper JAR...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$webclient = New-Object System.Net.WebClient; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient.DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar', '%WRAPPER_JAR%')"
    if not exist "%WRAPPER_JAR%" (
        echo [ERROR] Failed to download Maven Wrapper JAR. Please install Apache Maven manually.
        exit /b 1
    )
)

"%JAVACMD%" -Dmaven.multiModuleProjectDirectory="%EXEC_DIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
