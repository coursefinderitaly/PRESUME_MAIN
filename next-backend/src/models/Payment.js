const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true }, // Stored in INR
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'captured', 'failed'], default: 'created' },
  itemId: { type: String },
  itemName: { type: String },
  failureReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
