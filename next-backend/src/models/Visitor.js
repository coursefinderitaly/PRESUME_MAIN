const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip:         { type: String, default: 'Unknown' },
  country:    { type: String, default: 'Unknown' },
  countryCode:{ type: String, default: '' },
  regionName: { type: String, default: '' },
  city:       { type: String, default: '' },
  isp:        { type: String, default: '' },
  browser:    { type: String, default: 'Unknown' },
  os:         { type: String, default: 'Unknown' },
  device:     { type: String, default: 'Desktop' },  // Desktop | Mobile | Tablet
  page:       { type: String, default: '/' },
  referrer:   { type: String, default: 'Direct' },
  userAgent:  { type: String, default: '' },
}, { timestamps: true });

// TTL index: auto-delete records older than 90 days to keep DB lean
visitorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model('Visitor', visitorSchema);
