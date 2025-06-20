#!/bin/bash

# BeforeInstall script for BeautyOnTheMove Android app deployment

set -e

echo "Starting BeforeInstall script..."

# Create application directory if it doesn't exist
mkdir -p /opt/beautyonmove

# Stop any existing application processes
if systemctl is-active --quiet httpd; then
    echo "Stopping Apache HTTP server..."
    systemctl stop httpd
fi

# Clean up any existing deployment artifacts
if [ -d "/opt/beautyonmove/current" ]; then
    echo "Removing existing deployment..."
    rm -rf /opt/beautyonmove/current
fi

# Create necessary directories
mkdir -p /opt/beautyonmove/current
mkdir -p /opt/beautyonmove/backup

echo "BeforeInstall script completed successfully." 