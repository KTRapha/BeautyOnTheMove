#!/bin/bash

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

echo "Setting up GitHub OIDC provider for AWS Account: $ACCOUNT_ID in Region: $REGION"

# Create the OIDC provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --region $REGION

echo "GitHub OIDC provider created successfully!"
echo "Provider ARN: arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com" 