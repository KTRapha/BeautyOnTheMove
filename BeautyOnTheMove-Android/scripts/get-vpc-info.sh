#!/bin/bash

# Script to help find VPC and subnet information for CloudFormation parameters

echo "🔍 Finding VPC and subnet information for your AWS account..."
echo ""

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: $ACCOUNT_ID"
echo ""

# List VPCs
echo "📋 Available VPCs:"
aws ec2 describe-vpcs \
    --query 'Vpcs[*].[VpcId,State,Tags[?Key==`Name`].Value|[0],CidrBlock]' \
    --output table

echo ""
echo "📋 Available Subnets:"
aws ec2 describe-subnets \
    --query 'Subnets[*].[SubnetId,AvailabilityZone,State,Tags[?Key==`Name`].Value|[0],CidrBlock]' \
    --output table

echo ""
echo "💡 To get specific VPC and subnet IDs, run:"
echo "aws ec2 describe-vpcs --filters \"Name=state,Values=available\" --query 'Vpcs[0].VpcId' --output text"
echo "aws ec2 describe-subnets --filters \"Name=state,Values=available\" --query 'Subnets[0:2].SubnetId' --output text"
echo ""
echo "📝 Update your cloudformation-parameters.json file with the actual values:"
echo "Replace 'vpc-xxxxxxxxx' with your actual VPC ID"
echo "Replace 'subnet-xxxxxxxxx' with your actual subnet IDs" 