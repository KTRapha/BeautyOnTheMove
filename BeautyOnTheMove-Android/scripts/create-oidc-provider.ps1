# PowerShell script to create GitHub OIDC Identity Provider for AWS
# This is required because AWS::IAM::OIDCIdentityProvider is not supported in CloudFormation

Write-Host "🔧 Creating GitHub OIDC Identity Provider..." -ForegroundColor Yellow

# Configuration
$Region = "us-east-1"

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
    $AccountId = aws sts get-caller-identity --query Account --output text
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
    Write-Host "Account ID: $AccountId" -ForegroundColor White
} catch {
    Write-Host "❌ AWS CLI is not configured" -ForegroundColor Red
    exit 1
}

# Check if OIDC provider already exists
Write-Host "🔍 Checking if OIDC provider already exists..." -ForegroundColor Yellow
$ExistingProvider = aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text

if ($ExistingProvider) {
    Write-Host "✅ OIDC provider already exists: $ExistingProvider" -ForegroundColor Green
    Write-Host "📝 You can now proceed with deploying the CloudFormation stack." -ForegroundColor Yellow
    exit 0
}

Write-Host "🔍 OIDC provider not found. Creating new one..." -ForegroundColor Yellow

# Create the OIDC provider
Write-Host "🚀 Creating GitHub OIDC Identity Provider..." -ForegroundColor Yellow

aws iam create-open-id-connect-provider `
    --url https://token.actions.githubusercontent.com `
    --client-id-list sts.amazonaws.com `
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 `
    --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GitHub OIDC Identity Provider created successfully!" -ForegroundColor Green
    
    # Get the provider ARN
    $ProviderArn = aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text
    Write-Host "✅ Provider ARN: $ProviderArn" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 OIDC setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy the CloudFormation stack with the updated template" -ForegroundColor White
    Write-Host "2. The IAM roles will now be able to trust the GitHub OIDC provider" -ForegroundColor White
    Write-Host "3. Your GitHub Actions should be able to assume the role successfully!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Failed to create OIDC provider" -ForegroundColor Red
    exit 1
} 