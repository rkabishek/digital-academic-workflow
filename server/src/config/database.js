const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolution of MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if custom DNS cannot be set
}

/**
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable.
 * Gracefully logs errors without crashing the entire Express process.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] MONGODB_URI is not defined in environment variables.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err.message);
    });

    return conn;
  } catch (error) {
    console.warn('[DB] MongoDB initial connection failed:', error.message);
    console.warn('[DB] API server is still running. Retrying MongoDB in background...');
    setTimeout(connectDB, 10000);
    return null;
  }
};

module.exports = connectDB;
