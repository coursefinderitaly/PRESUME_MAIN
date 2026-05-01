// next-backend/src/app/api/admin/users/[studentId]/applications/[appId]/route.js
const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../../../lib/db');
const User = require('../../../../../../../models/User');
const { withRoles } = require('../../../../../../../lib/authMiddleware');

// DELETE /api/admin/users/[studentId]/applications/[appId]
const DELETE = withRoles(['admin'], async function (request, { params }) {
  try {
    await dbConnect();
    const { studentId, appId } = await params;

    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    student.appliedUniversities = student.appliedUniversities.filter(
      (app) => String(app.id) !== appId
    );

    try {
      const Application = require('../../../../../../../models/Application');
      if (Application) {
        await Application.deleteMany({ studentId });
      }
    } catch (_) {
      // Ignore if Application model not present
    }

    await student.save();
    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('[DELETE /api/admin/users/:studentId/applications/:appId]', err);
    return NextResponse.json({ error: 'Server error deleting application' }, { status: 500 });
  }
});

module.exports = { DELETE };
