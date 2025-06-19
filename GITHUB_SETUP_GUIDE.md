# GitHub Repository Setup Guide for BeautyOnTheMove

## 🎯 Overview

This guide will help you create separate GitHub repositories for the Android and iOS versions of BeautyOnTheMove. This approach provides better organization, platform-specific deployment, and easier maintenance.

## 📱 Repository Structure

We'll create two separate repositories:

1. **BeautyOnTheMove-Android** - Android-specific code and builds
2. **BeautyOnTheMove-iOS** - iOS-specific code and builds

## 🚀 Step-by-Step Setup

### Step 1: Prepare Repository Scripts

First, let's run the preparation scripts to create the separate repository structures:

```bash
# Make scripts executable (if on macOS/Linux)
chmod +x scripts/prepare-android-repo.sh
chmod +x scripts/prepare-ios-repo.sh

# Run the preparation scripts
bash scripts/prepare-android-repo.sh
bash scripts/prepare-ios-repo.sh
```

### Step 2: Create GitHub Repositories

#### Option A: Using GitHub Web Interface

1. **Create Android Repository:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Repository name: `BeautyOnTheMove-Android`
   - Description: `BeautyOnTheMove Android Application - Beauty services marketplace`
   - Visibility: Choose based on your needs (Public/Private)
   - **DO NOT** initialize with README (we'll add our own)
   - Click "Create repository"

2. **Create iOS Repository:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Repository name: `BeautyOnTheMove-iOS`
   - Description: `BeautyOnTheMove iOS Application - Beauty services marketplace`
   - Visibility: Choose based on your needs (Public/Private)
   - **DO NOT** initialize with README (we'll add our own)
   - Click "Create repository"

#### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Create Android repository
gh repo create BeautyOnTheMove-Android --description "BeautyOnTheMove Android Application - Beauty services marketplace" --public

# Create iOS repository
gh repo create BeautyOnTheMove-iOS --description "BeautyOnTheMove iOS Application - Beauty services marketplace" --public
```

### Step 3: Set Up Android Repository

```bash
# Navigate to Android repository directory
cd ../BeautyOnTheMove-Android

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial Android repository setup

- React Native Android application
- BeautyOnTheMove marketplace app
- Platform-specific Android components
- Build and deployment scripts
- Documentation and guides"

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/BeautyOnTheMove-Android.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Set Up iOS Repository

```bash
# Navigate to iOS repository directory
cd ../BeautyOnTheMove-iOS

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial iOS repository setup

- React Native iOS application
- BeautyOnTheMove marketplace app
- Platform-specific iOS components
- Build and deployment scripts
- Documentation and guides"

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/BeautyOnTheMove-iOS.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔧 Repository Configuration

### Android Repository Features

- **Branch Protection:** Enable for `main` branch
- **Required Reviews:** Require pull request reviews
- **Status Checks:** Require status checks to pass
- **Topics:** Add topics like `react-native`, `android`, `beauty`, `marketplace`
- **Description:** Update with detailed project information

### iOS Repository Features

- **Branch Protection:** Enable for `main` branch
- **Required Reviews:** Require pull request reviews
- **Status Checks:** Require status checks to pass
- **Topics:** Add topics like `react-native`, `ios`, `beauty`, `marketplace`
- **Description:** Update with detailed project information

## 📋 Repository Settings

### Enable Features

For both repositories, enable these features:

1. **Issues:** Enable for bug tracking and feature requests
2. **Projects:** Enable for project management
3. **Wiki:** Enable for documentation
4. **Discussions:** Enable for community discussions
5. **Security:** Enable security advisories

### Set Up Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

## 🔄 Workflow Setup

### Development Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit:**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push and Create Pull Request:**
   ```bash
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

4. **Review and Merge:**
   - Get code review
   - Address feedback
   - Merge to main

### Release Workflow

1. **Create Release Branch:**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version:**
   - Update `package.json` version
   - Update `app.json` version
   - Update Android `build.gradle` version
   - Update iOS `Info.plist` version

3. **Build and Test:**
   ```bash
   # Android
   npm run build:android-bundle
   
   # iOS
   npm run build:ios
   ```

4. **Create Release:**
   - Tag the release
   - Create GitHub release
   - Upload build artifacts

## 📦 CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/ci.yml` in each repository:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm test
    - run: npm run lint

  build-android:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run bundle:android
    - run: npm run build:android-bundle
```

## 🔗 Cross-Repository Links

### Update README Files

Add cross-repository links to each README:

**Android README:**
```markdown
## Related Repositories

- [BeautyOnTheMove-iOS](https://github.com/YOUR_USERNAME/BeautyOnTheMove-iOS) - iOS version of the app
- [BeautyOnTheMove-Web](https://github.com/YOUR_USERNAME/BeautyOnTheMove-Web) - Web version (if applicable)
```

**iOS README:**
```markdown
## Related Repositories

- [BeautyOnTheMove-Android](https://github.com/YOUR_USERNAME/BeautyOnTheMove-Android) - Android version of the app
- [BeautyOnTheMove-Web](https://github.com/YOUR_USERNAME/BeautyOnTheMove-Web) - Web version (if applicable)
```

## 🎉 Next Steps

After setting up the repositories:

1. **Update Documentation:** Ensure all documentation is up to date
2. **Set Up Monitoring:** Configure repository insights and analytics
3. **Team Access:** Add team members with appropriate permissions
4. **Deployment:** Set up automated deployment pipelines
5. **Testing:** Ensure all builds work correctly in the new structure

## 📞 Support

If you encounter any issues:

1. Check the [GitHub documentation](https://docs.github.com/)
2. Review the deployment guides in each repository
3. Ensure all dependencies are properly configured
4. Verify platform-specific requirements are met

---

**Remember:** Keep both repositories in sync for shared code changes and maintain consistent versioning across platforms. 