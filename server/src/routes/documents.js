const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const Document = require('../models/Document');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');
const upload = require('../middleware/upload');

// ── Student: Submit Document ──────────────────────────────────────────────────
router.post('/', protect, restrict('student'), upload.single('file'), async (req, res, next) => {
  try {
    const { title, type, description } = req.body;
    const doc = await Document.create({
      title, type, description,
      submittedBy: req.user._id,
      status: 'submitted',
      submittedAt: new Date(),
      filePath: req.file ? `uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : null,
      mimeType: req.file ? req.file.mimetype : null,
    });
    // Notify staff advisor
    if (req.user.staffAdvisor) {
      await sendNotification(req.user.staffAdvisor, {
        title: 'New Document Submission',
        message: `${req.user.name} submitted a document: "${title}"`,
        type: 'info',
        link: `/staff/documents/${doc._id}`,
      });
    }
    res.status(201).json({ success: true, message: 'Document submitted successfully.', data: { document: doc } });
  } catch (err) { next(err); }
});

// ── Student: My Documents ─────────────────────────────────────────────────────
router.get('/my', protect, restrict('student'), async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = { submittedBy: req.user._id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email');
    res.json({ success: true, data: { documents } });
  } catch (err) { next(err); }
});

// ── Staff/Admin: List Documents for Review ────────────────────────────────────
router.get('/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (req.user.role === 'staff') {
      // Staff sees only their students' documents
      const myStudents = await User.find({ staffAdvisor: req.user._id }).select('_id');
      filter.submittedBy = { $in: myStudents.map(s => s._id) };
    }
    const documents = await Document.find(filter)
      .sort({ submittedAt: -1 })
      .populate('submittedBy', 'name email rollNumber department year section');
    res.json({ success: true, data: { documents } });
  } catch (err) { next(err); }
});

// ── Get Single Document ───────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('submittedBy', 'name email rollNumber')
      .populate('reviewedBy',  'name email')
      .populate('approvedBy',  'name email');
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    res.json({ success: true, data: { document: doc } });
  } catch (err) { next(err); }
});

// ── Staff: Review Document ────────────────────────────────────────────────────
router.put('/:id/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const allowedStatuses = ['under_review', 'approved', 'rejected', 'correction_needed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });

    doc.status = status;
    doc.remarks = remarks;
    doc.reviewedBy = req.user._id;
    doc.reviewedAt = new Date();
    if (status === 'approved') { doc.approvedBy = req.user._id; doc.approvedAt = new Date(); }
    await doc.save();

    await sendNotification(doc.submittedBy, {
      title: `Document ${status.replace('_', ' ')}`,
      message: `Your document "${doc.title}" was marked as ${status.replace('_', ' ')}.`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning',
      link: `/student/documents/${doc._id}`,
    });

    res.json({ success: true, message: 'Document status updated.', data: { document: doc } });
  } catch (err) { next(err); }
});

// ── Student: Resubmit with Correction ────────────────────────────────────────
router.put('/:id/resubmit', protect, restrict('student'), upload.single('file'), async (req, res, next) => {
  try {
    const { correction } = req.body;
    const doc = await Document.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    doc.status = 'submitted';
    doc.correction = correction;
    doc.submittedAt = new Date();
    if (req.file) {
      doc.filePath = `uploads/${req.file.filename}`;
      doc.fileName = req.file.originalname;
      doc.fileSize = req.file.size;
      doc.mimeType = req.file.mimetype;
    }
    await doc.save();
    res.json({ success: true, message: 'Document resubmitted.', data: { document: doc } });
  } catch (err) { next(err); }
});

// ── Delete (Draft only) ───────────────────────────────────────────────────────
router.delete('/:id', protect, restrict('student'), async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    if (doc.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft documents can be deleted.' });
    }
    await doc.deleteOne();
    res.json({ success: true, message: 'Document deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
