# BeautyOnTheMove

A React Native application for BeautyOnTheMove (Beauty On The Move) with production-ready features.

## 🚀 Features

- **Authentication System** - Secure login/register with token management
- **Dashboard** - Overview of bookings and statistics
- **Bookings Management** - Create, view, and manage bookings
- **Offers System** - Browse and manage offers
- **User Profile** - User account management
- **Production Ready** - Error boundaries, environment configuration, and proper error handling

## 📋 Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- AWS Account (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BeautyOnTheMove
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp config/env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```

4. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
API_BASE_URL=https://api.beautyonmove.com
API_TIMEOUT=30000

# Authentication
AUTH_TOKEN_KEY=beautyonmove_auth_token
AUTH_REFRESH_TOKEN_KEY=beautyonmove_refresh_token

# App Configuration
APP_NAME=BeautyOnTheMove
APP_VERSION=1.0.0
APP_ENVIRONMENT=production

# AWS Configuration
AWS_S3_BUCKET=beautyonmove-app-assets
```

### Backend API

Ensure your backend API provides the following endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /user/profile` - Get user profile
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create new booking
- `GET /offers` - Get available offers
- `GET /dashboard/stats` - Get dashboard statistics

## 🏃‍♂️ Development

### Start Development Server
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
npm run lint:fix
```

## 🏗️ Building for Production

### Android Release Build
```bash
# Clean build
npm run clean:android

# Build APK
npm run build:android

# Build AAB (for Play Store)
npm run build:android-bundle
```

The built APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

### iOS Release Build
```bash
# Open Xcode and build for release
cd ios
open BeautyOnTheMove.xcworkspace
```

## 🚀 Deployment with AWS CodeDeploy

### Prerequisites
1. AWS Account with appropriate permissions
2. EC2 instance running Amazon Linux/RHEL/Windows Server
3. GitHub repository with your code

### Setup Steps

1. **Create IAM Roles**
   - Create EC2 role with `AmazonEC2RoleforCodeDeploy` policy
   - Create CodeDeploy service role with `AWSCodeDeployRole` policy

2. **Configure EC2 Instance**
   - Launch EC2 instance with the IAM role
   - Install CodeDeploy agent
   - Configure security groups

3. **Create CodeDeploy Application**
   - Application name: `BeautyOnTheMove`
   - Deployment type: `EC2/On-premises`

4. **Create Deployment Group**
   - Service role: Your CodeDeploy service role
   - Deployment type: `In-place`
   - Environment: `Amazon EC2 instances`
   - Tag your instances appropriately

5. **GitHub Integration**
   - Connect your GitHub repository
   - Configure webhooks for automatic deployment
   - Set up deployment triggers

### Deployment Files

Create the following files in your repository:

#### `appspec.yml`
```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/beautyonmove-app
hooks:
  BeforeInstall:
    - location: scripts/before_install.sh
      runas: root
  ApplicationStop:
    - location: scripts/stop_application.sh
      runas: root
  ApplicationStart:
    - location: scripts/start_application.sh
      runas: root
  ValidateService:
    - location: scripts/validate_service.sh
      runas: root
```

#### `scripts/before_install.sh`
```bash
#!/bin/bash
# Update system packages
yum update -y

# Install Node.js and npm
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Create application directory
mkdir -p /var/www/beautyonmove-app
```

#### `scripts/start_application.sh`
```bash
#!/bin/bash
cd /var/www/beautyonmove-app

# Install dependencies
npm install --production

# Start application with PM2
pm2 start npm --name "beautyonmove-app" -- start
pm2 save
pm2 startup
```

## 📊 Monitoring and Logging

### Error Tracking
The app includes error boundaries and comprehensive error handling. Consider integrating:

- **Sentry** for error tracking
- **AWS CloudWatch** for monitoring
- **AWS X-Ray** for tracing

### Performance Monitoring
- Monitor API response times
- Track app crashes and errors
- Monitor user engagement metrics

## 🔒 Security

### API Security
- All API calls use HTTPS
- JWT token authentication
- Automatic token refresh
- Secure token storage using AsyncStorage

### App Security
- Error boundaries prevent app crashes
- Input validation on all forms
- Secure storage of sensitive data

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:ci
```

### Manual Testing Checklist
- [ ] Login/Register flow
- [ ] Navigation between screens
- [ ] API calls and error handling
- [ ] Offline functionality
- [ ] App performance
- [ ] Error boundary functionality

## 📱 App Store Deployment

### Google Play Store
1. Build AAB: `npm run build:android-bundle`
2. Upload to Google Play Console
3. Configure release notes and screenshots
4. Submit for review

### Apple App Store
1. Build in Xcode for release
2. Archive and upload to App Store Connect
3. Configure app metadata
4. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial production release
  - Authentication system
  - Dashboard and booking management
  - Production-ready error handling
  - AWS CodeDeploy integration

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd BeautyOnTheMove
```

## iOS Setup

1. Install iOS dependencies:
```bash
cd ios
pod install
```

2. Open the project in Xcode:
```bash
open BeautyOnTheMove.xcworkspace
```

## Deployment

### Android
- Application name: `BeautyOnTheMove`
- Package name: `com.beautyonmove`
- Version code: `1`
- Version name: `1.0.0`

### Server Deployment

1. Create deployment directory:
```bash
sudo mkdir -p /var/www/beautyonmove-app
sudo chown -R $USER:$USER /var/www/beautyonmove-app
```

2. Clone and setup:
```bash
cd /var/www/beautyonmove-app
git clone <repository-url> .
npm install
```

3. Start the application:
```bash
pm2 start npm --name "beautyonmove-app" -- start
```

## Deployment Status

- ✅ Apache web server configured and working
- ✅ EC2 instance accessible at: http://54.237.203.146
- 🚀 Ready for APK deployment via GitHub Actions

## Latest Deployment

**Trigger Date**: $(date)
**Status**: Ready for deployment
