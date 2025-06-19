#!/bin/bash

# BeforeInstall script for BeautyOnTheMove Android app deployment

echo "Starting BeforeInstall script..."

# Update system packages
sudo yum update -y

# Install required packages
sudo yum install -y java-11-openjdk-devel
sudo yum install -y nodejs npm
sudo yum install -y git

# Create application directory
sudo mkdir -p /var/www/beauty-on-the-move
sudo chown -R ec2-user:ec2-user /var/www/beauty-on-the-move

# Install Android SDK and build tools
sudo yum install -y wget unzip
cd /opt
sudo wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip
sudo unzip commandlinetools-linux-8512546_latest.zip
sudo mkdir -p android-sdk/cmdline-tools
sudo mv cmdline-tools android-sdk/cmdline-tools/latest

# Set environment variables
echo 'export ANDROID_HOME=/opt/android-sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

# Accept Android licenses
yes | sudo $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# Install Android SDK components
sudo $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

echo "BeforeInstall script completed successfully." 