#!/bin/bash

# ApplicationStart script for BeautyOnTheMove Android app deployment

set -e

echo "Starting ApplicationStart script..."

# Start Apache HTTP server
if ! systemctl is-active --quiet httpd; then
    echo "Starting Apache HTTP server..."
    systemctl start httpd
    systemctl enable httpd
fi

# Verify the server is running
if systemctl is-active --quiet httpd; then
    echo "Apache HTTP server is running successfully."
else
    echo "Failed to start Apache HTTP server."
    exit 1
fi

# Test the web server
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "Web server is responding correctly."
else
    echo "Warning: Web server may not be responding correctly."
fi

echo "ApplicationStart script completed successfully." 