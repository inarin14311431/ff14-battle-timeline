@echo off
cd /d "%~dp0"
node -e "const [a,b]=process.versions.node.split('.').map(Number);if(a<24||(a===24&&b<17))process.exit(1)" >nul 2>&1
if errorlevel 1 (
 echo Install Node.js 24.17 or newer first.
 pause
 exit /b 1
)
if not exist .env copy .env.example .env >nul
call npm ci
if errorlevel 1 (
 pause
 exit /b 1
)
echo Setup complete. Edit .env, then run prepare-audio.cmd and register.cmd.
pause
