const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  try {
    const { contents } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { contents },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('AI Proxy Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to connect to AI service' });
  }
});

module.exports = router;
