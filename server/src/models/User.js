const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User Model
 * Roles: student | staff | admin
 * Students are linked to a Staff member via staffCode.
 * Staff accounts carry a unique STF-XXXXX code for student association.
 * Admin accounts are seeded only — registration is not public.
 */
const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },

    // ── Role ──────────────────────────────────────────────
    role: {
      type: String,
      enum: { values: ['student', 'staff', 'admin'], message: 'Invalid role' },
      required: true,
    },

    // ── Profile ───────────────────────────────────────────
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, 'Phone must be a 10-digit number'],
    },
    department: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },

    // ── Student-specific ──────────────────────────────────
    rollNumber: {
      type: String,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
    },
    // Reference to staff advisor
    staffAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Staff code used to link student to advisor
    linkedStaffCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    // ── Staff-specific ─────────────────────────────────────
    staffCode: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      uppercase: true,
      // Format: STF-XXXXX
    },
    designation: {
      type: String,
      trim: true,
    },

    // ── Account state ──────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ── Password reset ─────────────────────────────────────
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // ── Notifications ──────────────────────────────────────
    notifications: [
      {
        title:     { type: String, required: true },
        message:   { type: String, required: true },
        type:      { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
        isRead:    { type: Boolean, default: false },
        link:      { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    unreadNotifications: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* ── Indexes ─────────────────────────────────────────── */
userSchema.index({ role: 1 });

/* ── Middleware: hash password before save ──────────── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/* ── Instance method: compare password ─────────────── */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/* ── Instance method: safe public profile ──────────── */
userSchema.methods.toPublicJSON = function () {
  return {
    _id:          this._id,
    name:         this.name,
    email:        this.email,
    role:         this.role,
    phone:        this.phone,
    department:   this.department,
    profileImage: this.profileImage,
    rollNumber:   this.rollNumber,
    year:         this.year,
    section:      this.section,
    staffCode:    this.staffCode,
    designation:  this.designation,
    staffAdvisor: this.staffAdvisor,
    isActive:     this.isActive,
    unreadNotifications: this.unreadNotifications,
    createdAt:    this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
