@echo off
echo ================================
echo Starting ATS Resume Builder
echo ================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 3

echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"

echo.
echo ================================
echo Application Starting...
echo ================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause
taskkill /FI "WindowTitle eq *python app.py*" /F
taskkill /FI "WindowTitle eq *npm start*" /F
