const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const Project = require('../models/Project');
const { sendNotification } = require('../services/notificationService');
const upload = require('../middleware/upload');

// Submit project
router.post('/', protect, restrict('student'), async (req, res, next) => {
  try {
    const { title, description, domain, teamMembers } = req.body;
    const project = await Project.create({
      title, description, domain,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [teamMembers].filter(Boolean),
      submittedBy: req.user._id,
      status: 'submitted',
      submittedAt: new Date(),
    });
    res.status(201).json({ success: true, message: 'Project submitted.', data: { project } });
  } catch (err) { next(err); }
});

// My projects
router.get('/my', protect, restrict('student'), async (req, res, next) => {
  try {
    const projects = await Project.find({ submittedBy: req.user._id })
      .populate('reviewedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: { projects } });
  } catch (err) { next(err); }
});

// Staff: list projects
router.get('/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const projects = await Project.find(filter)
      .populate('submittedBy', 'name email rollNumber department')
      .populate('reviewedBy', 'name email').sort({ submittedAt: -1 });
    res.json({ success: true, data: { projects } });
  } catch (err) { next(err); }
});

// Get single project
router.get('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('submittedBy', 'name email rollNumber')
      .populate('reviewedBy', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, data: { project } });
  } catch (err) { next(err); }
});

// Review project
router.put('/:id/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const project = await Project.findByIdAndUpdate(req.params.id,
      { status, remarks, reviewedBy: req.user._id },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    await sendNotification(project.submittedBy, {
      title: `Project ${status}`,
      message: `Your project "${project.title}" was ${status}.`,
      type: status === 'approved' ? 'success' : 'warning',
      link: `/student/projects/${project._id}`,
    });
    res.json({ success: true, message: 'Project updated.', data: { project } });
  } catch (err) { next(err); }
});

// Add milestone (student)
router.post('/:id/milestones', protect, restrict('student'), upload.single('file'), async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    const project = await Project.findOne({ _id: req.params.id, submittedBy: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    project.milestones.push({
      title, description, dueDate,
      filePath: req.file ? `uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      status: 'submitted',
      submittedAt: new Date(),
    });
    await project.save();
    res.status(201).json({ success: true, message: 'Milestone added.', data: { project } });
  } catch (err) { next(err); }
});

// Review milestone (staff)
router.put('/:id/milestones/:milestoneId/review', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found.' });
    milestone.status = status;
    milestone.feedback = feedback;
    milestone.reviewedAt = new Date();
    await project.save();
    res.json({ success: true, message: 'Milestone reviewed.', data: { project } });
  } catch (err) { next(err); }
});

module.exports = router;
