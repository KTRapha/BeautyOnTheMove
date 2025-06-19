#!/bin/bash

# Script to create S3 bucket for BeautyOnTheMove deployment artifacts

set -e

# Configuration
BUCKET_NAME="ktrapha-beautyonmove-android-deployments"
REGION="us-east-1"

echo "🪣 Creating S3 bucket for deployment artifacts..."
echo "Bucket Name: $BUCKET_NAME"
echo "Region: $REGION"
echo ""

# Check if bucket already exists
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 > /dev/null; then
    echo "✅ Bucket '$BUCKET_NAME' already exists!"
else
    echo "🚀 Creating new bucket..."
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    
    if [ $? -eq 0 ]; then
        echo "✅ Bucket created successfully!"
    else
        echo "❌ Failed to create bucket"
        exit 1
    fi
fi

# Configure bucket for versioning (optional but recommended)
echo "🔧 Configuring bucket versioning..."
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

# Configure bucket encryption
echo "🔐 Configuring bucket encryption..."
aws s3api put-bucket-encryption \
    --bucket $BUCKET_NAME \
    --server-side-encryption-configuration '{
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }
        ]
    }'

# Configure bucket lifecycle (optional - delete old versions after 30 days)
echo "📅 Configuring bucket lifecycle..."
aws s3api put-bucket-lifecycle-configuration \
    --bucket $BUCKET_NAME \
    --lifecycle-configuration '{
        "Rules": [
            {
                "ID": "DeleteOldVersions",
                "Status": "Enabled",
                "Filter": {
                    "Prefix": ""
                },
                "NoncurrentVersionExpiration": {
                    "NoncurrentDays": 30
                }
            }
        ]
    }'

echo ""
echo "🎉 S3 bucket setup completed!"
echo ""
echo "📊 Bucket Details:"
echo "Bucket Name: $BUCKET_NAME"
echo "Region: $REGION"
echo "URL: https://$BUCKET_NAME.s3.$REGION.amazonaws.com"
echo ""
echo "📝 Add this to your GitHub repository secrets:"
echo "S3_BUCKET_NAME: $BUCKET_NAME" 