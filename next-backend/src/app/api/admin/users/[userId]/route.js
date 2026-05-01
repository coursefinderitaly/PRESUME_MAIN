// next-backend/src/app/api/admin/users/[id]/route.js
const { NextResponse } = require('next/server');
const bcrypt = require('bcrypt');
const dbConnect = require('../../../../../lib/db');
const User = require('../../../../../models/User');
const { withRoles } = require('../../../../../lib/authMiddleware');

// PUT /api/admin/users/[id]
const PUT = withRoles(['admin'], async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = { ...(await request.json()) };

    if (updates.assignedCounselor === '') updates.assignedCounselor = null;
    if (updates.createdByCounselor === '') updates.createdByCounselor = null;
    if (updates.registeredBy === '') updates.registeredBy = null;

    if (updates.password && updates.password.trim() !== '') {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('[PUT /api/admin/users/:id]', err);
    return NextResponse.json({ error: 'Server error updating user' }, { status: 500 });
  }
});

// DELETE /api/admin/users/[id]
const DELETE = withRoles(['admin'], async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('[DELETE /api/admin/users/:id]', err);
    return NextResponse.json({ error: 'Server error deleting user' }, { status: 500 });
  }
});

module.exports = { PUT, DELETE };
