#!/bin/bash

# BeautyOnTheMove Android Deployment Script
# This script builds and prepares the Android app for Google Play Store submission

set -e

echo "🚀 Starting BeautyOnTheMove Android Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Cleaning previous builds..."
cd android
./gradlew clean

print_status "Building release APK..."
./gradlew assembleRelease

print_status "Building release AAB (Android App Bundle)..."
./gradlew bundleRelease

print_status "Build completed successfully!"
print_status "APK location: android/app/build/outputs/apk/release/app-release.apk"
print_status "AAB location: android/app/build/outputs/bundle/release/app-release.aab"

print_warning "Next steps for Google Play Store submission:"
echo "1. Upload the AAB file to Google Play Console"
echo "2. Fill in app store listing information"
echo "3. Add screenshots and app description"
echo "4. Set up content rating"
echo "5. Configure pricing and distribution"
echo "6. Submit for review"

cd ..
print_status "Android deployment preparation complete! 🎉" 