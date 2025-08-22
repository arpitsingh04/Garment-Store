@echo off
echo Diamond Garment Backend Setup

echo Installing dependencies...
call npm install

echo.
echo Creating admin user and seeding initial data...
call npm run seed

echo.
echo Setup complete!
echo.
echo To start the server, run: npm run dev
echo Admin panel is now part of the React frontend at: http://localhost:3000/admin
echo Login with:
echo   Email: admin@diamondgarment.com
echo   Password: admin123
echo.

pause
