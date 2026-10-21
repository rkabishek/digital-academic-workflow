const mongoose = require('mongoose');

/**
 * Certificate Model — Phase 7
 * Auto-generated certificates with QR code verification.
 */
const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    // Format: CERT-YYYYMM-XXXXXX
  },
  type: {
    type: String,
    required: true,
    enum: ['participation', 'completion', 'achievement', 'internship', 'project', 'other'],
  },
  title:       { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  issuedTo:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedDate:  { type: Date, default: Date.now },
  validUntil:  { type: Date, default: null },

  // Reference to the original document/project/OD that triggered this
  relatedDocument: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: null },

  // QR code
  qrCode:      { type: String },  // base64 or URL to QR image
  qrData:      { type: String },  // the data encoded in QR

  // Generated PDF
  filePath:    { type: String, default: null },
  fileName:    { type: String, default: null },

  isRevoked:   { type: Boolean, default: false },
  revokeReason: { type: String, default: null },
}, { timestamps: true });

certificateSchema.index({ issuedTo: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
