const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  consultancyType: { type: String, required: true },
  subOption: { type: String, required: true },
  date: { type: String, required: true }, // Storing as string from frontend
  time: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
