#!/bin/bash

# BeautyOnTheMove Android App - Infrastructure Deployment Script
# This script deploys the CloudFormation stack for CodeDeploy infrastructure

set -e

# Configuration
STACK_NAME="BeautyOnTheMove-Infrastructure"
TEMPLATE_FILE="cloudformation/template.yaml"
PARAMETERS_FILE="cloudformation-parameters.json"
REGION="us-east-1"  # Change to your preferred region

echo "🚀 Starting BeautyOnTheMove Infrastructure Deployment..."
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Validate CloudFormation template
echo "📋 Validating CloudFormation template..."
aws cloudformation validate-template \
    --template-body file://$TEMPLATE_FILE \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Template validation successful"
else
    echo "❌ Template validation failed"
    exit 1
fi

# Check if stack already exists
STACK_EXISTS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].StackStatus' \
    --output text 2>/dev/null || echo "STACK_NOT_FOUND")

if [ "$STACK_EXISTS" != "STACK_NOT_FOUND" ]; then
    echo "📝 Stack '$STACK_NAME' already exists. Updating..."
    OPERATION="update-stack"
else
    echo "🆕 Creating new stack '$STACK_NAME'..."
    OPERATION="create-stack"
fi

# Deploy the stack
echo "🚀 Deploying CloudFormation stack..."
aws cloudformation $OPERATION \
    --stack-name $STACK_NAME \
    --template-body file://$TEMPLATE_FILE \
    --parameters file://$PARAMETERS_FILE \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Stack deployment initiated successfully"
    echo ""
    echo "⏳ Waiting for stack deployment to complete..."
    
    # Wait for stack to complete
    aws cloudformation wait stack-$([ "$OPERATION" = "create-stack" ] && echo "create" || echo "update")-complete \
        --stack-name $STACK_NAME \
        --region $REGION
    
    echo "✅ Stack deployment completed successfully!"
    echo ""
    echo "📊 Stack outputs:"
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
        --output table
else
    echo "❌ Stack deployment failed"
    exit 1
fi

echo ""
echo "🎉 Infrastructure deployment completed!"
echo ""
echo "Next steps:"
echo "1. Add S3_BUCKET_NAME secret to your GitHub repository"
echo "2. Push code to trigger the first deployment"
echo "3. Monitor deployment in AWS CodeDeploy console" 