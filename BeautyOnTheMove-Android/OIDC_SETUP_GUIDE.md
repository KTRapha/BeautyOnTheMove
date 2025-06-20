# OIDC Authentication Setup Guide

## Problem
You're getting the error: `Not authorized to perform sts:AssumeRoleWithWebIdentity`

This happens when GitHub Actions tries to assume an AWS IAM role using OIDC (OpenID Connect) authentication, but the setup is incomplete.

## Solution Steps

### Step 1: Create GitHub OIDC Provider in AWS

1. **Go to AWS Console** → **IAM** → **Identity providers**
2. **Click "Add provider"**
3. **Select "OpenID Connect"**
4. **Provider URL**: `https://token.actions.githubusercontent.com`
5. **Audience**: `sts.amazonaws.com`
6. **Click "Add provider"**

### Step 2: Get Your IAM Role ARN

1. **Go to AWS Console** → **CloudFormation**
2. **Select your stack**: `BeautyOnTheMove-Android-Stack`
3. **Go to "Outputs" tab**
4. **Find**: `GitHubActionsRoleARNWithoutBoundary`
5. **Copy the ARN value**

The ARN should look like:
```
arn:aws:iam::123456789012:role/GitHubActionsCodeDeployRole-BeautyOnTheMove-Android-Stack
```

### Step 3: Add GitHub Repository Secret

1. **Go to your GitHub repository**: `https://github.com/KTRapha/BeautyOnTheMove`
2. **Go to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Name**: `IAMROLE_GITHUB`
5. **Value**: Paste the ARN from Step 2

### Step 4: Verify Trust Policy

The IAM role trust policy should look like this (it's already correct in your CloudFormation template):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:KTRapha/BeautyOnTheMove:*"
        }
      }
    }
  ]
}
```

### Step 5: Test the Setup

1. **Go to your GitHub repository**
2. **Go to Actions tab**
3. **You should see the "Deploy to AWS" workflow**
4. **Click "Run workflow"** → **"Run workflow"**
5. **The workflow should now succeed**

## Troubleshooting

### If you still get OIDC errors:

1. **Check the OIDC provider exists**:
   - Go to AWS Console → IAM → Identity providers
   - Verify `token.actions.githubusercontent.com` is listed

2. **Check the IAM role trust policy**:
   - Go to AWS Console → IAM → Roles
   - Find your role: `GitHubActionsCodeDeployRole-BeautyOnTheMove-Android-Stack`
   - Check the "Trust relationships" tab

3. **Verify GitHub secret**:
   - Go to GitHub repository → Settings → Secrets
   - Ensure `IAMROLE_GITHUB` is set correctly

4. **Check repository name**:
   - Ensure the repository name in the trust policy matches exactly: `KTRapha/BeautyOnTheMove`

### Common Issues:

1. **Wrong repository name**: The trust policy must match your exact repository name
2. **Missing OIDC provider**: The GitHub OIDC provider must exist in AWS
3. **Incorrect ARN**: The GitHub secret must contain the correct IAM role ARN
4. **Permission boundary**: If using permission boundaries, ensure the role can be assumed

## Manual AWS CLI Commands (if needed)

If you have AWS CLI installed, you can create the OIDC provider with:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

## Next Steps

After fixing the OIDC issue:

1. Your GitHub Actions workflow will be able to authenticate with AWS
2. The workflow will build your React Native app
3. The app will be deployed to your EC2 instances via CodeDeploy
4. Your app will be accessible via the load balancer

## Support

If you continue to have issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all AWS resources are created correctly
3. Ensure your AWS account has the necessary permissions 