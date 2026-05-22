const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Dummy item database - replace with real DB queries later
const itemDatabase = {
  'test_item_1': { name: 'Premium Access Unlock', price_inr: 1 },
  'premium_access': { name: 'Premium Access', price_inr: 999 },
  'application_fee': { name: 'Application Processing Fee', price_inr: 29900 },
};

// 1. Create Order
router.post('/create-order', async (req, res) => {
  try {
    const { itemId, userEmail } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId is required' });

    const item = itemDatabase[itemId];
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: item.price_inr * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ error: 'Failed to create order' });

    await Payment.create({
      userEmail: userEmail || 'unknown',
      razorpayOrderId: order.id,
      amount: item.price_inr,
      currency: 'INR',
      status: 'created',
      itemId: itemId,
      itemName: item.name
    });

    res.json({ success: true, order });
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
router.get('/history', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const payments = await Payment.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// 4. Admin: Get ALL payments across all students
router.get('/admin/all', async (req, res) => {
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
router.post('/admin/toggle-access', async (req, res) => {
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
    if (!signature) return res.status(400).json({ error: 'Missing signature' });

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody || '')
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('[Webhook] Invalid signature');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { event, payload } = req.body;
    console.log(`[Razorpay Webhook] Event: ${event}`);

    if (event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: 'captured', razorpayPaymentId: paymentId },
        { new: true }
      );
      // Also unlock portal via webhook (backup for missed frontend verifications)
      if (payment && payment.userEmail) {
        await User.findOneAndUpdate({ email: payment.userEmail }, { portalUnlocked: true });
      }
    } else if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      const errorDesc = payload.payment.entity.error_description;
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { status: 'failed', failureReason: errorDesc }
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
