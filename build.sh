#!/bin/bash

# Install dependencies
npm install

# Build the project
npm run build

# Create deployment directory
mkdir -p deploy

# Copy necessary files
cp -r dist/* deploy/
cp .htaccess deploy/
cp server.js deploy/
cp package.json deploy/

# Create production package
cd deploy
zip -r ../deploy.zip .
cd ..

echo "Build completed! Check deploy.zip for the production files." 