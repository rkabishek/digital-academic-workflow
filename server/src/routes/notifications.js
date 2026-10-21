const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/notifications — get my notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notifications unreadNotifications');
    res.json({
      success: true,
      data: {
        notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt),
        unreadCount: user.unreadNotifications,
      },
    });
  } catch (err) { next(err); }
});

// PUT /api/notifications/:id/read — mark single as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const notif = user.notifications.id(req.params.id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });
    if (!notif.isRead) {
      notif.isRead = true;
      user.unreadNotifications = Math.max(0, user.unreadNotifications - 1);
      await user.save();
    }
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) { next(err); }
});

// PUT /api/notifications/read-all — mark all as read
router.put('/read-all', protect, async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          'notifications.$[].isRead': true,
          unreadNotifications: 0,
        },
      }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) { next(err); }
});

// DELETE /api/notifications/:id — delete a notification
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const notif = user.notifications.id(req.params.id);
    if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });
    if (!notif.isRead) user.unreadNotifications = Math.max(0, user.unreadNotifications - 1);
    notif.deleteOne();
    await user.save();
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) { next(err); }
});

// DELETE /api/notifications — clear all
router.delete('/', protect, async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { notifications: [], unreadNotifications: 0 } });
    res.json({ success: true, message: 'All notifications cleared.' });
  } catch (err) { next(err); }
});

module.exports = router;
