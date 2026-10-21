const mongoose = require('mongoose');

/**
 * AuditLog Model — Phase 12
 * Tracks administrative and security-critical actions across the platform.
 */
const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      // e.g., 'USER_LOGIN', 'USER_REGISTERED', 'DOCUMENT_SUBMITTED', 'DOCUMENT_APPROVED', 'DOCUMENT_REJECTED', 'CERTIFICATE_ISSUED', 'CERTIFICATE_REVOKED', 'OD_APPROVED', 'USER_STATUS_TOGGLED'
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    performedByName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      enum: ['student', 'staff', 'admin', 'system', 'anonymous'],
      default: 'system',
    },
    entityType: {
      type: String,
      enum: ['User', 'Document', 'Project', 'ODRequest', 'Certificate', 'Note', 'Auth', 'System'],
      required: true,
    },
    entityId: {
      type: String,
      default: null,
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING'],
      default: 'SUCCESS',
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ performedBy: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
