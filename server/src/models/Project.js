const mongoose = require('mongoose');

/**
 * Project Model — Phase 5
 * Multi-stage student project submissions with staff review.
 */
const milestoneSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dueDate:     { type: Date },
  filePath:    { type: String, default: null },
  fileName:    { type: String, default: null },
  status:      { type: String, enum: ['pending', 'submitted', 'approved', 'rejected', 'revision_needed'], default: 'pending' },
  feedback:    { type: String, trim: true },
  submittedAt: { type: Date, default: null },
  reviewedAt:  { type: Date, default: null },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true, maxlength: 200 },
  description:   { type: String, trim: true, maxlength: 2000 },
  domain:        { type: String, trim: true },
  teamMembers:   [{ type: String, trim: true }],

  submittedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
    default: 'draft',
  },

  milestones:  [milestoneSchema],
  remarks:     { type: String, trim: true, maxlength: 500 },
  submittedAt: { type: Date, default: null },
}, { timestamps: true });

projectSchema.index({ submittedBy: 1 });
projectSchema.index({ reviewedBy: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
