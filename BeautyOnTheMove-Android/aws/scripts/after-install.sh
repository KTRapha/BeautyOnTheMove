#!/bin/bash

# AfterInstall script for BeautyOnTheMove Android app deployment

set -e

echo "Starting AfterInstall script..."

# Move deployed files to current directory
if [ -d "/opt/beautyonmove/app-release.apk" ]; then
    echo "Moving APK to current directory..."
    mv /opt/beautyonmove/app-release.apk /opt/beautyonmove/current/
fi

# Set proper permissions
chmod -R 755 /opt/beautyonmove/current

# Create a simple web page to serve the APK
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>BeautyOnTheMove Android App</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        .download-btn { 
            background-color: #4CAF50; color: white; padding: 15px 32px; 
            text-decoration: none; display: inline-block; font-size: 16px; 
            margin: 4px 2px; cursor: pointer; border-radius: 4px; 
        }
        .version { color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>BeautyOnTheMove</h1>
    <p>Download the latest version of our Android app</p>
    <a href="/beautyonmove.apk" class="download-btn">Download APK</a>
    <div class="version">
        <p>Version: Latest</p>
        <p>Last updated: $(date)</p>
    </div>
</body>
</html>
EOF

# Copy APK to web directory for download
if [ -f "/opt/beautyonmove/current/app-release.apk" ]; then
    cp /opt/beautyonmove/current/app-release.apk /var/www/html/beautyonmove.apk
    chmod 644 /var/www/html/beautyonmove.apk
fi

echo "AfterInstall script completed successfully." 