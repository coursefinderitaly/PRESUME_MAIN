import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Printer } from 'lucide-react';
import { API_BASE_URL } from '../config';
import './coupon.css';

const BASE_W = 2560;
const BASE_H = 1166;

const URLS = {
  0: 'https://static.codia.ai/s/image_25c262e1-c091-4eb1-a6d8-0027f6c36eca.png',
  2: 'https://static.codia.ai/s/image_5e2d26d9-3102-47ce-998c-e6c03cce5bdc.png',
  3: 'https://static.codia.ai/s/image_6161313d-cd2d-4c62-897b-8c0e33a94eaf.png',
  4: 'https://static.codia.ai/s/image_7f0418c5-d635-470d-9421-d9aee318b3cd.png',
  5: 'https://static.codia.ai/s/image_8574a786-dd2d-453c-bd73-400b27d6cce0.png',
  6: 'https://static.codia.ai/s/image_9b979220-083c-406b-bd65-7bc2967b2f67.png',
  7: 'https://static.codia.ai/s/image_9dd9bf58-4168-443f-a3c3-7a431a55bc1b.png',
  8: 'https://static.codia.ai/s/image_cd28a956-787c-4d68-b8f8-f6c4a8422ed3.png',
  9: 'https://static.codia.ai/s/image_eb25a644-64a3-43b9-8769-9753e8267725.png',
  10: 'https://static.codia.ai/s/image_eb4a3610-3f14-4bcd-821c-cfd274b338bb.png',
  34: 'https://static.codia.ai/s/image_34208cee-eded-44ed-a265-1c6603166dbb.png',
};

function n(id, left, top, width, height, style, children) {
  return (
    <div
      key={id}
      className={`node node-${id}`}
      style={{ left, top, width, height, fontFamily: 'Inter, sans-serif', ...style }}
    >
      {children}
    </div>
  );
}

