const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/staff — list all staff (for student registration dropdown)
router.get('/staff', async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff', isActive: true })
      .select('name email staffCode department designation');
    res.json({ success: true, data: { staff } });
  } catch (err) { next(err); }
});

// GET /api/users/students — list students (staff/admin only)
router.get('/students', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const filter = { role: 'student' };
    if (req.user.role === 'staff') filter.staffAdvisor = req.user._id;
    const students = await User.find(filter)
      .select('name email rollNumber department year section linkedStaffCode createdAt')
      .sort({ name: 1 });
    res.json({ success: true, data: { students } });
  } catch (err) { next(err); }
});

// GET /api/users/:id — get user by ID (protected)
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (err) { next(err); }
});

module.exports = router;
