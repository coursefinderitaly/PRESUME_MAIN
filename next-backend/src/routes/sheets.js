const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../middleware/auth');

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const multer = require('multer');

// Configure multer to save directly to the desired path with the correct name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../'));
  },
  filename: function (req, file, cb) {
    cb(null, 'courses.xlsx');
  }
});
const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../courses.xlsx');
    
    // Check if file exists to prevent hard crashes
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "courses.xlsx file not found on server" });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    res.json(sheetData);
  } catch (error) {
    console.error("Error reading local Excel file:", error.message);
    res.status(500).json({ error: "Failed to parse local courses data" });
  }
});

// Endpoint to download the current excel file
router.get('/download', auth, (req, res) => {
  const filePath = path.join(__dirname, '../../courses.xlsx');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "courses.xlsx file not found on server" });
  }
  res.download(filePath, 'courses.xlsx');
});

// Endpoint to upload and replace the excel file
router.post('/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Check if it's a valid excel file
    const filePath = req.file.path;
    try {
      const workbook = xlsx.readFile(filePath);
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("Invalid excel structure");
      }
    } catch (err) {
      // If it's not a valid excel file, delete it
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Invalid Excel file format" });
    }

    res.json({ message: "File uploaded and updated successfully." });
  } catch (error) {
    console.error("Error uploading excel file:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
