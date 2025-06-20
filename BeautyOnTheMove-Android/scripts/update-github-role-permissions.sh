#!/bin/bash

# Script to update GitHub Actions IAM role with necessary permissions for CodeDeploy with Auto Scaling Groups

ROLE_NAME="GitHubActionsCodeDeployRole-BeautyOnTheMove-Android-Stack"
ACCOUNT_ID="665802315326"

echo "🔧 Updating GitHub Actions IAM role permissions..."

# Create the policy document for additional permissions
cat > additional-permissions-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeScalingActivities",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ssm:DescribeInstanceInformation",
                "ssm:GetParameter",
                "ssm:GetParameters"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create the policy
echo "📝 Creating additional permissions policy..."
aws iam create-policy \
    --policy-name "GitHubActionsAdditionalPermissions" \
    --policy-document file://additional-permissions-policy.json \
    --description "Additional permissions for GitHub Actions CodeDeploy role" \
    || echo "Policy already exists or failed to create"

# Attach the policy to the role
echo "🔗 Attaching policy to role..."
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/GitHubActionsAdditionalPermissions"

echo "✅ GitHub Actions role permissions updated successfully!"
echo "📋 Summary of added permissions:"
echo "   - Auto Scaling Group operations"
echo "   - Elastic Load Balancer operations"
echo "   - EC2 instance operations"
echo "   - Systems Manager operations"

# Clean up
rm -f additional-permissions-policy.json

echo "🎯 Next steps:"
echo "   1. The GitHub Actions workflow should now be able to check Auto Scaling Group status"
echo "   2. Run the workflow again to see detailed debugging information"
echo "   3. Check if the Auto Scaling Group has healthy instances" 