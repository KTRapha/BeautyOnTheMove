#!/bin/bash

# Script to recreate the GitHub Actions IAM role
# Based on AWS Security Blog guide

set -e

# Configuration
ROLE_NAME="GitHubActionsCodeDeployRole"
ACCOUNT_ID="665802315326"
GITHUB_ORG="KTRapha"
GITHUB_REPO="BeautyOnTheMove"
GITHUB_BRANCH="main"

echo "🔧 Recreating GitHub Actions IAM Role..."
echo "Role Name: $ROLE_NAME"
echo "Account ID: $ACCOUNT_ID"
echo "GitHub Org: $GITHUB_ORG"
echo "GitHub Repo: $GITHUB_REPO"
echo "GitHub Branch: $GITHUB_BRANCH"
echo ""

# Create trust policy JSON file
cat > trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:${GITHUB_ORG}/${GITHUB_REPO}:*"
                }
            }
        }
    ]
}
EOF

echo "📋 Trust Policy created:"
cat trust-policy.json
echo ""

# Create the role
echo "🚀 Creating IAM role..."
aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json \
    --description "Role for GitHub Actions to deploy BeautyOnTheMove Android app"

if [ $? -eq 0 ]; then
    echo "✅ Role created successfully!"
else
    echo "❌ Failed to create role"
    exit 1
fi

# Create permission policy for CodeDeploy
cat > codedeploy-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "codedeploy:*",
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket",
                "ec2:DescribeInstances",
                "ec2:DescribeTags",
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
EOF

echo "📋 Permission Policy created:"
cat codedeploy-policy.json
echo ""

# Attach the permission policy
echo "🔗 Attaching permission policy..."
aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name CodeDeployPermissions \
    --policy-document file://codedeploy-policy.json

if [ $? -eq 0 ]; then
    echo "✅ Permission policy attached successfully!"
else
    echo "❌ Failed to attach permission policy"
    exit 1
fi

# Get the role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)

echo ""
echo "🎉 GitHub Actions IAM Role recreated successfully!"
echo ""
echo "📊 Role Details:"
echo "Role Name: $ROLE_NAME"
echo "Role ARN: $ROLE_ARN"
echo ""
echo "📝 Update your GitHub Actions workflow with this ARN:"
echo "role-to-assume: $ROLE_ARN"
echo ""
echo "🧹 Cleaning up temporary files..."
rm -f trust-policy.json codedeploy-policy.json

echo "✅ Done!" 