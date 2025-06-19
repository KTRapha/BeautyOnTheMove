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