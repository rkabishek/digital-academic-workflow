const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * GET /api/health
 * Public endpoint — returns server and database status.
 * Used for monitoring, deployment checks, and Phase 1 validation.
 */
router.get('/', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    success: true,
    message: 'Digital Academic Document Workflow API is running',
    data: {
      server: 'online',
      environment: process.env.NODE_ENV || 'development',
      database: dbStateMap[dbState] || 'unknown',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

module.exports = router;
