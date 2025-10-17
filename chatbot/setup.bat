@echo off
echo 🤖 Setting up your Paytm Chatbot...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed! Please install Python first.
    echo Download from: https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Navigate to chatbot directory
cd /d "%~dp0"

REM Install Python requirements
echo 📦 Installing Python packages...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install packages!
    pause
    exit /b 1
)

echo ✅ All packages installed successfully!
echo.
echo 🚀 To start your chatbot:
echo 1. Make sure your Node.js backend is running (npm start in backend folder)
echo 2. Run: python main.py
echo 3. Visit: http://localhost:8000/docs to test
echo.
echo 📚 Read info.txt for detailed instructions!
echo.
pause