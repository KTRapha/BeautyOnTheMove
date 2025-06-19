#!/bin/bash

# ApplicationStart script for BeautyOnTheMove Android app deployment

echo "Starting ApplicationStart script..."

# Start Apache web server
sudo systemctl start httpd
sudo systemctl enable httpd

# Configure firewall to allow HTTP traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# Create a status file
echo "BeautyOnTheMove Android app is now available for download" > /var/www/beauty-on-the-move/status.txt
echo "Deployment completed at: $(date)" >> /var/www/beauty-on-the-move/status.txt

echo "ApplicationStart script completed successfully."
echo "APK is available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/beauty-on-the-move.apk" 