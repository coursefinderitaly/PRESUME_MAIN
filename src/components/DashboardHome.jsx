import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, GraduationCap, MapPin, Award, BookOpen, Clock, ArrowRight, Plane, FileText, ChevronRight, Bell, Settings, CreditCard, Zap, Tag, Timer, PhoneCall, Mail, FileCheck, Banknote } from 'lucide-react';
import useLocalLayoutScale from '../hooks/useLocalLayoutScale';

const ease = [0.4, 0.0, 0.2, 1];

// ========================================================
// CONFIGURATION: Adjust Section Scale Values Section-by-Section
// ========================================================
export const DASHBOARD_LAYOUT_SCALES = {
  // =======================================================================
  // CARD HEIGHT & WIDTH CONTROLS (Tweak these variables to resize cards!)
  // =======================================================================
  sizes: {
    // 1. GREETING CARD (Top Left Card)
    greetingCardWidth: '1',          // Width / Flex weight (e.g. '1', '2' or '700px')
    greetingCardHeight: '150px',     // Height of Greeting Banner

    // 2. 24/7 SUPPORT CARD (Top Right Card)
    supportCardWidth: '260px',       // Width of Support Card
    supportCardHeight: '245px',      // Height of Support Column (includes bottom links)

    // 3. ITALY INTAKE 2026 CARD (Bottom Left Card)
    italyCardWidth: '1fr',           // Grid width column ratio (e.g. '1fr', '300px')
    italyCardHeight: '180px',        // Height of Italy Intake Card

    // 4. PREMIUM SERVICES CARD (Bottom Right Card)
    premiumServicesCardWidth: '1.8fr', // Grid width column ratio (e.g. '1.8fr', '500px')
    premiumServicesCardHeight: '180px', // Height of Premium Services Card

    // 5. METRIC CARDS (4 cards: Target Universities, Documents, IELTS, Scholarship)
    metricCardsWidth: 'repeat(4, 1fr)', // Grid width columns for the 4 metric cards (e.g. 'repeat(4, 1fr)' or fixed 'repeat(4, 200px)')
    metricCardsHeight: '100px',       // Height of the metrics cards
  },

  // Global spacing between containers and margins
  global: {
    gap: '10px',                // Space between main blocks
    padding: '25px 14px 10px', // Top, Left/Right, Bottom dashboard margins
  },

  // Section 1: Hero Greeting Banner
  hero: {
    padding: '24px 32px',       // Padding inside the banner card
    titleSize: '2.0rem',        // Title text size
    descSize: '0.98rem',        // Description paragraph text size
    buttonPadding: '14px 26px',  // Resume button padding
    buttonSize: '0.95rem',      // Resume button text size
    planeSize: 55,              // Airplane icon size (in pixels)
  },

  // Section 1.5: 24/7 Support Card
  support: {
    padding: '16px 16px',       // Padding inside support card
  },

  // Section 2: Metrics Row
  metrics: {
    gap: '12px',                // Gap between the 4 metric cards
    cardPadding: '12px 16px',   // Padding inside each metric card
    iconSize: 22,               // Metric icon size (in pixels)
    iconPadding: '9px',         // Padding surrounding metric icons
    valueSize: '1.6rem',        // Value size
    titleSize: '0.8rem',       // Label text size
  },

  // Section 3: Horizontal Timeline Bar (unused)
  timeline: {
    cardPadding: '10px 16px',
    innerPadding: '8px 16px',
    nodeSize: 16,
    titleSize: '0.75rem',
    descSize: '0.65rem',
    lineTop: 36,
  },

  // Section 4: Bottom Grid (Featured Destination + Services)
  bottomGrid: {
    gap: '10px',
    columns: '1fr 1.8fr',
    mapPadding: '0',
    mapTitleSize: '1.3rem',
    mapSubSize: '0.78rem',
    tasksPadding: '10px 12px',  // Quick tasks card padding
    tasksGap: '6px',
    taskTitleSize: '0.8rem',
    taskSubSize: '0.65rem',
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

const capitalizeName = (name) => {
  if (!name) return 'Student';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const DashboardHome = ({ profile, handleAvatarUpload, avatarUploading, setShowCoupon, setActiveTab, unreadMsgCount }) => {
  // Offer card countdown timer (48h from now)
  const [offerTimeLeft, setOfferTimeLeft] = useState({ h: 47, m: 59, s: 59 });
  const [salePulse, setSalePulse] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Destination Slideshow State
  const destinations = [
    { country: 'Italy', title: 'Italy Intake 2026', sub: 'Free education + €8,000 yearly regional grants.', img: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Russia', title: 'Russia MBBS 2026', sub: 'Top-tier Medical Universities & highly affordable fees.', img: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Georgia', title: 'Georgia MBBS 2026', sub: 'WHO recognized medical degrees with low cost of living.', img: 'https://images.unsplash.com/photo-1565018977111-44d320925e0c?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Germany', title: 'Study in Germany', sub: 'Tuition-free world-class engineering & tech programs.', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80' },
    { country: 'France', title: 'Study in France', sub: 'Excellence in Business, Fashion, and Culinary Arts.', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Canada', title: 'Canada Intakes', sub: 'High-quality education with excellent post-study work routes.', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=80' },
    { country: 'UK', title: 'Study in the UK', sub: 'Prestigious universities with 1-year Master’s options.', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80' },
    { country: 'USA', title: 'Study in the USA', sub: 'Global hub for innovation, research & Ivy League schools.', img: 'https://images.unsplash.com/photo-1498644337220-2ce32b0c9584?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Australia', title: 'Study in Australia', sub: 'World-class universities with a vibrant lifestyle.', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80' },
    { country: 'Ireland', title: 'Study in Ireland', sub: 'Fast-growing tech hub with great career opportunities.', img: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1600&q=80' }
  ];
  const [currentDestIndex, setCurrentDestIndex] = useState(0);

  // Offers Slideshow State
  const flashOffers = [
    { pct: '50%', title: 'Premium Services — Limited Time Offer', sub: 'Unlock IELTS prep, SOP writing & visa support at 50% off. Enroll before the offer expires.' },
    { pct: '30%', title: 'Priority Processing — Flash Sale', sub: 'Get 30% off on priority application processing today. Speed up your admission.' }
  ];
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    const destInterval = setInterval(() => {
      setCurrentDestIndex(prev => (prev + 1) % destinations.length);
    }, 4000);
    const offerInterval = setInterval(() => {
      setCurrentOfferIndex(prev => (prev + 1) % flashOffers.length);
    }, 5000);
    return () => { clearInterval(destInterval); clearInterval(offerInterval); };
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for offer card
  useEffect(() => {
    const countdown = setInterval(() => {
      setOfferTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    // Pulse every 5s to draw attention
    const pulseInterval = setInterval(() => {
      setSalePulse(true);
      setTimeout(() => setSalePulse(false), 600);
    }, 5000);
    return () => { clearInterval(countdown); clearInterval(pulseInterval); };
  }, []);

  // Calculate actual completion percentage matching the Vertical Tracker logic
  const isProfileComplete = Boolean(profile?.firstName && profile?.phone);
  const isAcademicComplete = isProfileComplete && Boolean(profile?.highestLevelOfEducation || profile?.educationHistory?.some(edu => edu.universityName || edu.percentageObtained));
  const hasApplied = isAcademicComplete && Boolean(profile?.country || profile?.appliedUniversities?.length > 0 || profile?.savedUniversitiesCart?.length > 0);
  const isDocsUploaded = hasApplied && Boolean(profile?.documentZip || profile?.documents?.length > 0 || profile?.passportNo);
  const isApproved = isDocsUploaded && Boolean(profile?.studentStatus === 'Active' || profile?.applicationStatus === 'approved');

  const isSubmitted = Boolean(profile?.documentZip || profile?.applications?.length > 0);

  const completed = isSubmitted
    ? [true, true, true, true, true]
    : [isProfileComplete, isAcademicComplete, hasApplied, isDocsUploaded, isApproved];
  const doneCount = completed.filter(Boolean).length;
  const pct = Math.round((doneCount / 5) * 100);

  const displayName = capitalizeName(`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()) || 'Student';

  // Layout scales reference
  const s = DASHBOARD_LAYOUT_SCALES;
  const layoutScale = useLocalLayoutScale(1536);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)', scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 24 }
    }
  };

  return (
    <motion.div
      className="study-abroad-dash"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ zoom: layoutScale }}
    >
      <style>{`
        .study-abroad-dash {
          flex: 1;
          min-height: 0;
          height: 100%;
          max-height: 100%;
          color: var(--text-main, #F8FAFC);
          font-family: 'Inter', sans-serif;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: ${s.global.gap};
          overflow-y: auto;
          box-sizing: border-box;
          padding: ${s.global.padding};
          
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .study-abroad-dash::-webkit-scrollbar {
          display: none;
        }
        
        .dest-title-text { color: #ffffff !important; text-shadow: 0 2px 10px rgba(0,0,0,0.9) !important; }
        .dest-sub-text { color: #f8fafc !important; text-shadow: 0 2px 8px rgba(0,0,0,0.95) !important; }
        .dest-badge-text { color: #fbbf24 !important; font-weight: 800 !important; }

        /* Moving Background Objects */
        .ambient-orb {
          position: fixed; border-radius: 50%; filter: blur(130px); opacity: 0.25; z-index: -1;
          animation: floatOrb 30s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .orb-1 { width: 600px; height: 600px; background: rgba(217, 119, 6, 0.08); top: -150px; left: -100px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(251, 191, 36, 0.06); bottom: -150px; right: -100px; animation-delay: -15s; }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 60px) scale(1.15); }
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-mesh-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(45deg, rgba(217, 119, 6, 0.04), rgba(251, 191, 36, 0.03), rgba(23, 23, 23, 0.02));
          background-size: 200% 200%;
          animation: gradientFlow 8s ease infinite;
          pointer-events: none;
        }

        /* Premium Base Classes (Restored Glassmorphism) */
        .glass-panel {
          background: linear-gradient(135deg, rgba(38, 38, 38, 0.4), rgba(23, 23, 23, 0.5)) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3), 
            inset 0 1px 0px rgba(255,255,255,0.04),
            0 0 0 1px rgba(217, 119, 6, 0.03);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        [data-theme="light"] .glass-panel {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.04)) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(0, 0, 0, 0.15) !important;
        }
        .glass-panel:hover {
          border-color: rgba(251, 191, 36, 0.15);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.35), 
            inset 0 1px 0px rgba(255,255,255,0.06),
            0 0 12px rgba(251, 191, 36, 0.08);
        }

        /* ── Light mode: yellow → dark amber for readability ── */
        [data-theme="light"] .study-abroad-dash [style*="color: #fbbf24"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(251, 191, 36)"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(251,191,36)"],
        [data-theme="light"] .study-abroad-dash [style*="color: #facc15"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(250, 204, 21)"],
        [data-theme="light"] .study-abroad-dash [style*="color: #f59e0b"] {
          color: #92400e !important;
        }
        [data-theme="light"] .study-abroad-dash [style*="color: #d97706"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(217, 119, 6)"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(217,119,6)"] {
          color: #78350f !important;
        }
        
        [data-theme="light"] .study-abroad-dash [style*="color: #fff"],
        [data-theme="light"] .study-abroad-dash [style*="color: #ffffff"],
        [data-theme="light"] .study-abroad-dash [style*="color: #F8FAFC"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(255, 255, 255)"],
        [data-theme="light"] .study-abroad-dash [style*="color: rgb(255,255,255)"] {
          color: var(--text-main) !important;
        }

        [data-theme="light"] .study-abroad-dash [style*="color: #94A3B8"],
        [data-theme="light"] .study-abroad-dash [style*="color: #cbd5e1"] {
          color: var(--text-muted) !important;
        }

        [data-theme="light"] .study-abroad-dash svg[stroke="#fbbf24"],
        [data-theme="light"] .study-abroad-dash svg[stroke="#facc15"],
        [data-theme="light"] .study-abroad-dash svg[stroke="#f59e0b"],
        [data-theme="light"] .study-abroad-dash svg[stroke="#d97706"] {
          stroke: #92400e !important;
        }
        
        [data-theme="light"] .study-abroad-dash *[color="#fbbf24"],
        [data-theme="light"] .study-abroad-dash *[color="#facc15"],
        [data-theme="light"] .study-abroad-dash *[color="#f59e0b"],
        [data-theme="light"] .study-abroad-dash *[color="#d97706"] {
          color: #92400e !important;
        }
        [data-theme="light"] .study-abroad-dash .offer-badge-pct,
        [data-theme="light"] .study-abroad-dash .offer-badge-off {
          color: #92400e !important;
        }
        [data-theme="light"] .study-abroad-dash .countdown-num {
          color: #78350f !important;
        }
        [data-theme="light"] .text-gradient-gold {
          background: linear-gradient(135deg, #b45309, #92400e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Typography */
        h1, h2, h3, h4 { margin: 0; font-weight: 700; color: var(--text-main); font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        p, span { margin: 0; color: var(--text-dim); }
        .text-gradient-neon { background: linear-gradient(135deg, #38BDF8, #C084FC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* Layout Grids */
        .metrics-row {
          display: grid;
          grid-template-columns: ${s.sizes.metricCardsWidth};
          gap: ${s.metrics.gap};
          height: ${s.sizes.metricCardsHeight};
          flex-shrink: 0;
        }
        .bottom-grid {
          display: grid;
          grid-template-columns: ${s.sizes.italyCardWidth} ${s.sizes.premiumServicesCardWidth};
          gap: ${s.bottomGrid.gap};
          min-height: 0;
          flex-shrink: 0;
        }
        .destination-bg {
          position: absolute;
          inset: 0;
          background: url(https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&q=80) center/cover;
          opacity: 0.75;
        }
        [data-theme="light"] .destination-bg {
          opacity: 0.85;
          filter: contrast(1.02) brightness(1.02);
        }
        .destination-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.35) 60%, transparent 100%);
          z-index: 1;
        }
        [data-theme="light"] .destination-overlay {
          background: linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 60%, transparent 100%);
        }

        /* Status Badges */
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
        .status-active { background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid rgba(56,189,248,0.25); }

        /* Horizontal Timeline */
        .horizontal-timeline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding: ${s.timeline.innerPadding};
          flex-shrink: 0;
        }
        .timeline-line {
          position: absolute;
          left: 10%;
          right: 10%;
          top: ${s.timeline.lineTop}px;
          height: 2px;
          background: rgba(255, 255, 255, 0.08);
          z-index: 1;
        }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          width: 20%;
          text-align: center;
        }
        .step-node {
          width: ${s.timeline.nodeSize}px;
          height: ${s.timeline.nodeSize}px;
          border-radius: 50%;
          background: #1e293b;
          border: 3px solid rgba(255,255,255,0.1);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .step-node.completed {
          background: #10b981;
          border-color: rgba(16, 185, 129, 0.3);
        }
        .step-node.current {
          background: #38bdf8;
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        }

        .plane-graphic { display: flex; }
        @media (max-width: 768px) {
          .plane-graphic { display: none; }
          .metrics-row { grid-template-columns: repeat(2, 1fr); }
          .bottom-grid {
            grid-template-columns: 1fr;
            height: auto;
            min-height: auto;
            flex: none;
          }
        }

        /* ===== PROFESSIONAL OFFER CARD ===== */

        /* Subtle left-to-right shimmer on the card bg */
        @keyframes offerBgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Live dot pulse */
        @keyframes liveDot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          50%       { opacity: 0.7; transform: scale(1.3); box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }

        /* Countdown blink separator */
        @keyframes colonBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }

        /* Single clean sweep shimmer */
        @keyframes offerSweep {
          0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          8%   { opacity: 1; }
          50%  { transform: translateX(250%) skewX(-15deg); opacity: 0.6; }
          51%  { opacity: 0; }
          100% { transform: translateX(250%) skewX(-15deg); opacity: 0; }
        }

        /* Discount badge glow breathe */
        @keyframes discountGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.2); }
          50%       { box-shadow: 0 0 16px 4px rgba(251,191,36,0.18); }
        }

        /* ---- CARD BASE ---- */
        .offer-card-v2 {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          cursor: pointer;
          background: linear-gradient(
            112deg,
            rgba(26,20,10,0.96) 0%,
            rgba(18,14,8,0.97) 55%,
            rgba(22,16,10,0.96) 100%
          );
          border: 1px solid rgba(251,191,36,0.14);
          box-shadow: none;
        }
        /* top-edge amber hairline accent */
        .offer-card-v2::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 5%, #f59e0b 30%, #fbbf24 50%, #f59e0b 70%, transparent 95%);
          z-index: 6;
          opacity: 0.7;
        }
        /* Sweep shimmer */
        .offer-card-v2::after {
          content: '';
          position: absolute;
          inset-block: 0;
          left: 0;
          width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: offerSweep 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }
        [data-theme="light"] .offer-card-v2 {
          background: linear-gradient(112deg, rgba(200,185,145,0.38) 0%, rgba(185,168,125,0.32) 55%, rgba(205,190,155,0.38) 100%);
          border-color: rgba(160,120,50,0.22);
        }

        /* ---- DISCOUNT BADGE ---- */
        .offer-discount-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          background: linear-gradient(145deg, rgba(251,191,36,0.14) 0%, rgba(245,158,11,0.08) 100%);
          border: 1.5px solid rgba(251,191,36,0.28);
          border-radius: 12px;
          flex-shrink: 0;
          animation: discountGlow 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .offer-discount-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 60% 30%, rgba(251,191,36,0.08), transparent 70%);
        }
        .offer-badge-pct {
          font-size: 1.3rem;
          font-weight: 900;
          color: #fbbf24;
          line-height: 1;
          letter-spacing: -1.5px;
          position: relative;
          z-index: 1;
        }
        .offer-badge-off {
          font-size: 0.52rem;
          font-weight: 700;
          color: rgba(251,191,36,0.7);
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          margin-top: 1px;
        }

        /* ---- LIVE PILL ---- */
        .offer-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.28);
          border-radius: 20px;
          padding: 2px 8px 2px 6px;
          font-size: 0.58rem;
          font-weight: 700;
          color: #10b981;
          letter-spacing: 1px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #10b981;
          animation: liveDot 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ---- TITLE ---- */
        .offer-title-v2 {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.2px;
          line-height: 1.3;
        }
        [data-theme="light"] .offer-title-v2 {
          color: #1e1206;
        }

        /* ---- DIVIDER ---- */
        .offer-divider {
          width: 1px;
          align-self: stretch;
          background: rgba(255,255,255,0.07);
          flex-shrink: 0;
          margin: 0 4px;
        }
        [data-theme="light"] .offer-divider {
          background: rgba(0,0,0,0.08);
        }

        /* ---- COUNTDOWN ---- */
        .offer-countdown {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }
        .countdown-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 4px 8px;
          min-width: 34px;
        }
        [data-theme="light"] .countdown-block {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.09);
        }
        .countdown-num {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.5px;
        }
        .countdown-lbl {
          font-size: 0.42rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }
        .countdown-sep {
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(251,191,36,0.5);
          margin-bottom: 8px;
          animation: colonBlink 1s step-start infinite;
          flex-shrink: 0;
        }

        /* ---- CTA BUTTON ---- */
        .offer-cta-v2 {
          position: relative;
          background: #f59e0b;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          color: #0d0900;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.1px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(245,158,11,0.3);
          font-family: inherit;
          transition: background 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .offer-cta-v2:hover {
          background: #fbbf24;
          box-shadow: 0 4px 20px rgba(251,191,36,0.45);
        }

        /* unused legacy classes kept for safety */
        .offer-sparkles, .sparkle-particle, .offer-ticker-wrap,
        .offer-ticker-item, .ticker-dot, .offer-accent-bar,
        .offer-starburst, .offer-starburst svg.star-bg, .offer-starburst-inner,
        .offer-pct, .offer-off, .offer-shine { display: none !important; }
      `}</style>

      {/* Ambient Moving Orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      {/* 1. TOP ROW: HERO GREETING BANNER + SUPPORT INFO */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px', flexShrink: 0, marginTop: '-5px', alignItems: 'stretch' }}>

        {/* GREETING BANNER */}
        <motion.div
          className="glass-panel"
          style={{ padding: s.hero.padding, position: 'relative', flex: s.sizes.greetingCardWidth, minHeight: s.sizes.greetingCardHeight, minWidth: 0, display: 'flex', alignItems: 'center' }}
        >
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '24px' }}>
            {/* Avatar & Text Details Wrapper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, minWidth: 0 }}>
              {/* Avatar Container */}
              <div
                className="hero-avatar-container"
                style={{ position: 'relative', cursor: profile?.avatarUrl ? 'default' : 'pointer', flexShrink: 0 }}
                onClick={() => {
                  if (!profile?.avatarUrl && handleAvatarUpload) {
                    document.getElementById('hero-avatar-upload').click();
                  }
                }}
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.1rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                    {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : 'N'}
                  </div>
                )}
                {!profile?.avatarUrl && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: avatarUploading ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 700 }}>{avatarUploading ? 'Wait...' : 'Add'}</span>
                  </div>
                )}
                <input id="hero-avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={avatarUploading} />
              </div>

              {/* Title, Subtitle, and Progress Bar combo */}
              <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={13} color="#facc15" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#facc15', letterSpacing: '0.5px' }}>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h1 style={{ fontSize: s.hero.titleSize, marginBottom: '2px', marginTop: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2', fontWeight: 800 }}>
                  {greeting}, <span className="text-gradient-neon">{displayName}</span>
                </h1>
                <p style={{ fontSize: s.hero.descSize, color: 'var(--text-dim)', margin: 0, whiteSpace: 'normal', lineHeight: '1.4', opacity: 0.9 }}>
                  Your study abroad journey is {pct}% complete. Tracking <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{profile?.country || 'University of Milan'}</span>.
                </p>
                {/* Journey progress bar inside the card to fill the height perfectly */}
                <div style={{ marginTop: '12px', width: '100%', maxWidth: '380px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Journey Progress</span>
                    <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800 }}>{pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #fbbf24, #d97706)', borderRadius: '10px', boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Button & Plane graphic */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, paddingLeft: '10px', position: 'relative' }}>
              <style>{`
                @keyframes resumeBtnGlow {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0), 0 4px 16px rgba(99,102,241,0.35); }
                  50%       { box-shadow: 0 0 0 6px rgba(99,102,241,0), 0 8px 28px rgba(99,102,241,0.65); }
                }
                @keyframes resumeShimmer {
                  0%   { left: -70%; opacity: 0; }
                  10%  { opacity: 1; }
                  55%  { left: 120%; opacity: 1; }
                  60%  { opacity: 0; }
                  100% { left: 120%; opacity: 0; }
                }
                .resume-btn {
                  position: relative;
                  overflow: hidden;
                  padding: ${s.hero.buttonPadding};
                  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%);
                  border: 1.5px solid rgba(167,139,250,0.5);
                  border-radius: 12px;
                  color: #ffffff;
                  font-weight: 800;
                  font-size: ${s.hero.buttonSize};
                  letter-spacing: 0.4px;
                  display: inline-flex;
                  align-items: center;
                  gap: 7px;
                  cursor: pointer;
                  white-space: nowrap;
                  font-family: inherit;
                  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
                  animation: resumeBtnGlow 2.5s ease-in-out infinite;
                  z-index: 2;
                }
                .resume-btn::after {
                  content: '';
                  position: absolute;
                  top: -10%;
                  left: -70%;
                  width: 40%;
                  height: 120%;
                  background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
                  transform: skewX(-18deg);
                  animation: resumeShimmer 4s ease-in-out infinite;
                  pointer-events: none;
                }
                [data-theme="light"] .resume-btn {
                  background: linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #4f46e5 100%);
                  border-color: rgba(99,102,241,0.6);
                  box-shadow: 0 4px 14px rgba(79,70,229,0.3);
                }
              `}</style>
              <motion.button
                className="resume-btn"
                onClick={() => setActiveTab && setActiveTab(profile?.portalUnlocked === false ? 'subscriptions' : 'applications')}
                whileHover={{ scale: 1.05, background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #4f46e5 100%)' }}
                whileTap={{ scale: 0.96 }}
              >
                Resume Journey <ArrowRight size={14} strokeWidth={2.5} />
              </motion.button>
              <div className="plane-graphic" style={{ marginLeft: '10px' }}>
                <Plane size={s.hero.planeSize} color="#fcd34d" style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SUPPORT HELP CAPSULE - SIDE BY SIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: s.sizes.supportCardWidth, minHeight: s.sizes.supportCardHeight, flexShrink: 0 }}>
          <div className="glass-panel" style={{ padding: s.support.padding, borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', flex: 1, border: '1px solid rgba(251, 191, 36, 0.2)' }}>

            {/* Header: 24/7 Support */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', paddingLeft: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 6px #fbbf24', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Support Helpline</span>
            </div>

            {/* Helpline Call Widget */}
            <a
              href="tel:7880080054"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(251,191,36,0.03)', border: '1px solid rgba(251,191,36,0.1)', textDecoration: 'none', transition: 'all 0.2s', outline: 'none' }}
              className="support-contact-widget"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)';
                e.currentTarget.style.background = 'rgba(251,191,36,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.1)';
                e.currentTarget.style.background = 'rgba(251,191,36,0.03)';
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0 }}>
                <PhoneCall size={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: '1px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>Call Helpline</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.1 }}>+91 7880080054</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.1 }}>+91 8962977410</span>
              </div>
            </a>

            {/* Email Support Widget */}
            <a
              href="mailto:presumeoverseas@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', background: 'rgba(251,191,36,0.03)', border: '1px solid rgba(251,191,36,0.1)', textDecoration: 'none', transition: 'all 0.2s', outline: 'none' }}
              className="support-contact-widget"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)';
                e.currentTarget.style.background = 'rgba(251,191,36,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.1)';
                e.currentTarget.style.background = 'rgba(251,191,36,0.03)';
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0 }}>
                <Mail size={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: '2px' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Support</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-main)', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '-0.2px' }}>presumeoverseas@gmail.com</span>
              </div>
            </a>

          </div>

          <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
            <motion.div onClick={() => setActiveTab && setActiveTab('payments')} whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.4)' }} whileTap={{ scale: 0.95 }} className="glass-panel" style={{ flex: 1, padding: '10px 0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}>
              <CreditCard size={20} color="#94A3B8" />
            </motion.div>
            <motion.div onClick={() => setActiveTab && setActiveTab('profile')} whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.4)' }} whileTap={{ scale: 0.95 }} className="glass-panel" style={{ flex: 1, padding: '10px 0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}>
              <Settings size={20} color="#94A3B8" />
            </motion.div>
            <motion.div onClick={() => setActiveTab && setActiveTab('notifications')} whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.4)' }} whileTap={{ scale: 0.95 }} className="glass-panel" style={{ flex: 1, padding: '10px 0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'visible', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}>
              <Bell size={20} color="#94A3B8" />
              {unreadMsgCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 5px', borderRadius: '10px', boxShadow: '0 0 0 2px #0f172a' }}>{unreadMsgCount}</span>
              )}
            </motion.div>
          </div>
        </div>

      </motion.div>

      {/* 2. METRICS ROW */}
      <motion.div variants={itemVariants} className="metrics-row">
        {[
          { icon: <GraduationCap size={s.metrics.iconSize} color="#fbbf24" />, title: 'Target Universities', value: String(profile?.savedUniversitiesCart?.length || profile?.appliedUniversities?.length || 0), sub: 'Shortlisted' },
          { icon: <FileText size={s.metrics.iconSize} color="#d97706" />, title: 'Documents Verified', value: String(profile?.documents?.length || (profile?.documentZip ? 1 : 0)), sub: 'Uploaded' }
        ].map((metric, i) => (
          <div key={i} className="glass-panel" style={{ padding: s.metrics.cardPadding, display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ padding: s.metrics.iconPadding, background: 'rgba(251,191,36,0.1)', borderRadius: '10px', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {metric.icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
              <h3 style={{ fontSize: s.metrics.valueSize, lineHeight: '1.1', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>{metric.value}</h3>
              <p style={{ fontWeight: 600, color: '#94A3B8', fontSize: s.metrics.titleSize, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.title}</p>
              <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>{metric.sub}</span>
            </div>
          </div>
        ))}

        {/* Merged 3-Part Card: Offer Letter Statuses */}
        <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
          
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Offer Letter Status</span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', flex: 1 }}>
            {/* Part 1: Approved */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{ padding: s.metrics.iconPadding, background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileCheck size={s.metrics.iconSize} color="#10b981" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
                <h3 style={{ fontSize: s.metrics.valueSize, lineHeight: '1.1', color: '#10b981', fontWeight: 800, margin: 0 }}>0</h3>
                <p style={{ fontWeight: 600, color: '#94A3B8', fontSize: s.metrics.titleSize, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Approved</p>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

            {/* Part 2: Rejected */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{ padding: s.metrics.iconPadding, background: 'rgba(239,68,68,0.1)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={s.metrics.iconSize} color="#ef4444" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
                <h3 style={{ fontSize: s.metrics.valueSize, lineHeight: '1.1', color: '#ef4444', fontWeight: 800, margin: 0 }}>0</h3>
                <p style={{ fontWeight: 600, color: '#94A3B8', fontSize: s.metrics.titleSize, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Rejected</p>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

            {/* Part 3: Pending */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div style={{ padding: s.metrics.iconPadding, background: 'rgba(251,191,36,0.1)', borderRadius: '10px', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={s.metrics.iconSize} color="#fbbf24" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
                <h3 style={{ fontSize: s.metrics.valueSize, lineHeight: '1.1', color: '#fbbf24', fontWeight: 800, margin: 0 }}>0</h3>
                <p style={{ fontWeight: 600, color: '#94A3B8', fontSize: s.metrics.titleSize, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pending</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* 3. BOTTOM ROW (DESTINATIONS & TASKS) — moved up */}
      <motion.div variants={itemVariants} className="bottom-grid">
        {/* Featured Destination Slideshow */}
        <motion.div
          className="glass-panel"
          whileHover="hover"
          style={{ padding: 0, height: s.sizes.italyCardHeight, position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentDestIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <motion.div
                variants={{ hover: { scale: 1.08 } }}
                transition={{ duration: 0.4, ease: ease }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${destinations[currentDestIndex].img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 0
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }} />
              
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
                <div style={{ flex: 1, paddingRight: '15px' }}>
                  <span className="dest-badge-text" style={{ marginBottom: '6px', background: 'rgba(251,191,36,0.25)', padding: '4px 8px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(251,191,36,0.3)', backdropFilter: 'blur(4px)', borderRadius: '6px' }}>
                    <MapPin size={9} /> Top Country
                  </span>
                  <h3 className="dest-title-text" style={{ fontSize: s.bottomGrid.mapTitleSize, margin: 0, fontWeight: 900 }}>
                    {destinations[currentDestIndex].title}
                  </h3>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <p className="dest-sub-text" style={{ fontSize: s.bottomGrid.mapSubSize, textAlign: 'right', maxWidth: '240px', lineHeight: '1.4', margin: 0, fontWeight: 700 }}>
                    {destinations[currentDestIndex].sub}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slideshow Indicators */}
          <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 3 }}>
            {destinations.map((_, idx) => (
              <div key={idx} style={{ width: idx === currentDestIndex ? '16px' : '6px', height: '4px', borderRadius: '4px', background: idx === currentDestIndex ? '#fbbf24' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </motion.div>

        {/* Premium Services */}
        <div className="glass-panel" style={{ padding: s.bottomGrid.tasksPadding, display: 'flex', flexDirection: 'column', gap: '10px', height: s.sizes.premiumServicesCardHeight, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
          <div className="animated-mesh-bg" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--text-main)' }}>Premium Services</h2>
            <motion.span
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, background: 'rgba(251, 191, 36, 0.1)', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              Explore All
            </motion.span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
            {[
              { title: 'IELTS Prep', sub: 'Live classes & mock tests', icon: <BookOpen size={18} color="#fbbf24" />, glow: '#fbbf24', rgb: '251, 191, 36', id: 'ielts' },
              { title: 'SOP Creation', sub: 'Expert crafted statement', icon: <FileText size={18} color="#f59e0b" />, glow: '#f59e0b', rgb: '245, 158, 11', id: 'sop' },
              { title: 'Loan Assistance', sub: 'Education loan support', icon: <Banknote size={18} color="#ef4444" />, glow: '#ef4444', rgb: '239, 68, 68', id: 'loan' }
            ].map((service, i) => (
              <motion.div
                key={i}
                className="premium-service-widget"
                whileHover="hover"
                variants={{
                  hover: {
                    y: -3,
                    borderColor: service.glow,
                    boxShadow: `0 8px 24px rgba(${service.rgb}, 0.22), 0 0 0 1px rgba(${service.rgb}, 0.15)`,
                  }
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '12px',
                  background: `linear-gradient(135deg, rgba(${service.rgb}, 0.12) 0%, rgba(${service.rgb}, 0.05) 60%, rgba(255,255,255,0.03) 100%)`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid rgba(${service.rgb}, 0.22)`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 0.3s, border-color 0.3s',
                  boxShadow: `0 2px 12px rgba(${service.rgb}, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)`
                }}
              >
                {/* Top radial glow */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(${service.rgb}, 0.25) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                {/* Shimmer top-edge line */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: '15%', right: '15%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, rgba(${service.rgb}, 0.6), transparent)`,
                  pointerEvents: 'none',
                  zIndex: 1
                }} />

                {/* Icon pill */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '7px',
                  background: `rgba(${service.rgb}, 0.15)`,
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid rgba(${service.rgb}, 0.3)`,
                  boxShadow: `0 0 10px rgba(${service.rgb}, 0.15)`,
                  flexShrink: 0
                }}>
                  {service.icon}
                </div>

                {/* Text */}
                <div style={{ position: 'relative', zIndex: 2, minWidth: 0, width: '100%' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>{service.sub}</p>
                </div>

                {/* Arrow chip */}
                <div style={{ position: 'absolute', bottom: '9px', right: '9px', zIndex: 2, opacity: 0.45 }}>
                  <ChevronRight size={11} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. OFFER BANNER — professional compact strip */}
      <motion.div variants={itemVariants} style={{ flexShrink: 0 }}>
        <motion.div
          className="offer-card-v2"
          whileHover={{ scale: 1.006, y: -2 }}
          whileTap={{ scale: 0.99 }}
          style={{ position: 'relative' }}
          onClick={() => setShowCoupon && setShowCoupon(true)}
        >
          {/* Single row layout */}
          <div style={{ position: 'relative', zIndex: 4, display: 'flex', alignItems: 'center', gap: '16px', padding: '11px 20px' }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentOfferIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                {/* Discount badge */}
                <div className="offer-discount-badge" style={{ flexShrink: 0 }}>
                  <span className="offer-badge-pct">{flashOffers[currentOfferIndex].pct}</span>
                  <span className="offer-badge-off">OFF</span>
                </div>

                {/* Title + subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <div className="offer-live-badge">
                      <span className="live-dot" />
                      Live
                    </div>
                    <h3 className="offer-title-v2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {flashOffers[currentOfferIndex].title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flashOffers[currentOfferIndex].sub}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Vertical divider */}
            <div className="offer-divider" />

            {/* Countdown */}
            <div className="offer-countdown">
              <div className="countdown-block">
                <span className="countdown-num">{String(offerTimeLeft.h).padStart(2, '0')}</span>
                <span className="countdown-lbl">HRS</span>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-block">
                <span className="countdown-num">{String(offerTimeLeft.m).padStart(2, '0')}</span>
                <span className="countdown-lbl">MIN</span>
              </div>
              <span className="countdown-sep">:</span>
              <div className="countdown-block">
                <span className="countdown-num">{String(offerTimeLeft.s).padStart(2, '0')}</span>
                <span className="countdown-lbl">SEC</span>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="offer-divider" />

            {/* CTA */}
            <motion.button
              className="offer-cta-v2"
              onClick={(e) => { e.stopPropagation(); setShowCoupon && setShowCoupon(true); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Claim Offer
              <ArrowRight size={14} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
