#!/bin/bash

# AfterInstall script for BeautyOnTheMove Android app deployment

echo "Starting AfterInstall script..."

# Navigate to application directory
cd /var/www/beauty-on-the-move

# Install Node.js dependencies
npm ci

# Build the React Native app
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build Android APK
cd android
./gradlew assembleRelease
cd ..

# Copy APK to a web-accessible location
sudo mkdir -p /var/www/html
sudo cp android/app/build/outputs/apk/release/app-release.apk /var/www/html/beauty-on-the-move.apk

# Set proper permissions
sudo chmod 644 /var/www/html/beauty-on-the-move.apk
sudo chown apache:apache /var/www/html/beauty-on-the-move.apk

# Create a simple download page
sudo tee /var/www/html/index.html > /dev/null <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>BeautyOnTheMove - Download</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .download-btn { 
            background: #007bff; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin: 20px; 
        }
    </style>
</head>
<body>
    <h1>BeautyOnTheMove</h1>
    <p>Your beauty services marketplace app</p>
    <a href="beauty-on-the-move.apk" class="download-btn">Download APK</a>
</body>
</html>
EOF

echo "AfterInstall script completed successfully." 