// Extracted Ticket Component
const CouponTicket = ({ name, destination, voucherCode, date }) => {
  return (
    <div className="ticket-modal-content" style={{ width: '2560px' }}>
      <div id="stage-wrap" style={{ justifyContent: 'flex-start', minHeight: 'auto', background: 'transparent' }}>
        <div id="stageSizer" style={{ width: '2560px', height: '893px' }}>
          <div id="stage" style={{ borderRadius: '60px', overflow: 'hidden' }}>
            {n(1, 0, 0, 194, 1166, { objectFit: 'contain' },
              <img src={URLS[10]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(40, 0, 0, 2560, 2, {},
              <img src={URLS[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
            )}
            {n(2, 196, 1, 2364, 274,
              { background: '#252525', borderRadius: '0px 69px 0px 0px', border: '1px solid #3E3D3E' },
              null
            )}
            {n(38, 765, 13, 400, 233, {},
              <img src={URLS[7]} alt="Presume Overseas logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(39, 1089, 25, 25, 24, {},
              <img src={URLS[3]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(37, 1187, 60, 828, 176,
              { fontSize: '64px', fontWeight: 700, color: '#D2B486', lineHeight: '1.2', whiteSpace: 'pre-line', overflow: 'visible', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
              "PRESUME OVERSEAS\nEducation (opc)Pvt.Ltd."
            )}
            {n(5, 0, 275, 1912, 891, {},
              <img src={URLS[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(3, 1912, 274, 648, 892, {},
              <img src={URLS[4]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            <div className="ambient-glow-1"></div>
            <div className="ambient-glow-2"></div>
            {n(17, 1910, 275, 649, 525,
              { background: '#FAF5EF', border: '1px solid #F0ECE5' },
              null
            )}
            {n(8, 1910, 889, 649, 277, { background: '#FAF5EF' }, null)}
            {n(28, 35, 276, 661, 248, {},
              <img src={URLS[6]} alt="Airplane" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(29, 191, 275, 509, 244, {},
              <img src={URLS[8]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(35, 357, 517, 141, 47,
              { fontSize: '42px', fontWeight: 800, color: '#1a1a1a', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "FROM"
            )}
            {n(34, 894, 520, 72, 50,
              { fontSize: '42px', fontWeight: 800, color: '#1a1a1a', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "TO"
            )}
            {n(33, 355, 559, 210, 75,
              { fontSize: '76px', fontWeight: 800, color: '#5a4220', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "INDIA"
            )}
            {n(32, 892, 558, 250, 76,
              { fontSize: '76px', fontWeight: 800, color: '#5a4220', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              destination
            )}
            {n(27, 691, 577, 67, 35, {},
              <img src={URLS[9]} alt="arrow" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(26, 1751, 348, 84, 359, {},
              <img src={URLS[5]} alt="barcode" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(31, 57, 590, 80, 436,
              {
                fontSize: '56px', fontWeight: 700, color: '#F2EDE3',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              `Validity: ${date}`
            )}
            {n(30, 345, 787, 1335, 113,
              { fontSize: '86px', fontWeight: 800, color: '#5a4220', whiteSpace: 'nowrap', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              `VOUCHER ID : ${voucherCode}`
            )}
            {n(25, 2011, 376, 175, 31,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "PASSENGER"
            )}
            {(() => {
              const len = name ? name.length : 0;
              let fs = '64px';
              if (len > 12 && len <= 16) fs = '52px';
              else if (len > 16 && len <= 20) fs = '42px';
              else if (len > 20 && len <= 26) fs = '34px';
              else if (len > 26) fs = '28px';

              return n(24, 2014, 410, 450, 85,
                { fontSize: fs, fontWeight: 800, color: '#000', whiteSpace: 'nowrap', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', transition: 'font-size 0.2s ease' },
                name
              );
            })()}
            {n(23, 2015, 506, 79, 30,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "GATE"
            )}
            {n(22, 2308, 506, 73, 30,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "SEAT"
            )}
            {n(21, 2032, 542, 100, 70,
              { fontSize: '64px', fontWeight: 800, color: '#000', lineHeight: '1.2', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "17"
            )}
            {n(20, 2311, 542, 120, 70,
              { fontSize: '64px', fontWeight: 800, color: '#000', lineHeight: '1.2', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "17A"
            )}
            {n(19, 2025, 760, 85, 30,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "FROM"
            )}
            {n(18, 2319, 761, 43, 29,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "TO"
            )}
            {n(13, 1910, 801, 649, 87, {},
              <img src={URLS[34]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}
            {n(15, 2027, 822, 180, 56,
              { fontSize: '48px', fontWeight: 800, color: '#FFF', lineHeight: '1.2', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "MUMBAI"
            )}
            {n(14, 2325, 822, 200, 56,
              { fontSize: '48px', fontWeight: 800, color: '#FFF', whiteSpace: 'nowrap', lineHeight: '1.2', overflow: 'visible', display: 'flex', alignItems: 'center' },
              destination
            )}
            {n(11, 2031, 936, 100, 31,
              { fontSize: '38px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '0.1em', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "FLIGHT"
            )}
            {n(10, 2315, 920, 180, 70,
              { fontSize: '64px', fontWeight: 800, color: '#000', lineHeight: '1.2', overflow: 'visible', display: 'flex', alignItems: 'center' },
              "LP317"
            )}
            {n(9, 1910, 990, 650, 50,
              { fontSize: '36px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', whiteSpace: 'nowrap', lineHeight: '1', overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' },
              `VOUCHER ID:${voucherCode}`
            )}
            <div className="ticket-shine-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TICKET ANIMATION — Left → Right (printer slot faces RIGHT)
// ============================================================

export default function CouponPage({ onClose, defaultName = '', defaultEmail = '', onGenerateSuccess }) {
  console.log('Force Vite reload for printer mouth!');
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('ITALY');
  const [discountType, setDiscountType] = useState('50');
  const [animationState, setAnimationState] = useState('idle');
  const [voucherCode, setVoucherCode] = useState('ITA-PE----');
  const [validUntil, setValidUntil] = useState('17-05-26');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ==========================================
  // VOUCHER TWEAK CONTROLS
  // ==========================================
  // Change these values to easily control the generated voucher's size and position!
  const MANUAL_VOUCHER_SCALE_MAX = 0.17; // The maximum size/scale of the voucher
  const MANUAL_VOUCHER_SCALE_MIN = 0.08; // The minimum size for mobile screens
  const MANUAL_VOUCHER_OFFSET_X = 20;    // Move the voucher left/right after it prints
  const MANUAL_VOUCHER_OFFSET_Y = -25;   // Move the voucher up/down
  // ==========================================

  // Responsive Ticket Scale System
  const [scaleFactor, setScaleFactor] = useState(0.22);
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      let newScale = 0.22;

      // Calculate exactly how much space we have to the right of the printer
      if (width >= 900) {
        // card max width is 1440, padding is 80
        const cardWidth = Math.min(width - 80, 1440);
        // left panel = 320, printer = 520, padding = 40. Total = 880.
        // We allow the ticket to overlap the printer by 20% of its width.
        const egress = cardWidth - 880;
        newScale = egress / (2560 * 0.8); // 80% of ticket needs to fit in egress
      } else {
        const egress = width - 80 - 450; // mobile approximation
        newScale = egress / (2560 * 0.8);
      }

      if (newScale > MANUAL_VOUCHER_SCALE_MAX) newScale = MANUAL_VOUCHER_SCALE_MAX;
      if (newScale < MANUAL_VOUCHER_SCALE_MIN) newScale = MANUAL_VOUCHER_SCALE_MIN;

      setScaleFactor(newScale);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TICKET_SCALE_INSIDE = scaleFactor * 0.85;
  const TICKET_SCALE_FINAL = scaleFactor;

  const ticketWidth = 2560 * scaleFactor;
  // Calculate relative X positions dynamically based on scale
  const TICKET_HIDDEN_X = -ticketWidth - 50;
  const TICKET_STAGE1_X = -ticketWidth * 0.7;
  const TICKET_STAGE2_X = -ticketWidth * 0.4;
  const TICKET_STAGE3_X = -ticketWidth * 0.15;
  const TICKET_FINAL_X = MANUAL_VOUCHER_OFFSET_X; // Uses the manual offset X
  const TICKET_FINAL_Y = MANUAL_VOUCHER_OFFSET_Y; // Uses the manual offset Y

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (animationState !== 'idle' || isGenerating) return;

    if (!name.trim()) {
      setErrorMsg('Please enter passenger name to print the ticket.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Please enter a valid email address to receive the coupon.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, destination, email, phone: `${countryCode}${phone}`, discount: discountType })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to generate coupon. Please try again.');
        setIsGenerating(false);
        return;
      }

      setVoucherCode(data.coupon.code);

      const dateObj = new Date(data.coupon.validUntil);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yy = String(dateObj.getFullYear()).slice(-2);
      setValidUntil(`${dd}-${mm}-${yy}`);

      setAnimationState('printing-1');
      setTimeout(() => setAnimationState('printing-2'), 800);
      setTimeout(() => setAnimationState('printing-3'), 1600);
      setTimeout(() => setAnimationState('ejecting'), 2400);
      setTimeout(() => {
        setAnimationState('printed');
        setIsGenerating(false);
        if (onGenerateSuccess) onGenerateSuccess(data.coupon);
      }, 3500);

    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again later.');
      setIsGenerating(false);
    }
  };


  const handleTestPrint = () => {
    if (animationState !== 'idle' || isGenerating) return;

    setErrorMsg('');
    setIsGenerating(true);

    // Set dummy data for testing the UI
    if (!name) setName('TEST PASSENGER');
    setVoucherCode('TST-DUMMY-1234');
    setValidUntil('31-12-25');

    setAnimationState('printing-1');
    setTimeout(() => setAnimationState('printing-2'), 800);
    setTimeout(() => setAnimationState('printing-3'), 1600);
    setTimeout(() => setAnimationState('ejecting'), 2400);
    setTimeout(() => {
      setAnimationState('printed');
      setIsGenerating(false);
    }, 3500);
  };

  const resetMachine = () => {
    setAnimationState('idle');
    setVoucherCode('ITA-PE----');
  };

  // Current X position for the ticket
  const ticketX =
    animationState === 'idle' ? TICKET_HIDDEN_X :
      animationState === 'printing-1' ? TICKET_STAGE1_X :
        animationState === 'printing-2' ? TICKET_STAGE2_X :
          animationState === 'printing-3' ? TICKET_STAGE3_X :
            animationState === 'ejecting' ? TICKET_FINAL_X :
    /* printed */                     TICKET_FINAL_X;

  const ticketScale = scaleFactor;

  const ticketDuration =
    animationState === 'printing-1' ? 0.25 :
      animationState === 'printing-2' ? 0.25 :
        animationState === 'printing-3' ? 0.25 :
          animationState === 'ejecting' ? 0.25 : 0.15; // Fast snappy mechanical feed

  // Tiny Y settle when fully printed
  const ticketY = TICKET_FINAL_Y + (animationState === 'printed' ? 3 : 0);

  return (
    <div className="cute-coupon-overlay">
      <motion.div
        className="cute-voucher-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
      >
        <button className="cute-close-btn" onClick={onClose}><X size={20} strokeWidth={3} /></button>

        <div className="cute-card-layout">
          {/* ── LEFT: Cute Form Panel ── */}
          <div className="cute-form-section">
            <div className="cute-header">
              <div className="cute-icon-badge">✨</div>
              <h2>Generate Voucher</h2>
              <p>Fill in the details to print your special discount ticket.</p>
            </div>

            {errorMsg && (
              <div className="cute-error">
                <span className="error-icon">Oops!</span> {errorMsg}
              </div>
            )}

            <div className="cute-input-grid">
              <div className="c-input-group">
                <label>Passenger Name</label>
                <input
                  type="text"
                  placeholder="e.g. Charlie Brown"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={animationState !== 'idle' || isGenerating}
                />
              </div>

              <div className="c-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={animationState !== 'idle' || isGenerating || !!defaultEmail}
                  style={{ opacity: defaultEmail ? 0.6 : 1 }}
                />
              </div>

              <div className="c-input-row">
                <div className="c-input-group c-country">
                  <label>Code</label>
                  <div className="select-wrapper">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      disabled={animationState !== 'idle' || isGenerating}
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+971">AE (+971)</option>
                    </select>
                  </div>
                </div>
                <div className="c-input-group c-phone">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="000 000 0000"
                    value={phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhone(val);
                    }}
                    disabled={animationState !== 'idle' || isGenerating}
                  />
                </div>
              </div>

              <div className="c-input-group">
                <label>Destination</label>
                <div className="select-wrapper">
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    disabled={animationState !== 'idle' || isGenerating}
                  >
                    <option value="ITALY">🍕 Italy</option>
                    <option value="AUSTRALIA">🦘 Australia</option>
                    <option value="CANADA">🍁 Canada</option>
                    <option value="FRANCE">🥐 France</option>
                    <option value="GERMANY">🥨 Germany</option>
                    <option value="IRELAND">☘️ Ireland</option>
                    <option value="UK">☕ United Kingdom</option>
                    <option value="USA">🗽 United States</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Cute Printer Panel ── */}
          <div className="cute-printer-section">
            <div className="cute-bg-blobs">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
            </div>

            <div className="cute-printer-scene">
              {/* The Cute Printer */}
              <div className={`cute-printer-machine state-${animationState}`}>

                {/* Printer Face/Eyes */}
                <div className="cp-face">
                  <div className="cp-eye left"></div>
                  <div className="cp-blush left"></div>
                  <div className="cp-mouth"></div>
                  <div className="cp-eye right"></div>
                  <div className="cp-blush right"></div>
                </div>

                <div className="cp-status-bubble">
                  <div className="cp-indicator"></div>
                  <span>
                    {animationState === 'idle' ? 'Ready!' :
                      animationState === 'printed' ? 'Yay! Done!' :
                        animationState === 'ejecting' ? 'Here it comes!' : 'Printing...'}
                  </span>
                </div>

                <motion.button
                  className="cp-print-btn"
                  onClick={handleGenerate}
                  disabled={animationState !== 'idle' || isGenerating}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95, rotate: 2 }}
                >
                  <span className="btn-icon">🖨️</span>
                  <span>{animationState === 'idle' ? 'Print Ticket' : 'Working...'}</span>
                </motion.button>

                <div className="cp-slot-cover">
                  {animationState.startsWith('printing') && (
                    <div className="cute-sparkles-container">
                      <div className="c-sparkle sp1">✨</div>
                      <div className="c-sparkle sp2">⭐</div>
                      <div className="c-sparkle sp3">✨</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Discount Toggles Below Printer */}
              <div className="cute-discount-toggles">
                <button
                  className={`cp-discount-btn ${discountType === '50' ? 'active' : ''}`}
                  onClick={() => setDiscountType('50')}
                  disabled={animationState !== 'idle' || isGenerating}
                >
                  🌟 50% Discount
                </button>
                <button
                  className={`cp-discount-btn ${discountType === '30' ? 'active' : ''}`}
                  onClick={() => setDiscountType('30')}
                  disabled={animationState !== 'idle' || isGenerating}
                >
                  ✨ 30% Discount
                </button>
              </div>

              {/* Ticket Egress */}
              <div className="cute-ticket-egress">
                <motion.div
                  className="cute-ticket-wrapper"
                  initial={{ x: TICKET_HIDDEN_X, y: TICKET_FINAL_Y, scale: scaleFactor, opacity: 0 }}
                  animate={{
                    x: ticketX,
                    y: ticketY,
                    scale: ticketScale,
                    opacity: animationState === 'idle' ? 0 : 1,
                  }}
                  transition={{
                    x: animationState.startsWith('printing')
                      ? { type: 'spring', stiffness: 60, damping: 10, mass: 0.5 } // More bouncy
                      : { type: 'spring', stiffness: 50, damping: 16 },
                    y: { duration: 0.5, ease: 'easeOut' },
                    scale: { duration: 0.4 },
                    opacity: { duration: 0.4 },
                  }}
                  whileHover={
                    animationState === 'printed'
                      ? { scale: TICKET_SCALE_FINAL * 1.05, x: TICKET_FINAL_X + 20, y: TICKET_FINAL_Y - 5, rotate: 2, zIndex: 100 }
                      : {}
                  }
                >
                  <div className={animationState.startsWith('printing') ? 'ticket-cute-vibrate' : ''} style={{ width: '100%', height: '100%' }}>
                    <CouponTicket
                      name={name ? name.toUpperCase() : ''}
                      destination={destination.toUpperCase()}
                      voucherCode={voucherCode}
                      date={validUntil}
                    />
                  </div>
                </motion.div>

                {/* Copy Button */}
                <AnimatePresence>
                  {animationState === 'printed' && (
                    <motion.div
                      className="cute-copy-action"
                      initial={{ opacity: 0, y: 20, scale: 0.8, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                      exit={{ opacity: 0, y: 20, scale: 0.8, x: '-50%' }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                      style={{
                        left: `${Math.min(TICKET_FINAL_X + (2560 * scaleFactor) / 2, 400)}px`,
                        bottom: '-45px'
                      }}
                    >
                      <button className="cute-copy-btn" onClick={handleCopy}>
                        {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={3} />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
