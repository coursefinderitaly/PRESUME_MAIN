const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/rbac');

// ── Helper: parse User-Agent string into browser / OS / device ──────────────
function parseUA(ua = '') {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // Browser detection (order matters — check specific before generic)
  if (/Edg\//i.test(ua))            browser = 'Microsoft Edge';
  else if (/OPR\//i.test(ua))       browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Browser';
  else if (/Chrome/i.test(ua))      browser = 'Chrome';
  else if (/Safari/i.test(ua))      browser = 'Safari';
  else if (/Firefox/i.test(ua))     browser = 'Firefox';
  else if (/MSIE|Trident/i.test(ua)) browser = 'Internet Explorer';

  // OS detection
  if (/Windows NT 10/i.test(ua))    os = 'Windows 10/11';
  else if (/Windows NT/i.test(ua))  os = 'Windows';
  else if (/Android/i.test(ua))     os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac OS X/i.test(ua))    os = 'macOS';
  else if (/Linux/i.test(ua))       os = 'Linux';
  else if (/CrOS/i.test(ua))        os = 'Chrome OS';

  // Device detection
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) device = 'Mobile';
  else if (/iPad|Tablet/i.test(ua))         device = 'Tablet';

  return { browser, os, device };
}

// ── Helper: resolve geolocation from IP using ip-api.com (free, no key) ─────
async function getGeo(ip) {
  // Skip for private / loopback IPs
  if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::ffff:127.0.0.1') {
    return { country: 'Local Network', countryCode: 'LN', regionName: '', city: '', isp: '' };
  }

  try {
    const cleanIp = ip.replace(/^::ffff:/, ''); // strip IPv4-mapped prefix
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,countryCode,regionName,city,isp`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.status === 'success') {
      return {
        country:     data.country     || 'Unknown',
        countryCode: data.countryCode || '',
        regionName:  data.regionName  || '',
        city:        data.city        || '',
        isp:         data.isp         || '',
      };
    }
  } catch (_) { /* geo lookup failed silently */ }

  return { country: 'Unknown', countryCode: '', regionName: '', city: '', isp: '' };
}

// ── POST /api/visitors — log a new visit (public, called from frontend) ──────
router.post('/', async (req, res) => {
  try {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      'Unknown';

    const ua       = req.headers['user-agent'] || '';
    const page     = (req.body.page     || '/').slice(0, 200);
    const referrer = (req.body.referrer || 'Direct').slice(0, 500);

    const { browser, os, device } = parseUA(ua);
    const geo = await getGeo(ip);

    await Visitor.create({
      ip: ip.replace(/^::ffff:/, ''),
      ...geo,
      browser,
      os,
      device,
      page,
      referrer,
      userAgent: ua.slice(0, 500),
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[visitors POST]', err.message);
    res.status(500).json({ error: 'Failed to log visit' });
  }
});

// ── GET /api/visitors — fetch visitor list + stats (admin only) ──────────────
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);

    const now   = new Date();
    const dayAgo   = new Date(now - 24 * 60 * 60 * 1000);
    const weekAgo  = new Date(now - 7  * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [visitors, total, todayCount, weekCount, monthCount] = await Promise.all([
      Visitor.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Visitor.countDocuments(),
      Visitor.countDocuments({ createdAt: { $gte: dayAgo } }),
      Visitor.countDocuments({ createdAt: { $gte: weekAgo } }),
      Visitor.countDocuments({ createdAt: { $gte: monthAgo } }),
    ]);

    res.json({ visitors, total, todayCount, weekCount, monthCount });
  } catch (err) {
    console.error('[visitors GET]', err.message);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// ── DELETE /api/visitors/clear — wipe all logs (admin only) ─────────────────
router.delete('/clear', auth, checkRole(['admin']), async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ ok: true, message: 'All visitor logs cleared' });
  } catch (err) {
    console.error('[visitors DELETE]', err.message);
    res.status(500).json({ error: 'Failed to clear visitor logs' });
  }
});

module.exports = router;
