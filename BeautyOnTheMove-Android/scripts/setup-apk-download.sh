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

# Create a simple download page
echo "Creating download page..."
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>BeautyOnTheMove - Download</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .download-btn { 
            background: #4CAF50; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            display: inline-block; 
            margin: 20px; 
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .download-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        h1 {
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        p {
            margin-bottom: 30px;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .version {
            font-size: 0.9em;
            opacity: 0.7;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>BeautyOnTheMove</h1>
        <p>Your beauty services marketplace app</p>
        <a href="beauty-on-the-move.apk" class="download-btn">📱 Download APK</a>
        <div class="version">
            <p>Version 1.0.0</p>
            <p>Deployed: $(date)</p>
        </div>
    </div>
</body>
</html>
EOF

# Set proper permissions for the HTML file
chmod 644 /var/www/html/index.html
chown apache:apache /var/www/html/index.html

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
echo "Download page is available at: http://$PUBLIC_HOSTNAME/" 