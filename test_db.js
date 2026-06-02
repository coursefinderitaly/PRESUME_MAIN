const mongoose = require('mongoose');
const User = require('./next-backend/src/models/User');
const Application = require('./next-backend/src/models/Application');
require('dotenv').config({path: __dirname + '/next-backend/.env'});

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const users = await User.find({ role: 'student' }).select('email appliedUniversities applications');
  console.log("Students Info:");
  users.forEach(u => {
    console.log(`${u.email}: Applied: ${u.appliedUniversities.length}, Formal Apps: ${u.applications.length}`);
  });
  
  const apps = await Application.find();
  console.log("Total Applications in DB:", apps.length);
  process.exit(0);
}).catch(err => {
  console.error("DB Error:", err);
  process.exit(1);
});
