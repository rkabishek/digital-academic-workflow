const mongoose = require('mongoose');

/**
 * ODRequest Model — Phase 6
 * On-Duty / Permission requests by students, reviewed by staff.
 */
const odRequestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ['on_duty', 'permission', 'leave'],
    required: true,
  },
  reason:      { type: String, required: true, trim: true, maxlength: 1000 },
  venue:       { type: String, trim: true },
  fromDate:    { type: Date, required: true },
  toDate:      { type: Date, required: true },
  fromTime:    { type: String },  // HH:MM format for permission
  toTime:      { type: String },

  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  staffRemarks:   { type: String, trim: true, maxlength: 500 },
  supportingDoc:  { type: String, default: null },
  reviewedAt:     { type: Date, default: null },
}, { timestamps: true });

odRequestSchema.index({ submittedBy: 1, status: 1 });
odRequestSchema.index({ reviewedBy: 1, status: 1 });

module.exports = mongoose.model('ODRequest', odRequestSchema);
