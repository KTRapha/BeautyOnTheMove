#!/bin/bash

# BeautyOnTheMove iOS Deployment Script
# This script builds and prepares the iOS app for Apple App Store submission

set -e

echo "🚀 Starting BeautyOnTheMove iOS Deployment..."

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

print_status "Installing iOS dependencies..."
cd ios
pod install

print_status "Building for release..."
xcodebuild -workspace BeautyOnTheMove.xcworkspace \
           -scheme BeautyOnTheMove \
           -configuration Release \
           -destination generic/platform=iOS \
           -archivePath build/BeautyOnTheMove.xcarchive \
           archive

print_status "Exporting IPA..."
xcodebuild -exportArchive \
           -archivePath build/BeautyOnTheMove.xcarchive \
           -exportPath build/ \
           -exportOptionsPlist exportOptions.plist

print_status "Build completed successfully!"
print_status "IPA location: ios/build/BeautyOnTheMove.ipa"

print_warning "Next steps for Apple App Store submission:"
echo "1. Open Xcode and select Product → Archive"
echo "2. In the Organizer, click 'Distribute App'"
echo "3. Choose 'App Store Connect'"
echo "4. Upload the build"
echo "5. Fill in app store listing information in App Store Connect"
echo "6. Add screenshots and app description"
echo "7. Set up content rating"
echo "8. Submit for review"

cd ..
print_status "iOS deployment preparation complete! 🎉" 