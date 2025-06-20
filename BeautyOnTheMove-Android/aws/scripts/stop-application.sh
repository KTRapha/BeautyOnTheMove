#!/bin/bash

# ApplicationStop script for BeautyOnTheMove Android app deployment

set -e

echo "Starting ApplicationStop script..."

# Stop Apache HTTP server
if systemctl is-active --quiet httpd; then
    echo "Stopping Apache HTTP server..."
    systemctl stop httpd
    echo "Apache HTTP server stopped successfully."
else
    echo "Apache HTTP server is not running."
fi

echo "ApplicationStop script completed successfully." 