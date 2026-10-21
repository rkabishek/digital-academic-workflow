const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const ODRequest = require('../models/ODRequest');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');
const upload = require('../middleware/upload');

// Submit OD request
router.post('/', protect, restrict('student'), upload.single('supportingDoc'), async (req, res, next) => {
  try {
    const { requestType, reason, venue, fromDate, toDate, fromTime, toTime } = req.body;
    const od = await ODRequest.create({
      requestType, reason, venue,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      fromTime, toTime,
      submittedBy: req.user._id,
      supportingDoc: req.file ? `uploads/${req.file.filename}` : null,
    });
    // Notify staff advisor
    if (req.user.staffAdvisor) {
      await sendNotification(req.user.staffAdvisor, {
        title: 'New OD Request',
        message: `${req.user.name} submitted an ${requestType.replace('_', ' ')} request.`,
        type: 'info',
        link: `/staff/od-requests/${od._id}`,
      });
    }
    res.status(201).json({ success: true, message: 'Request submitted.', data: { request: od } });
  } catch (err) { next(err); }
});

// My requests
router.get('/my', protect, restrict('student'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { submittedBy: req.user._id };
    if (status) filter.status = status;
    const requests = await ODRequest.find(filter)
      .populate('reviewedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { requests } });
  } catch (err) { next(err); }
});

// Staff: list all OD requests from their students
router.get('/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (req.user.role === 'staff') {
      const myStudents = await User.find({ staffAdvisor: req.user._id }).select('_id');
      filter.submittedBy = { $in: myStudents.map(s => s._id) };
    }
    const requests = await ODRequest.find(filter)
      .populate('submittedBy', 'name email rollNumber department year section')
      .populate('reviewedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { requests } });
  } catch (err) { next(err); }
});

// Get single
router.get('/:id', protect, async (req, res, next) => {
  try {
    const od = await ODRequest.findById(req.params.id)
      .populate('submittedBy', 'name email rollNumber')
      .populate('reviewedBy', 'name email');
    if (!od) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, data: { request: od } });
  } catch (err) { next(err); }
});

// Staff: approve or reject
router.put('/:id/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, staffRemarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
    }
    const od = await ODRequest.findByIdAndUpdate(req.params.id,
      { status, staffRemarks, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!od) return res.status(404).json({ success: false, message: 'Request not found.' });
    await sendNotification(od.submittedBy, {
      title: `OD Request ${status}`,
      message: `Your ${od.requestType.replace('_', ' ')} request was ${status}.`,
      type: status === 'approved' ? 'success' : 'error',
      link: `/student/od-requests/${od._id}`,
    });
    res.json({ success: true, message: `Request ${status}.`, data: { request: od } });
  } catch (err) { next(err); }
});

// Delete (pending only)
router.delete('/:id', protect, restrict('student'), async (req, res, next) => {
  try {
    const od = await ODRequest.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!od) return res.status(404).json({ success: false, message: 'Request not found.' });
    if (od.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot delete a reviewed request.' });
    }
    await od.deleteOne();
    res.json({ success: true, message: 'Request deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
