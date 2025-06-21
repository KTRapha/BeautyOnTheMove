const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*', // In production, restrict this to your app's domain
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (replace with database in production)
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

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: password, // In production, hash this with bcrypt
      name,
      phone,
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
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

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
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
    
    // Remove token
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

    // Update user
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

    // Update booking
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

// Initialize some sample data
const initializeSampleData = () => {
  // Sample offers
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

// Initialize sample data
initializeSampleData();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BeautyOnTheMove API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

module.exports = app; 