const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render/Cloud platforms
app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176',
  'https://coursefinderitaly.com', 'https://www.coursefinderitaly.com',
  'https://coursefinder2-0.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('coursefinderitaly.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback: allow all for now to fix Hostinger login loop
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-protected', 'x-auth-token']
}));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: [
        "'self'",
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176',
        "https://script.google.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Custom CSRF Protection
app.use((req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (mutatingMethods.includes(req.method)) {
    if (req.headers['x-csrf-protected'] !== '1') {
      return res.status(403).json({ error: 'CSRF Violation: Protected header missing' });
    }
  }
  next();
});

// NoSQL Injection Prevention
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (obj[key] && typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
});

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests from this IP, please try again later' }
});
app.use('/api/auth/login', authLimiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || '', { 
  serverSelectionTimeoutMS: 5000,
  family: 4
}).then(async () => {
  console.log('Connected to database');
  
  // Auto-seed Admin
  try {
    const User = require('./src/models/User');
    const bcrypt = require('bcrypt');
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        phone: '0000000000',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('--- SYSTEM ADMIN CREATED ---');
    }
  } catch (err) {
    console.log('Admin seeding skipped:', err.message);
  }
}).catch(err => {
  console.error('Database connection error:', err);
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/erp', require('./src/routes/erp'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/send-student-docs', require('./src/routes/studentDocs'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/sheets', require('./src/routes/sheets'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/ai', require('./src/routes/ai'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'up', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Serve static React Frontend
app.use(express.static(path.join(__dirname, '../dist')));

// SPA Catch-all
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
