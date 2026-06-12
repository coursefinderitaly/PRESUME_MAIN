const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/rbac');
const rateLimit = require('express-rate-limit');

// Rate limiters for payment actions
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many payment requests from this IP, please try again later.' }
});

const { COUPONS } = require('../config/coupons');
const { getPhases } = require('../config/feesHelper');

// Dummy item database - replace with real DB queries later
const itemDatabase = {
  'application_fee': { name: 'Application Processing Fee', price_inr: 29900 },
  'mbbs_fee': { name: 'MBBS Phase 1 Fee', price_inr: 50000 },
  'bachelors_masters_fee': { name: 'Bachelors/Masters Phase 1 Fee', price_inr: 35000 },
};

const calculateDynamicFee = (countryId, uniType, selectedLevel, applied, couponCode) => {
    const activeCouponName = (applied && couponCode) ? couponCode.toUpperCase() : '';
    const currentPhases = getPhases(countryId, uniType || 'Public', selectedLevel, activeCouponName);
    const phase1Fee = currentPhases[0];

    if (['italy', 'germany', 'russia', 'georgia'].includes(countryId.toLowerCase())) {
        return Math.round(phase1Fee * 1.18);
    }
    return phase1Fee;
};

// 1. Create Order
router.post('/create-order', auth, paymentLimiter, async (req, res) => {
  try {
    const { itemId, pricingParams } = req.body;
    let finalAmount = 0;
    let finalItemName = 'Custom Payment';

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userEmail = user.email;

    if (itemId === 'dynamic_fee' && pricingParams) {
      finalAmount = calculateDynamicFee(
        pricingParams.countryId,
        pricingParams.uniType,
        pricingParams.selectedLevel,
        pricingParams.applied,
        pricingParams.couponCode
      );
      finalItemName = `Phase 1 Fee - ${pricingParams.countryId.toUpperCase()} - ${pricingParams.selectedLevel}`;
    } else if (itemId === 'phase_payment' && pricingParams) {
      let level = user.highestLevelOfEducation;
      if (!['Bachelors', 'Masters', 'MBBS'].includes(level)) {
        level = 'Bachelors';
      }
      const countryId = pricingParams.countryName || user.country || 'italy';
      
      const Coupon = require('../models/Coupon');
      const activeCoupon = await Coupon.findOne({
        userEmail: user.email.toLowerCase(),
        isActive: true,
        validUntil: { $gt: new Date() }
      });
      const couponCode = activeCoupon ? activeCoupon.code : '';
      
      const phases = getPhases(countryId, 'Public', level, couponCode);
      const phaseIndex = parseInt(pricingParams.phaseNumber, 10) - 1;
      
      let baseFee = 0;
      if (phases && phaseIndex >= 0 && phaseIndex < phases.length) {
          baseFee = phases[phaseIndex];
      } else {
          return res.status(400).json({ error: 'Invalid phase number' });
      }

      if (['italy', 'germany', 'russia', 'georgia'].includes(countryId.toLowerCase())) {
          finalAmount = Math.round(baseFee * 1.18);
      } else {
          finalAmount = baseFee;
      }
      
      finalItemName = `${pricingParams.countryName ? pricingParams.countryName.toUpperCase() : 'Study Abroad'} - Phase ${pricingParams.phaseNumber} Payment`;
    } else if (itemId && itemDatabase[itemId]) {
      finalAmount = itemDatabase[itemId].price_inr;
      finalItemName = itemDatabase[itemId].name;
    } else {
      return res.status(400).json({ error: 'Invalid or missing itemId' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: finalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ error: 'Failed to create order' });

    await Payment.create({
      userEmail: userEmail,
      razorpayOrderId: order.id,
      amount: finalAmount,
      currency: 'INR',
      status: 'created',
      itemId: itemId || 'custom',
      itemName: finalItemName,
      pricingParams: pricingParams ? JSON.stringify(pricingParams) : null
    });

    res.json({ success: true, order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error during order creation' });
  }
});

// 2. Verify Payment + Auto-unlock user portal
router.post('/verify-payment', auth, paymentLimiter, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing verification parameters' });
    }

    const bodyText = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(bodyText)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const signatureBuffer = Buffer.from(razorpay_signature, 'hex');

    if (expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'captured', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      // Auto-unlock the user's portal ONLY for valid initial subscriptions
      if (payment && payment.userEmail) {
        const validUnlockItems = ['dynamic_fee', 'application_fee', 'mbbs_fee', 'bachelors_masters_fee'];
        if (validUnlockItems.includes(payment.itemId)) {
          await User.findOneAndUpdate(
            { email: payment.userEmail },
            { portalUnlocked: true }
          );
          console.log(`[Payment] Portal unlocked for: ${payment.userEmail}`);
        }
      }

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Do NOT mutate the payment record to 'failed' here. 
      // An attacker could perform a DOS attack by pinging valid order IDs with invalid signatures.
      console.warn(`[Payment] Invalid signature attempt for order: ${razorpay_order_id}`);
      return res.status(400).json({ error: 'Invalid payment signature.' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error during verification' });
  }
});

// 3. Fetch Payment History by email
router.get('/history', auth, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    // Prevent IDOR: Ensure the requested email matches the logged-in user's email (unless admin)
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.email !== email) {
        return res.status(403).json({ error: 'Unauthorized to view this history' });
    }

    const payments = await Payment.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// 4. Admin: Get ALL payments across all students
router.get('/admin/all', auth, checkRole(['admin']), async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    // Enrich with user portal status
    const enriched = await Promise.all(payments.map(async (p) => {
      const user = await User.findOne({ email: p.userEmail }).select('firstName lastName portalUnlocked');
      return {
        ...p.toObject(),
        userName: user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Unknown',
        portalUnlocked: user ? user.portalUnlocked : false
      };
    }));

    res.json({ success: true, payments: enriched });
  } catch (error) {
    console.error('Admin payments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch all payments' });
  }
});

