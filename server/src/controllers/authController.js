const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { generateStaffCode, generateSecureToken, hashToken } = require('../utils/crypto');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/emailService');

/* ── Helper: send token response ─────────────────────── */
const sendToken = (res, statusCode, user, message = 'Success') => {
  const token = signToken({ id: user._id, role: user.role });
  res.status(statusCode).json({
    success: true,
    message,
    data: {
      token,
      user: user.toPublicJSON ? user.toPublicJSON() : user,
    },
  });
};

/* ═══════════════════════════════════════════════════════
   POST /api/auth/register/student
═══════════════════════════════════════════════════════ */
const registerStudent = async (req, res, next) => {
  try {
    const {
      name, email, password, phone, department,
      rollNumber, year, section, staffCode,
    } = req.body;

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Resolve staff advisor if staffCode provided
    let staffAdvisor = null;
    if (staffCode) {
      const advisor = await User.findOne({ staffCode: staffCode.toUpperCase(), role: 'staff' });
      if (!advisor) {
        return res.status(400).json({ success: false, message: 'Invalid Staff Code. Please check with your staff advisor.' });
      }
      staffAdvisor = advisor._id;
    }

    const user = await User.create({
      name, email, password, phone, department,
      rollNumber, year, section,
      role: 'student',
      staffAdvisor,
      linkedStaffCode: staffCode ? staffCode.toUpperCase() : null,
    });

    sendToken(res, 201, user, 'Student account created successfully.');
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   POST /api/auth/register/staff
═══════════════════════════════════════════════════════ */
const registerStaff = async (req, res, next) => {
  try {
    const { name, email, password, phone, department, designation } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Generate unique staff code
    let staffCode;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      staffCode = generateStaffCode();
      const existing = await User.findOne({ staffCode });
      if (!existing) isUnique = true;
      attempts++;
    }

    const user = await User.create({
      name, email, password, phone, department, designation,
      role: 'staff',
      staffCode,
    });

    sendToken(res, 201, user, `Staff account created. Your Staff Code is ${staffCode}`);
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   POST /api/auth/login
═══════════════════════════════════════════════════════ */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Explicitly select password (select: false on schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });
    }

    sendToken(res, 200, user, 'Logged in successfully.');
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   GET /api/auth/me   (requires protect middleware)
═══════════════════════════════════════════════════════ */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: { user: user.toPublicJSON() },
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   PUT /api/auth/change-password  (requires protect)
═══════════════════════════════════════════════════════ */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    sendToken(res, 200, user, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════════════════════
   PUT /api/auth/profile  (requires protect)
═══════════════════════════════════════════════════════ */
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'department', 'year', 'section', 'designation'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: user.toPublicJSON() },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerStudent, registerStaff, login, getMe, changePassword, updateProfile, forgotPassword, resetPassword };

/* ═══════════════════════════════════════════════════════
   POST /api/auth/forgot-password
═══════════════════════════════════════════════════════ */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const user = await User.findOne({ email });
    // Always respond 200 to prevent user enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const rawToken = generateSecureToken(32);
    user.passwordResetToken   = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:6100'}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new Error('Email could not be sent. Please try again later.'));
    }

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) { next(err); }
}

/* ═══════════════════════════════════════════════════════
   PUT /api/auth/reset-password/:token
═══════════════════════════════════════════════════════ */
async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = hashToken(token);
    const user = await User.findOne({
      passwordResetToken:   hashed,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendToken(res, 200, user, 'Password reset successfully.');
  } catch (err) { next(err); }
}
