# CodeDeploy Permission Boundary Configuration Guide

This guide explains how to deploy the BeautyOnTheMove Android app using AWS CodeDeploy with and without permission boundaries.

## Overview

The CloudFormation template now supports two deployment scenarios:
1. **With Permission Boundary**: Enhanced security with IAM permission boundaries
2. **Without Permission Boundary**: Standard deployment without additional IAM restrictions

## Step 1: Create Permission Boundary (Optional)

If you want to use permission boundaries for enhanced security:

### 1.1 Deploy Permission Boundary Stack

```bash
aws cloudformation create-stack \
  --stack-name BeautyOnTheMove-PermissionBoundary \
  --template-body file://cloudformation/permission-boundary.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```

### 1.2 Note the Permission Boundary ARN

After deployment, note the ARN from the stack outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-PermissionBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`PermissionBoundaryArn`].OutputValue' \
  --output text
```

Example output: `arn:aws:iam::123456789012:policy/BeautyOnTheMovePermissionBoundary`

## Step 2: Deploy Main Infrastructure

### 2.1 Deploy WITHOUT Permission Boundary

For standard deployment without permission boundaries:

```bash
aws cloudformation create-stack \
  --stack-name BeautyOnTheMove-Stack-NoBoundary \
  --template-body file://cloudformation/template.yaml \
  --parameters \
    ParameterKey=GitHubRepoName,ParameterValue=BeautyOnTheMove-Android \
    ParameterKey=GitHubThumbprintList,ParameterValue=6938fd4d98bab03faadb97b34396831e3780aea1 \
    ParameterKey=VPC,ParameterValue=vpc-xxxxxxxxx \
    ParameterKey=PublicSubnet1,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PublicSubnet2,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PermissionBoundaryArn,ParameterValue="" \
  --capabilities CAPABILITY_NAMED_IAM
```

**Resources Created:**
- `BeautyOnTheMoveCodeDeployRoleWithoutBoundary`
- `BeautyOnTheMoveGitHubActionsRoleWithoutBoundary`
- `BeautyOnTheMoveDeploymentGroupWithoutBoundary`

### 2.2 Deploy WITH Permission Boundary

For enhanced security with permission boundaries:

```bash
aws cloudformation create-stack \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --template-body file://cloudformation/template.yaml \
  --parameters \
    ParameterKey=GitHubRepoName,ParameterValue=BeautyOnTheMove-Android \
    ParameterKey=GitHubThumbprintList,ParameterValue=6938fd4d98bab03faadb97b34396831e3780aea1 \
    ParameterKey=VPC,ParameterValue=vpc-xxxxxxxxx \
    ParameterKey=PublicSubnet1,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PublicSubnet2,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PermissionBoundaryArn,ParameterValue=arn:aws:iam::123456789012:policy/BeautyOnTheMovePermissionBoundary \
  --capabilities CAPABILITY_NAMED_IAM
```

**Resources Created:**
- `BeautyOnTheMoveCodeDeployRoleWithBoundary`
- `BeautyOnTheMoveGitHubActionsRoleWithBoundary`
- `BeautyOnTheMoveDeploymentGroupWithBoundary`

## Step 3: Configure GitHub Secrets

### 3.1 For Deployment WITHOUT Permission Boundary

Add these secrets to your GitHub repository:

```bash
# Get the role ARN from CloudFormation outputs
ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-NoBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithoutBoundary`].OutputValue' \
  --output text)

DEPLOYMENT_GROUP=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-NoBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`CodeDeployDeploymentGroupNameWithoutBoundary`].OutputValue' \
  --output text)
```

GitHub Secrets:
- `IAMROLE_GITHUB`: `$ROLE_ARN`
- `CODEDEPLOY_DEPLOYMENT_GROUP`: `$DEPLOYMENT_GROUP`

### 3.2 For Deployment WITH Permission Boundary

Add these secrets to your GitHub repository:

```bash
# Get the role ARN from CloudFormation outputs
ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithBoundary`].OutputValue' \
  --output text)

DEPLOYMENT_GROUP=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`CodeDeployDeploymentGroupNameWithBoundary`].OutputValue' \
  --output text)
```

GitHub Secrets:
- `IAMROLE_GITHUB`: `$ROLE_ARN`
- `CODEDEPLOY_DEPLOYMENT_GROUP`: `$DEPLOYMENT_GROUP`

## Step 4: Update GitHub Actions Workflow

Update your `.github/workflows/deploy.yml` to use the correct deployment group:

```yaml
name: Build and Deploy to AWS

