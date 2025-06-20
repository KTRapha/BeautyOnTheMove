# PowerShell script to create GitHub OIDC provider for AWS

# Get AWS Account ID
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
$REGION = (aws configure get region)

Write-Host "Setting up GitHub OIDC provider for AWS Account: $ACCOUNT_ID in Region: $REGION" -ForegroundColor Yellow

# Check if OIDC provider already exists
Write-Host "Checking if OIDC provider already exists..." -ForegroundColor Cyan
$EXISTING_PROVIDER = (aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text 2>$null)

if ($EXISTING_PROVIDER) {
    Write-Host "✅ OIDC provider already exists: $EXISTING_PROVIDER" -ForegroundColor Green
    Write-Host "You can now proceed with deploying the CloudFormation stack." -ForegroundColor Yellow
    exit 0
}

Write-Host "OIDC provider not found. Creating new one..." -ForegroundColor Cyan

# Create the OIDC provider
try {
    aws iam create-open-id-connect-provider `
        --url https://token.actions.githubusercontent.com `
        --client-id-list sts.amazonaws.com `
        --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 `
        --region $REGION

    Write-Host "✅ GitHub OIDC provider created successfully!" -ForegroundColor Green
    Write-Host "Provider ARN: arn:aws:iam::$ACCOUNT_ID`:oidc-provider/token.actions.githubusercontent.com" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 OIDC setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy the CloudFormation stack with the updated template"
    Write-Host "2. The IAM roles will now be able to trust the GitHub OIDC provider"
    Write-Host "3. Your GitHub Actions should be able to assume the role successfully!"
    Write-Host ""
}
catch {
    Write-Host "❌ Failed to create OIDC provider: $_" -ForegroundColor Red
    exit 1
} 