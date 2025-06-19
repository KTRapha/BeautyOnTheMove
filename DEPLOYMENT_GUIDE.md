# BeautyOnTheMove Deployment Guide

## 🚀 Quick Start

Your BeautyOnTheMove app is now ready for deployment! This guide will walk you through the complete process of publishing to both the Apple App Store and Google Play Store.

## 📋 App Information

- **App Name**: BeautyOnTheMove
- **Bundle ID**: com.beautyonmove.app
- **Version**: 1.0.0
- **Build Number**: 1
- **Category**: Lifestyle
- **Pricing**: Free with in-app purchases

## 🛠️ Prerequisites

### Required Accounts
- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Developer Account ($25 one-time)

### Required Assets
- [ ] App icon (1024x1024 for iOS, 512x512 for Android)
- [ ] Screenshots for all device sizes
- [ ] App description and metadata
- [ ] Privacy policy and terms of service URLs

## 📱 Android Deployment (Google Play Store)

### Step 1: Prepare Build
```bash
# Clean previous builds
npm run clean:android

# Bundle JavaScript assets
npm run bundle:android

# Build release APK and AAB
npm run build:android-bundle
```

### Step 2: Google Play Console Setup
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in app information:
   - **App name**: BeautyOnTheMove
   - **Short description**: Beauty services marketplace - Your Beauty On The Move
   - **Full description**: [Use template from assets/app-store/README.md]
   - **Category**: Lifestyle
   - **Content rating**: Everyone (3+)

### Step 3: Upload Assets
1. Upload app icon (512x512 px)
2. Upload screenshots for different device sizes
3. Add feature graphic (optional)
4. Upload app bundle (.aab file)

### Step 4: Configure Store Listing
- [ ] App description
- [ ] Screenshots
- [ ] Privacy policy URL
- [ ] Content rating questionnaire
- [ ] App access (public or testing)

### Step 5: Submit for Review
1. Complete all required sections
2. Submit for review
3. Wait for Google's review (typically 1-3 days)

## 🍎 iOS Deployment (Apple App Store)

### Step 1: Prepare Build
```bash
# Install iOS dependencies
cd ios && pod install

# Build for release (requires Xcode)
npm run build:ios
```

### Step 2: App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information:
   - **App name**: BeautyOnTheMove
   - **Bundle ID**: com.beautyonmove.app
   - **SKU**: beautyonmove-ios
   - **Primary category**: Lifestyle

### Step 3: Upload Build
1. Open Xcode
2. Select Product → Archive
3. In Organizer, click "Distribute App"
4. Choose "App Store Connect"
5. Upload the build

### Step 4: Configure Store Listing
- [ ] App description
- [ ] Screenshots for all device sizes
- [ ] App preview videos (optional)
- [ ] Keywords
- [ ] Privacy policy URL
- [ ] Content rating

### Step 5: Submit for Review
1. Complete all required sections
2. Submit for review
3. Wait for Apple's review (typically 1-7 days)

## 💰 Monetization Setup

### Subscription Products
- **Customer Subscription**: $2.50/month
- **Technician Subscription**: $7.50/month
- **Commission**: 10% on bookings

### In-App Purchases
Configure these in both app stores:
1. Customer monthly subscription
2. Technician monthly subscription
3. Commission calculation system

## 📊 Post-Launch Monitoring

### Analytics Setup
- [ ] Google Analytics for Firebase
- [ ] App Store Connect Analytics
- [ ] Google Play Console Analytics

### Crash Reporting
- [ ] Firebase Crashlytics
- [ ] App Store Connect crash reports
- [ ] Google Play Console crash reports

### Key Metrics to Track
- [ ] App store ratings and reviews
- [ ] Download numbers
- [ ] User retention rates
- [ ] Revenue metrics
- [ ] User engagement
- [ ] Crash rates

## 🔧 Troubleshooting

### Common Issues

#### Android Build Issues
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

#### iOS Build Issues
```bash
# Clean and rebuild
cd ios
rm -rf build
pod install
xcodebuild clean
```

#### Bundle Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache
```

### Support Resources
- [React Native Deployment Guide](https://reactnative.dev/docs/publishing-to-app-store)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review the deployment checklist in `DEPLOYMENT_CHECKLIST.md`
3. Ensure all prerequisites are met
4. Follow the step-by-step guides for each platform

## 🎉 Success!

Once your app is live on both stores:
1. Monitor user feedback and reviews
2. Track key performance metrics
3. Plan regular updates and improvements
4. Consider marketing and promotion strategies

---

**Remember**: The deployment process can take several days due to app store review times. Plan accordingly and ensure your app is thoroughly tested before submission. 