# Simple PowerShell script to deploy CloudFormation and fix OIDC issue

Write-Host "🔧 Deploying CloudFormation stack to fix OIDC issue..." -ForegroundColor Yellow

# Configuration
$StackName = "BeautyOnTheMove-Android-Stack"
$Region = "us-east-1"
$GitHubRepo = "KTRapha/BeautyOnTheMove"

Write-Host "Stack Name: $StackName" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host "GitHub Repo: $GitHubRepo" -ForegroundColor White
Write-Host ""

# Check AWS CLI
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed" -ForegroundColor Red
    exit 1
}

# Check authentication
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured" -ForegroundColor Red
    exit 1
}

# Get VPC and subnets
Write-Host "🔍 Getting VPC and subnet information..." -ForegroundColor Yellow
$VPC_ID = aws ec2 describe-vpcs --region $Region --query 'Vpcs[0].VpcId' --output text
$SUBNET1_ID = aws ec2 describe-subnets --region $Region --query 'Subnets[0].SubnetId' --output text
$SUBNET2_ID = aws ec2 describe-subnets --region $Region --query 'Subnets[1].SubnetId' --output text

if (-not $VPC_ID -or -not $SUBNET1_ID -or -not $SUBNET2_ID) {
    Write-Host "❌ Could not find VPC or subnets" -ForegroundColor Red
    Write-Host "Please provide VPC and subnet IDs manually" -ForegroundColor White
    exit 1
}

Write-Host "✅ Found VPC: $VPC_ID" -ForegroundColor Green
Write-Host "✅ Found Subnet 1: $SUBNET1_ID" -ForegroundColor Green
Write-Host "✅ Found Subnet 2: $SUBNET2_ID" -ForegroundColor Green

# Deploy CloudFormation stack
Write-Host "🚀 Deploying CloudFormation stack..." -ForegroundColor Yellow

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

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CloudFormation stack deployed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy CloudFormation stack" -ForegroundColor Red
    exit 1
}

# Get role ARN
Write-Host "🔍 Getting IAM role ARN..." -ForegroundColor Yellow
$ROLE_ARN = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithoutBoundary`].OutputValue' `
    --output text

if (-not $ROLE_ARN) {
    $ROLE_ARN = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithBoundary`].OutputValue' `
        --output text
}

if ($ROLE_ARN) {
    Write-Host "✅ GitHub Actions Role ARN: $ROLE_ARN" -ForegroundColor Green
} else {
    Write-Host "❌ Could not find the GitHub Actions role ARN" -ForegroundColor Red
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