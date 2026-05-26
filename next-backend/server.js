process.on('uncaughtException', (err) => {
  console.error('CRASH ERROR (Exception):', err.message);
  console.error(err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('CRASH ERROR (Rejection):', err);
  process.exit(1);
});

// Programmatic dependencies auto-installer for Hostinger
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function installIfNeeded() {
  const essentialDeps = ['dotenv', 'razorpay', 'express', 'mongoose', 'cors', 'helmet', 'cookie-parser', 'express-rate-limit'];
  let needsInstall = false;
  
  for (const dep of essentialDeps) {
    try {
      require.resolve(dep);
    } catch (e) {
      console.log(`Dependency "${dep}" is missing.`);
      needsInstall = true;
      break;
    }
  }

  if (needsInstall) {
    console.log('--- STARTING PROGRAMMATIC NPM INSTALL ON HOSTINGER ---');
    const backendDir = __dirname;
    const nodeBin = process.argv[0];
    const nodeDir = path.dirname(nodeBin);

    // Inject node binary dir into PATH so postinstall scripts (e.g. @firebase/util)
    // that call bare `node` can find it on Hostinger where it's not globally available.
    const envWithNode = {
      ...process.env,
      PATH: `${nodeDir}:${process.env.PATH || ''}`,
    };
    
    const npmPaths = [
      'npm',
      path.join(nodeDir, 'npm'),
      path.join(nodeDir, 'npm.cmd'),
      path.join(nodeDir, '../lib/node_modules/npm/bin/npm-cli.js'),
      path.join(nodeDir, 'node_modules/npm/bin/npm-cli.js')
    ];

    let success = false;
    for (const npmPath of npmPaths) {
      try {
        let command;
        if (npmPath.endsWith('.js')) {
          command = `"${nodeBin}" "${npmPath}" install --production --no-audit --no-fund`;
        } else {
          command = `"${npmPath}" install --production --no-audit --no-fund`;
        }
        console.log(`Running install command: ${command} in ${backendDir}`);
        execSync(command, { cwd: backendDir, stdio: 'inherit', env: envWithNode });
        success = true;
        console.log('--- NPM INSTALL COMPLETED SUCCESSFULLY ---');
        break;
      } catch (err) {
        console.log(`Failed installing with "${npmPath}":`, err.message);
      }
    }

    if (!success) {
      console.error('CRITICAL: Programmatic npm install failed. Please install dependencies manually.');
    } else {
      console.log('--- DEPENDENCIES PREPARED, CONTINUING BOOTSTRAP ---');
    }
  }
}

try {
  installIfNeeded();
} catch (e) {
  console.error('Error during auto-installation helper:', e);
}


require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 0;

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

app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cookieParser());

// Custom CSRF Protection
app.use((req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  // Exempt public visitor tracking endpoint from CSRF (no user session)
  if (req.path === '/api/visitors' && req.method === 'POST') return next();
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
const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || '';
mongoose.connect(dbUri, { 
  serverSelectionTimeoutMS: 5000,
  family: 4
}).then(async () => {
  console.log('Connected to database');
  
  // Auto-seed Admin
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment.');
    } else {
      const User = require('./src/models/User');
      const existing = await User.findOne({ email: adminEmail });
      
      if (!existing) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        
        await User.create({
          firstName: 'System',
          lastName: 'Admin',
          phone: '0000000000',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        console.log('--- SYSTEM ADMIN INITIALIZED ---');
      }
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
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/payment', require('./src/routes/payment'));
app.use('/api/visitors', require('./src/routes/visitors'));

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
