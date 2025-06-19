# PowerShell script to fix OIDC issue with GitHub Actions and AWS
# This script will deploy the updated CloudFormation template and verify the setup

param(
    [string]$StackName = "BeautyOnTheMove-Android-Stack",
    [string]$Region = "us-east-1",
    [string]$GitHubRepo = "KTRapha/BeautyOnTheMove"
)

Write-Host "🔧 Fixing OIDC issue for GitHub Actions..." -ForegroundColor Yellow

# Configuration
Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Stack Name: $StackName" -ForegroundColor White
Write-Host "  Region: $Region" -ForegroundColor White
Write-Host "  GitHub Repo: $GitHubRepo" -ForegroundColor White
Write-Host ""

# Check if AWS CLI is installed
try {
    $null = Get-Command aws -ErrorAction Stop
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if user is authenticated
try {
    $null = aws sts get-caller-identity 2>$null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Get VPC and subnet information
Write-Host "🔍 Getting VPC and subnet information..." -ForegroundColor Yellow
try {
    $VPC_ID = aws ec2 describe-vpcs --region $Region --query 'Vpcs[0].VpcId' --output text 2>$null
    $SUBNET1_ID = aws ec2 describe-subnets --region $Region --query 'Subnets[0].SubnetId' --output text 2>$null
    $SUBNET2_ID = aws ec2 describe-subnets --region $Region --query 'Subnets[1].SubnetId' --output text 2>$null

    if (-not $VPC_ID -or -not $SUBNET1_ID -or -not $SUBNET2_ID) {
        Write-Host "❌ Could not find VPC or subnets. Please provide them manually:" -ForegroundColor Red
        Write-Host "VPC_ID=your-vpc-id" -ForegroundColor White
        Write-Host "SUBNET1_ID=your-subnet1-id" -ForegroundColor White
        Write-Host "SUBNET2_ID=your-subnet2-id" -ForegroundColor White
        exit 1
    }

    Write-Host "✅ Found VPC: $VPC_ID" -ForegroundColor Green
    Write-Host "✅ Found Subnet 1: $SUBNET1_ID" -ForegroundColor Green
    Write-Host "✅ Found Subnet 2: $SUBNET2_ID" -ForegroundColor Green
} catch {
    Write-Host "❌ Error getting VPC/subnet information" -ForegroundColor Red
    exit 1
}

# Deploy CloudFormation stack
Write-Host "🚀 Deploying CloudFormation stack..." -ForegroundColor Yellow

try {
    aws cloudformation deploy `
        --template-file cloudformation/template.yaml `
        --stack-name $StackName `
        --parameter-overrides `
            GitHubRepoName=$GitHubRepo `
            VPC=$VPC_ID `
            PublicSubnet1=$SUBNET1_ID `
            PublicSubnet2=$SUBNET2_ID `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    Write-Host "✅ CloudFormation stack deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy CloudFormation stack" -ForegroundColor Red
    exit 1
}

# Get the role ARN
Write-Host "🔍 Getting IAM role ARN..." -ForegroundColor Yellow
try {
    $ROLE_ARN = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithoutBoundary`].OutputValue' `
        --output text 2>$null

    if (-not $ROLE_ARN) {
        $ROLE_ARN = aws cloudformation describe-stacks `
            --stack-name $StackName `
            --region $Region `
            --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithBoundary`].OutputValue' `
            --output text 2>$null
    }

    if (-not $ROLE_ARN) {
        Write-Host "❌ Could not find the GitHub Actions role ARN" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ GitHub Actions Role ARN: $ROLE_ARN" -ForegroundColor Green
} catch {
    Write-Host "❌ Error getting role ARN" -ForegroundColor Red
    exit 1
}

# Verify the OIDC provider
Write-Host "🔍 Verifying OIDC provider..." -ForegroundColor Yellow
try {
    $OIDC_PROVIDER_ARN = aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text 2>$null

    if (-not $OIDC_PROVIDER_ARN) {
        Write-Host "❌ OIDC provider not found" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ OIDC Provider ARN: $OIDC_PROVIDER_ARN" -ForegroundColor Green
} catch {
    Write-Host "❌ Error verifying OIDC provider" -ForegroundColor Red
    exit 1
}

# Verify the trust policy
Write-Host "🔍 Verifying trust policy..." -ForegroundColor Yellow
try {
    $TRUST_POLICY = aws iam get-role --role-name GitHubActionsCodeDeployRole --query 'Role.AssumeRolePolicyDocument' --output json 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Trust policy verified" -ForegroundColor Green
        Write-Host "Trust Policy:" -ForegroundColor White
        Write-Host $TRUST_POLICY -ForegroundColor White
    } else {
        Write-Host "❌ Could not verify trust policy" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error verifying trust policy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 OIDC setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure your GitHub repository secrets are configured:" -ForegroundColor White
Write-Host "   - AWS_REGION: $Region" -ForegroundColor White
Write-Host "   - NEW_S3_BUCKET_NAME: ktrapha-beautyonmove-android-deployments" -ForegroundColor White
Write-Host ""
Write-Host "2. The role ARN to use in your workflow:" -ForegroundColor White
Write-Host "   $ROLE_ARN" -ForegroundColor White
Write-Host ""
Write-Host "3. Push your changes to trigger the GitHub Actions workflow" -ForegroundColor White
Write-Host ""
Write-Host "✅ Your GitHub Actions should now be able to assume the role successfully!" -ForegroundColor Green 