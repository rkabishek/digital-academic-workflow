const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const Note = require('../models/Note');
const upload = require('../middleware/upload');

// Staff: upload note
router.post('/', protect, restrict('staff', 'admin'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file.' });
    const { title, description, subject, department, year, tags } = req.body;
    const note = await Note.create({
      title, description, subject, department,
      year: year ? Number(year) : undefined,
      tags: tags ? JSON.parse(tags) : [],
      uploadedBy: req.user._id,
      filePath: `uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
    res.status(201).json({ success: true, message: 'Note uploaded.', data: { note } });
  } catch (err) { next(err); }
});

// List notes (with filters)
router.get('/', protect, async (req, res, next) => {
  try {
    const { department, year, subject, search } = req.query;
    const filter = { isPublished: true };
    if (department) filter.department = department;
    if (year) filter.year = Number(year);
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') },
    ];
    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email department')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { notes } });
  } catch (err) { next(err); }
});

// Get single note
router.get('/:id', protect, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, data: { note } });
  } catch (err) { next(err); }
});

// Download note (increment counter)
router.get('/:id/download', protect, async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    const path = require('path');
    const fullPath = path.isAbsolute(note.filePath)
      ? note.filePath
      : path.join(__dirname, '../../', note.filePath);
    res.download(fullPath, note.fileName);
  } catch (err) { next(err); }
});

// Staff: update note
router.put('/:id', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { title, description, subject, department, year, tags, isPublished } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, uploadedBy: req.user.role === 'admin' ? undefined : req.user._id },
      { title, description, subject, department, year, tags, isPublished },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, message: 'Note updated.', data: { note } });
  } catch (err) { next(err); }
});

// Delete note
router.delete('/:id', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.uploadedBy = req.user._id;
    const note = await Note.findOneAndDelete(filter);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
