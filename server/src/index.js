const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to MongoDB Atlas first
  await connectDB();

  // 2. Start HTTP server
  app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] CORS allowed origin: ${process.env.CLIENT_URL || 'http://localhost:6000'}`);
  });
};

startServer();
