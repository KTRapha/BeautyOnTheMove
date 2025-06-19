#!/bin/bash

# BeautyOnTheMove Android Repository Preparation Script
# This script prepares the Android-specific code for a separate GitHub repository

set -e

echo "🚀 Preparing BeautyOnTheMove Android Repository..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create Android repository directory
ANDROID_REPO_DIR="../BeautyOnTheMove-Android"
print_status "Creating Android repository directory: $ANDROID_REPO_DIR"

mkdir -p "$ANDROID_REPO_DIR"

# Copy shared React Native files
print_status "Copying shared React Native files..."
cp -r android/ "$ANDROID_REPO_DIR/"
cp -r screens/ "$ANDROID_REPO_DIR/"
cp -r components/ "$ANDROID_REPO_DIR/"
cp -r config/ "$ANDROID_REPO_DIR/"
cp -r assets/ "$ANDROID_REPO_DIR/"
cp -r scripts/ "$ANDROID_REPO_DIR/"

# Copy configuration files
cp package.json "$ANDROID_REPO_DIR/"
cp app.json "$ANDROID_REPO_DIR/"
cp babel.config.js "$ANDROID_REPO_DIR/"
cp metro.config.js "$ANDROID_REPO_DIR/"
cp .eslintrc.js "$ANDROID_REPO_DIR/"
cp .prettierrc.js "$ANDROID_REPO_DIR/"
cp jest.config.js "$ANDROID_REPO_DIR/"
cp tsconfig.json "$ANDROID_REPO_DIR/"
cp .watchmanconfig "$ANDROID_REPO_DIR/"
cp .gitignore "$ANDROID_REPO_DIR/"

# Copy source files
cp App.js "$ANDROID_REPO_DIR/"
cp index.js "$ANDROID_REPO_DIR/"
cp theme.js "$ANDROID_REPO_DIR/"
cp useTheme.js "$ANDROID_REPO_DIR/"
cp api.js "$ANDROID_REPO_DIR/"

# Copy documentation
cp README.md "$ANDROID_REPO_DIR/"
cp DEPLOYMENT_GUIDE.md "$ANDROID_REPO_DIR/"
cp DEPLOYMENT_CHECKLIST.md "$ANDROID_REPO_DIR/"

# Create Android-specific README
cat > "$ANDROID_REPO_DIR/README-ANDROID.md" << 'EOF'
# BeautyOnTheMove - Android Repository

This repository contains the Android-specific code for the BeautyOnTheMove mobile application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio
- Android SDK

### Installation
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android
```

### Building for Release
```bash
# Clean previous builds
npm run clean:android

# Bundle JavaScript assets
npm run bundle:android

# Build release APK and AAB
npm run build:android-bundle
```

## 📱 Android-Specific Features

- Android-specific UI components
- Platform-specific permissions
- Android notification handling
- Google Play Services integration
- Android-specific navigation

## 🏗️ Project Structure

```
BeautyOnTheMove-Android/
├── android/                 # Android native code
├── screens/                 # React Native screens
├── components/              # React Native components
├── config/                  # Configuration files
├── assets/                  # App assets
├── scripts/                 # Build and deployment scripts
└── [shared files]           # Shared React Native files
```

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🔧 Development

This repository is designed to work independently for Android development while maintaining compatibility with the shared React Native codebase.

## 📄 License

MIT License - see LICENSE file for details.
EOF

# Create Android-specific package.json
print_status "Creating Android-specific package.json..."
cat > "$ANDROID_REPO_DIR/package.json" << 'EOF'
{
  "name": "beautyonmove-android",
  "version": "1.0.0",
  "description": "BeautyOnTheMove Android Application",
  "main": "index.js",
  "scripts": {
    "android": "react-native run-android",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:android-bundle": "cd android && ./gradlew bundleRelease",
    "clean:android": "cd android && ./gradlew clean",
    "bundle:android": "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res",
    "deploy:android": "bash scripts/deploy-android.sh"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.3.16",
    "@react-navigation/native": "^7.1.12",
    "@react-navigation/native-stack": "^7.3.17",
    "axios": "^1.10.0",
    "react": "19.1.0",
    "react-native": "0.80.0",
    "react-native-safe-area-context": "^5.4.1",
    "react-native-screens": "^4.11.1",
    "react-native-vector-icons": "^10.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/runtime": "^7.25.0",
    "@react-native-community/cli": "19.0.0",
    "@react-native-community/cli-platform-android": "19.0.0",
    "@react-native/babel-preset": "0.80.0",
    "@react-native/eslint-config": "0.80.0",
    "@react-native/metro-config": "0.80.0",
    "@react-native/typescript-config": "0.80.0",
    "@types/jest": "^29.5.13",
    "@types/react": "^19.1.0",
    "@types/react-test-renderer": "^19.1.0",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "react-test-renderer": "19.1.0",
    "typescript": "5.0.4"
  },
  "engines": {
    "node": ">=18"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/BeautyOnTheMove-Android.git"
  },
  "keywords": [
    "react-native",
    "android",
    "beauty",
    "mobile",
    "marketplace"
  ],
  "author": "BeautyOnTheMove Team",
  "license": "MIT"
}
EOF

# Create Android-specific .gitignore
cat > "$ANDROID_REPO_DIR/.gitignore" << 'EOF'
# OSX
#
.DS_Store

# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace

# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# node.js
#
node_modules/
npm-debug.log
yarn-error.log

# BUCK
buck-out/
\.buckd/
*.keystore
!debug.keystore

# fastlane
#
# It is recommended to not store the screenshots in the git repo. Instead, use fastlane to re-generate the
# screenshots whenever they are needed.
# For more information about the recommended setup visit:
# https://docs.fastlane.tools/best-practices/source-control/

*/fastlane/report.xml
*/fastlane/Preview.html
*/fastlane/screenshots

# Bundle artifacts
*.jsbundle

# CocoaPods
/ios/Pods/

# Expo
.expo/
web-build/

# Flipper
ios/Pods/Flipper*

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# Testing
/coverage

# Yarn
yarn.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF

print_status "Android repository preparation complete!"
print_status "Repository location: $ANDROID_REPO_DIR"
print_warning "Next steps:"
echo "1. Navigate to $ANDROID_REPO_DIR"
echo "2. Initialize git repository: git init"
echo "3. Add files: git add ."
echo "4. Create initial commit: git commit -m 'Initial Android repository setup'"
echo "5. Create GitHub repository and push" 