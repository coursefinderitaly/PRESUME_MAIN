const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendStudentEmail } = require('../utils/mailer');
const { getVoucherEmailHTML } = require('../utils/emailTemplates');

// POST /api/coupons/generate
// Generate a new coupon (accessible without account)
router.post('/generate', async (req, res) => {
  try {
    const { name, destination, email, phone } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check if email already has an active coupon
    const existingCoupon = await Coupon.findOne({ 
      userEmail: lowerEmail, 
      isActive: true,
      validUntil: { $gt: new Date() }
    });

    if (existingCoupon) {
      return res.status(400).json({ error: 'An active coupon already exists for this email address.', coupon: existingCoupon });
    }

    // Generate unique code: PRESUME-[3-CHARS]-[4-DIGITS]
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChars = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `PRESUME-${randomChars}-${randomDigits}`;

    // 4 days from now
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 4);

    // If user is already registered, try to find them to bind the ID
    const user = await User.findOne({ email: lowerEmail });

    const newCoupon = new Coupon({
      code,
      userEmail: lowerEmail,
      userId: user ? user._id : null,
      name,
      phone,
      destination,
      discount: 50,
      validUntil
    });

    await newCoupon.save();

    // Auto-send voucher email
    try {
      // Format validUntil to DD-MM-YY for the email template
      const dd = String(validUntil.getDate()).padStart(2, '0');
      const mm = String(validUntil.getMonth() + 1).padStart(2, '0');
      const yy = String(validUntil.getFullYear()).slice(-2);
      const formattedDate = `${dd}-${mm}-${yy}`;

      const html = getVoucherEmailHTML({ name, code, validUntil: formattedDate, destination });
      const subject = '🎉 Your Presume Overseas Premium Voucher is Here!';

      await sendStudentEmail(lowerEmail, subject, html);
    } catch (emailError) {
      console.error('Error sending auto-voucher email:', emailError);
      // We don't fail the generation if email fails, just log it.
    }

    res.json({ message: 'Coupon generated successfully', coupon: newCoupon });
  } catch (error) {
    console.error('Error generating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET /api/coupons/my-coupon
// Get the active coupon for the authenticated user
router.get('/my-coupon', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activeCoupon = await Coupon.findOne({
      $or: [{ userId: req.user.id }, { userEmail: user.email.toLowerCase() }],
      isActive: true,
      validUntil: { $gt: new Date() }
    });

    if (!activeCoupon) {
      return res.status(404).json({ message: 'No active coupon found' });
    }

    res.json({ coupon: activeCoupon });
  } catch (error) {
    console.error('Error fetching user coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/coupons/all
// Get all coupons (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching all coupons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/coupons/:id
// Update coupon status or validity (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { isActive, validUntil } = req.body;
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (validUntil !== undefined) updateData.validUntil = new Date(validUntil);

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/coupons/:id
// Delete a coupon (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
