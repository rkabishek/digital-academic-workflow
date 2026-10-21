const express = require('express');
const {
  registerStudent,
  registerStaff,
  login,
  getMe,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public
router.post('/register/student', registerStudent);
router.post('/register/staff',   registerStaff);
router.post('/login',            login);
router.post('/forgot-password',  forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected
router.get('/me',                protect, getMe);
router.put('/change-password',   protect, changePassword);
router.put('/profile',           protect, updateProfile);

module.exports = router;
