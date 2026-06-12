import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight, ShieldCheck, ChevronDown, CreditCard, Ticket, Sparkles, Info } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { COUPONS } from '../config/coupons';
import { getPhases } from '../config/feesHelper';

const ConfettiBlast = () => {
  const particles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-[9999]">
      {particles.map((_, i) => {
        const angle = (i / 15) * 360;
        const radius = Math.random() * 60 + 35;
        const xTarget = Math.cos(angle * Math.PI / 180) * radius;
        const yTarget = Math.sin(angle * Math.PI / 180) * radius - 20;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: xTarget,
              y: yTarget,
              scale: Math.random() * 1.2 + 0.4,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#fbbf24' : '#f59e0b',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.8)'
            }}
          />
        );
      })}
    </div>
  );
};

const QuickAuthModal = ({ isOpen, onClose, onSuccess, initialProgram = 'Bachelors', getFirstPhaseFee, getOriginalFirstPhaseFee, countryId, initialCoupon = '', initialDiscount = 0, hideRegistration = false, loggedInEmail = '', isPhase1Paid = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: loggedInEmail || '',
    phonePrefix: '+91',
    phone: '',
    password: '',
    program: initialProgram
  });

  const [couponInput, setCouponInput] = useState(initialCoupon || '');
  const [couponDiscount, setCouponDiscount] = useState(initialDiscount || 0);
  const [couponError, setCouponError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, program: initialProgram }));
  }, [initialProgram]);

  React.useEffect(() => {
    if (loggedInEmail) {
      setFormData(prev => ({ ...prev, email: loggedInEmail }));
    }
  }, [loggedInEmail]);

  React.useEffect(() => {
    setCouponInput(initialCoupon || '');
    setCouponDiscount(initialDiscount || 0);
    setCouponError('');
  }, [initialCoupon, initialDiscount]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const hasToken = !!localStorage.getItem('token');
  const shouldHideRegistration = hideRegistration || hasToken;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        body: JSON.stringify({
          ...formData,
          phone: `${formData.phonePrefix} ${formData.phone}`,
          role: 'student',
          deferWelcomeEmail: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      onSuccess(formData.email, formData.password, formData.program, couponDiscount > 0 ? couponInput : '', couponDiscount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pricing calculations
  const activeCouponName = couponDiscount > 0 ? couponInput : '';
  const basePhases = getPhases(countryId, 'Public', formData.program, '') || [];
  const currentPhases = getPhases(countryId, 'Public', formData.program, activeCouponName) || [];

  const phase1Base = basePhases[0] || 0;
  const phase1Discounted = currentPhases[0] || 0;
  const hasItalyGST = countryId === 'italy';
  const gstRate = 0.18;

  const getPhaseNameShort = (idx, totalCount) => {
    if (idx === 0) return "Phase 1: Admission Process";
    if (idx === 1) return "Phase 2: After Admission";
    if (idx === 2) {
      return totalCount === 3 ? "Phases 3 & 4: Visa & Accommodation" : "Phase 3: Pre-enrollment Docs";
    }
    if (idx === 3) return "Phase 4: Visa Support";
    return `Phase ${idx + 1}`;
  };

  const isCombined50 = countryId === 'italy' && (formData.program === 'Bachelors' || formData.program === 'Masters') && couponDiscount === 50;
  const isCombinedPhase = isCombined50 || (formData.program === 'MBBS' && ['russia', 'georgia', 'italy'].includes(countryId));

  // Safe Phase List Construction
  const displayPhases = [];
  if (isCombinedPhase && currentPhases.length >= 3) {
    displayPhases.push({
      idx: 0,
      name: "Phase 1: Admission Process",
      price: currentPhases[0],
      isDueNow: true
    });
    // Only push phase 2 if it's > 0 or it's genuinely part of the structure
    if (currentPhases[1] !== undefined) {
      displayPhases.push({
        idx: 1,
        name: "Phase 2: After Admission",
        price: currentPhases[1],
        isDueNow: false
      });
    }
    // Merge phase 3 and 4 visually into the final phase
    const p3 = currentPhases[2] || 0;
    const p4 = currentPhases[3] || 0;
    displayPhases.push({
      idx: 2,
      name: isCombined50 ? "Phases 3 & 4: Visa & Accommodation Docs" : "Phase 3: Visa & Documentation",
      price: p3 + p4,
      isDueNow: false
    });
  } else {
    for (let i = 0; i < currentPhases.length; i++) {
      if (i > 0 && currentPhases[i] === 0) continue; // Skip zero-value phases gracefully
      displayPhases.push({
        idx: i,
        name: getPhaseNameShort(i, currentPhases.length),
        price: currentPhases[i],
        isDueNow: i === 0
      });
    }
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.97, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`relative w-full ${shouldHideRegistration ? 'max-w-md' : 'max-w-3xl'} bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl z-10 my-4`}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow rings */}
        <div className="absolute -top-[150px] -right-[150px] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-[150px] -left-[150px] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Identifiable Close Button */}
        <button
          onClick={onClose}
          title="Close Checkout"
          aria-label="Close Checkout"
          className="absolute top-4 right-4 z-[80] text-slate-400 hover:text-red-400 bg-slate-950/80 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 p-2.5 rounded-full transition-all duration-300 hover:scale-115 active:scale-90 hover:rotate-90 shadow-lg"
        >
          <X size={22} className="shrink-0" />
        </button>

        {/* Layout Grid */}
        <div className={shouldHideRegistration ? "flex flex-col relative z-10" : "grid grid-cols-1 md:grid-cols-12 relative z-10 divide-y md:divide-y-0 md:divide-x divide-slate-800/80"}>

          {/* LEFT: Registration Column */}
          {!shouldHideRegistration && (
            <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-center">
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles size={8} /> Activation Portal
                </div>
                <h3 className="text-xl font-black text-slate-50 leading-tight">Create Account</h3>
                <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                  Register to initialize your portal and access checkout.
                </p>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg mb-4 text-[11px] font-bold flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={e => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-600 outline-none focus:border-cyan-500 hover:border-slate-600 hover:bg-slate-950/60 transition-all duration-200 text-xs font-semibold"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Program</label>
                    <select
                      value={formData.program}
                      onChange={e => handleInputChange('program', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-slate-950/40 border border-slate-700/50 rounded-xl text-slate-100 outline-none focus:border-cyan-500 hover:border-slate-600 hover:bg-slate-950/60 transition-all duration-200 text-xs font-semibold appearance-none cursor-pointer"
                    >
                      <option value="Bachelors" className="bg-slate-900">Bachelors</option>
                      <option value="Masters" className="bg-slate-900">Masters</option>
                      <option value="MBBS" className="bg-slate-900">MBBS</option>
                    </select>
                    <div className="absolute right-2.5 top-[27px] pointer-events-none text-slate-500">
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/40 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-600 outline-none focus:border-cyan-500 hover:border-slate-600 hover:bg-slate-950/60 transition-all duration-200 text-xs font-semibold"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <div className="flex bg-slate-950/40 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-cyan-500 hover:border-slate-600 hover:bg-slate-950/60 transition-all duration-200">
                    <select
                      value={formData.phonePrefix}
                      onChange={e => handleInputChange('phonePrefix', e.target.value)}
                      className="bg-transparent border-none text-slate-300 pl-2.5 pr-1.5 py-2 outline-none text-xs font-bold cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <option value="+91" className="bg-slate-900 text-slate-200">+91</option>
                      <option value="+1" className="bg-slate-900 text-slate-200">+1</option>
                      <option value="+44" className="bg-slate-900 text-slate-200">+44</option>
                      <option value="+61" className="bg-slate-900 text-slate-200">+61</option>
                      <option value="+971" className="bg-slate-900 text-slate-200">+971</option>
                    </select>
                    <div className="w-px bg-slate-700/50 my-1.5"></div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        const maxLen = formData.phonePrefix === '+91' ? 10 : 15;
                        if (val.length <= maxLen) handleInputChange('phone', val);
                      }}
                      className="w-full pl-2.5 pr-3 py-2 bg-transparent text-slate-100 placeholder:text-slate-600 outline-none text-xs font-semibold"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-slate-950/40 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-600 outline-none focus:border-cyan-500 hover:border-slate-600 hover:bg-slate-950/60 transition-all duration-200 text-xs font-semibold"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all active:scale-[0.98] hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(6,182,212,0.35)] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-black shadow-lg"
                  >
                    {loading ? <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                      <>
                        <span>Proceed to Pay</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* RIGHT: Compact Invoice breakdown */}
          <div className={`${shouldHideRegistration ? 'col-span-1 p-6' : 'md:col-span-6 p-6 sm:p-7'} bg-slate-950/20 flex flex-col justify-between`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 pr-12">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-cyan-400 w-4 h-4" />
                  <span className="text-xs font-black text-slate-100 uppercase tracking-wider">Checkout Breakdown</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {formData.program}
                </span>
              </div>

              {/* Info banner (extremely compact) */}
              {!isPhase1Paid && (
                <div className="mb-4 text-[10.5px] text-amber-400 bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium hover:bg-amber-500/10 transition-colors duration-200">
                  <Info size={13} className="shrink-0 text-amber-400" />
                  <span>Pay only the <strong className="text-cyan-400">Phase 1 fee</strong> right now to unlock portal.</span>
                </div>
              )}

              {/* Sleek inline phases lists */}
              <div className="space-y-1.5 mb-4">
                {displayPhases.map((phaseItem, index) => {
                  const isPhase1 = phaseItem.isDueNow;

                  return (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between border transition-all duration-300 ${isPhase1
                          ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:scale-[1.01]'
                          : 'bg-transparent border-transparent opacity-50 hover:opacity-85 hover:bg-slate-950/30'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black transition-colors ${isPhase1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {phaseItem.idx + 1}
                        </span>
                        <span className={`text-[11px] font-bold text-slate-200 ${isPhase1 && isPhase1Paid ? 'line-through text-slate-500' : ''}`}>{phaseItem.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        {!isPhase1 && <span className="text-[8px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-black tracking-wide">LATER</span>}
                        {isPhase1 && !isPhase1Paid && <span className="text-[8px] bg-cyan-500 text-slate-950 px-1 py-0.2 rounded font-black tracking-wide">DUE NOW</span>}
                        {isPhase1 && isPhase1Paid && <span className="text-[8px] bg-emerald-500 text-slate-950 px-1 py-0.2 rounded font-black tracking-wide">PAID</span>}
                        <span className={`text-[11px] font-black text-slate-300 ${isPhase1 && isPhase1Paid ? 'line-through text-slate-500' : ''}`}>
                          ₹ {phaseItem.price?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code input field (compact) */}
              <div className="p-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl relative mb-4 hover:border-slate-700/50 transition-all duration-200">
                <AnimatePresence>
                  {showPromoSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute -top-10 inset-x-0 mx-auto w-max px-3 py-1.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-lg shadow-md flex items-center z-30 uppercase tracking-wider"
                    >
                      🎉 {couponDiscount}% Saved!
                    </motion.div>
                  )}
                </AnimatePresence>
                {showPromoSuccess && <ConfettiBlast />}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    disabled={couponDiscount > 0}
                    placeholder="PROMO CODE"
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-850 rounded-lg text-slate-100 placeholder:text-slate-600 outline-none focus:border-cyan-500 hover:border-slate-700 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (couponDiscount > 0) {
                        setCouponInput('');
                        setCouponDiscount(0);
                        setCouponError('');
                        return;
                      }
                      if (!couponInput.trim()) return;
                      const code = couponInput.toUpperCase();
                      if (COUPONS[code] !== undefined) {
                        setCouponDiscount(COUPONS[code]);
                        setCouponError('');
                        setShowPromoSuccess(true);
                        setTimeout(() => setShowPromoSuccess(false), 2000);
                      } else if (code.startsWith('PRESUME-')) {
                        setCouponDiscount(50);
                        setCouponError('');
                        setShowPromoSuccess(true);
                        setTimeout(() => setShowPromoSuccess(false), 2000);
                      } else {
                        setCouponError('Invalid');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border hover:scale-[1.02] active:scale-95 ${couponDiscount > 0
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30'
                      }`}
                  >
                    {couponDiscount > 0 ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[9px] text-red-400 font-semibold mt-1 px-0.5">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown Details */}
              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 select-none">Invoice Totals</p>

                <div className="flex justify-between items-center text-[11px] hover:text-slate-300 transition-colors">
                  <span className="text-slate-400 font-medium">Phase 1 Base</span>
                  <span className="text-slate-300 font-bold">₹ {phase1Discounted.toLocaleString('en-IN')}</span>
                </div>

                {hasItalyGST && (
                  <div className="flex justify-between items-center text-[11px] hover:text-slate-300 transition-colors">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-slate-300 font-bold">₹ {Math.round(phase1Discounted * gstRate).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Final Total Due Today */}
                <div className="flex justify-between items-center p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl mt-3 hover:scale-[1.01] hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(6,182,212,0.12)] transition-all duration-305 cursor-default">
                  <div>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">Total Due Today</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Phase 1 fee {hasItalyGST && "+ GST"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      ₹ {Math.round(phase1Discounted * (hasItalyGST ? 1 + gstRate : 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button / Footer (super compact) */}
            <div className="mt-4 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-1.5 text-emerald-450 text-[10px] font-black uppercase tracking-wider mb-3 select-none">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0 animate-pulse" />
                <span className="text-slate-300">Secure Activation Guarantee</span>
              </div>

              {shouldHideRegistration ? (
                <div>
                  {isPhase1Paid ? (
                    <button
                      disabled
                      className={`w-full py-2.5 rounded-xl font-bold cursor-not-allowed flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider shadow-lg ${isLight ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-600/30 text-slate-300 border border-emerald-500/20'}`}
                    >
                      <span>First Installment Paid</span>
                      <ShieldCheck size={14} className={isLight ? "text-emerald-100" : "text-emerald-400"} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSuccess(formData.email || loggedInEmail || '', '', formData.program, couponDiscount > 0 ? couponInput : '', couponDiscount)}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all active:scale-[0.98] hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(6,182,212,0.4)] flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider shadow-lg"
                    >
                      <span>Proceed to Secure Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2 bg-slate-850/30 rounded-lg border border-slate-800 text-center">
                  {isPhase1Paid ? (
                    <p className="text-[8.5px] text-emerald-400 font-bold uppercase tracking-wider">
                      ✓ First Installment Already Paid
                    </p>
                  ) : (
                    <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">
                      Register on the left to activate checkout
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default QuickAuthModal;
