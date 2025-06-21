#!/bin/bash

# Setup APK download script for BeautyOnTheMove Android app
set -e  # Exit on any error

echo "=== Starting APK download setup ==="
echo "Current directory: $(pwd)"
echo "Script location: $0"
echo "Listing current directory:"
ls -la

# Find the APK file in the deployment archive
echo "🔍 Searching for APK file in deployment archive..."
DEPLOYMENT_ROOT="/opt/codedeploy-agent/deployment-root"
APK_SOURCE=""

# Find the most recent deployment archive
if [ -d "$DEPLOYMENT_ROOT" ]; then
    echo "Looking in deployment root: $DEPLOYMENT_ROOT"
    ls -la "$DEPLOYMENT_ROOT"
    
    # Search recursively for APK files in deployment-archive directories
    echo "🔍 Searching recursively for APK files..."
    APK_FILES=$(find "$DEPLOYMENT_ROOT" -name "app-release.apk" -type f 2>/dev/null | head -1)
    
    if [ -n "$APK_FILES" ]; then
        APK_SOURCE="$APK_FILES"
        echo "✅ Found APK in: $APK_SOURCE"
    else
        echo "❌ No APK files found in deployment root"
    fi
fi

if [ -z "$APK_SOURCE" ]; then
    echo "❌ ERROR: Could not find APK file in deployment archive"
    echo "Searching for APK files in current directory and subdirectories..."
    find . -name "*.apk" -type f 2>/dev/null || echo "No APK files found"
    
    # Also search in deployment root
    echo "Searching in deployment root for APK files..."
    find "$DEPLOYMENT_ROOT" -name "*.apk" -type f 2>/dev/null || echo "No APK files found in deployment root"
    exit 1
fi

APK_DEST="/var/www/html/beauty-on-the-move.apk"

echo "📦 Copying APK from $APK_SOURCE to $APK_DEST"

# Ensure Apache is installed and running
if ! command -v httpd &> /dev/null; then
    echo "Installing Apache..."
    yum update -y
    yum install -y httpd
fi

# Start and enable Apache
echo "Starting Apache..."
systemctl start httpd
systemctl enable httpd

# Create web directory if it doesn't exist
mkdir -p /var/www/html

# Copy APK to web directory
echo "Copying APK file..."
cp "$APK_SOURCE" "$APK_DEST"

# Set proper permissions for the APK
echo "Setting APK permissions..."
chmod 644 "$APK_DEST"
chown apache:apache "$APK_DEST"

echo "APK file copied successfully, size: $(ls -lh "$APK_DEST" | awk '{print $5}')"

# Update the existing apk-download.html file with the real download link
echo "Updating apk-download.html with real download link..."
cat > /var/www/html/apk-download.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>BeautyOnTheMove APK Download</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .download-btn { display: inline-block; background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .download-btn:hover { background: #0056b3; }
        .status { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>BeautyOnTheMove Android App</h1>
        <div class="status success">
            <strong>✅ Status:</strong> APK successfully deployed and ready for download!
        </div>
        <p>Your BeautyOnTheMove Android app has been successfully built and deployed. Click the button below to download the APK file.</p>
        <a href="beauty-on-the-move.apk" class="download-btn">📱 Download APK</a>
        <p><small>Server IP: 54.237.203.146 | Deployed: $(date)</small></p>
    </div>
</body>
</html>
EOF

# Set proper permissions for the HTML file
chmod 644 /var/www/html/apk-download.html
chown apache:apache /var/www/html/apk-download.html

# Verify Apache is running
if systemctl is-active --quiet httpd; then
    echo "Apache is running successfully"
else
    echo "ERROR: Apache failed to start"
    systemctl status httpd
    exit 1
fi

# Get instance public hostname
PUBLIC_HOSTNAME=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null || echo "localhost")

echo "=== APK download setup completed successfully ==="
echo "APK is available at: http://$PUBLIC_HOSTNAME/beauty-on-the-move.apk"
echo "Download page is available at: http://$PUBLIC_HOSTNAME/apk-download.html" 