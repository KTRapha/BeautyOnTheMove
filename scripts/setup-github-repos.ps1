# BeautyOnTheMove GitHub Repository Setup Script (PowerShell)
# This script helps set up separate GitHub repositories for Android and iOS

Write-Host "🚀 Setting up BeautyOnTheMove GitHub Repositories..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📱 Step 1: Preparing repository directories..." -ForegroundColor Yellow

# Create Android repository directory
$ANDROID_REPO_DIR = "../BeautyOnTheMove-Android"
if (Test-Path $ANDROID_REPO_DIR) {
    Write-Host "⚠️  Android repository directory already exists. Removing..." -ForegroundColor Yellow
    Remove-Item $ANDROID_REPO_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $ANDROID_REPO_DIR -Force | Out-Null

# Create iOS repository directory
$IOS_REPO_DIR = "../BeautyOnTheMove-iOS"
if (Test-Path $IOS_REPO_DIR) {
    Write-Host "⚠️  iOS repository directory already exists. Removing..." -ForegroundColor Yellow
    Remove-Item $IOS_REPO_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $IOS_REPO_DIR -Force | Out-Null

Write-Host "📁 Step 2: Copying files to Android repository..." -ForegroundColor Yellow

# Copy Android-specific files
Copy-Item -Path "android" -Destination "$ANDROID_REPO_DIR/" -Recurse
Copy-Item -Path "screens" -Destination "$ANDROID_REPO_DIR/" -Recurse
Copy-Item -Path "components" -Destination "$ANDROID_REPO_DIR/" -Recurse
Copy-Item -Path "config" -Destination "$ANDROID_REPO_DIR/" -Recurse
Copy-Item -Path "assets" -Destination "$ANDROID_REPO_DIR/" -Recurse
Copy-Item -Path "scripts" -Destination "$ANDROID_REPO_DIR/" -Recurse

# Copy shared files
Copy-Item -Path "package.json", "app.json", "babel.config.js", "metro.config.js", ".eslintrc.js", ".prettierrc.js", "jest.config.js", "tsconfig.json", ".watchmanconfig", ".gitignore" -Destination $ANDROID_REPO_DIR
Copy-Item -Path "App.js", "index.js", "theme.js", "useTheme.js", "api.js" -Destination $ANDROID_REPO_DIR
Copy-Item -Path "README.md", "DEPLOYMENT_GUIDE.md", "DEPLOYMENT_CHECKLIST.md" -Destination $ANDROID_REPO_DIR

Write-Host "📁 Step 3: Copying files to iOS repository..." -ForegroundColor Yellow

# Copy iOS-specific files
Copy-Item -Path "ios" -Destination "$IOS_REPO_DIR/" -Recurse
Copy-Item -Path "screens" -Destination "$IOS_REPO_DIR/" -Recurse
Copy-Item -Path "components" -Destination "$IOS_REPO_DIR/" -Recurse
Copy-Item -Path "config" -Destination "$IOS_REPO_DIR/" -Recurse
Copy-Item -Path "assets" -Destination "$IOS_REPO_DIR/" -Recurse
Copy-Item -Path "scripts" -Destination "$IOS_REPO_DIR/" -Recurse

# Copy shared files
Copy-Item -Path "package.json", "app.json", "babel.config.js", "metro.config.js", ".eslintrc.js", ".prettierrc.js", "jest.config.js", "tsconfig.json", ".watchmanconfig", ".gitignore", "Gemfile" -Destination $IOS_REPO_DIR
Copy-Item -Path "App.js", "index.js", "theme.js", "useTheme.js", "api.js" -Destination $IOS_REPO_DIR
Copy-Item -Path "README.md", "DEPLOYMENT_GUIDE.md", "DEPLOYMENT_CHECKLIST.md" -Destination $IOS_REPO_DIR

Write-Host "📝 Step 4: Creating platform-specific README files..." -ForegroundColor Yellow

# Create Android-specific README
$androidReadme = @"
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
"@

Set-Content -Path "$ANDROID_REPO_DIR/README-ANDROID.md" -Value $androidReadme

# Create iOS-specific README
$iosReadme = @"
# BeautyOnTheMove - iOS Repository

This repository contains the iOS-specific code for the BeautyOnTheMove mobile application.

## 🚀 Quick Start

### Prerequisites
- macOS (required for iOS development)
- Node.js 18+
- React Native CLI
- Xcode 14+
- CocoaPods

### Installation
```bash
# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS device/simulator
npm run ios
```

### Building for Release
```bash
# Install iOS dependencies
cd ios && pod install

# Build for release (requires Xcode)
npm run build:ios
```

## 📱 iOS-Specific Features

- iOS-specific UI components
- Platform-specific permissions
- iOS notification handling
- Apple Pay integration
- iOS-specific navigation
- Face ID/Touch ID integration

## 🏗️ Project Structure

```
BeautyOnTheMove-iOS/
├── ios/                     # iOS native code
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

This repository is designed to work independently for iOS development while maintaining compatibility with the shared React Native codebase.

## 📄 License

MIT License - see LICENSE file for details.
"@

Set-Content -Path "$IOS_REPO_DIR/README-IOS.md" -Value $iosReadme

Write-Host "✅ Repository preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repositories:" -ForegroundColor White
Write-Host "   - BeautyOnTheMove-Android"
Write-Host "   - BeautyOnTheMove-iOS"
Write-Host ""
Write-Host "2. Set up Android repository:" -ForegroundColor White
Write-Host "   cd $ANDROID_REPO_DIR"
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial Android repository setup'"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/BeautyOnTheMove-Android.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "3. Set up iOS repository:" -ForegroundColor White
Write-Host "   cd $IOS_REPO_DIR"
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial iOS repository setup'"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/BeautyOnTheMove-iOS.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "📖 See GITHUB_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Yellow 