const { NextResponse } = require('next/server');
const jwt = require('jsonwebtoken');

function withAuth(handler) {
  return async (request, context) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                    request.cookies.get('token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Attach user to request object
      request.user = decoded;
      request.authUser = decoded; // Some routes use authUser

      return handler(request, context);
    } catch (err) {
      console.error('[Auth Middleware Error]', err);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  };
}

function withRoles(allowedRoles, handler) {
  return async (request, context) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                    request.cookies.get('token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ error: 'Access forbidden: insufficient permissions' }, { status: 403 });
      }

      // Attach user to request object
      request.user = decoded;
      request.authUser = decoded;

      return handler(request, context);
    } catch (err) {
      console.error('[Auth Middleware Error]', err);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  };
}

module.exports = { withAuth, withRoles };

