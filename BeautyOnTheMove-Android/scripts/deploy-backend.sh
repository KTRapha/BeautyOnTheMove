#!/bin/bash

# Backend deployment script for BeautyOnTheMove
set -e

echo "=== Starting Backend Deployment ==="

# Configuration
BACKEND_DIR="/var/www/beautyonmove-backend"
SERVICE_NAME="beautyonmove-api"
PORT=3000

echo "📦 Installing Node.js and dependencies..."

# Install Node.js 18.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

echo "📁 Setting up backend directory..."

# Create backend directory
mkdir -p "$BACKEND_DIR"
cd "$BACKEND_DIR"

echo "📋 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "beautyonmove-backend",
  "version": "1.0.0",
  "description": "Backend API for BeautyOnTheMove Android app",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "uuid": "^9.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

echo "🔧 Creating server.js..."
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data storage
let users = [];
let bookings = [];
let offers = [];
let authTokens = [];

// Helper functions
const generateToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const user = users.find(u => authTokens.includes(token));
  if (!user) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  req.user = user;
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BeautyOnTheMove API is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/auth/register', (req, res) => {
  try {
    const { email, password, name, phone, userType = 'customer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      phone,
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    const token = generateToken(newUser.id);
    authTokens.push(token);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        userType: newUser.userType
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    authTokens.push(token);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/auth/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const tokenIndex = authTokens.indexOf(token);
    if (tokenIndex > -1) {
      authTokens.splice(tokenIndex, 1);
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User management endpoints
app.get('/user/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/user/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      phone: phone || users[userIndex].phone,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        phone: users[userIndex].phone,
        userType: users[userIndex].userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bookings endpoints
app.get('/bookings', authenticateToken, (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/bookings', authenticateToken, (req, res) => {
  try {
    const { serviceType, date, time, location, description, price } = req.body;

    if (!serviceType || !date || !time || !location) {
      return res.status(400).json({ message: 'Service type, date, time, and location are required' });
    }

    const newBooking = {
      id: bookings.length + 1,
      userId: req.user.id,
      serviceType,
      date,
      time,
      location,
      description,
      price: price || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time, location, description } = req.body;

    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id) && b.userId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      status: status || bookings[bookingIndex].status,
      date: date || bookings[bookingIndex].date,
      time: time || bookings[bookingIndex].time,
      location: location || bookings[bookingIndex].location,
      description: description || bookings[bookingIndex].description,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Booking updated successfully',
      booking: bookings[bookingIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id) && b.userId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    bookings.splice(bookingIndex, 1);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Offers endpoints
app.get('/offers', (req, res) => {
  try {
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/offers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const offer = offers.find(o => o.id === parseInt(id));
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard endpoints
app.get('/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    const totalBookings = userBookings.length;
    const pendingBookings = userBookings.filter(b => b.status === 'pending').length;
    const completedBookings = userBookings.filter(b => b.status === 'completed').length;
    const totalSpent = userBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      totalSpent,
      recentBookings: userBookings.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize sample data
const initializeSampleData = () => {
  offers = [
    {
      id: 1,
      title: 'Hair Styling',
      description: 'Professional hair styling services',
      price: 50,
      duration: '1 hour',
      category: 'hair',
      image: 'https://via.placeholder.com/300x200?text=Hair+Styling'
    },
    {
      id: 2,
      title: 'Manicure & Pedicure',
      description: 'Complete nail care services',
      price: 35,
      duration: '45 minutes',
      category: 'nails',
      image: 'https://via.placeholder.com/300x200?text=Manicure+Pedicure'
    },
    {
      id: 3,
      title: 'Facial Treatment',
      description: 'Rejuvenating facial treatment',
      price: 75,
      duration: '1.5 hours',
      category: 'facial',
      image: 'https://via.placeholder.com/300x200?text=Facial+Treatment'
    },
    {
      id: 4,
      title: 'Makeup Application',
      description: 'Professional makeup for special occasions',
      price: 60,
      duration: '1 hour',
      category: 'makeup',
      image: 'https://via.placeholder.com/300x200?text=Makeup+Application'
    }
  ];
  console.log('Sample data initialized');
};

initializeSampleData();

app.listen(PORT, () => {
  console.log(`🚀 BeautyOnTheMove API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});
EOF

echo "📦 Installing dependencies..."
npm install --production

echo "🔧 Creating environment file..."
cat > .env << EOF
NODE_ENV=production
PORT=3000
JWT_SECRET=beautyonmove_jwt_secret_key_2025
CORS_ORIGIN=*
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

echo "✅ Backend deployment completed!"
echo "📊 Service status:"
pm2 status "$SERVICE_NAME"

echo "🔗 API Health Check:"
sleep 3
curl -s http://localhost:$PORT/health || echo "Health check failed - service may still be starting"

echo "🌐 Backend API is now available at:"
echo "   Local: http://localhost:$PORT"
echo "   External: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP'):$PORT"
echo ""
echo "📱 Update your app's API_BASE_URL to:"
echo "   http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP'):$PORT" 