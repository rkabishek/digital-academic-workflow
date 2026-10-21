const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

// ── GET /api/audit-logs — Admin view audit trail ─────────────────────────────
router.get('/', protect, restrict('admin'), async (req, res, next) => {
  try {
    const { action, entityType, status, search, page = 1, limit = 25 } = req.query;
    const filter = {};

    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { performedByName: new RegExp(search, 'i') },
        { action: new RegExp(search, 'i') },
        { details: new RegExp(search, 'i') },
        { entityId: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('performedBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
