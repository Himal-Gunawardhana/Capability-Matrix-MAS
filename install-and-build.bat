@echo off
echo Installing dependencies...
call npm install --legacy-peer-deps
echo.
echo Building project...
call npm run build
echo.
echo Done! Run 'node serve.js' to start the server.
pause
