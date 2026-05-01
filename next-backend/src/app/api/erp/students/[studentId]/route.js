// next-backend/src/app/api/erp/students/[id]/route.js
const { NextResponse } = require('next/server');
const dbConnect = require('../../../../../lib/db');
const User = require('../../../../../models/User');
const Application = require('../../../../../models/Application');
const { withAuth, withRoles } = require('../../../../../lib/authMiddleware');

const ALLOWED_STUDENT_FIELDS = [
  'firstName', 'middleName', 'lastName', 'email', 'phone', 'dob', 'gender',
  'country', 'state', 'city', 'offerStatus', 'studentStatus',
  'mailingAddress1', 'mailingAddress2', 'mailingCountry', 'mailingState', 'mailingCity', 'mailingPincode',
  'isPermanentSameAsMailing', 'permanentAddress1', 'permanentAddress2', 'permanentCountry', 'permanentState', 'permanentCity', 'permanentPincode',
  'passportNo', 'issueDate', 'expiryDate', 'issueCountry', 'issueState', 'issueCity',
  'nationality', 'citizenship', 'multiCitizen', 'livingInOtherCountry', 'otherNationality', 'otherLivingCountry',
  'altContactName', 'altContactPhone', 'altContactEmail', 'altContactRelation',
  'countryOfEducation', 'highestLevelOfEducation', 'educationHistory', 'workExperience', 'appliedUniversities', 'savedUniversitiesCart',
];

// PUT /api/erp/students/[id]
const PUT = withAuth(async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await request.json();

    const student = await User.findById(id);
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Role-based authorization: a student can only edit their own record
    if (
      request.authUser.role === 'student' &&
      request.authUser.id !== id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized access: You can only edit your own profile.' },
        { status: 403 }
      );
    }

    // Check email uniqueness if changing
    if (updates.email && updates.email !== student.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    ALLOWED_STUDENT_FIELDS.forEach((field) => {
      if (updates[field] !== undefined) {
        student[field] = updates[field];
      }
    });

    await student.save();
    return NextResponse.json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error('[PUT /api/erp/students/:id]', err);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
});

// DELETE /api/erp/students/[id]
const DELETE = withRoles(['admin', 'partner'], async function (request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const student = await User.findOneAndDelete({ _id: id, role: 'student' });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    await Application.deleteMany({ _id: { $in: student.applications } });

    return NextResponse.json({ message: 'Student removed successfully' });
  } catch (err) {
    console.error('[DELETE /api/erp/students/:id]', err);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
});

module.exports = { PUT, DELETE };
