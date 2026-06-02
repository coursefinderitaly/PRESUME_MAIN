const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: false },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  interest: { type: String, required: false },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
