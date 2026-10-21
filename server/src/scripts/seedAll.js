/**
 * Comprehensive Database Seeding Script — Phase 13
 * Seeds demo accounts (Student, Faculty, Admin), sample documents, OD requests,
 * projects, milestones, study materials, certificates with QR codes, and audit logs.
 *
 * Usage: node src/scripts/seedAll.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dns = require('dns');
const QRCode = require('qrcode');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const User = require('../models/User');
const Document = require('../models/Document');
const Project = require('../models/Project');
const ODRequest = require('../models/ODRequest');
const Certificate = require('../models/Certificate');
const Note = require('../models/Note');
const AuditLog = require('../models/AuditLog');

const seedAll = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // 1. Seed or update Admin
    let admin = await User.findOne({ email: 'admin@acadflow.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'AcadFlow Administrator',
        email: 'admin@acadflow.edu',
        password: 'Password@123',
        role: 'admin',
        phone: '9876543210',
        department: 'Academic Administration',
        isActive: true,
      });
      console.log('[Seed] Created Admin account: admin@acadflow.edu');
    } else {
      admin.password = 'Password@123';
      await admin.save();
      console.log('[Seed] Updated Admin password: admin@acadflow.edu');
    }

    // 2. Seed or update Faculty / Staff
    let faculty = await User.findOne({ email: 'faculty@acadflow.edu' });
    if (!faculty) {
      faculty = await User.create({
        name: 'Dr. Sarah Mitchell',
        email: 'faculty@acadflow.edu',
        password: 'Password@123',
        role: 'staff',
        staffCode: 'STF-DEMO1',
        designation: 'Associate Professor',
        department: 'Computer Science & Engineering',
        phone: '9876543211',
        isActive: true,
      });
      console.log('[Seed] Created Faculty account: faculty@acadflow.edu (Staff Code: STF-DEMO1)');
    } else {
      faculty.password = 'Password@123';
      faculty.staffCode = 'STF-DEMO1';
      await faculty.save();
      console.log('[Seed] Updated Faculty account: faculty@acadflow.edu');
    }

    // 3. Seed or update Student
    let student = await User.findOne({ email: 'student@acadflow.edu' });
    if (!student) {
      student = await User.create({
        name: 'Alex Johnson',
        email: 'student@acadflow.edu',
        password: 'Password@123',
        role: 'student',
        rollNumber: '21CS042',
        department: 'Computer Science & Engineering',
        year: 3,
        section: 'A',
        phone: '9876543212',
        staffAdvisor: faculty._id,
        linkedStaffCode: 'STF-DEMO1',
        isActive: true,
      });
      console.log('[Seed] Created Student account: student@acadflow.edu (Roll: 21CS042)');
    } else {
      student.password = 'Password@123';
      student.staffAdvisor = faculty._id;
      student.linkedStaffCode = 'STF-DEMO1';
      await student.save();
      console.log('[Seed] Updated Student account: student@acadflow.edu');
    }

    // 4. Sample Document
    const existingDoc = await Document.findOne({ title: 'NOC for Summer Internship at ISRO' });
    if (!existingDoc) {
      await Document.create({
        title: 'NOC for Summer Internship at ISRO',
        type: 'noc',
        description: 'Application for No Objection Certificate to attend summer research internship at ISRO Satellite Centre, Bangalore.',
        submittedBy: student._id,
        status: 'submitted',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      });
      console.log('[Seed] Created sample NOC Document.');
    }

    // 5. Sample OD Request
    const existingOD = await ODRequest.findOne({ reason: 'Representing University at Inter-Collegiate Smart India Hackathon' });
    if (!existingOD) {
      await ODRequest.create({
        requestType: 'on_duty',
        reason: 'Representing University at Inter-Collegiate Smart India Hackathon',
        venue: 'IIT Madras Research Park, Chennai',
        fromDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        toDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        fromTime: '08:30',
        toTime: '18:00',
        submittedBy: student._id,
        status: 'pending',
      });
      console.log('[Seed] Created sample OD Request.');
    }

    // 6. Sample Project with Milestones
    const existingProj = await Project.findOne({ title: 'Decentralized Academic Credential Verification System' });
    if (!existingProj) {
      await Project.create({
        title: 'Decentralized Academic Credential Verification System',
        description: 'Building an tamper-proof digital certification system using cryptographic hashing, automated workflow approvals, and QR codes.',
        domain: 'Distributed Systems & Cloud Security',
        teamMembers: ['Alex Johnson (Lead)', 'Priya Sharma (Frontend)', 'Karthik Raja (Backend)'],
        submittedBy: student._id,
        status: 'approved',
        remarks: 'Approved capstone proposal. Ensure comprehensive test coverage for cryptographic verification.',
        reviewedBy: faculty._id,
        milestones: [
          {
            title: 'Milestone 1: SRS & System Architecture Blueprint',
            description: 'Completed requirement specifications, entity relationships, and API contract specifications.',
            status: 'approved',
            feedback: 'Excellent modular specification. Proceed to implementation.',
            reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            title: 'Milestone 2: Prototype Implementation & Benchmarking',
            description: 'Core REST APIs, role-based JWT auth, and Mongoose schema indices implemented.',
            status: 'submitted',
            submittedAt: new Date(),
          },
        ],
      });
      console.log('[Seed] Created sample Capstone Project with Milestones.');
    }

    // 7. Sample Notes
    const existingNote = await Note.findOne({ title: 'Distributed Systems & Consensus Protocols (CS801)' });
    if (!existingNote) {
      await Note.create({
        title: 'Distributed Systems & Consensus Protocols (CS801)',
        subject: 'Distributed Computing',
        department: 'Computer Science & Engineering',
        year: 3,
        description: 'Comprehensive study materials covering Raft consensus, Byzantine Fault Tolerance, and CAP Theorem tradeoffs.',
        tags: ['distributed-systems', 'consensus', 'raft', 'paxos'],
        uploadedBy: faculty._id,
        filePath: 'uploads/sample-distributed-systems-note.pdf',
        fileName: 'sample-distributed-systems-note.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        downloads: 28,
        isPublished: true,
      });
      console.log('[Seed] Created sample Study Note.');
    }

    // 8. Sample Certificate with QR Code
    const existingCert = await Certificate.findOne({ certificateNumber: 'CERT-202609-DEMO01' });
    if (!existingCert) {
      const qrData = `${process.env.CLIENT_URL || 'http://localhost:6100'}/verify/CERT-202609-DEMO01`;
      const qrCode = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H', width: 200 });

      await Certificate.create({
        certificateNumber: 'CERT-202609-DEMO01',
        title: 'Academic Excellence in Cloud & Systems Architecture',
        type: 'achievement',
        description: 'Awarded for extraordinary technical contributions and milestone delivery in advanced academic coursework.',
        issuedTo: student._id,
        issuedBy: faculty._id,
        qrCode,
        qrData,
        issuedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRevoked: false,
      });
      console.log('[Seed] Created sample verified Digital Certificate (CERT-202609-DEMO01).');
    }

    // 9. Sample Audit Log
    const existingAudit = await AuditLog.findOne({ action: 'SYSTEM_BOOTSTRAP' });
    if (!existingAudit) {
      await AuditLog.create({
        action: 'SYSTEM_BOOTSTRAP',
        performedBy: admin._id,
        performedByName: admin.name,
        userRole: 'admin',
        entityType: 'System',
        details: 'Initial system seeding and module bootstrapping completed.',
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
      });
      console.log('[Seed] Created initial Audit Log entry.');
    }

    console.log('\n======================================================');
    console.log('✅ ALL SEED DATA POPULATED SUCCESSFULLY!');
    console.log('Demo Credentials for Testing:');
    console.log('------------------------------------------------------');
    console.log('1. Student:');
    console.log('   Email:    student@acadflow.edu');
    console.log('   Password: Password@123');
    console.log('   Roll No:  21CS042  (Linked to STF-DEMO1)');
    console.log('------------------------------------------------------');
    console.log('2. Faculty / Staff:');
    console.log('   Email:    faculty@acadflow.edu');
    console.log('   Password: Password@123');
    console.log('   Code:     STF-DEMO1');
    console.log('------------------------------------------------------');
    console.log('3. Administrator:');
    console.log('   Email:    admin@acadflow.edu');
    console.log('   Password: Password@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedAll();
