# Quick Reference: CodeDeploy Permission Boundary Setup

## Step 2, Point 3: Create CodeDeploy with and without Permission Boundary

### Option 1: WITHOUT Permission Boundary (Simpler)

```bash
# Deploy main stack without permission boundary
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

**Creates:**
- `BeautyOnTheMoveCodeDeployRoleWithoutBoundary`
- `BeautyOnTheMoveGitHubActionsRoleWithoutBoundary`
- `BeautyOnTheMoveDeploymentGroupWithoutBoundary`

### Option 2: WITH Permission Boundary (More Secure)

```bash
# First, create permission boundary
aws cloudformation create-stack \
  --stack-name BeautyOnTheMove-PermissionBoundary \
  --template-body file://cloudformation/permission-boundary.yaml \
  --capabilities CAPABILITY_NAMED_IAM

# Get the permission boundary ARN
PERMISSION_BOUNDARY_ARN=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-PermissionBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`PermissionBoundaryArn`].OutputValue' \
  --output text)

# Deploy main stack with permission boundary
aws cloudformation create-stack \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --template-body file://cloudformation/template.yaml \
  --parameters \
    ParameterKey=GitHubRepoName,ParameterValue=BeautyOnTheMove-Android \
    ParameterKey=GitHubThumbprintList,ParameterValue=6938fd4d98bab03faadb97b34396831e3780aea1 \
    ParameterKey=VPC,ParameterValue=vpc-xxxxxxxxx \
    ParameterKey=PublicSubnet1,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PublicSubnet2,ParameterValue=subnet-xxxxxxxxx \
    ParameterKey=PermissionBoundaryArn,ParameterValue=$PERMISSION_BOUNDARY_ARN \
  --capabilities CAPABILITY_NAMED_IAM
```

**Creates:**
- `BeautyOnTheMoveCodeDeployRoleWithBoundary`
- `BeautyOnTheMoveGitHubActionsRoleWithBoundary`
- `BeautyOnTheMoveDeploymentGroupWithBoundary`

### GitHub Secrets Configuration

**For No Boundary:**
```bash
ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-NoBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithoutBoundary`].OutputValue' \
  --output text)

DEPLOYMENT_GROUP=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-NoBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`CodeDeployDeploymentGroupNameWithoutBoundary`].OutputValue' \
  --output text)
```

**For With Boundary:**
```bash
ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithBoundary`].OutputValue' \
  --output text)

DEPLOYMENT_GROUP=$(aws cloudformation describe-stacks \
  --stack-name BeautyOnTheMove-Stack-WithBoundary \
  --query 'Stacks[0].Outputs[?OutputKey==`CodeDeployDeploymentGroupNameWithBoundary`].OutputValue' \
  --output text)
```

### Key Differences

| Aspect | Without Boundary | With Boundary |
|--------|------------------|---------------|
| **Security** | Standard | Enhanced |
| **Setup Complexity** | Simple | Moderate |
| **IAM Restrictions** | None | Applied |
| **Compliance** | Basic | Enterprise-ready |
| **Troubleshooting** | Easy | Requires boundary knowledge |

### Recommendation

1. **Start with No Boundary** for initial testing and development
2. **Migrate to With Boundary** for production deployments
3. **Use With Boundary** for enterprise environments requiring enhanced security

### Files Created/Modified

- `cloudformation/template.yaml` - Updated with conditional permission boundary support
- `cloudformation/permission-boundary.yaml` - New permission boundary policy template
- `CODEDEPLOY_PERMISSION_BOUNDARY_GUIDE.md` - Comprehensive deployment guide

### Next Steps

1. Choose your deployment option (with or without boundary)
2. Deploy the CloudFormation stack(s)
3. Configure GitHub secrets with the appropriate role ARN and deployment group
4. Test the deployment pipeline
5. Monitor and troubleshoot as needed

For detailed instructions, see: `CODEDEPLOY_PERMISSION_BOUNDARY_GUIDE.md` 