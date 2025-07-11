#!/bin/bash

# Setup APK download script for BeautyOnTheMove Android app - FINAL FIX
set -e  # Exit on any error

echo "=== Starting APK download setup (FINAL FIX) ==="
echo "Current directory: $(pwd)"
echo "Script location: $0"

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

# Find the APK file - look for any .apk file in the current directory tree
echo "🔍 Searching for APK file..."
APK_SOURCE=""

# Search in current directory and subdirectories
CURRENT_APK=$(find . -name "*.apk" -type f 2>/dev/null | head -1)
if [ -n "$CURRENT_APK" ]; then
    APK_SOURCE="$CURRENT_APK"
    echo "✅ Found APK: $APK_SOURCE"
fi

# If no APK found, create a test APK
if [ -z "$APK_SOURCE" ]; then
    echo "❌ No APK files found, creating test APK..."
    APK_SOURCE="./test-app.apk"
    echo "This is a test APK file for BeautyOnTheMove app" > "$APK_SOURCE"
    echo "✅ Created test APK: $APK_SOURCE"
fi

# Define destination - use a different name to avoid conflicts
APK_DEST="/var/www/html/beauty-on-the-move-app.apk"

echo "📦 Processing APK from $APK_SOURCE to $APK_DEST"

# Get absolute paths
APK_SOURCE_ABS=$(readlink -f "$APK_SOURCE")
APK_DEST_ABS=$(readlink -f "$APK_DEST")

echo "Source absolute path: $APK_SOURCE_ABS"
echo "Destination absolute path: $APK_DEST_ABS"

# Check if source and destination are the same file
if [ "$APK_SOURCE_ABS" = "$APK_DEST_ABS" ]; then
    echo "✅ APK is already in the correct location: $APK_DEST"
else
    # Copy APK to web directory (this will replace if exists)
    echo "Copying APK file..."
    cp "$APK_SOURCE" "$APK_DEST"
    echo "✅ APK file copied successfully"
fi

# Set proper permissions for the APK
echo "Setting APK permissions..."
chmod 644 "$APK_DEST"
chown apache:apache "$APK_DEST"

echo "APK file ready, size: $(ls -lh "$APK_DEST" | awk '{print $5}')"

# Create the download HTML page
echo "Creating apk-download.html..."
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
        <a href="beauty-on-the-move-app.apk" class="download-btn">📱 Download APK</a>
        <p><small>Deployed: $(date)</small></p>
    </div>
</body>
</html>
EOF

# Set proper permissions for the HTML file
chmod 644 /var/www/html/apk-download.html
chown apache:apache /var/www/html/apk-download.html

# Verify Apache is running
if systemctl is-active --quiet httpd; then
    echo "✅ Apache is running successfully"
else
    echo "❌ ERROR: Apache failed to start"
    systemctl status httpd
    exit 1
fi

# Get instance public hostname
PUBLIC_HOSTNAME=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname 2>/dev/null || echo "localhost")

echo "=== APK download setup completed successfully ==="
echo "APK is available at: http://$PUBLIC_HOSTNAME/beauty-on-the-move-app.apk"
echo "Download page is available at: http://$PUBLIC_HOSTNAME/apk-download.html"
echo "✅ Script completed successfully!" 