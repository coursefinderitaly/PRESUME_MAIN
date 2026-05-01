/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─── CORS / Security Headers ────────────────────────────────────────────────
  async headers() {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'https://coursefinderitaly.com',
      'https://www.coursefinderitaly.com',
      'https://coursefinder2-0.onrender.com',
    ].join(',');

    return [
      {
        // Apply to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Tightened per-route via middleware
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-auth-token, Authorization, x-csrf-protected',
          },
          // Security headers (mirrors helmet defaults)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // ─── File Upload Body Size ──────────────────────────────────────────────────
  // Increase the default 4MB body parser limit for the email-zip route.
  // This is handled per-route via `export const maxDuration` but setting a
  // global body size limit here helps avoid early rejections.
  experimental: {
    serverActions: {
      bodySizeLimit: '52mb',
    },
  },
};

module.exports = nextConfig;
