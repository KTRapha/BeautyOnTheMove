#!/bin/bash

# Script to fix OIDC issue with GitHub Actions and AWS
# This script will deploy the updated CloudFormation template and verify the setup

set -e

echo "🔧 Fixing OIDC issue for GitHub Actions..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="BeautyOnTheMove-Android-Stack"
REGION="us-east-1"
GITHUB_REPO="KTRapha/BeautyOnTheMove"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Stack Name: $STACK_NAME"
echo "  Region: $REGION"
echo "  GitHub Repo: $GITHUB_REPO"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI is configured${NC}"

# Get VPC and subnet information
echo -e "${YELLOW}🔍 Getting VPC and subnet information...${NC}"
VPC_ID=$(aws ec2 describe-vpcs --region $REGION --query 'Vpcs[0].VpcId' --output text 2>/dev/null || echo "")
SUBNET1_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[0].SubnetId' --output text 2>/dev/null || echo "")
SUBNET2_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[1].SubnetId' --output text 2>/dev/null || echo "")

if [ -z "$VPC_ID" ] || [ -z "$SUBNET1_ID" ] || [ -z "$SUBNET2_ID" ]; then
    echo -e "${RED}❌ Could not find VPC or subnets. Please provide them manually:${NC}"
    echo "VPC_ID=your-vpc-id"
    echo "SUBNET1_ID=your-subnet1-id"
    echo "SUBNET2_ID=your-subnet2-id"
    exit 1
fi

echo -e "${GREEN}✅ Found VPC: $VPC_ID${NC}"
echo -e "${GREEN}✅ Found Subnet 1: $SUBNET1_ID${NC}"
echo -e "${GREEN}✅ Found Subnet 2: $SUBNET2_ID${NC}"

# Deploy CloudFormation stack
echo -e "${YELLOW}🚀 Deploying CloudFormation stack...${NC}"

aws cloudformation deploy \
    --template-file cloudformation/template.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        GitHubRepoName=$GITHUB_REPO \
        VPC=$VPC_ID \
        PublicSubnet1=$SUBNET1_ID \
        PublicSubnet2=$SUBNET2_ID \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CloudFormation stack deployed successfully${NC}"
else
    echo -e "${RED}❌ Failed to deploy CloudFormation stack${NC}"
    exit 1
fi

# Get the role ARN
echo -e "${YELLOW}🔍 Getting IAM role ARN...${NC}"
ROLE_ARN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithoutBoundary`].OutputValue' \
    --output text 2>/dev/null)

if [ -z "$ROLE_ARN" ]; then
    ROLE_ARN=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleARNWithBoundary`].OutputValue' \
        --output text 2>/dev/null)
fi

if [ -z "$ROLE_ARN" ]; then
    echo -e "${RED}❌ Could not find the GitHub Actions role ARN${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub Actions Role ARN: $ROLE_ARN${NC}"

# Verify the OIDC provider
echo -e "${YELLOW}🔍 Verifying OIDC provider...${NC}"
OIDC_PROVIDER_ARN=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn" --output text 2>/dev/null)

if [ -z "$OIDC_PROVIDER_ARN" ]; then
    echo -e "${RED}❌ OIDC provider not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ OIDC Provider ARN: $OIDC_PROVIDER_ARN${NC}"

# Verify the trust policy
echo -e "${YELLOW}🔍 Verifying trust policy...${NC}"
TRUST_POLICY=$(aws iam get-role --role-name GitHubActionsCodeDeployRole --query 'Role.AssumeRolePolicyDocument' --output json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Trust policy verified${NC}"
    echo "Trust Policy:"
    echo "$TRUST_POLICY" | jq '.'
else
    echo -e "${RED}❌ Could not verify trust policy${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 OIDC setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Make sure your GitHub repository secrets are configured:"
echo "   - AWS_REGION: $REGION"
echo "   - NEW_S3_BUCKET_NAME: ktrapha-beautyonmove-android-deployments"
echo ""
echo "2. The role ARN to use in your workflow:"
echo "   $ROLE_ARN"
echo ""
echo "3. Push your changes to trigger the GitHub Actions workflow"
echo ""
echo -e "${GREEN}✅ Your GitHub Actions should now be able to assume the role successfully!${NC}" 