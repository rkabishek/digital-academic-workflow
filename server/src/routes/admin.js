const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const User = require('../models/User');
const Document = require('../models/Document');
const Project = require('../models/Project');
const ODRequest = require('../models/ODRequest');
const Certificate = require('../models/Certificate');
const Note = require('../models/Note');
const { generateStaffCode } = require('../utils/crypto');

// ── GET /api/admin/stats — System Statistics ──────────────────────────────────
router.get('/stats', protect, restrict('admin'), async (req, res, next) => {
  try {
    const [
      totalUsers, students, staff,
      totalDocuments, pendingDocuments, approvedDocuments,
      totalProjects, totalOD, pendingOD,
      totalCerts, totalNotes,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'staff' }),
      Document.countDocuments(),
      Document.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      Document.countDocuments({ status: 'approved' }),
      Project.countDocuments(),
      ODRequest.countDocuments(),
      ODRequest.countDocuments({ status: 'pending' }),
      Certificate.countDocuments({ isRevoked: false }),
      Note.countDocuments({ isPublished: true }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          users: { total: totalUsers, students, staff },
          documents: { total: totalDocuments, pending: pendingDocuments, approved: approvedDocuments },
          projects: { total: totalProjects },
          odRequests: { total: totalOD, pending: pendingOD },
          certificates: { total: totalCerts },
          notes: { total: totalNotes },
        },
      },
    });
  } catch (err) { next(err); }
});

// ── GET /api/admin/users — All Users ─────────────────────────────────────────
router.get('/users', protect, restrict('admin'), async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { rollNumber: new RegExp(search, 'i') },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({
      success: true,
      data: {
        users,
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (err) { next(err); }
});

// ── PUT /api/admin/users/:id/toggle — Activate/Deactivate ─────────────────────
router.put('/users/:id/toggle', protect, restrict('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, data: { user: user.toPublicJSON() } });
  } catch (err) { next(err); }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete('/users/:id', protect, restrict('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin.' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
});

// ── POST /api/admin/create-admin — Seed another admin ────────────────────────
router.post('/create-admin', protect, restrict('admin'), async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already in use.' });
    const admin = await User.create({ name, email, password, phone, role: 'admin' });
    res.status(201).json({ success: true, message: 'Admin created.', data: { user: admin.toPublicJSON() } });
  } catch (err) { next(err); }
});

// ── GET /api/admin/documents — All Documents ─────────────────────────────────
router.get('/documents', protect, restrict('admin'), async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const skip = (Number(page) - 1) * Number(limit);
    const [documents, total] = await Promise.all([
      Document.find(filter)
        .populate('submittedBy', 'name email rollNumber')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Document.countDocuments(filter),
    ]);
    res.json({
      success: true,
      data: { documents, pagination: { total, page: Number(page), limit: Number(limit) } },
    });
  } catch (err) { next(err); }
});

module.exports = router;
