# GitHub Actions Setup Guide for BeautyOnTheMove Android App

This guide will help you set up GitHub Actions to automatically build and deploy your React Native Android app to AWS using CodeDeploy.

## Prerequisites

✅ **Completed:** AWS CloudFormation stack is successfully deployed  
✅ **Completed:** All necessary AWS resources are created  
✅ **Completed:** GitHub Actions workflow files are created  

## Step 1: Get AWS Resource Information

From your CloudFormation stack outputs, note down these values:

- **S3 Bucket Name:** `botm-deploy-665802315326-us-east-1`
- **CodeDeploy Application:** `BeautyOnTheMoveApp`
- **CodeDeploy Deployment Group:** `BeautyOnTheMoveDeploymentGroupWithoutBoundary`
- **GitHub Actions Role ARN:** (from the stack outputs)

## Step 2: Configure GitHub Repository Secrets

1. Go to your GitHub repository: `https://github.com/KTRapha/BeautyOnTheMove`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

   **Name:** `IAMROLE_GITHUB`  
   **Value:** `arn:aws:iam::665802315326:role/BeautyOnTheMove-Android-Stack-GitHubActionsCodeDeployRole-XXXXXXXXX`

   (Replace the X's with the actual role name from your CloudFormation stack outputs)

## Step 3: Update Workflow Configuration (if needed)

The workflow file `.github/workflows/deploy.yml` is already configured with:

- **S3 Bucket:** `botm-deploy-665802315326-us-east-1`
- **AWS Region:** `us-east-1`
- **CodeDeploy Application:** `BeautyOnTheMoveApp`
- **CodeDeploy Deployment Group:** `BeautyOnTheMoveDeploymentGroupWithoutBoundary`

If you need to change any of these values, edit the `env` section in the workflow file.

## Step 4: Test the Deployment

1. **Manual Trigger (Recommended for first test):**
   - Go to your GitHub repository
   - Click on **Actions** tab
   - Select **Build and Deploy** workflow
   - Click **Run workflow** → **Run workflow**

2. **Automatic Deployment (Optional):**
   - Edit `.github/workflows/deploy.yml`
   - Uncomment the `push` and `pull_request` triggers
   - Comment out the `workflow_dispatch` line
   - Push changes to trigger automatic deployment

## Step 5: Monitor the Deployment

### GitHub Actions
- Monitor the workflow execution in the **Actions** tab
- Check for any build or deployment errors

### AWS CodeDeploy
- Go to AWS CodeDeploy Console
- Select your application: `BeautyOnTheMoveApp`
- View deployment status and logs

### Application Access
- Once deployed, access your app at the Load Balancer DNS name
- The APK will be available for download at: `http://[LOAD_BALANCER_DNS]/beautyonmove.apk`

## Step 6: Verify the Setup

1. **Check S3 Bucket:** Verify deployment artifacts are uploaded
2. **Check CodeDeploy:** Verify deployment completes successfully
3. **Check EC2 Instances:** Verify web server is running and serving the APK
4. **Test Download:** Try downloading the APK from the web interface

## Troubleshooting

### Common Issues:

1. **Permission Denied Errors:**
   - Verify the GitHub Actions role ARN is correct
   - Check that the role has proper permissions

2. **Build Failures:**
   - Check Node.js and Java versions in the workflow
   - Verify all dependencies are properly installed

3. **Deployment Failures:**
   - Check CodeDeploy logs in AWS Console
   - Verify the appspec.yml file is correct
   - Check that deployment scripts have proper permissions

4. **APK Not Accessible:**
   - Verify Apache HTTP server is running on EC2 instances
   - Check security group allows HTTP traffic (port 80)
   - Verify the APK file is copied to the web directory

## Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `appspec.yml` - CodeDeploy deployment specification
- `aws/scripts/before-install.sh` - Pre-deployment script
- `aws/scripts/after-install.sh` - Post-deployment script
- `aws/scripts/start-application.sh` - Application start script
- `aws/scripts/stop-application.sh` - Application stop script

## Next Steps

After successful setup:

1. **Test the complete pipeline** with a manual trigger
2. **Enable automatic deployment** by uncommenting the push triggers
3. **Set up monitoring and alerts** for deployment status
4. **Configure additional environments** (staging, production) if needed

## Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Review AWS CodeDeploy deployment logs
3. Verify all AWS resources are properly configured
4. Ensure all scripts have proper permissions and syntax 