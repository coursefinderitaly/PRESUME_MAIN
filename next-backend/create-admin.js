const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function run() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in the .env file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Using the User model schema as defined in your code
    const UserSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'partner', 'admin', 'counselor', 'freelancer'], default: 'student' }
    }, { timestamps: true });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Generate hashed password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    };

    // Check if user already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('Admin user already exists.');
    } else {
      const admin = new User(adminData);
      await admin.save();
      console.log('Admin user created successfully!');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
