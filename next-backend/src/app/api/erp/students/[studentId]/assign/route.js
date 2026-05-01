const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../../lib/db');
const User = require('../../../../../../models/User');
const { withRoles } = require('../../../../../../lib/authMiddleware');

export const dynamic = 'force-dynamic';

// PUT /api/erp/students/[studentId]/assign
export const PUT = withRoles(['admin', 'partner', 'counselor'], async function (request, { params }) {
  try {
    await dbConnect();
    const { studentId } = await params;
    const { counselorId } = await request.json();

    const student = await User.findByIdAndUpdate(
      studentId,
      { assignedCounselor: counselorId || null },
      { new: true }
    ).populate('assignedCounselor', 'firstName lastName email');

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (err) {
    console.error('[PUT /api/erp/students/:studentId/assign]', err);
    return NextResponse.json({ error: 'Failed to assign counselor' }, { status: 500 });
  }
});
