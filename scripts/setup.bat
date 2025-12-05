@echo off
REM Pre-commit hook setup script for Windows
REM This script helps developers set up their environment for development

setlocal enabledelayedexpansion

echo 🚀 Setting up Study Materials Platform development environment...
echo.

REM Check Node.js version
echo ✓ Checking Node.js version...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo   Node.js version: !NODE_VERSION!

REM Install dependencies
echo ✓ Installing dependencies...
call npm install

REM Setup Husky
echo ✓ Setting up Git hooks with Husky...
call npm run prepare

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo   1. Copy .env.example to .env.local
echo   2. Fill in your Supabase credentials in .env.local
echo   3. Run 'npm run dev' to start the development server
echo.
echo 📚 Documentation:
echo   - README: https://github.com/buildforsrilanka/study-materials/blob/main/README.md
echo   - Contributing: https://github.com/buildforsrilanka/study-materials/blob/main/CONTRIBUTING.md
echo.

pause
