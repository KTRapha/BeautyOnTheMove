#!/bin/bash

# Script to create GitHub OIDC Identity Provider for AWS
# This is required because AWS::IAM::OIDCIdentityProvider is not supported in CloudFormation

set -e

echo "🔧 Creating GitHub OIDC Identity Provider..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")

if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ Could not get AWS account ID. Please ensure AWS CLI is configured.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Account ID: $ACCOUNT_ID"
echo "  Region: $REGION"
echo ""

# Check if OIDC provider already exists
echo -e "${YELLOW}🔍 Checking if OIDC provider already exists...${NC}"
EXISTING_PROVIDER=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_PROVIDER" ]; then
    echo -e "${GREEN}✅ OIDC provider already exists: $EXISTING_PROVIDER${NC}"
    echo -e "${YELLOW}📝 You can now proceed with deploying the CloudFormation stack.${NC}"
    exit 0
fi

echo -e "${YELLOW}🔍 OIDC provider not found. Creating new one...${NC}"

# Create the OIDC provider
echo -e "${YELLOW}🚀 Creating GitHub OIDC Identity Provider...${NC}"

aws iam create-open-id-connect-provider \
    --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
    --region $REGION

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ GitHub OIDC Identity Provider created successfully!${NC}"
    
    # Get the provider ARN
    PROVIDER_ARN=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text)
    echo -e "${GREEN}✅ Provider ARN: $PROVIDER_ARN${NC}"
    
    echo ""
    echo -e "${GREEN}🎉 OIDC setup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Deploy the CloudFormation stack with the updated template"
    echo "2. The IAM roles will now be able to trust the GitHub OIDC provider"
    echo "3. Your GitHub Actions should be able to assume the role successfully!"
    echo ""
else
    echo -e "${RED}❌ Failed to create OIDC provider${NC}"
    exit 1
fi 