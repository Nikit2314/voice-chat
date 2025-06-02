@echo off
echo Installing dependencies...
call npm install

echo Building the project...
call npm run build

echo Creating deployment directory...
if not exist deploy mkdir deploy

echo Copying necessary files...
xcopy /E /I dist deploy
copy .htaccess deploy
copy server.js deploy
copy package.json deploy

echo Creating production package...
cd deploy
powershell Compress-Archive -Path * -DestinationPath ..\deploy.zip -Force
cd ..

echo Build completed! Check deploy.zip for the production files.
pause 