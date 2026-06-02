import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Pointer, Printer } from 'lucide-react';
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
  const wrapRef = useRef(null);
  const sizerRef = useRef(null);

  useEffect(() => {
    function updateScale() {
      if (!wrapRef.current || !sizerRef.current) return;
      // Make the ticket smaller, max 800px or 90% of screen
      const maxWidth = Math.min(window.innerWidth * 0.9, 800);
      const scale = maxWidth / BASE_W;
      const scaledW = Math.ceil(BASE_W * scale);
      const scaledH = Math.ceil(BASE_H * scale);
      sizerRef.current.style.width = scaledW + 'px';
      sizerRef.current.style.height = scaledH + 'px';
      if (sizerRef.current.firstChild) {
        sizerRef.current.firstChild.style.transform = `scale(${scale})`;
      }
    }
    updateScale();
    // Re-run when it might be shown
    setTimeout(updateScale, 50);
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="ticket-modal-content">
      <div id="stage-wrap" ref={wrapRef} style={{ justifyContent: 'center', minHeight: 'auto', background: 'transparent' }}>
        <div id="stageSizer" ref={sizerRef}>
          <div id="stage" style={{ clipPath: 'inset(15px round 60px)' }}>
            {/* Node 1 - left gold bar */}
            {n(1, 0, 0, 194, 1166,
              { objectFit: 'contain' },
              <img src={URLS[10]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 40 - thin top line */}
            {n(40, 0, 0, 2560, 2,
              {},
              <img src={URLS[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
            )}

            {/* Node 2 - dark header box */}
            {n(2, 196, 1, 2364, 274,
              { background: '#252525', borderRadius: '0px 69px 0px 0px', border: '1px solid #3E3D3E' },
              null
            )}

            {/* Node 38 - company logo */}
            {n(38, 765, 13, 400, 233,
              {},
              <img src={URLS[7]} alt="Presume Overseas logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 39 - registered mark */}
            {n(39, 1089, 25, 25, 24,
              {},
              <img src={URLS[3]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 37 - company name text */}
            {n(37, 1187, 60, 828, 176,
              { fontSize: '64px', fontWeight: 700, color: '#D2B486', lineHeight: '1.2', whiteSpace: 'pre-line' },
              "PRESUME OVERSEAS\nEducation (opc)Pvt.Ltd."
            )}

            {/* Node 5 - main cream card background */}
            {n(5, 0, 275, 1912, 891,
              {},
              <img src={URLS[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 3 - right section background */}
            {n(3, 1912, 274, 648, 892,
              {},
              <img src={URLS[4]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Ambient background glows */}
            <div className="ambient-glow-1"></div>
            <div className="ambient-glow-2"></div>

            {/* Node 17 - right top white panel */}
            {n(17, 1910, 275, 649, 525,
              { background: '#FAF5EF', border: '1px solid #F0ECE5' },
              null
            )}

            {/* Node 8 - right bottom white panel */}
            {n(8, 1910, 889, 649, 277,
              { background: '#FAF5EF' },
              null
            )}

            {/* Node 28 - airplane image */}
            {n(28, 35, 276, 661, 248,
              {},
              <img src={URLS[6]} alt="Airplane" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 29 - FROM label area */}
            {n(29, 191, 275, 509, 244,
              {},
              <img src={URLS[8]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 35 - FROM text */}
            {n(35, 357, 517, 141, 47,
              { fontSize: '32px', fontWeight: 700, color: '#383634' },
              "FROM"
            )}

            {/* Node 34 - TO text */}
            {n(34, 894, 520, 72, 50,
              { fontSize: '36px', fontWeight: 700, color: '#373635' },
              "TO"
            )}

            {/* Node 33 - INDIA text */}
            {n(33, 355, 559, 210, 75,
              { fontSize: '56px', fontWeight: 700, color: '#8A6E45' },
              "INDIA"
            )}

            {/* Node 32 - DYNAMIC DESTINATION text */}
            {n(32, 892, 558, 250, 76,
              { fontSize: '56px', fontWeight: 700, color: '#8A6E45' },
              destination
            )}

            {/* Node 27 - arrow icon */}
            {n(27, 691, 577, 67, 35,
              {},
              <img src={URLS[9]} alt="arrow" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 26 - barcode */}
            {n(26, 1751, 348, 84, 359,
              {},
              <img src={URLS[5]} alt="barcode" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* Node 31 - validity rotated text */}
            {n(31, 115, 672, 100, 436,
              {
                fontSize: '64px', fontWeight: 700, color: '#F2EDE3',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                lineHeight: 'normal',
              },
              `Validity: ${date}`
            )}

            {/* Node 30 - VOUCHER ID large text */}
            {n(30, 345, 787, 1335, 113,
              { fontSize: '64px', fontWeight: 700, color: '#8A6E45', whiteSpace: 'nowrap' },
              `VOUCHER ID : ${voucherCode}`
            )}

            {/* Right panel - PASSENGER */}
            {n(25, 2011, 376, 175, 31,
              { fontSize: '24px', fontWeight: 700, color: '#666', letterSpacing: '0.05em', lineHeight: 'normal' },
              "PASSENGER"
            )}

            {/* DYNAMIC PASSENGER NAME */}
            {n(24, 2014, 415, 450, 49,
              { fontSize: '48px', fontWeight: 800, color: '#111', whiteSpace: 'nowrap', lineHeight: 'normal', overflow: 'visible' },
              name
            )}

            {/* GATE */}
            {n(23, 2015, 506, 79, 30,
              { fontSize: '24px', fontWeight: 700, color: '#666', letterSpacing: '0.05em', lineHeight: 'normal' },
              "GATE"
            )}

            {/* SEAT */}
            {n(22, 2308, 506, 73, 30,
              { fontSize: '24px', fontWeight: 700, color: '#666', letterSpacing: '0.05em', lineHeight: 'normal' },
              "SEAT"
            )}

            {/* Gate number */}
            {n(21, 2032, 542, 42, 44,
              { fontSize: '42px', fontWeight: 800, color: '#111', lineHeight: 'normal', overflow: 'visible' },
              "17"
            )}

            {/* Seat number */}
            {n(20, 2311, 542, 69, 44,
              { fontSize: '42px', fontWeight: 800, color: '#111', lineHeight: 'normal', overflow: 'visible' },
              "17A"
            )}

            {/* FROM label right panel */}
            {n(19, 2025, 760, 85, 30,
              { fontSize: '24px', fontWeight: 700, color: '#666', letterSpacing: '0.05em', lineHeight: 'normal' },
              "FROM"
            )}

            {/* TO label right panel */}
            {n(18, 2319, 761, 43, 29,
              { fontSize: '24px', fontWeight: 700, color: '#666', letterSpacing: '0.05em', lineHeight: 'normal' },
              "TO"
            )}

            {/* Node 13 - gold banner strip for FROM/TO */}
            {n(13, 1910, 801, 649, 87,
              {},
              <img src={URLS[34]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {/* MUMBAI */}
            {n(15, 2027, 826, 145, 38,
              { fontSize: '32px', fontWeight: 800, color: '#FFF', lineHeight: 'normal', overflow: 'visible' },
              "MUMBAI"
            )}
            {/* DYNAMIC DESTINATION RIGHT PANEL */}
            {n(14, 2325, 827, 200, 38,
              { fontSize: '32px', fontWeight: 800, color: '#FFF', whiteSpace: 'nowrap', lineHeight: 'normal', overflow: 'visible' },
              destination
            )}

            {/* FLIGHT */}
            {n(11, 2031, 936, 100, 31,
              { fontSize: '26px', fontWeight: 900, color: '#666', letterSpacing: '0.1em', lineHeight: 'normal' },
              "FLIGHT"
            )}

            {/* LP317 */}
            {n(10, 2315, 926, 109, 47,
              { fontSize: '42px', fontWeight: 800, color: '#111', lineHeight: 'normal', overflow: 'visible' },
              "LP317"
            )}

            {/* Bottom VOUCHER ID */}
            {n(9, 1910, 990, 650, 50,
              { fontSize: '32px', fontWeight: 700, color: '#666', textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 'normal', overflow: 'visible' },
              `VOUCHER ID:${voucherCode}`
            )}

            {/* Holographic reflection sweep overlay */}
            <div className="ticket-shine-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 🎛️  POSITION & SIZE TUNING — EDIT THESE TO MOVE THINGS
// Save the file after each change to see results live!
// ============================================================

// --- PRINTER MACHINE ---
const MACHINE_X = -200;          // Moves machine Left(-) / Right(+) in px
const MACHINE_Y = 70;          // Moves machine Up(-) / Down(+) in px

// --- VOUCHER DETAILS CARD (Settings) ---
const SETTINGS_X = -720;         // Let flexbox handle it
const SETTINGS_Y = -250;         // Let flexbox handle it

// --- GENERATED COUPON (Ticket) ---
// NOTE: Because the machine is rotated -90deg, local Y = visual Right/Left
const TICKET_HIDDEN_Y = -350;   // Deeply hidden inside machine
const TICKET_PEEK_Y = -300;     // Barely peeking out of slot
const TICKET_FEED1_Y = -220;    // 1/3 out
const TICKET_FEED2_Y = -120;    // 2/3 out
const TICKET_ALMOST_Y = -20;    // Fully out of the slot
const TICKET_FINAL_Y = 340;     // Fully out — how far RIGHT it lands
const TICKET_FINAL_X = "-30px"; // Vertical nudge when landed (Up- / Down+)

const TICKET_SCALE_INSIDE = 0.45;  // Size while hiding inside the machine
const TICKET_SCALE_PEEK = 0.45;  // Size while peeking / feeding
const TICKET_SCALE_FINAL = 1.2;  // Final displayed size after fully printed

// ============================================================

export default function CouponPage({ onClose, defaultName = '' }) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('ITALY');
  const [animationState, setAnimationState] = useState('idle'); // idle | peek | feed1 | feed2 | almost | printed
  const [voucherCode, setVoucherCode] = useState('ITA-PE----');
  const [validUntil, setValidUntil] = useState('17-05-26');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    
    setErrorMsg('');
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, destination, email })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to generate coupon. Please try again.');
        setIsGenerating(false);
        return;
      }

      setVoucherCode(data.coupon.code);
      
      // Format validUntil to DD-MM-YY for the ticket
      const dateObj = new Date(data.coupon.validUntil);
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yy = String(dateObj.getFullYear()).slice(-2);
      setValidUntil(`${dd}-${mm}-${yy}`);

      // Stage 1: Peek — the front edge of the ticket appears from the slot
      setAnimationState('peek');

      setTimeout(() => {
        // Stage 2: Feed chunk 1
        setAnimationState('feed1');
      }, 600);

      setTimeout(() => {
        // Stage 3: Feed chunk 2
        setAnimationState('feed2');
      }, 1400);

      setTimeout(() => {
        // Stage 4: Almost out
        setAnimationState('almost');
      }, 2200);

      setTimeout(() => {
        // Final Stage: Fully printed & ready to rip
        setAnimationState('printed');
        setIsGenerating(false);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Please try again later.');
      setIsGenerating(false);
    }
  };

  const resetMachine = () => {
    setAnimationState('idle');
    setVoucherCode('ITA-PE----');
  };

  // Compute ticket Y position based on animation stage
  const ticketY =
    animationState === 'idle' ? TICKET_HIDDEN_Y :
      animationState === 'peek' ? TICKET_PEEK_Y :
        animationState === 'feed1' ? TICKET_FEED1_Y :
          animationState === 'feed2' ? TICKET_FEED2_Y :
            animationState === 'almost' ? TICKET_ALMOST_Y :
    /* printed */                  TICKET_FINAL_Y;

  const ticketX =
    animationState === 'printed' ? TICKET_FINAL_X : 0;

  const ticketScale =
    animationState === 'idle' ? TICKET_SCALE_INSIDE :
      animationState === 'peek' ? TICKET_SCALE_PEEK :
        animationState === 'feed1' ? TICKET_SCALE_PEEK :
          animationState === 'feed2' ? TICKET_SCALE_PEEK :
            animationState === 'almost' ? TICKET_SCALE_PEEK :
    /* printed */                  TICKET_SCALE_FINAL;

  // Duration varies by stage for the realistic feed feel
  const ticketDuration =
    animationState === 'peek' ? 0.5 :
      animationState === 'feed1' ? 0.8 :
        animationState === 'feed2' ? 0.8 :
          animationState === 'almost' ? 0.8 :
            animationState === 'printed' ? 0.8 : 0.3;

  return (
    <div className="generator-machine-container">
      {/* Wrapper to contain rotated machine bounding box so it doesn't break flex layout */}
      <div style={{ width: '450px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* The Printer Machine */}
        <motion.div
          className={`printer-assembly state-${animationState}`}
          initial={{ x: MACHINE_X, y: MACHINE_Y, rotate: -90 }}
          animate={{ x: MACHINE_X, y: MACHINE_Y, rotate: -90 }}
          transition={{ duration: 0 }}
        >
          {/* === TICKET MASK: crops ticket while it feeds through the slot === */}
          <div
            className="printer-slot-mask"
            style={{
              overflow: animationState === 'printed' ? 'visible' : 'hidden',
              pointerEvents: animationState === 'printed' ? 'auto' : 'none',
              zIndex: animationState === 'printed' ? 100 : 1
            }}
          >
            <motion.div
              className="printer-ticket-wrapper"
              initial={{ y: TICKET_HIDDEN_Y, scale: TICKET_SCALE_INSIDE, x: 0, rotate: 90 }}
              animate={{
                y: ticketY,
                x: ticketX,
                rotate: 90,
                scale: ticketScale,
              }}
              transition={{
                y: {
                  duration: ticketDuration,
                  ease: animationState === 'feed' ? [0.25, 0, 0.5, 1] : "easeOut"
                },
                x: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 0.8, ease: "easeInOut" },
              }}
              style={{
                zIndex: animationState === 'printed' ? 100 : 1,
                transformOrigin: 'center center',
                willChange: (animationState === 'peek' || animationState === 'feed1' || animationState === 'feed2' || animationState === 'almost') ? 'transform' : 'auto'
              }}
            >
              <CouponTicket
                name={name ? name.toUpperCase() : ''}
                destination={destination.toUpperCase()}
                voucherCode={voucherCode}
                date={validUntil}
              />

              {/* Copy/Close buttons */}
              <AnimatePresence>
                {animationState === 'printed' && (
                  <motion.div
                    className="ticket-actions"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                    <button className="reset-btn" onClick={() => {
                      resetMachine();
                      if (onClose) onClose();
                    }}>
                      <X size={18} />
                      <span>Close</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* === MACHINE TOP LIP === */}
          <motion.div className="printer-top-lip" animate={{ opacity: 1 }}>
            <div className="blinking-light"></div>
          </motion.div>

          {/* === MACHINE BODY === */}
          <motion.div className="printer-body" animate={{ opacity: 1 }}>
            <motion.button
              className="print-action-btn"
              onClick={handleGenerate}
              disabled={animationState !== 'idle' || isGenerating}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                <Printer size={30} color={animationState === 'idle' ? "#111" : "#777"} style={{ marginBottom: '6px' }} />
                <span>GENERATE</span>
              </div>
            </motion.button>

            <div className="printer-slot-shadow">
              {animationState !== 'idle' && animationState !== 'printed' && (
                <div className="laser-scanner"></div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <motion.div
        className="machine-settings"
        style={{ transform: `translate(${SETTINGS_X}px, ${SETTINGS_Y}px)` }}
        animate={{ opacity: 1 }}
      >
        <div className="settings-header">
          <h3>Voucher Details</h3>
          <p>Set your destination before printing.</p>
        </div>
        
        {/* Error Message */}
        {errorMsg && (
          <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {errorMsg}
          </div>
        )}

        <div className="input-group">
          <input
            type="text"
            placeholder="Passenger Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={animationState !== 'idle' || isGenerating}
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={animationState !== 'idle' || isGenerating}
            style={{ marginTop: '10px' }}
          />
        </div>
        <div className="input-group">
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            disabled={animationState !== 'idle' || isGenerating}
          >
            <option value="ITALY">Italy</option>
            <option value="AUSTRALIA">Australia</option>
            <option value="CANADA">Canada</option>
            <option value="FRANCE">France</option>
            <option value="GERMANY">Germany</option>
            <option value="IRELAND">Ireland</option>
            <option value="UK">United Kingdom</option>
            <option value="USA">United States</option>
          </select>
        </div>
      </motion.div>
    </div>
  );
}