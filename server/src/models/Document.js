const mongoose = require('mongoose');

/**
 * Document Model — Phase 4
 * Represents any academic document submitted by a student for staff/admin review.
 */
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  type: {
    type: String,
    required: true,
    enum: ['noc', 'bonafide', 'internship', 'scholarship', 'transfer', 'other'],
  },
  description: { type: String, trim: true, maxlength: 1000 },
  // Uploader
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Reviewer
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Final approver
  approvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'correction_needed'],
    default: 'draft',
  },

  filePath:    { type: String, default: null },
  fileName:    { type: String, default: null },
  fileSize:    { type: Number, default: null },
  mimeType:    { type: String, default: null },

  // Staff/Admin remarks
  remarks:     { type: String, trim: true, maxlength: 500 },
  // Student comment on correction
  correction:  { type: String, trim: true, maxlength: 500 },

  submittedAt: { type: Date, default: null },
  reviewedAt:  { type: Date, default: null },
  approvedAt:  { type: Date, default: null },
}, { timestamps: true });

documentSchema.index({ submittedBy: 1, status: 1 });
documentSchema.index({ reviewedBy: 1, status: 1 });

module.exports = mongoose.model('Document', documentSchema);
