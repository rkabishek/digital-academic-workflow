/**
 * Admin Seed Script
 * Creates the first admin account.
 * Usage: node src/scripts/seedAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    const exists = await User.findOne({ role: 'admin' });
    if (exists) {
      console.log('[Seed] Admin already exists:', exists.email);
      process.exit(0);
    }

    const admin = await User.create({
      name:     'AcadFlow Admin',
      email:    'admin@acadflow.edu',
      password: 'Admin@1234',
      role:     'admin',
      phone:    '9999999999',
      department: 'Administration',
    });

    console.log('[Seed] ✅ Admin created successfully!');
    console.log('[Seed]    Email:   ', admin.email);
    console.log('[Seed]    Password: Admin@1234  (change this immediately!)');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] ❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
