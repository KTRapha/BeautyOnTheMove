# AWS Deployment Guide for BeautyOnTheMove Android App

This guide will walk you through deploying your BeautyOnTheMove Android app to Amazon Web Services (AWS) using AWS CodeDeploy and GitHub Actions.

## Prerequisites

1. **AWS Account**: You need an active AWS account with appropriate permissions
2. **GitHub Repository**: Your BeautyOnTheMove-Android code should be in a GitHub repository
3. **AWS CLI**: Install and configure AWS CLI on your local machine
4. **Node.js and Java**: Ensure you have Node.js 18+ and Java 11+ installed locally

## Step 1: Deploy AWS Infrastructure

### 1.1 Deploy CloudFormation Stack

1. Open the AWS CloudFormation console
2. Click "Create stack" → "With new resources"
3. Choose "Upload a template file" and select the `cloudformation/template.yaml` file
4. Click "Next"

### 1.2 Configure Stack Parameters

Fill in the following parameters:

- **Stack name**: `BeautyOnTheMove-Stack`
- **GitHubRepoName**: Your GitHub repository name (e.g., `BeautyOnTheMove-Android`)
- **GitHubThumbprintList**: `6938fd4d98bab03faadb97b34396831e3780aea1`
- **VPC**: Select an existing VPC or create a new one
- **PublicSubnet1**: Select a public subnet
- **PublicSubnet2**: Select another public subnet

### 1.3 Deploy the Stack

1. Click "Next" through the remaining pages
2. Check the acknowledgment box for IAM resources
3. Click "Create stack"
4. Wait for the stack to complete (approximately 10-15 minutes)

### 1.4 Note the Outputs

After deployment, note the following outputs from the CloudFormation stack:

- **LoadBalancerDNS**: The DNS name of your load balancer
- **S3BucketName**: The S3 bucket for deployment artifacts
- **CodeDeployApplicationName**: The CodeDeploy application name
- **CodeDeployDeploymentGroupName**: The CodeDeploy deployment group name
- **GitHubActionsRoleARN**: The IAM role ARN for GitHub Actions

## Step 2: Configure GitHub Secrets

### 2.1 Add Repository Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add the following secrets:

1. **IAMROLE_GITHUB**: The GitHubActionsRoleARN from CloudFormation outputs
2. **AWS_REGION**: Your AWS region (e.g., `us-east-1`)
3. **S3_BUCKET**: The S3BucketName from CloudFormation outputs
4. **CODEDEPLOY_APPLICATION**: The CodeDeployApplicationName from CloudFormation outputs
5. **CODEDEPLOY_DEPLOYMENT_GROUP**: The CodeDeployDeploymentGroupName from CloudFormation outputs

### 2.2 Example Secret Values

```
IAMROLE_GITHUB: arn:aws:iam::123456789012:role/BeautyOnTheMoveGitHubActionsRole
AWS_REGION: us-east-1
S3_BUCKET: beauty-on-the-move-deployment-123456789012
CODEDEPLOY_APPLICATION: BeautyOnTheMoveApp
CODEDEPLOY_DEPLOYMENT_GROUP: BeautyOnTheMoveDeploymentGroup
```

## Step 3: Deploy Your Application

### 3.1 Manual Deployment

1. Go to your GitHub repository
2. Navigate to the **Actions** tab
3. Select the "Build and Deploy to AWS" workflow
4. Click "Run workflow"
5. Select the branch (usually `main`)
6. Click "Run workflow"

### 3.2 Automatic Deployment

The workflow is configured to automatically trigger on:
- Push to the `main` branch
- Pull requests to the `main` branch

## Step 4: Monitor Deployment

### 4.1 GitHub Actions

1. Go to the **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Monitor the build and deployment steps

### 4.2 AWS CodeDeploy

1. Open the AWS CodeDeploy console
2. Navigate to your application (`BeautyOnTheMoveApp`)
3. Check the deployment status and logs

### 4.3 EC2 Instances

1. Open the AWS EC2 console
2. Check the status of your instances in the Auto Scaling Group
3. Verify the application is running

## Step 5: Access Your Application

### 5.1 Download APK

Once deployment is complete, you can download the APK from:

```
http://[LoadBalancerDNS]/beauty-on-the-move.apk
```

### 5.2 Web Interface

Access the download page at:

```
http://[LoadBalancerDNS]/
```

## Step 6: Troubleshooting

### 6.1 Common Issues

**Build Failures:**
- Check Node.js and Java versions in the workflow
- Verify all dependencies are properly installed
- Check the build logs in GitHub Actions

**Deployment Failures:**
- Verify CodeDeploy agent is running on EC2 instances
- Check the deployment logs in AWS CodeDeploy console
- Ensure IAM roles have proper permissions

**Access Issues:**
- Verify security groups allow HTTP traffic (port 80)
- Check that the load balancer is properly configured
- Ensure the web server is running on EC2 instances

### 6.2 Log Locations

- **GitHub Actions**: Repository → Actions tab
- **CodeDeploy**: AWS CodeDeploy console → Applications → Deployments
- **EC2**: SSH into instances and check `/var/log/` directory

## Step 7: Scaling and Maintenance

### 7.1 Auto Scaling

The CloudFormation template creates an Auto Scaling Group that can scale from 1 to 3 instances based on demand.

### 7.2 Updates

To update your application:

1. Make changes to your code
2. Commit and push to the `main` branch
3. The GitHub Actions workflow will automatically build and deploy

### 7.3 Monitoring

Set up CloudWatch alarms to monitor:
- EC2 instance health
- Load balancer metrics
- Application performance

## Step 8: Cleanup

To avoid incurring charges, delete the CloudFormation stack:

1. Open the AWS CloudFormation console
2. Select your stack (`BeautyOnTheMove-Stack`)
3. Click "Delete"
4. Confirm the deletion

This will remove all created resources including:
- EC2 instances
- Load balancer
- S3 bucket
- IAM roles
- CodeDeploy application

## Security Considerations

1. **IAM Roles**: Use least privilege principle for IAM roles
2. **Security Groups**: Restrict access to necessary ports only
3. **HTTPS**: Consider adding SSL/TLS certificates for production
4. **Secrets**: Never commit AWS credentials to your repository
5. **Updates**: Keep your application and dependencies updated

## Cost Optimization

1. **Instance Types**: Use appropriate instance types for your workload
2. **Auto Scaling**: Configure scaling policies to optimize costs
3. **S3 Lifecycle**: Set up lifecycle policies for old deployment artifacts
4. **Monitoring**: Use CloudWatch to monitor and optimize resource usage

## Support

For issues with:
- **AWS Services**: Contact AWS Support
- **GitHub Actions**: Check GitHub documentation
- **React Native**: Refer to React Native documentation
- **CodeDeploy**: Review AWS CodeDeploy documentation

---

**Note**: This deployment setup is suitable for development and testing. For production deployments, consider additional security measures, monitoring, and backup strategies. 