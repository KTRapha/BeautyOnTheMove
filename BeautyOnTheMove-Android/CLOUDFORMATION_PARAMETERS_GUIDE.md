# CloudFormation Parameters Configuration Guide

This guide provides detailed instructions for configuring the CloudFormation parameters when deploying the BeautyOnTheMove Android app infrastructure to AWS.

## Required Parameters

Based on the CloudFormation template, you need to configure the following parameters:

### 1. GitHubRepoName
- **Type**: String
- **Description**: Name of your GitHub repository
- **Default**: `BeautyOnTheMove-Android`
- **Your Value**: `BeautyOnTheMove-Android` (or your actual repository name)

### 2. GitHubThumbprintList
- **Type**: String
- **Description**: GitHub thumbprint for OIDC (OpenID Connect)
- **Default**: `6938fd4d98bab03faadb97b34396831e3780aea1`
- **Your Value**: Use the default value (this is the current GitHub OIDC thumbprint)

### 3. VPC
- **Type**: AWS::EC2::VPC::Id
- **Description**: VPC ID where your resources will be deployed
- **Required**: Yes
- **How to find**: 
  1. Go to AWS VPC Console
  2. Note down your VPC ID (format: vpc-xxxxxxxxx)
  3. Or create a new VPC if needed

### 4. PublicSubnet1
- **Type**: AWS::EC2::Subnet::Id
- **Description**: First public subnet for load balancer and EC2 instances
- **Required**: Yes
- **How to find**:
  1. Go to AWS VPC Console → Subnets
  2. Find a public subnet in your VPC
  3. Note the Subnet ID (format: subnet-xxxxxxxxx)

### 5. PublicSubnet2
- **Type**: AWS::EC2::Subnet::Id
- **Description**: Second public subnet for high availability
- **Required**: Yes
- **How to find**:
  1. Go to AWS VPC Console → Subnets
  2. Find another public subnet in a different Availability Zone
  3. Note the Subnet ID (format: subnet-xxxxxxxxx)

## Step-by-Step Configuration

### Step 1: Prepare Your AWS Environment

1. **Log into AWS Console**
   - Go to https://console.aws.amazon.com/
   - Select your preferred region (recommended: us-east-1, us-west-2, or eu-west-1)

2. **Check Your VPC Setup**
   - Navigate to VPC Console
   - Ensure you have a VPC with at least 2 public subnets
   - Note down the VPC ID and subnet IDs

### Step 2: Create VPC and Subnets (If Needed)

If you don't have a VPC with public subnets, create one:

```bash
# Using AWS CLI (optional)
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications ResourceType=vpc,Tags='[{Key=Name,Value=BeautyOnTheMove-VPC}]'

# Then create subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

### Step 3: Deploy CloudFormation Stack

1. **Open CloudFormation Console**
   - Go to AWS CloudFormation Console
   - Click "Create stack" → "With new resources"

2. **Upload Template**
   - Choose "Upload a template file"
   - Select the `cloudformation/template.yaml` file from your repository
   - Click "Next"

3. **Configure Parameters**

Fill in the parameters as follows:

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Stack name** | `BeautyOnTheMove-Stack` | Choose a unique name |
| **GitHubRepoName** | `BeautyOnTheMove-Android` | Your GitHub repository name |
| **GitHubThumbprintList** | `6938fd4d98bab03faadb97b34396831e3780aea1` | Use default value |
| **VPC** | `vpc-xxxxxxxxx` | Your VPC ID |
| **PublicSubnet1** | `subnet-xxxxxxxxx` | First public subnet ID |
| **PublicSubnet2** | `subnet-xxxxxxxxx` | Second public subnet ID |

### Step 4: Advanced Configuration (Optional)

You can also modify the template to add more parameters:

```yaml
Parameters:
  InstanceType:
    Type: String
    Default: t3.medium
    AllowedValues:
      - t3.micro
      - t3.small
      - t3.medium
      - t3.large
    Description: EC2 instance type for the application servers

  MinSize:
    Type: Number
    Default: 1
    MinValue: 1
    MaxValue: 5
    Description: Minimum number of instances in the Auto Scaling Group

  MaxSize:
    Type: Number
    Default: 3
    MinValue: 1
    MaxValue: 10
    Description: Maximum number of instances in the Auto Scaling Group
```

## Parameter Validation

The CloudFormation template includes parameter validation:

- **VPC**: Must be a valid VPC ID in your account
- **Subnets**: Must be valid subnet IDs in the specified VPC
- **GitHubThumbprintList**: Must be a valid SHA-1 hash

## Common Issues and Solutions

### Issue 1: "VPC does not exist"
**Solution**: 
- Verify the VPC ID is correct
- Ensure you're in the right AWS region
- Check that the VPC exists in your account

### Issue 2: "Subnet does not exist"
**Solution**:
- Verify subnet IDs are correct
- Ensure subnets are in the specified VPC
- Check that subnets are public (have route to internet gateway)

### Issue 3: "GitHub repository not found"
**Solution**:
- Verify the GitHub repository name is correct
- Ensure the repository is public or you have access
- Check for typos in the repository name

## Security Considerations

1. **VPC Selection**: Choose a VPC with appropriate security groups
2. **Subnet Selection**: Use public subnets for load balancer access
3. **GitHub Thumbprint**: Keep the default value unless GitHub updates it
4. **Repository Name**: Ensure it matches your actual GitHub repository

## Cost Optimization

1. **Instance Type**: The template uses t3.medium by default (cost-effective)
2. **Auto Scaling**: Configured for 1-3 instances (minimize costs)
3. **Region Selection**: Choose a region close to your users for better performance

## Next Steps After Parameter Configuration

1. **Deploy the Stack**: Click "Create stack" and wait for completion
2. **Note the Outputs**: Save the output values for GitHub secrets configuration
3. **Configure GitHub Secrets**: Use the output values in your GitHub repository
4. **Test Deployment**: Trigger the GitHub Actions workflow

## Example Parameter Values

Here's an example configuration for the us-east-1 region:

```
Stack name: BeautyOnTheMove-Stack
GitHubRepoName: BeautyOnTheMove-Android
GitHubThumbprintList: 6938fd4d98bab03faadb97b34396831e3780aea1
VPC: vpc-0a1b2c3d4e
PublicSubnet1: subnet-0f1e2d3c4b
PublicSubnet2: subnet-0a9b8c7d6e
```

## Support

If you encounter issues with parameter configuration:

1. **Check AWS Documentation**: [CloudFormation Parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html)
2. **Verify VPC Setup**: Ensure your VPC has internet connectivity
3. **Review Error Messages**: CloudFormation provides detailed error information
4. **Contact AWS Support**: For account-specific issues

---

**Note**: Always test the deployment in a non-production environment first to ensure all parameters are correctly configured. 