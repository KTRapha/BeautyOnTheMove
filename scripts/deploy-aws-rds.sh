#!/bin/bash

# AWS RDS + Backend deployment script for BeautyOnTheMove
set -e

echo "=== BeautyOnTheMove AWS RDS + Backend Deployment ==="
echo "🚀 Setting up PostgreSQL database on AWS RDS + Backend API"

# Configuration
BACKEND_DIR="/var/www/beautyonmove-backend"
SERVICE_NAME="beautyonmove-api"
PORT=3000
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "44.211.36.78")

echo "📍 EC2 Instance IP: $EC2_IP"

echo ""
echo "=== Step 1: AWS RDS Database Setup Instructions ==="
echo ""
echo "📋 Before running this script, you need to create an AWS RDS PostgreSQL database:"
echo ""
echo "1. Go to AWS Console → RDS → Create database"
echo "2. Choose 'Standard create' and 'PostgreSQL'"
echo "3. Template: 'Free tier'"
echo "4. Settings:"
echo "   - DB instance identifier: beautyonmove-db"
echo "   - Master username: beautyonmove_use"
echo "   - Master password: Tshamala1982"
echo "5. Instance configuration:"
echo "   - DB instance class: db.t3.micro (Free tier)"
echo "   - Storage: 20 GB (Free tier)"
echo "6. Connectivity:"
echo "   - VPC: Default VPC"
echo "   - Public access: Yes"
echo "   - VPC security group: Create new (beautyonmove-db-sg)"
echo "   - Availability Zone: us-east-1a"
echo "7. Database authentication: Password authentication"
echo "8. Additional configuration:"
echo "   - Initial database name: beautyonmove"
echo "   - Backup retention: 7 days"
echo "   - Monitoring: Disable enhanced monitoring"
echo ""
echo "⚠  IMPORTANT: After creating the database, you'll get an endpoint like:"
echo "   beautyonmove-db.xxxxxxxxx.us-east-1.rds.amazonaws.com"
echo ""
echo "📝 You'll need to update the .env file with your RDS endpoint and credentials."
echo ""

# Check if user wants to continue
read -p "Have you created the AWS RDS database? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please create the AWS RDS database first, then run this script again."
    exit 1
fi

echo ""
echo "=== Step 2: Database Configuration ==="
echo ""

# Get RDS endpoint from user
read -p "Enter your RDS endpoint (e.g., beautyonmove-db.xxxxxxxxx.us-east-1.rds.amazonaws.com): " RDS_ENDPOINT

if [ -z "$RDS_ENDPOINT" ]; then
    echo "❌ RDS endpoint is required."
    exit 1
fi

echo ""
echo "=== Step 3: Installing Dependencies ==="

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Create backend directory
mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

echo "📋 Copying backend files from project..."
cp -r ../../backend/* .

echo "📦 Installing dependencies..."
npm install --production

echo "🔧 Creating environment file with RDS configuration..."
cat > .env << EOF
NODE_ENV=production
PORT=3000

# JWT Configuration
JWT_SECRET=nSxl15wE19e3nyyefacFPge9HecgAmlEpvfPY2EaJZw=
JWT_EXPIRES_IN=7d

# PostgreSQL Database Configuration (AWS RDS)
DB_HOST=$RDS_ENDPOINT
DB_PORT=5432
DB_NAME=beautyonmove
DB_USER=beautyonmove_use
DB_PASSWORD=Tshamala1982
DATABASE_URL=postgresql://beautyonmove_use:Tshamala1982@$RDS_ENDPOINT:5432/beautyonmove

# Email Configuration (for future email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=beautyonmove-app-assets

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
APP_NAME=BeautyOnTheMove
APP_VERSION=1.0.0

# Database SSL (for AWS RDS)
DB_SSL=true
EOF

echo "🚀 Starting backend service with PM2..."

# Stop existing service if running
pm2 stop "$SERVICE_NAME" 2>/dev/null || true
pm2 delete "$SERVICE_NAME" 2>/dev/null || true

# Start new service
pm2 start server.js --name "$SERVICE_NAME"
pm2 save
pm2 startup

echo "🔧 Configuring firewall..."
firewall-cmd --permanent --add-port=$PORT/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "=== Step 4: Verification ==="

echo "🔍 Checking backend service status..."
pm2 status "$SERVICE_NAME"

echo "🔍 Testing API health endpoint..."
sleep 5
if curl -s http://localhost:$PORT/health > /dev/null; then
    echo "✅ Backend API is running successfully"
else
    echo "❌ Backend API health check failed"
fi

echo ""
echo "=== 🎉 AWS RDS + Backend Deployment Completed! ==="
echo ""
echo "🗄 Database: PostgreSQL on AWS RDS"
echo "   Endpoint: $RDS_ENDPOINT"
echo "   Database: beautyonmove"
echo "   User: beautyonmove_use"
echo ""
echo "🔗 Backend API:"
echo "   http://$EC2_IP:3000"
echo ""
echo "📊 API Health Check:"
echo "   http://$EC2_IP:3000/health"
echo ""
echo "📱 APK Download:"
echo "   http://$EC2_IP/beauty-on-the-move-app.apk"
echo ""
echo "📄 Download Page:"
echo "   http://$EC2_IP/apk-download.html"
echo ""
echo "📋 Next Steps:"
echo "   1. Download and install the APK on your Android device"
echo "   2. The app will automatically connect to the AWS RDS database"
echo "   3. Register a new account or login to start using the app"
echo "   4. Create bookings, browse offers, and manage your profile"
echo ""
echo "🔧 Management Commands:"
echo "   pm2 status beautyonmove-api     # Check backend status"
echo "   pm2 logs beautyonmove-api       # View backend logs"
echo "   pm2 restart beautyonmove-api    # Restart backend"
echo ""
echo "✅ Your BeautyOnTheMove app is now fully functional with AWS RDS!" 