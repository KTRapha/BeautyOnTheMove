const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
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
      )
    `);

    // Create offers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
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
      )
    `);

    // Create auth_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens(token)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_tokens(expires_at)');

    client.release();
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Seed sample data
const seedSampleData = async () => {
  try {
    const client = await pool.connect();
    
    // Check if offers already exist
    const existingOffers = await client.query('SELECT COUNT(*) FROM offers');
    if (existingOffers.rows[0].count > 0) {
      console.log('📝 Sample data already exists, skipping seed');
      client.release();
      return true;
    }

    // Insert sample offers
    const sampleOffers = [
      {
        title: 'Hair Styling',
        description: 'Professional hair styling services',
        price: 50.00,
        duration: '1 hour',
        category: 'hair',
        image_url: 'https://via.placeholder.com/300x200?text=Hair+Styling'
      },
      {
        title: 'Manicure & Pedicure',
        description: 'Complete nail care services',
        price: 35.00,
        duration: '45 minutes',
        category: 'nails',
        image_url: 'https://via.placeholder.com/300x200?text=Manicure+Pedicure'
      },
      {
        title: 'Facial Treatment',
        description: 'Rejuvenating facial treatment',
        price: 75.00,
        duration: '1.5 hours',
        category: 'facial',
        image_url: 'https://via.placeholder.com/300x200?text=Facial+Treatment'
      },
      {
        title: 'Makeup Application',
        description: 'Professional makeup for special occasions',
        price: 60.00,
        duration: '1 hour',
        category: 'makeup',
        image_url: 'https://via.placeholder.com/300x200?text=Makeup+Application'
      }
    ];

    for (const offer of sampleOffers) {
      await client.query(`
        INSERT INTO offers (title, description, price, duration, category, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [offer.title, offer.description, offer.price, offer.duration, offer.category, offer.image_url]);
    }

    client.release();
    console.log('✅ Sample data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Sample data seeding failed:', error.message);
    return false;
  }
};

// Clean up expired tokens
const cleanupExpiredTokens = async () => {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM auth_tokens WHERE expires_at < NOW()');
    client.release();
  } catch (error) {
    console.error('Token cleanup failed:', error.message);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  seedSampleData,
  cleanupExpiredTokens
}; 