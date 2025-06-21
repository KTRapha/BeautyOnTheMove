# AWS RDS PostgreSQL Setup Guide for BeautyOnTheMove

## 🎯 Overview

This guide will help you set up a **PostgreSQL database on AWS RDS** for your BeautyOnTheMove Android app. AWS RDS provides a fully managed, scalable database solution with a generous free tier.

## 🆓 AWS RDS Free Tier Benefits

- **12 months free** with 750 hours per month
- **20 GB** of General Purpose SSD storage
- **Free backup storage** up to 100% of your database size
- **Multiple database engines**: MySQL, PostgreSQL, MariaDB, SQL Server Express
- **Fully managed** - AWS handles backups, patching, and maintenance

## 📋 Prerequisites

1. **AWS Account** with access to RDS
2. **EC2 Instance** running your backend (already deployed)
3. **Basic knowledge** of AWS Console

## 🚀 Step-by-Step Setup

### Step 1: Create RDS Database

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to **RDS** service

2. **Create Database**
   - Click **"Create database"**
   - Choose **"Standard create"**
   - Select **"PostgreSQL"** as the engine

3. **Template Selection**
   - Choose **"Free tier"** template
   - This will automatically configure the free tier settings

4. **Settings Configuration**
   ```
   DB instance identifier: beautyonmove-db
   Master username: beautyonmove_user
   Master password: [create a secure password]
   ```
   ⚠️ **Save your password securely!**

5. **Instance Configuration**
   ```
   DB instance class: db.t3.micro (Free tier)
   Storage: 20 GB (Free tier)
   Storage type: General Purpose SSD (gp2)
   ```

6. **Connectivity Settings**
   ```
   VPC: Default VPC
   Public access: Yes
   VPC security group: Create new
   Security group name: beautyonmove-db-sg
   Availability Zone: us-east-1a (or your preferred zone)
   Database port: 5432 (default)
   ```

7. **Database Authentication**
   - Choose **"Password authentication"**

8. **Additional Configuration**
   ```
   Initial database name: beautyonmove
   Backup retention: 7 days
   Monitoring: Disable enhanced monitoring
   Maintenance window: No preference
   Deletion protection: Disable (for free tier)
   ```

9. **Create Database**
   - Click **"Create database"**
   - Wait for the database to be created (5-10 minutes)

### Step 2: Configure Security Group

1. **Navigate to Security Groups**
   - Go to **EC2** → **Security Groups**
   - Find the security group created for your RDS database

2. **Add Inbound Rule**
   ```
   Type: PostgreSQL
   Protocol: TCP
   Port: 5432
   Source: Custom
   IP: [Your EC2 instance's security group ID]
   Description: Allow EC2 to connect to RDS
   ```

### Step 3: Get Database Endpoint

1. **Find Your Database**
   - Go back to **RDS** → **Databases**
   - Click on your `beautyonmove-db` instance

2. **Copy Endpoint**
   - Note the **Endpoint** (e.g., `beautyonmove-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)
   - This is your database connection string

### Step 4: Deploy Backend with RDS

1. **SSH into your EC2 instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. **Navigate to project directory**
   ```bash
   cd /home/ec2-user/BOTMApp/BeautyOnTheMove-Android
   ```

3. **Run the deployment script**
   ```bash
   chmod +x scripts/deploy-aws-rds.sh
   ./scripts/deploy-aws-rds.sh
   ```

4. **Enter your RDS details when prompted**
   - RDS endpoint
   - Database password

## 🔧 Database Schema

The backend will automatically create these tables:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Offers Table
```sql
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(100),
  category VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Auth Tokens Table
```sql
CREATE TABLE auth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing the Setup

### 1. Health Check
```bash
curl http://your-ec2-ip:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "BeautyOnTheMove API is running",
  "database": "connected",
  "timestamp": "2025-01-XX...",
  "endpoints": [...]
}
```

### 2. Test Database Connection
```bash
# SSH into EC2 and test connection
psql -h your-rds-endpoint -U beautyonmove_user -d beautyonmove
```

### 3. Test API Endpoints
```bash
# Test offers endpoint
curl http://your-ec2-ip:3000/offers

# Test registration
curl -X POST http://your-ec2-ip:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## 🔒 Security Best Practices

### 1. Database Security
- ✅ Use strong passwords
- ✅ Enable SSL connections
- ✅ Restrict access to EC2 security group only
- ✅ Regular backups enabled

### 2. Application Security
- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt
- ✅ Rate limiting enabled
- ✅ CORS properly configured

### 3. Network Security
- ✅ RDS in private subnet (if possible)
- ✅ Security groups properly configured
- ✅ No public access to database (only through app)

## 💰 Cost Management

### Free Tier Limits
- **750 hours/month** (enough for 24/7 usage)
- **20 GB storage**
- **100% backup storage**

### Monitoring Costs
- Set up billing alerts in AWS
- Monitor usage in RDS console
- Consider upgrading only when needed

## 🚨 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```
   Error: connect ETIMEDOUT
   Solution: Check security group rules and VPC settings
   ```

2. **Authentication Failed**
   ```
   Error: password authentication failed
   Solution: Verify username/password in .env file
   ```

3. **SSL Connection Issues**
   ```
   Error: self signed certificate
   Solution: Set DB_SSL=true in .env file
   ```

4. **Database Not Found**
   ```
   Error: database "beautyonmove" does not exist
   Solution: Check initial database name in RDS creation
   ```

### Debug Commands

```bash
# Check backend logs
pm2 logs beautyonmove-api

# Test database connection
psql -h your-rds-endpoint -U beautyonmove_user -d beautyonmove

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Monitor RDS metrics
aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name CPUUtilization
```

## 📊 Monitoring & Maintenance

### 1. Database Monitoring
- Monitor CPU, memory, and storage usage
- Set up CloudWatch alarms
- Check slow query logs

### 2. Backup Strategy
- Automated daily backups (7 days retention)
- Manual snapshots before major changes
- Test restore procedures

### 3. Performance Optimization
- Monitor query performance
- Add indexes as needed
- Consider read replicas for scaling

## 🎉 Success Checklist

- [ ] RDS PostgreSQL database created
- [ ] Security group configured
- [ ] Backend deployed with RDS connection
- [ ] Health check passes
- [ ] Sample data seeded
- [ ] API endpoints working
- [ ] Android app connects successfully
- [ ] User registration/login works
- [ ] Bookings can be created
- [ ] Offers are displayed

## 🔗 Useful Links

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
- [AWS Free Tier](https://aws.amazon.com/free/)

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS RDS documentation
3. Check backend logs: `pm2 logs beautyonmove-api`
4. Verify database connectivity
5. Test API endpoints individually

---

**🎯 Your BeautyOnTheMove app is now powered by a professional, scalable PostgreSQL database on AWS RDS!** 