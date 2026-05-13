const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// 1. CREATE APPOINTMENT (Public)
router.post('/book', async (req, res) => {
  try {
    const { fullname, email, phone, country, consultancyType, subOption, date, time } = req.body;
    
    if (!fullname || !email || !phone || !consultancyType || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      fullname, email, phone, country, consultancyType, subOption, date, time
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error booking appointment" });
  }
});

// 2. GET ALL APPOINTMENTS (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status, consultancyType, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (consultancyType) query.consultancyType = consultancyType;
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching appointments" });
  }
});

// 3. UPDATE APPOINTMENT STATUS (Admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body;
    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating appointment" });
  }
});

// 4. DELETE APPOINTMENT (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting appointment" });
  }
});

module.exports = router;
