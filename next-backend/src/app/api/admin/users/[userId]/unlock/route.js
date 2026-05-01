// next-backend/src/app/api/admin/users/[id]/unlock/route.js
const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../../lib/db');
const User = require('../../../../../../models/User');
const { withRoles } = require('../../../../../../lib/authMiddleware');

// POST /api/admin/users/[id]/unlock
const POST = withRoles(['admin'], async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    return NextResponse.json({
      message: 'User account unlocked successfully',
      user: { email: user.email, loginAttempts: 0 },
    });
  } catch (err) {
    console.error('[POST /api/admin/users/:id/unlock]', err);
    return NextResponse.json({ error: 'Server error unlocking user' }, { status: 500 });
  }
});

module.exports = { POST };
