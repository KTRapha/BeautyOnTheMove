const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import database connection
const { pool, testConnection, initializeDatabase, seedSampleData } = require('./database');

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

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database and is not expired
    const client = await pool.connect();
    const tokenResult = await client.query(
      'SELECT user_id FROM auth_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    client.release();

    if (tokenResult.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Get user data
    const userClient = await pool.connect();
    const userResult = await userClient.query(
      'SELECT id, email, name, phone, user_type FROM users WHERE id = $1',
      [decoded.userId]
    );
    userClient.release();

    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      status: 'OK', 
      message: 'BeautyOnTheMove API is running',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      endpoints: [
        'POST /auth/register',
        'POST /auth/login', 
        'POST /auth/logout',
        'GET /user/profile',
        'PUT /user/profile',
        'GET /bookings',
        'POST /bookings',
        'PUT /bookings/:id',
        'DELETE /bookings/:id',
        'GET /offers',
        'GET /offers/:id',
        'GET /dashboard/stats'
      ]
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Authentication endpoints
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, userType = 'customer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const client = await pool.connect();

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await client.query(
      `INSERT INTO users (email, password, name, phone, user_type) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, phone, user_type, created_at`,
      [email, hashedPassword, name, phone, userType]
    );

    // Generate token
    const token = generateToken(newUser.rows[0].id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store token in database
    await client.query(
      'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [newUser.rows[0].id, token, expiresAt]
    );

    client.release();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        name: newUser.rows[0].name,
        userType: newUser.rows[0].user_type
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const client = await pool.connect();

    // Find user
    const userResult = await client.query(
      'SELECT id, email, password, name, phone, user_type FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      client.release();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      client.release();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store token in database
    await client.query(
      'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    client.release();

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const client = await pool.connect();
    
    // Remove token from database
    await client.query(
      'DELETE FROM auth_tokens WHERE token = $1',
      [token]
    );

    client.release();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User management endpoints
app.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const client = await pool.connect();
    
    const userResult = await client.query(
      'SELECT id, email, name, phone, user_type, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    client.release();

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const client = await pool.connect();
    
    const updateResult = await client.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING id, email, name, phone, user_type`,
      [name, phone, req.user.id]
    );

    client.release();

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updateResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bookings endpoints
app.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const client = await pool.connect();
    
    const bookingsResult = await client.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    client.release();

    res.json(bookingsResult.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const { serviceType, date, time, location, description, price } = req.body;

    if (!serviceType || !date || !time || !location) {
      return res.status(400).json({ message: 'Service type, date, time, and location are required' });
    }

    const client = await pool.connect();
    
    const newBooking = await client.query(
      `INSERT INTO bookings (user_id, service_type, date, time, location, description, price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [req.user.id, serviceType, date, time, location, description, price || 0]
    );

    client.release();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, time, location, description } = req.body;

    const client = await pool.connect();
    
    const updateResult = await client.query(
      `UPDATE bookings 
       SET status = COALESCE($1, status),
           date = COALESCE($2, date),
           time = COALESCE($3, time),
           location = COALESCE($4, location),
           description = COALESCE($5, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [status, date, time, location, description, id, req.user.id]
    );

    client.release();

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully',
      booking: updateResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    
    const deleteResult = await client.query(
      'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    client.release();

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Offers endpoints
app.get('/offers', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const offersResult = await client.query(
      'SELECT * FROM offers WHERE is_active = true ORDER BY created_at DESC'
    );

    client.release();

    res.json(offersResult.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const client = await pool.connect();
    
    const offerResult = await client.query(
      'SELECT * FROM offers WHERE id = $1 AND is_active = true',
      [id]
    );

    client.release();

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offerResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard endpoints
app.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Get booking statistics
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COALESCE(SUM(price), 0) as total_spent
      FROM bookings 
      WHERE user_id = $1
    `, [req.user.id]);

    // Get recent bookings
    const recentBookingsResult = await client.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    client.release();

    const stats = statsResult.rows[0];
    res.json({
      totalBookings: parseInt(stats.total_bookings),
      pendingBookings: parseInt(stats.pending_bookings),
      completedBookings: parseInt(stats.completed_bookings),
      totalSpent: parseFloat(stats.total_spent),
      recentBookings: recentBookingsResult.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();
    
    // Seed sample data
    await seedSampleData();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 BeautyOnTheMove API server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`🗄️ Database: PostgreSQL (AWS RDS) - Connected`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app; 