on:
  workflow_dispatch: {}
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  JAVA_VERSION: '11'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: ${{ env.JAVA_VERSION }}
        
    - name: Install dependencies
      run: |
        npm ci
        cd android && ./gradlew wrapper
        
    - name: Build Android APK
      run: |
        cd android
        ./gradlew assembleRelease
        cd ..
        
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: ${{ secrets.IAMROLE_GITHUB }}
        aws-region: ${{ secrets.AWS_REGION }}
        
    - name: Upload to S3
      run: |
        aws s3 cp android/app/build/outputs/apk/release/app-release.apk s3://${{ secrets.S3_BUCKET }}/beauty-on-the-move.apk
        
    - name: Deploy to EC2
      run: |
        aws deploy create-deployment \
          --application-name ${{ secrets.CODEDEPLOY_APPLICATION }} \
          --deployment-group-name ${{ secrets.CODEDEPLOY_DEPLOYMENT_GROUP }} \
          --s3-location bucket=${{ secrets.S3_BUCKET }},key=beauty-on-the-move.apk,bundleType=zip \
          --description "Deployment from GitHub Actions"
```

## Step 5: Security Comparison

### Without Permission Boundary
**Pros:**
- Simpler setup
- No additional IAM restrictions
- Easier troubleshooting

**Cons:**
- Less secure
- Roles have broader permissions
- Higher risk of privilege escalation

### With Permission Boundary
**Pros:**
- Enhanced security
- Prevents privilege escalation
- Follows security best practices
- Complies with enterprise security policies

**Cons:**
- More complex setup
- Additional IAM restrictions
- May require adjustments for specific use cases

## Step 6: Permission Boundary Details

The permission boundary policy includes:

### Allowed Actions:
- CodeDeploy operations (`codedeploy:*`)
- S3 operations for deployment artifacts
- EC2 and Auto Scaling operations
- Load Balancer operations
- CloudWatch Logs operations
- Limited IAM operations (read-only)

### Denied Actions:
- IAM role/policy creation/deletion
- IAM user/group management
- Permission boundary modifications
- Service-linked role operations
- MFA device management
- SAML/OIDC provider management

## Step 7: Troubleshooting

### Common Issues with Permission Boundaries

1. **Deployment Fails with Access Denied**
   - Check if the permission boundary allows the required actions
   - Verify the role has the necessary permissions within the boundary

2. **GitHub Actions Fails**
   - Ensure the GitHub Actions role has the correct permissions
   - Check that the OIDC provider is properly configured

3. **CodeDeploy Agent Issues**
   - Verify the EC2 instance role has the required permissions
   - Check that the CodeDeploy agent is running

### Debugging Commands

```bash
# Check role permissions
aws iam get-role --role-name BeautyOnTheMoveCodeDeployRoleWithBoundary

# List attached policies
aws iam list-attached-role-policies --role-name BeautyOnTheMoveCodeDeployRoleWithBoundary

# Check permission boundary
aws iam get-role --role-name BeautyOnTheMoveCodeDeployRoleWithBoundary --query 'Role.PermissionsBoundary'

# Test permissions
aws sts assume-role --role-arn arn:aws:iam::123456789012:role/BeautyOnTheMoveCodeDeployRoleWithBoundary --role-session-name TestSession
```

## Step 8: Cleanup

To remove the stacks:

```bash
# Remove main stack
aws cloudformation delete-stack --stack-name BeautyOnTheMove-Stack-WithBoundary
aws cloudformation delete-stack --stack-name BeautyOnTheMove-Stack-NoBoundary

# Remove permission boundary stack (if created)
aws cloudformation delete-stack --stack-name BeautyOnTheMove-PermissionBoundary
```

## Best Practices

1. **Start Without Permission Boundary**: Deploy first without permission boundaries to ensure everything works
2. **Test Thoroughly**: Test all deployment scenarios before adding permission boundaries
3. **Monitor Logs**: Use CloudWatch to monitor deployment logs and identify permission issues
4. **Gradual Rollout**: Consider deploying to a test environment first
5. **Document Changes**: Keep track of any permission boundary adjustments needed

## Security Recommendations

1. **Use Permission Boundaries**: Always use permission boundaries in production environments
2. **Principle of Least Privilege**: Grant only the minimum permissions required
3. **Regular Audits**: Regularly review and audit IAM permissions
4. **Monitor Access**: Use CloudTrail to monitor IAM access
5. **Rotate Credentials**: Regularly rotate access keys and credentials

---

**Note**: This configuration provides a secure foundation for your BeautyOnTheMove Android app deployment. Choose the appropriate configuration based on your security requirements and compliance needs. 