// next-backend/src/app/api/admin/users/[id]/toggle-block/route.js
const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../../lib/db');
const User = require('../../../../../../models/User');
const { withRoles } = require('../../../../../../lib/authMiddleware');

export const dynamic = 'force-dynamic';

// POST /api/admin/users/[userId]/toggle-block
export const POST = withRoles(['admin'], async function (request, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user._id.toString() === request.authUser.id.toString()) {
      return NextResponse.json(
        { error: 'System prevents blocking your own administrative account.' },
        { status: 400 }
      );
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return NextResponse.json({
      message: `User account ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: { email: user.email, isBlocked: user.isBlocked },
    });
  } catch (err) {
    console.error('[POST /api/admin/users/:userId/toggle-block]', err);
    return NextResponse.json({ error: 'Server error toggling block status' }, { status: 500 });
  }
});

