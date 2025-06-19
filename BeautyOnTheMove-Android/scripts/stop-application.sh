#!/bin/bash

# ApplicationStop script for BeautyOnTheMove Android app deployment

echo "Starting ApplicationStop script..."

# Stop Apache web server
sudo systemctl stop httpd

# Create a backup of the current APK
if [ -f /var/www/html/beauty-on-the-move.apk ]; then
    sudo cp /var/www/html/beauty-on-the-move.apk /var/www/html/beauty-on-the-move.apk.backup.$(date +%Y%m%d_%H%M%S)
fi

echo "ApplicationStop script completed successfully." 