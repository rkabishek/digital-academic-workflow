const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

/* ── Helper: generate certificate number ── */
const genCertNumber = () => {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `CERT-${ym}-${rand}`;
};

// Issue certificate (staff/admin)
router.post('/', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const { title, type, description, issuedTo, validUntil, relatedDocument } = req.body;

    const student = await User.findById(issuedTo);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    let certNumber = genCertNumber();
    // Ensure uniqueness
    while (await Certificate.findOne({ certificateNumber: certNumber })) {
      certNumber = genCertNumber();
    }

    // QR data — verification URL
    const qrData = `${process.env.CLIENT_URL || 'http://localhost:6100'}/verify/${certNumber}`;
    const qrCode = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H', width: 200 });

    const cert = await Certificate.create({
      certificateNumber: certNumber,
      title, type, description,
      issuedTo, issuedBy: req.user._id,
      validUntil: validUntil ? new Date(validUntil) : null,
      relatedDocument: relatedDocument || null,
      qrCode, qrData,
    });

    const populated = await Certificate.findById(cert._id)
      .populate('issuedTo', 'name email rollNumber department')
      .populate('issuedBy', 'name email');

    res.status(201).json({ success: true, message: 'Certificate issued.', data: { certificate: populated } });
  } catch (err) { next(err); }
});

// My certificates (student)
router.get('/my', protect, restrict('student'), async (req, res, next) => {
  try {
    const certs = await Certificate.find({ issuedTo: req.user._id, isRevoked: false })
      .populate('issuedBy', 'name email').sort({ issuedDate: -1 });
    res.json({ success: true, data: { certificates: certs } });
  } catch (err) { next(err); }
});

// All certificates (staff/admin)
router.get('/', protect, restrict('staff', 'admin'), async (req, res, next) => {
  try {
    const certs = await Certificate.find()
      .populate('issuedTo', 'name email rollNumber')
      .populate('issuedBy', 'name email').sort({ issuedDate: -1 });
    res.json({ success: true, data: { certificates: certs } });
  } catch (err) { next(err); }
});

// Verify by certificate number (public)
router.get('/verify/:certNumber', async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ certificateNumber: req.params.certNumber })
      .populate('issuedTo', 'name email rollNumber department')
      .populate('issuedBy', 'name email designation');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found or invalid.' });
    res.json({
      success: true,
      message: cert.isRevoked ? 'This certificate has been revoked.' : 'Certificate is valid.',
      data: { certificate: cert, isValid: !cert.isRevoked },
    });
  } catch (err) { next(err); }
});

// Get single certificate
router.get('/:id', protect, async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id)
      .populate('issuedTo', 'name email rollNumber department')
      .populate('issuedBy', 'name email designation');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });
    res.json({ success: true, data: { certificate: cert } });
  } catch (err) { next(err); }
});

// Revoke certificate (admin only)
router.put('/:id/revoke', protect, restrict('admin'), async (req, res, next) => {
  try {
    const { revokeReason } = req.body;
    const cert = await Certificate.findByIdAndUpdate(req.params.id,
      { isRevoked: true, revokeReason },
      { new: true }
    );
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });
    res.json({ success: true, message: 'Certificate revoked.', data: { certificate: cert } });
  } catch (err) { next(err); }
});

module.exports = router;
