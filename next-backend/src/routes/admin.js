const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/rbac');

// All routes in this file require both auth and admin middleware to protect the data
router.use(auth, checkRole(['admin']));

// GET all users (students, partners, and other admins)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// CREATE user manually
router.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists in database' });
    
    const bcrypt = require('bcrypt');
    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('defaultpassword123', 10);
    
    const updates = { ...req.body };
    
    // Nullify empty ID fields to prevent Mongoose CastError
    if (updates.assignedCounselor === "") updates.assignedCounselor = null;
    if (updates.createdByCounselor === "") updates.createdByCounselor = null;
    if (updates.registeredBy === "") updates.registeredBy = null;
    
    // Create overriding password field
    const newUser = new User({ ...updates, password: hashedPassword });
    await newUser.save();
    
    // Hide password before returning
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    
    res.status(201).json({ message: 'User created successfully', user: userToReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating user' });
  }
});

// UPDATE user details
router.put('/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Nullify empty ID fields to prevent Mongoose CastError
    if (updates.assignedCounselor === "") updates.assignedCounselor = null;
    if (updates.createdByCounselor === "") updates.createdByCounselor = null;
    if (updates.registeredBy === "") updates.registeredBy = null;

    // If a password is provided, hash it before updating
    if (updates.password && updates.password.trim() !== "") {
       const bcrypt = require('bcrypt');
       updates.password = await bcrypt.hash(updates.password, 10);
    } else {
       delete updates.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// UNLOCK user lockout
router.post('/users/:id/unlock', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({ message: 'User account unlocked successfully', user: { email: user.email, loginAttempts: 0 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error unlocking user' });
  }
});

// TOGGLE BLOCK status
router.post('/users/:id/toggle-block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ error: "System prevents blocking your own administrative account." });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: `User account ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 
      user: { email: user.email, isBlocked: user.isBlocked } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error toggling block status' });
  }
});

// GET all uploaded documents from Hostinger storage (uploads folder)
router.get('/documents', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadDir)) {
        return res.json([]);
    }
    
    const files = fs.readdirSync(uploadDir);
    const fileData = files.map(filename => {
        const stats = fs.statSync(path.join(uploadDir, filename));
        return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            filePath: path.join(uploadDir, filename),
            downloadUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload/download/${filename}`
        };
    });
    
    // Sort by newest first
    fileData.sort((a, b) => b.createdAt - a.createdAt);
    res.json(fileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error listing documents' });
  }
});

// DELETE uploaded document from Hostinger storage
router.delete('/documents/:filename', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filename = req.params.filename;
    // ensure no directory traversal
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filePath = path.join(__dirname, '../../uploads', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting document' });
  }
});

// DELETE application from student profile
router.delete('/users/:studentId/applications/:appId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.appliedUniversities = student.appliedUniversities.filter(app => String(app.id) !== req.params.appId);
    
    // Also try to clean up formal Application documents if they exist.
    try {
       const Application = require('../models/Application');
       if (Application) {
          await Application.deleteMany({ studentId: req.params.studentId });
          // Note: Since we don't have the exact Application ID here, and to keep things clean, 
          // we could optionally not do this, but appliedUniversities is what powers the UI anyway.
       }
    } catch (e) {
       // Ignore if not present
    }

    await student.save();
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting application' });
  }
});


// =============================================
// ADMIN CHAT / MESSAGING ROUTES
// =============================================

// GET all students for chat (inbox)
router.get('/chats', async (req, res) => {
  try {
    const students = await User.find(
      { role: 'student' },
      'firstName lastName email adminMessages'
    ).sort({ updatedAt: -1 });

    const chatList = students.map(s => {
      const msgs = s.adminMessages || [];
      const unread = msgs.filter(m => m.sender === 'student' && !m.read).length;
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      return {
        studentId: s._id,
        studentName: `${s.firstName} ${s.lastName || ''}`.trim(),
        studentEmail: s.email,
        unreadCount: unread,
        lastMessage: lastMsg ? { text: lastMsg.text, sender: lastMsg.sender, timestamp: lastMsg.timestamp } : null,
        messageCount: msgs.length
      };
    });

    // Sort: unread first, then by last message, then alphabetical
    chatList.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      if (a.lastMessage && b.lastMessage) return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      return a.studentName.localeCompare(b.studentName);
    });

    res.json(chatList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching chats' });
  }
});

// GET total unread count for admin (for polling notification badge)
router.get('/chats/unread-count', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }, 'adminMessages');
    let total = 0;
    students.forEach(s => {
      (s.adminMessages || []).forEach(m => {
        if (m.sender === 'student' && !m.read) total++;
      });
    });
    res.json({ unread: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET messages for a specific student
router.get('/chats/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select('firstName lastName email adminMessages');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Mark all student messages as read
    let updated = false;
    student.adminMessages.forEach(m => {
      if (m.sender === 'student' && !m.read) {
        m.read = true;
        updated = true;
      }
    });
    if (updated) await student.save();

    res.json({
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName || ''}`.trim(),
      studentEmail: student.email,
      messages: student.adminMessages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// POST send a message TO a student (admin -> student)
router.post('/chats/:studentId', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });

    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.adminMessages.push({ text: text.trim(), sender: 'admin', read: false });
    await student.save();

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// DELETE clear chat history for a student
router.delete('/chats/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.adminMessages = [];
    await student.save();

    res.json({ message: 'Chat history cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =============================================
// ADMIN CONTACT FORMS ROUTES
// =============================================

// GET total unread count for contact forms (for notification badge)
router.get('/contacts/unread-count', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const total = await Contact.countDocuments({ isRead: false });
    res.json({ unread: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all contact form submissions
router.get('/contacts', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching contact forms' });
  }
});

// Toggle read status of a contact form submission
router.put('/contacts/:id/toggle-read', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact form not found' });
    contact.isRead = !contact.isRead;
    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating read status' });
  }
});

// DELETE contact form submission
router.delete('/contacts/:id', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact form deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting contact form' });
  }
});

// GET unread counts summary for all sections
router.get('/unread-summary', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const Appointment = require('../models/Appointment');
    const Application = require('../models/Application');
    
    // 1. Enquiries
    const unreadEnquiries = await Contact.countDocuments({ isRead: false });
    
    // 2. Appointments
    const unreadAppointments = await Appointment.countDocuments({ status: 'unread' });
    
    // 3. Applications
    const unreadApplications = await Application.countDocuments({ adminViewed: false });
    
    // 4. Direct Students (student role and adminViewed false)
    const unreadDirectStudents = await User.countDocuments({ role: 'student', adminViewed: false });
    
    // 5. Freelancers (freelancer role and adminViewed false)
    const unreadFreelancers = await User.countDocuments({ role: 'freelancer', adminViewed: false });

    // 6. Chats (already handled but good to have here too)
    const students = await User.find({ role: 'student' }, 'adminMessages');
    let unreadChats = 0;
    students.forEach(s => {
      (s.adminMessages || []).forEach(m => {
        if (m.sender === 'student' && !m.read) unreadChats++;
      });
    });

    res.json({
      enquiries: unreadEnquiries,
      appointments: unreadAppointments,
      applications: unreadApplications,
      directStudents: unreadDirectStudents,
      freelancers: unreadFreelancers,
      chats: unreadChats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching unread summary' });
  }
});

// Mark a whole category as read
router.post('/mark-category-read', async (req, res) => {
  try {
    const { category } = req.body;
    const Application = require('../models/Application');
    const Appointment = require('../models/Appointment');
    const Contact = require('../models/Contact');

    if (category === 'applications') {
      await Application.updateMany({ adminViewed: false }, { adminViewed: true });
    } else if (category === 'direct_students') {
      await User.updateMany({ role: 'student', adminViewed: false }, { adminViewed: true });
    } else if (category === 'freelancers') {
      await User.updateMany({ role: 'freelancer', adminViewed: false }, { adminViewed: true });
    } else if (category === 'appointments') {
      await Appointment.updateMany({ status: 'unread' }, { status: 'read' });
    } else if (category === 'contact_forms') {
      await Contact.updateMany({ isRead: false }, { isRead: true });
    }

    res.json({ message: `Category ${category} marked as read` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error marking read' });
  }
});

module.exports = router;
