const User = require('../models/User');

/**
 * Sends an in-app notification to a user.
 * @param {string|ObjectId} userId
 * @param {{ title, message, type, link }} notif
 */
const sendNotification = async (userId, { title, message, type = 'info', link = null }) => {
  try {
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          notifications: {
            $each: [{ title, message, type, link, isRead: false, createdAt: new Date() }],
            $position: 0,
            $slice: 50, // keep last 50 notifications
          },
        },
        $inc: { unreadNotifications: 1 },
      }
    );
  } catch (err) {
    // Non-critical — log but don't throw
    console.error('[Notification] Failed to send notification:', err.message);
  }
};

module.exports = { sendNotification };