// 5. Admin: Toggle portal access for a student
router.post('/admin/toggle-access', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { email, unlock } = req.body;
    if (!email || typeof unlock !== 'boolean') {
      return res.status(400).json({ error: 'email and unlock (boolean) are required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { portalUnlocked: unlock },
      { new: true }
    ).select('firstName lastName email portalUnlocked');

    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log(`[Admin] Portal ${unlock ? 'UNLOCKED' : 'LOCKED'} for: ${email}`);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Toggle access error:', error);
    res.status(500).json({ error: 'Failed to toggle portal access' });
  }
});

// 6. Webhook (called by Razorpay servers)
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(500).json({ error: 'Webhook secret not configured' });

    const signature = req.headers['x-razorpay-signature'];
    const razorpayEventId = req.headers['x-razorpay-event-id'];
    if (!signature) return res.status(400).json({ error: 'Missing signature' });

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody || '')
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      console.warn('[Webhook] Invalid signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    if (razorpayEventId) {
      const existingEvent = await Payment.findOne({ webhookEventsProcessed: razorpayEventId });
      if (existingEvent) {
        return res.status(200).json({ success: true, message: 'Event already processed' });
      }
    }

    const { event, payload } = req.body;
    console.log(`[Razorpay Webhook] Event: ${event}`);

    if (event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;
      const updateData = { status: 'captured', razorpayPaymentId: paymentId };
      if (razorpayEventId) updateData.$push = { webhookEventsProcessed: razorpayEventId };

      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        updateData,
        { new: true }
      );
      // Also unlock portal via webhook ONLY for valid initial subscriptions (backup for missed frontend verifications)
      if (payment && payment.userEmail) {
        const validUnlockItems = ['dynamic_fee', 'application_fee', 'mbbs_fee', 'bachelors_masters_fee'];
        if (validUnlockItems.includes(payment.itemId)) {
          await User.findOneAndUpdate({ email: payment.userEmail }, { portalUnlocked: true });
        }
      }
    } else if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      const errorDesc = payload.payment.entity.error_description;
      const updateData = { status: 'failed', failureReason: errorDesc };
      if (razorpayEventId) updateData.$push = { webhookEventsProcessed: razorpayEventId };

      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        updateData
      );
    } else {
      console.log(`[Razorpay Webhook] Acknowledged: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 7. Update simulated or real payment status (success or failure)
router.post('/update-status', auth, paymentLimiter, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, status, failureReason } = req.body;
    if (!razorpayOrderId || !status) {
      return res.status(400).json({ error: 'razorpayOrderId and status are required' });
    }

    // Only allow updating to 'failed' or 'cancelled' from the client.
    // 'captured' MUST be processed securely via webhook or signature verification.
    if (status !== 'failed' && status !== 'cancelled') {
      return res.status(403).json({ error: 'Forbidden. Status can only be updated to failed or cancelled from the client.' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status, razorpayPaymentId, failureReason },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Portal unlocking is strictly handled by /verify-payment or webhook.

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error during status update' });
  }
});

module.exports = router;
