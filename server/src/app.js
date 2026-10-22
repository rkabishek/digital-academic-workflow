const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : [];

const defaultOrigins = [
  'http://localhost:6100',
  'http://127.0.0.1:6100',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:6000',
  'http://127.0.0.1:6000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow wildcard in environment
      if (process.env.CLIENT_URL === '*' || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed =
        configuredOrigins.includes(cleanOrigin) ||
        defaultOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.endsWith('.onrender.com');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP Request Logging ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);

// Database connection guard for all database-backed endpoints
const mongoose = require('mongoose');
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently offline. Please ensure MongoDB is running or MongoDB Atlas is accessible.',
    });
  }
  next();
});

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/documents',     require('./routes/documents'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/od-requests',   require('./routes/odRequests'));
app.use('/api/notes',         require('./routes/notes'));
app.use('/api/certificates',  require('./routes/certificates'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/audit-logs',    require('./routes/auditLogs'));
// Static uploads
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
