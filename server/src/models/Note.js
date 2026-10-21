const mongoose = require('mongoose');

/**
 * Note Model — Phase 8
 * Academic notes/resources shared by staff, downloaded by students.
 */
const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000 },
  subject:     { type: String, trim: true },
  department:  { type: String, trim: true },
  year:        { type: Number, min: 1, max: 5 },
  tags:        [{ type: String, trim: true }],

  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  filePath:    { type: String, required: true },
  fileName:    { type: String, required: true },
  fileSize:    { type: Number },
  mimeType:    { type: String },

  downloads:   { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ department: 1, year: 1 });
noteSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Note', noteSchema);
