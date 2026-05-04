const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { fname, lname, email, phone, interest, message } = req.body;
    
    if (!fname || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required' });
    }

    const newContact = new Contact({
      fname,
      lname,
      email,
      phone,
      interest,
      message
    });

    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
