@echo off
echo ================================
echo ATS Resume Builder - Setup Script
echo ================================
echo.

echo Step 1: Setting up Backend...
cd backend
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt
echo Creating data directories...
if not exist "data" mkdir data
if not exist "data\resumes" mkdir data\resumes
if not exist "data\exports" mkdir data\exports
echo Backend setup complete!
echo.

cd ..

echo Step 2: Setting up Frontend...
cd frontend
echo Installing npm dependencies...
call npm install
echo Frontend setup complete!
echo.

cd ..

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo 1. Backend: Open a terminal, navigate to 'backend', run 'venv\Scripts\activate' then 'python app.py'
echo 2. Frontend: Open another terminal, navigate to 'frontend', run 'npm start'
echo.
echo The app will be available at http://localhost:3000
echo.
pause
