// next-backend/src/app/api/erp/students/[id]/assign/route.js
const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../../lib/db');
const User = require('../../../../../../models/User');
const { withRoles } = require('../../../../../../lib/authMiddleware');

// PUT /api/erp/students/[id]/assign
const PUT = withRoles(['admin', 'partner', 'counselor'], async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { counselorId } = await request.json();

    if (counselorId) {
      const counselor = await User.findOne({ _id: counselorId, role: 'counselor' });
      if (!counselor) {
        return NextResponse.json({ error: 'Counselor not found' }, { status: 404 });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { assignedCounselor: counselorId || null },
      { new: true }
    ).populate('assignedCounselor', 'name email');

    if (!user) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('[PUT /api/erp/students/:id/assign]', err);
    return NextResponse.json({ error: 'Failed to assign counselor' }, { status: 500 });
  }
});

module.exports = { PUT };
