# BeautyOnTheMove Backend API

A complete Node.js/Express backend API for the BeautyOnTheMove Android application.

## 🚀 Features

- **Authentication System** - Register, login, logout with JWT tokens
- **User Management** - Profile management and user data
- **Bookings System** - Create, read, update, delete bookings
- **Offers Management** - Browse beauty service offers
- **Dashboard Statistics** - User analytics and booking stats
- **Security** - Rate limiting, CORS, helmet security headers

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Bookings
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Delete booking

### Offers
- `GET /offers` - Get all offers
- `GET /offers/:id` - Get specific offer

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /health` - API health status

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🚀 Deployment on AWS EC2

### Prerequisites
- AWS EC2 instance (Amazon Linux 2 or Ubuntu)
- Node.js 18+ installed
- PM2 for process management

### Deployment Steps

1. **Connect to your EC2 instance:**
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. **Install Node.js (if not installed):**
   ```bash
   # For Amazon Linux 2
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # For Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone and setup the backend:**
   ```bash
   cd /var/www
   sudo mkdir beautyonmove-backend
   sudo chown ec2-user:ec2-user beautyonmove-backend
   cd beautyonmove-backend
   
   # Copy your backend files here
   # Or clone from your repository
   ```

5. **Install dependencies:**
   ```bash
   npm install --production
   ```

6. **Create environment file:**
   ```bash
   cp env.example .env
   nano .env
   # Update with your configuration
   ```

7. **Start with PM2:**
   ```bash
   pm2 start server.js --name "beautyonmove-api"
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx (optional):**
   ```bash
   sudo yum install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

9. **Configure firewall:**
   ```bash
   sudo firewall-cmd --permanent --add-port=3000/tcp
   sudo firewall-cmd --reload
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=*
```

### Security Settings

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers enabled
- **JWT**: Token-based authentication

## 📊 Monitoring

### PM2 Commands
```bash
pm2 status                    # Check status
pm2 logs beautyonmove-api     # View logs
pm2 restart beautyonmove-api  # Restart service
pm2 stop beautyonmove-api     # Stop service
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret
2. **Environment Variables**: Never commit sensitive data
3. **Rate Limiting**: Adjust limits based on your needs
4. **CORS**: Restrict origins in production
5. **HTTPS**: Use SSL/TLS in production

## 🧪 Testing

```bash
# Run tests
npm test

# Test API endpoints
curl http://localhost:3000/health
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## 📝 API Documentation

### Request/Response Examples

**Register User:**
```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "userType": "customer"
}
```

**Create Booking:**
```bash
POST /bookings
Authorization: Bearer <token>
{
  "serviceType": "Hair Styling",
  "date": "2025-01-15",
  "time": "14:00",
  "location": "123 Main St",
  "description": "Hair cut and styling",
  "price": 50
}
```

## 🚀 Production Deployment

For production deployment, consider:

1. **Database**: Use MongoDB Atlas or AWS RDS
2. **Load Balancer**: AWS Application Load Balancer
3. **SSL**: Configure HTTPS with Let's Encrypt
4. **Monitoring**: AWS CloudWatch integration
5. **Backup**: Regular database backups
6. **Scaling**: Auto-scaling groups for high availability

## 📞 Support

For issues and questions:
- Check the logs: `pm2 logs beautyonmove-api`
- Monitor health: `curl http://localhost:3000/health`
- Review configuration in `.env` file 