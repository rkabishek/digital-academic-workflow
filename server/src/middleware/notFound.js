/**
 * 404 Not Found middleware.
 * Catches any request that did not match a registered route.
 */
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = notFound;
