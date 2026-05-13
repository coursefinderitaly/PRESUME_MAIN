require('dns').setServers(['8.8.8.8']);
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendStudentEmail, sendAdminEmail } = require('../utils/mailer');
const { getWelcomeEmailHTML, getPartnerRequestEmailHTML } = require('../utils/emailTemplates');

// 1. SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { 
      firstName, lastName, country, state, city, phoneCode, phone, whatsappCode, whatsapp, email, password, role,
      companyName, companyAddress, teamSize, priorExperience, designation, studentUniqueId 
    } = req.body;
    
    // Check for existing user by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.email === email) return res.status(400).json({ error: "Email already registered" });
    }
    
    // Enforce Strict Password Complexity (8 chars, 1 upper, 1 lower, 1 number, 1 special)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
      });
    }

    // Scramble the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save to database
    const newUser = new User({ 
      firstName, lastName, country, state, city, phoneCode, phone, whatsappCode, whatsapp, email, 
      password: hashedPassword,
      role: role || 'student',
      companyName, companyAddress, teamSize, priorExperience, designation, studentUniqueId
    });
    await newUser.save();
    
    // Send Welcome Email if user is a student
    if (newUser.role === 'student' && email) {
      const subject = '🎓 Welcome to Presume Overseas — Your Journey Begins!';
      const html = getWelcomeEmailHTML(firstName, lastName);
      // Fire-and-forget — never block the signup response
      sendStudentEmail(email, subject, html).catch(err => console.error('[Auth] Welcome email failed:', err.message));
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// 2. LOGIN ROUTE (Allows login via email OR phone)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be email or phone
    
    // Find user in database by email or phone
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }] 
    });
    
    if (!user) return res.status(400).json({ error: "User not found" });
    
    // Enforce Block Status
    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account has been suspended. Please contact support." });
    }

    // Enforce Account Intrusion Soft-Locks
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ 
        error: `Account temporarily locked due to multiple failed attempts. Please try again in ${remainingMinutes} minutes.` 
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Skip lockout for Admin accounts
      if (user.role === 'admin') {
         return res.status(400).json({ error: "Invalid credentials" });
      }

      user.loginAttempts += 1;
      
      // If they fail 5 times, lock the account for 15 minutes
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        await user.save();
        return res.status(403).json({ error: "Maximum attempts reached. Account locked for 15 minutes." });
      }
      
      await user.save();
      return res.status(400).json({ error: "Invalid credentials" });
    }


    // If login is successful, reset lockout parameters
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    // Give user a token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set token as HTTPOnly Session Cookie (no maxAge = clears when browser closes)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'None'
    });
    
    res.json({ message: "Logged in successfully", user: { email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 3. GET CURRENT PROFILE
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 4. UPDATE PROFILE ROUTE
router.put('/update', auth, async (req, res) => {
  try {
    const { email, firstName, lastName, country, state, city, phone, whatsapp, companyName, companyAddress, teamSize, priorExperience, designation, studentUniqueId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already in use by another account" });
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (country) user.country = country;
    if (state) user.state = state;
    if (city) user.city = city;
    if (phone) user.phone = phone;
    if (whatsapp !== undefined) user.whatsapp = whatsapp;
    if (companyName !== undefined) user.companyName = companyName;
    if (companyAddress !== undefined) user.companyAddress = companyAddress;
    if (teamSize !== undefined) user.teamSize = teamSize;
    if (priorExperience !== undefined) user.priorExperience = priorExperience;
    if (designation !== undefined) user.designation = designation;
    if (studentUniqueId !== undefined) user.studentUniqueId = studentUniqueId;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error updating profile" });
  }
});

// 4.6 UPLOAD / UPDATE AVATAR
router.put('/avatar', auth, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    // Accept "" or null as removal, but throw error if field is undefined/absent entirely
    if (avatarUrl === undefined) return res.status(400).json({ error: 'No avatar data payload provided' });
    // Limit size only if data is present
    if (avatarUrl && avatarUrl.length > 800000) return res.status(400).json({ error: 'Image too large. Please use a smaller photo.' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.avatarUrl = avatarUrl;
    await user.save();
    res.json({ message: 'Avatar updated', avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error uploading avatar' });
  }
});

// 4.5 CHANGE PASSWORD ROUTE
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Please provide both current and new passwords" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Enforce Strict Password Complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
      });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error changing password" });
  }
});

// 5. PARTNER REGISTRATION REQUEST ROUTE
router.post('/partner-request', async (req, res) => {
  try {
    const { 
      firstName, lastName, country, state, city, phoneCode, phone, whatsappCode, whatsapp, email,
      companyName, companyAddress, teamSize, priorExperience, designation, studentUniqueId 
    } = req.body;
    
    // Check if email already registered as user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const adminEmail = process.env.STORAGE_EMAIL || process.env.EMAIL_USER;
    const partnerSubject = `🤝 New Partner Registration Request — ${companyName || firstName} ${lastName || ''}`;
    const partnerHTML = getPartnerRequestEmailHTML(req.body);

    // Send the email
    try {
        await sendAdminEmail(adminEmail, partnerSubject, partnerHTML);
        console.log(`[Auth] Partner request email sent for: ${email}`);
        res.status(200).json({ message: "Partner registration request received and forwarded to administration." });
    } catch (sendErr) {
        console.error('[Auth] Failed to send partner request email:', sendErr.message);
        res.status(500).json({ error: "Failed to send registration request: " + sendErr.message });
    }
  } catch (err) {
    console.error("Partner request error:", err);
    res.status(500).json({ error: "Server error sending request" });
  }
});

// 6. LOGOUT ROUTE
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;