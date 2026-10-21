const AuditLog = require('../models/AuditLog');

/**
 * Logs an event to the audit trail asynchronously.
 * Does not throw so it will never fail the calling request.
 */
const logAudit = async ({
  action,
  req = null,
  user = null,
  entityType = 'System',
  entityId = null,
  details = '',
  status = 'SUCCESS',
}) => {
  try {
    const performedUser = user || (req && req.user) || null;
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '') : '';

    await AuditLog.create({
      action,
      performedBy: performedUser ? performedUser._id : null,
      performedByName: performedUser ? performedUser.name : 'System',
      userRole: performedUser ? performedUser.role : 'system',
      entityType,
      entityId: entityId ? String(entityId) : null,
      details,
      ipAddress: String(ipAddress),
      status,
    });
  } catch (err) {
    console.error('[AUDIT_LOG_ERROR]', err.message);
  }
};

module.exports = { logAudit };
