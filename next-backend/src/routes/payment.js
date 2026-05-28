const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/rbac');

// Dummy item database - replace with real DB queries later
const itemDatabase = {
  'test_item_1': { name: 'Premium Access Unlock', price_inr: 1 },
  'premium_access': { name: 'Premium Access', price_inr: 999 },
  'application_fee': { name: 'Application Processing Fee', price_inr: 29900 },
  'mbbs_fee': { name: 'MBBS Phase 1 Fee', price_inr: 50000 },
  'bachelors_masters_fee': { name: 'Bachelors/Masters Phase 1 Fee', price_inr: 35000 },
};

const calculateDynamicFee = (countryId, uniType, selectedLevel, applied) => {
    const pricing = {
        'Public': {
            'Bachelors': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [35000, 15000, 50000, 50000] : [5000, 5000, 5000, 5000],
            'Masters': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [35000, 15000, 50000, 50000] : [5000, 5000, 5000, 5000],
            'MBBS': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [50000, 0, 50000, 50000] : [5000, 5000, 5000, 5000]
        },
        'Private': {
            'Bachelors': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [35000, 15000, 50000, 50000] : [5000, 5000, 5000, 5000],
            'Masters': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [35000, 15000, 50000, 50000] : [5000, 5000, 5000, 5000],
            'MBBS': (countryId === 'germany') ? [30000, 15000, 40000, 35000] : (countryId === 'italy') ? [50000, 0, 50000, 50000] : [5000, 5000, 5000, 5000]
        }
    };
    const currentPhases = (pricing[uniType] && pricing[uniType][selectedLevel]) ? pricing[uniType][selectedLevel] : [5000, 5000, 5000, 5000];
    return applied ? currentPhases[0] * 0.5 : currentPhases[0];
};

// 1. Create Order
router.post('/create-order', async (req, res) => {
  try {
    const { itemId, userEmail, pricingParams } = req.body;
    let finalAmount = 0;
    let finalItemName = 'Custom Payment';

    if (itemId === 'dynamic_fee' && pricingParams) {
      finalAmount = calculateDynamicFee(pricingParams.countryId, pricingParams.uniType, pricingParams.selectedLevel, pricingParams.applied);
      finalItemName = `Phase 1 Fee - ${pricingParams.selectedLevel}`;
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
      userEmail: userEmail || 'unknown',
      razorpayOrderId: order.id,
      amount: finalAmount,
      currency: 'INR',
      status: 'created',
      itemId: itemId || 'custom',
      itemName: finalItemName
    });

    res.json({ success: true, order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error during order creation' });
  }
});

// 2. Verify Payment + Auto-unlock user portal
router.post('/verify-payment', async (req, res) => {
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

    if (expectedSignature === razorpay_signature) {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'captured', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );

      // Auto-unlock the user's portal
      if (payment && payment.userEmail) {
        await User.findOneAndUpdate(
          { email: payment.userEmail },
          { portalUnlocked: true }
        );
        console.log(`[Payment] Portal unlocked for: ${payment.userEmail}`);
      }

      return res.json({ success: true, message: 'Payment verified and portal unlocked' });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed', failureReason: 'Invalid signature' }
      );
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
      // Also unlock portal via webhook (backup for missed frontend verifications)
      if (payment && payment.userEmail) {
        await User.findOneAndUpdate({ email: payment.userEmail }, { portalUnlocked: true });
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
router.post('/update-status', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, status, failureReason } = req.body;
    if (!razorpayOrderId || !status) {
      return res.status(400).json({ error: 'razorpayOrderId and status are required' });
    }

    if (status === 'captured') {
      return res.status(403).json({ error: 'Forbidden. Captures must be verified with signature.' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status, razorpayPaymentId, failureReason },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // If status is captured, we unlock the user's portal
    if (status === 'captured' && payment.userEmail) {
      await User.findOneAndUpdate(
        { email: payment.userEmail },
        { portalUnlocked: true }
      );
      console.log(`[Payment Update] Portal unlocked for: ${payment.userEmail}`);
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error during status update' });
  }
});

module.exports = router;
