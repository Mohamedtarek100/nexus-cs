@echo off
title NexusCS Mission Control
color 0b
echo ========================================================
echo         NEXUS-CS COMPUTER SCIENCE MISSION CONTROL
echo ========================================================
echo Starting local production server...
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Launching NexusCS...
start "" "http://localhost:5173"
call npm run dev
pause
