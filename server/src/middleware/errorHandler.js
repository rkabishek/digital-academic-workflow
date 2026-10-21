/**
 * Centralized Express error handler.
 * Must be registered LAST in app.js after all routes.
 *
 * Consistent response shape:
 *   { success: false, message: "..." }
 *
 * Stack traces are hidden in production.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status not already set
  const statusCode = err.statusCode || err.status || 500;

  const isProduction = process.env.NODE_ENV === 'production';

  // Log full error in server console (not exposed to client)
  if (!isProduction) {
    console.error('[Error]', err.stack || err.message);
  } else {
    console.error('[Error]', err.message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token has expired.' });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File size exceeds the allowed limit.' });
  }

  // Mongoose buffer timeout (database disconnected)
  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection timed out. Please ensure your current IP address is whitelisted in MongoDB Atlas Network Access.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
