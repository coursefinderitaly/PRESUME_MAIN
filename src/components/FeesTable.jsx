import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Wallet, FileText, Compass, Award, ShieldCheck, Ticket, CreditCard, Landmark, GraduationCap, Coins, Sparkles, Lock, Tag, Shield } from 'lucide-react';
import QuickAuthModal from './QuickAuthModal';
import RazorpayGateway from './RazorpayGateway';
import CouponPage from '../coupon_generator/coupon';
import { API_BASE_URL } from '../config';
import { COUPONS } from '../config/coupons';
import { getPhases } from '../config/feesHelper';
import { countryData } from '../data/countryData';

const ConfettiBlast = () => {
    const particles = Array.from({ length: 20 });
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-[9999]">
            {particles.map((_, i) => {
                const angle = (i / 20) * 360;
                const radius = Math.random() * 85 + 45;
                const xTarget = Math.cos(angle * Math.PI / 180) * radius;
                const yTarget = Math.sin(angle * Math.PI / 180) * radius - 40;

                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{
                            x: xTarget,
                            y: yTarget,
                            scale: Math.random() * 1.5 + 0.5,
                            rotate: Math.random() * 360,
                            opacity: 0
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#fbbf24' : '#f59e0b',
                            boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)'
                        }}
                    />
                );
            })}
        </div>
    );
};

const FeesTable = ({
    countryId,
    showUniversityFees = false,
    isDark = false,
    hideControls = false,
    externalLevel,
    onExternalLevelChange,
    externalUniType,
    onExternalUniTypeChange,
    userEmail = ''
}) => {
    const mbbsCosts = [
        {
            university: "Sapienza University of Rome",
            description: "Founded in 1303, one of the oldest and largest universities in Europe offering top-tier medical training.",
            rows: [
                { year: "1st Year", tuition: "€ 3,000", admin: "€ 2,500", app: "€ 30", total: "€ 5,530" },
                { year: "2nd - 6th Year", tuition: "€ 3,000", admin: "-", app: "-", total: "€ 3,000 / yr" }
            ]
        },
        {
            university: "University of Padua",
            description: "Established in 1222, internationally recognized for its high academic standards and clinical experience.",
            rows: [
                { year: "1st Year", tuition: "€ 2,800", admin: "€ 2,500", app: "€ 30", total: "€ 5,330" },
                { year: "2nd - 6th Year", tuition: "€ 2,800", admin: "-", app: "-", total: "€ 2,800 / yr" }
            ]
        }
    ];

    const [coupon, setCoupon] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [error, setError] = useState('');
    const [showPromoSuccess, setShowPromoSuccess] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);

    // Internal state overrides if props are absent
    const [internalLevel, setInternalLevel] = useState('Bachelors');
    const [internalUni, setInternalUni] = useState('Public');

    const selectedLevel = externalLevel !== undefined && externalLevel !== null ? externalLevel : internalLevel;
    const setSelectedLevel = onExternalLevelChange || setInternalLevel;

    const uniType = externalUniType !== undefined && externalUniType !== null ? externalUniType : internalUni;
    const setUniType = onExternalUniTypeChange || setInternalUni;

    const applied = couponDiscount > 0;

    // Payment Flow State
    const [isQuickAuthOpen, setIsQuickAuthOpen] = useState(false);
    const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
    const [paymentEmail, setPaymentEmail] = useState('');
    const [paymentPassword, setPaymentPassword] = useState('');
    const [paymentOrderId, setPaymentOrderId] = useState('');
    const [userPayments, setUserPayments] = useState([]);

    const fetchPayments = async () => {
        if (!userEmail) return;
        try {
            const res = await fetch(`${API_BASE_URL}/payment/history?email=${encodeURIComponent(userEmail)}`, {
                headers: { 'x-csrf-protected': '1' },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.payments) {
                    setUserPayments(data.payments);
                }
            }
        } catch (err) {
            console.error("Failed to fetch payments in FeesTable:", err);
        }
    };

    React.useEffect(() => {
        fetchPayments();
    }, [userEmail]);

    const isPhase1Paid = userPayments.some(p =>
        p.status === 'captured' &&
        (p.itemId === 'dynamic_fee' || (p.itemName && p.itemName.toLowerCase().includes('phase 1')))
    );

    const activeCouponName = applied ? coupon : '';
    const currentPhases = getPhases(countryId, uniType, selectedLevel, activeCouponName);
    const basePhases = getPhases(countryId, uniType, selectedLevel, '');

    const totalFee = basePhases.reduce((a, b) => a + b, 0);
    const discountedTotal = currentPhases.reduce((a, b) => a + b, 0);

    const getPhasePrice = (phaseIdx) => {
        if (phaseIdx === 'combined') return currentPhases[2];
        return currentPhases[phaseIdx];
    };

    const getPhasePricingDetails = (phaseIdx) => {
        if (phaseIdx === 'combined') {
            return {
                originalPrice: basePhases[2] + basePhases[3],
                discountedPrice: currentPhases[2]
            };
        }
        return {
            originalPrice: basePhases[phaseIdx],
            discountedPrice: currentPhases[phaseIdx]
        };
    };

    const getPhasePriceForLevel = (level) => {
        return getPhases(countryId, uniType, level, activeCouponName)[0];
    };

    const getOriginalPhasePriceForLevel = (level) => {
        return getPhases(countryId, uniType, level, '')[0];
    };

    const isCombined50 = countryId === 'italy' && (selectedLevel === 'Bachelors' || selectedLevel === 'Masters') && couponDiscount === 50;

    const handlePayNowClick = async () => {
        setIsQuickAuthOpen(true);
    };

    const handleQuickAuthSuccess = (email, password, program, finalCoupon, finalDiscount) => {
        if (program) {
            setSelectedLevel(program);
        }
        if (finalCoupon !== undefined && finalDiscount !== undefined) {
            setCoupon(finalCoupon);
            setCouponDiscount(finalDiscount);
        }
        setPaymentEmail(email);
        setPaymentPassword(password);
        setIsQuickAuthOpen(false);
        setPaymentOrderId(`order_${Math.random().toString(36).substring(2, 11)}`);
        setIsRazorpayOpen(true);
    };

    const handlePaymentSuccess = async () => {
        await fetchPayments();
        if (paymentEmail && paymentPassword) {
            try {
                const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                    credentials: 'include',
                    body: JSON.stringify({ identifier: paymentEmail, password: paymentPassword })
                });

                if (loginRes.ok) {
                    sessionStorage.setItem('tab_session', 'active');
                    window.location.href = '/dashboard';
                    return;
                }
            } catch (err) {
                console.error("Login failed after payment", err);
            }
        }
        window.location.href = '/dashboard';
    };

    const shouldHidePrice = uniType === 'Private' || !(countryId === 'germany' || countryId === 'italy');

    const feeStructure = [
        {
            title: "Admission Process",
            phaseIndex: 0,
            price: shouldHidePrice ? null : `₹ ${getPhasePrice(0).toLocaleString('en-IN')}`,
            icon: <FileText className="text-cyan-400" size={18} />,
            color: "from-cyan-500/10 to-blue-500/10 hover:border-cyan-400/40",
            glow: "bg-cyan-500/10",
            items: [
                "Assessment of profile",
                "Full assistance for profile building",
                "Require Documents sample will be provided",
                "Top universities Shortlisting"
            ]
        },
        ...(currentPhases[1] > 0 ? [{
            title: "After Admission",
            phaseIndex: 1,
            price: shouldHidePrice ? null : `₹ ${getPhasePrice(1).toLocaleString('en-IN')}`,
            icon: <CheckCircle2 className="text-indigo-400" size={18} />,
            color: "from-indigo-500/10 to-purple-500/10 hover:border-indigo-400/40",
            glow: "bg-indigo-500/10",
            items: [
                "University Acceptance Letter",
                "Interview Guidance",
                "Pre Enrollment Assistance",
                "Documents Verification"
            ]
        }] : []),
        ...(isCombined50 ? [{
            title: "Pre-enrollment, Scholarship & Visa",
            phaseIndex: 'combined',
            price: shouldHidePrice ? null : `₹ ${getPhasePrice(2).toLocaleString('en-IN')}`,
            icon: <Compass className="text-yellow-400" size={18} />,
            color: "from-yellow-500/10 to-amber-500/10 hover:border-yellow-400/40",
            glow: "bg-yellow-500/10",
            items: [
                "HRD attestation assistance",
                "Apostille, translation & legalization",
                "Courier charges",
                "Pre-enrollment filing",
                "DOV process assistance",
                "Scholarship Documents Process",
                "Scholarship application & submission",
                "Visa application assistance",
                "Visa Documents Assistance",
                "Accommodation proof assistance",
                "Mock interview prep"
            ]
        }] : [
            {
                title: "Pre-enrollment & Scholarship Docs",
                phaseIndex: 2,
                price: shouldHidePrice ? null : `₹ ${getPhasePrice(2).toLocaleString('en-IN')}`,
                icon: <Compass className="text-yellow-400" size={18} />,
                color: "from-yellow-500/10 to-amber-500/10 hover:border-yellow-400/40",
                glow: "bg-yellow-500/10",
                items: [
                    "HRD attestation assistance",
                    "Apostille, translation & legalization",
                    "Courier charges",
                    "Pre-enrollment filing",
                    "DOV process assistance",
                    "Scholarship Documents Process"
                ]
            },
            ...(currentPhases[3] > 0 ? [{
                title: "Scholarship application + Visa process",
                phaseIndex: 3,
                price: shouldHidePrice ? null : `₹ ${getPhasePrice(3).toLocaleString('en-IN')}`,
                icon: <ShieldCheck className="text-emerald-400" size={18} />,
                color: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-400/40",
                glow: "bg-emerald-500/10",
                items: [
                    "Scholarship application & submission",
                    "Visa application assistance",
                    "Visa Documents Assistance",
                    "Accommodation proof assistance",
                    "Mock interview prep"
                ]
            }] : [])
        ])
    ];

    // =========================================================================
    // CASE A: Compact Modal view used inside the Dashboard Subscriptions popup
    // =========================================================================
    if (hideControls) {
        const surface = 'var(--glass-popup-inner, rgba(255, 255, 255, 0.03))';
        const border = 'var(--glass-border)';
        const title = 'var(--text-main)';
        const sub = 'var(--text-muted)';
        const muted = 'var(--text-muted)';
        const accent = 'var(--accent-primary, #0ea5e9)';
        const accentBg = 'var(--filter-chip-bg)';
        const divider = 'var(--table-border)';
        const inputBg = 'var(--input-bg)';

        return (
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', fontFamily: 'inherit', position: 'relative' }}>

                {/* Grid Layout Container - Fit on screen completely */}
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="scrollbar-hide">
                    <div style={{ display: 'grid', gridTemplateColumns: feeStructure.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '12px', minHeight: 'min-content', paddingBottom: '4px', margin: 'auto 0' }}>
                        {feeStructure.map((item, idx) => {
                            const { originalPrice, discountedPrice } = getPhasePricingDetails(item.phaseIndex);
                            const displayPrice = !shouldHidePrice && discountedPrice > 0;
                            const stepNum = String(idx + 1).padStart(2, '0');

                            // Phase-specific colors & backgrounds
                            let phaseAccent = accent;
                            let phaseBg = 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)';
                            let phaseBorder = border;

                            if (idx === 0) { // Step 1: Admission (Cyan/Blue)
                                phaseAccent = '#22d3ee';
                                phaseBg = 'linear-gradient(135deg, rgba(34, 211, 238, 0.06) 0%, rgba(59, 130, 246, 0.03) 100%)';
                                phaseBorder = 'rgba(34, 211, 238, 0.25)';
                            } else if (idx === 1) { // Step 2: After Admission (Indigo/Purple)
                                phaseAccent = '#818cf8';
                                phaseBg = 'linear-gradient(135deg, rgba(129, 140, 248, 0.06) 0%, rgba(167, 139, 250, 0.03) 100%)';
                                phaseBorder = 'rgba(129, 140, 248, 0.25)';
                            } else if (idx === 2) { // Step 3: Pre-enrollment (Yellow/Amber)
                                phaseAccent = '#fbbf24';
                                phaseBg = 'linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(245, 158, 11, 0.03) 100%)';
                                phaseBorder = 'rgba(251, 191, 36, 0.25)';
                            } else if (idx === 3) { // Step 4: Visa (Emerald/Teal)
                                phaseAccent = '#34d399';
                                phaseBg = 'linear-gradient(135deg, rgba(52, 211, 153, 0.06) 0%, rgba(20, 184, 166, 0.03) 100%)';
                                phaseBorder = 'rgba(52, 211, 153, 0.25)';
                            }

                            return (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                                    style={{
                                        background: phaseBg,
                                        border: `1px solid ${phaseBorder}`,
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '14px 18px', background: 'rgba(255, 255, 255, 0.02)',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', flexShrink: 0
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: `linear-gradient(135deg, ${phaseAccent} 0%, rgba(255, 255, 255, 0.1) 100%)`,
                                                color: '#fff', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontSize: '15px', fontWeight: 800, flexShrink: 0,
                                                boxShadow: `0 2px 8px ${phaseAccent}40`
                                            }}>{stepNum}</span>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '11px', fontWeight: 900, color: phaseAccent, textTransform: 'uppercase', letterSpacing: '1px' }}>Step {idx + 1}</p>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '16px',
                                                    fontWeight: 800,
                                                    color: '#ffffff',
                                                    lineHeight: 1.2,
                                                    textDecoration: (idx === 0 && isPhase1Paid) ? 'line-through' : 'none',
                                                    opacity: (idx === 0 && isPhase1Paid) ? 0.6 : 1
                                                }}>{item.title}</p>
                                            </div>
                                        </div>
                                        {displayPrice && (
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                {applied && discountedPrice < originalPrice && (
                                                    <p style={{ margin: 0, fontSize: '11px', color: muted, textDecoration: 'line-through', fontWeight: 700 }}>₹{Math.round(originalPrice).toLocaleString('en-IN')}</p>
                                                )}
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '18px',
                                                    fontWeight: 950,
                                                    color: (idx === 0 && isPhase1Paid) ? '#10b981' : phaseAccent,
                                                    textDecoration: (idx === 0 && isPhase1Paid) ? 'line-through' : 'none',
                                                    opacity: (idx === 0 && isPhase1Paid) ? 0.6 : 1
                                                }}>₹{Math.round(discountedPrice).toLocaleString('en-IN')}</p>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '10px',
                                                    color: (idx === 0 && isPhase1Paid) ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                                                    fontWeight: 700,
                                                    textDecoration: (idx === 0 && isPhase1Paid) ? 'line-through' : 'none'
                                                }}>+ 18% GST (₹{Math.round(discountedPrice * 0.18).toLocaleString('en-IN')})</p>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '11px',
                                                    color: (idx === 0 && isPhase1Paid) ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                                                    fontWeight: 900,
                                                    textDecoration: (idx === 0 && isPhase1Paid) ? 'line-through' : 'none',
                                                    opacity: (idx === 0 && isPhase1Paid) ? 0.6 : 1
                                                }}>Total: ₹{Math.round(discountedPrice * 1.18).toLocaleString('en-IN')}</p>
                                                {idx === 0 && isPhase1Paid && (
                                                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✓ PAID</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Deliverables */}
                                    <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', alignContent: 'start', overflowY: 'auto', flex: 1 }} className="scrollbar-hide">
                                        {item.items.map((lineItem, lIdx) => (
                                            <div key={lIdx} style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                background: 'rgba(255, 255, 255, 0.015)',
                                                border: '1px solid rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                padding: '8px 12px'
                                            }}>
                                                <CheckCircle2 size={15} color={phaseAccent} style={{ flexShrink: 0 }} />
                                                <span style={{
                                                    fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)',
                                                    fontWeight: 600, lineHeight: 1.35
                                                }}>
                                                    {lineItem}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                    padding: '16px 0 0 0',
                    marginTop: '12px',
                    borderTop: `1px solid ${divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0
                }}>
                    {applied && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                marginBottom: '2px'
                            }}
                        >
                            <Ticket size={14} color="#10b981" />
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                Voucher '{coupon}' Applied
                            </span>
                        </motion.div>
                    )}
                    {!isPhase1Paid && (
                        <motion.div
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                padding: '8px 18px',
                                borderRadius: '24px'
                            }}
                        >
                            <Sparkles size={16} color="#fff" fill="#fff" />
                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                Pay 1st Phase Fee Now To Open Portal
                            </span>
                        </motion.div>
                    )}
                    <motion.button
                        whileHover={isPhase1Paid ? {} : { scale: 1.02 }} whileTap={isPhase1Paid ? {} : { scale: 0.97 }}
                        onClick={handlePayNowClick}
                        style={{
                            width: '100%', maxWidth: '400px', padding: '14px', borderRadius: '12px', cursor: isPhase1Paid ? 'default' : 'pointer',
                            background: isPhase1Paid ? 'rgba(16, 185, 129, 0.2)' : '#16a34a', color: isPhase1Paid ? '#10b981' : '#fff', fontSize: '16px', fontWeight: 900,
                            letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: isPhase1Paid ? 'none' : '0 4px 14px rgba(22,163,74,0.4)', boxSizing: 'border-box',
                            border: isPhase1Paid ? '1px solid rgba(16, 185, 129, 0.4)' : 'none'
                        }}
                    >
                        {isPhase1Paid ? (
                            <>
                                <CheckCircle2 size={18} /> First Installment Paid
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} /> Proceed to Payment
                            </>
                        )}
                    </motion.button>
                    <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <ShieldCheck size={13} color="#16a34a" /> SSL Encrypted · Razorpay
                    </p>
                </div>

                {/* Modals */}
                <QuickAuthModal
                    isOpen={isQuickAuthOpen} onClose={() => setIsQuickAuthOpen(false)}
                    onSuccess={handleQuickAuthSuccess} initialProgram={selectedLevel}
                    getFirstPhaseFee={getPhasePriceForLevel} getOriginalFirstPhaseFee={getOriginalPhasePriceForLevel}
                    countryId={countryId} initialCoupon={coupon} initialDiscount={couponDiscount}
                    hideRegistration={hideControls}
                    loggedInEmail={userEmail}
                    isPhase1Paid={isPhase1Paid}
                />
                <RazorpayGateway
                    isOpen={isRazorpayOpen} onClose={() => setIsRazorpayOpen(false)}
                    itemId="dynamic_fee"
                    pricingParams={{ countryId, uniType, selectedLevel, applied, couponCode: coupon }}
                    razorpayOrderId={paymentOrderId} userEmail={paymentEmail}
                    userPassword={paymentPassword} onPaymentSuccess={handlePaymentSuccess}
                    triggerWelcomeEmail={true}
                />
            </div>
        );
    }

    // =========================================================================
    // CASE B: Original Page View (used in public study-in-italy/germany pages)
    // =========================================================================
    const currentPricing = { total: totalFee, phase: currentPhases[0] };

    return (
        <div className="relative z-20 w-full max-w-6xl mx-auto my-8 px-4 select-none">
            {/* Header / Intro & Level Switcher grouped together (Centered) */}
            <div className="flex flex-col items-center text-center gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/10 text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md mb-3">
                        <Wallet size={12} className="text-accent-gold" /> Fee Structure
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-1">
                        Our Total Fee: {applied ? (
                            <><span className="line-through text-white/30 text-2xl md:text-4xl mr-3">₹ {currentPricing.total.toLocaleString('en-IN')}</span><span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">₹ {discountedTotal.toLocaleString('en-IN')}</span></>
                        ) : (
                            <span className="bg-gradient-to-r from-accent-gold via-amber-300 to-yellow-500 bg-clip-text text-transparent">₹ {currentPricing.total.toLocaleString('en-IN')}</span>
                        )}
                        <span className="text-[10px] text-gray-400 ml-2 font-bold uppercase tracking-widest block md:inline-block mt-2 md:mt-0 opacity-60">(18% GST applicable)</span>
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        {applied ? 'Flash Offer: Specialized Combined Packages' : 'Perfectly divided among phases'}
                    </p>

                    {/* University Type Toggle for Germany */}
                    {countryId === 'germany' && (
                        <div className="flex items-center justify-center gap-3 mt-8 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 shadow-inner">
                            {['Public', 'Private'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setUniType(type)}
                                    className={`px-10 py-4 rounded-xl text-[14px] font-black uppercase tracking-widest transition-all duration-300 ${uniType === type
                                        ? 'bg-white text-black shadow-lg scale-[1.02]'
                                        : 'text-white/40 hover:text-white/70'}`}
                                >
                                    {type} Universities
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Level Switcher (Now below and centered) */}
                <div className="flex flex-wrap justify-center gap-3">
                    {['Bachelors', 'Masters', 'MBBS'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-2 ${selectedLevel === level
                                ? 'bg-accent-gold border-accent-gold text-black shadow-[0_15px_30px_-10px_rgba(245,158,11,0.5)] scale-105'
                                : 'bg-white/[0.05] border-white/10 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Two Column Side-By-Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column (2/3 width): Phase Cards */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {feeStructure.map((item, idx) => {
                        const { originalPrice, discountedPrice } = getPhasePricingDetails(item.phaseIndex);
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -6, scale: 1.015, boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)' }}
                                transition={{ type: 'spring', damping: 15, stiffness: 100, delay: idx * 0.05 }}
                                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${item.color} backdrop-blur-2xl border border-white/5 hover:border-white/35 transition-all duration-300 overflow-hidden shadow-xl flex flex-col gap-5 cursor-default select-none h-full`}
                            >
                                {/* Dynamic Aura */}
                                <div className={`absolute top-0 right-0 w-48 h-48 ${item.glow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                {/* Phase Number, Icon, Title & Price */}
                                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center font-black text-sm text-accent-gold group-hover:scale-105 group-hover:border-white/20 transition-all shrink-0">
                                            0{idx + 1}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-accent-gold text-[10px] font-black uppercase tracking-wider mb-0.5">Phase 0{idx + 1}</p>
                                                <h3 className={`text-xl font-black text-white group-hover:text-white transition-colors tracking-tight leading-tight ${(idx === 0 && isPhase1Paid) ? 'line-through text-white/40' : ''}`}>{item.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 w-full sm:w-auto flex flex-col items-end gap-1">
                                        {!shouldHidePrice && (
                                            <>
                                                <div className="flex flex-col items-end">
                                                    {applied && discountedPrice < originalPrice && (
                                                        <span className={`text-[10px] text-gray-500 line-through font-bold ${(idx === 0 && isPhase1Paid) ? 'text-gray-600' : ''}`}>
                                                            ₹ {Math.round(originalPrice).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                    <span className={`text-lg font-black text-accent-gold tracking-tight ${(idx === 0 && isPhase1Paid) ? 'line-through text-emerald-500' : ''}`}>
                                                        ₹ {Math.round(discountedPrice).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className={`text-right text-[10px] text-gray-400 font-bold leading-normal ${(idx === 0 && isPhase1Paid) ? 'text-gray-500' : ''}`}>
                                                    <p className={`m-0 select-none ${(idx === 0 && isPhase1Paid) ? 'line-through' : ''}`}>+ 18% GST (₹ {Math.round(discountedPrice * 0.18).toLocaleString('en-IN')})</p>
                                                    <p className={`m-0 text-white font-extrabold select-none ${(idx === 0 && isPhase1Paid) ? 'line-through text-white/40' : ''}`}>Total: ₹ {Math.round(discountedPrice * 1.18).toLocaleString('en-IN')}</p>
                                                </div>
                                                {idx === 0 && isPhase1Paid && (
                                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider mt-1">✓ PAID</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Divider line inside card */}
                                <div className="h-px bg-gradient-to-r from-white/10 via-transparent to-transparent" />

                                {/* Deliverables checklist inside card */}
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 md:px-2">
                                    {item.items.map((lineItem, lIdx) => (
                                        <div key={lIdx} className="flex items-start gap-2 shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 opacity-90 group-hover:scale-110 transition-transform shrink-0" />
                                            <span className="text-sm text-gray-300 transition-colors font-medium leading-relaxed group-hover:text-gray-100">{lineItem}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Pay Now Button (Moved to bottom of phases) */}
                    <motion.button
                        whileHover={isPhase1Paid ? {} : { scale: 1.02 }}
                        whileTap={isPhase1Paid ? {} : { scale: 0.98 }}
                        onClick={handlePayNowClick}
                        className={`w-full mt-2 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 text-sm ${isPhase1Paid ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default shadow-none' : 'bg-gradient-to-r from-accent-gold via-yellow-400 to-amber-500 text-black shadow-[0_15px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.7)]'}`}
                    >
                        {isPhase1Paid ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                First Installment Paid
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Pay Now
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Right Column (1/3 width): Total Fee Card & Coupon Apply Card */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 bg-[#0a0f1d]/60 border border-white/10 p-6 rounded-[32px] backdrop-blur-2xl shadow-2xl relative h-full justify-between select-none"
                >
                    {/* Hover Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/10 rounded-full blur-[70px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col gap-4">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Fee Breakdown Summary</p>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-3">
                                    Premium Support
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCouponModal(true);
                                    }}
                                    className="px-3 py-1.5 bg-gradient-to-r from-accent-gold via-yellow-400 to-amber-500 text-black text-[10px] font-black tracking-widest uppercase rounded-xl hover:scale-105 transition-transform shadow-lg border border-white/20 mb-3"
                                >
                                    GET VOUCHER
                                </button>
                            </div>
                        </div>

                        {/* Sticker Banners */}
                        <div className="flex flex-col gap-2 select-none">
                            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between shadow-md backdrop-blur-md">
                                <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">🔥 50% OFF</span>
                                <span className="text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded font-black tracking-widest uppercase">VALID TODAY</span>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 p-3.5 rounded-2xl flex items-center justify-between shadow-md backdrop-blur-md">
                                <span className="text-xs font-black text-cyan-300 uppercase tracking-widest">✨ EARLY BIRD</span>
                                <span className="text-[9px] bg-cyan-500 text-black px-2 py-0.5 rounded font-black tracking-widest uppercase">LIMITED</span>
                            </div>
                        </div>

                        {/* Coupon Apply */}
                        <div className="flex items-center gap-2 bg-[#050811]/90 border border-white/10 p-2 rounded-2xl backdrop-blur-xl mt-1">
                            <div className="flex items-center gap-2 pl-2 text-white/50">
                                <Ticket size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="COUPON CODE"
                                value={coupon}
                                readOnly={applied}
                                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                className={`bg-transparent border-none outline-none text-white text-xs font-black placeholder-white/30 tracking-widest w-full px-1 ${applied ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                            <button
                                onClick={() => {
                                    if (applied) {
                                        setCouponDiscount(0);
                                        setCoupon('');
                                        setError('');
                                        return;
                                    }
                                    if (!coupon.trim()) return;
                                    const code = coupon.toUpperCase();
                                    if (COUPONS[code] !== undefined) {
                                        setCouponDiscount(COUPONS[code]);
                                        setError('');
                                    } else if (code.startsWith('PRESUME-')) {
                                        setCouponDiscount(50);
                                        setError('');
                                    } else {
                                        setCouponDiscount(0);
                                        setError('Invalid discount code');
                                    }
                                }}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md shrink-0 ${applied ? 'bg-rose-500/20 border border-rose-500/40 text-rose-450 hover:bg-rose-500 hover:text-white' : 'bg-accent-gold text-primary-blue hover:bg-yellow-400'}`}
                            >
                                {applied ? 'Remove' : 'Apply'}
                            </button>
                        </div>
                        {applied && (
                            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest pl-2">
                                Success! Discount code applied.
                            </p>
                        )}
                        {error && (
                            <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest pl-2">
                                {error}
                            </p>
                        )}

                        {/* Included Perks */}
                        <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                            <p className="text-[10px] font-black uppercase text-gray-400/80 tracking-widest mb-1 select-none">Included Premium Perks:</p>
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">100% Transparent Billing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Fast-Track Priority Processing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Flight/Insurance Booking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Scholarship Scouting & Review</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Pre-Departure Briefing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">VISA Interview Preparation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Post-Arrival Settling Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                                    <span className="text-xs font-medium text-gray-300">Accommodation Shortlisting Help</span>
                                </div>
                            </div>
                        </div>

                        {/* High-Impact Neon Visual Guarantee */}
                        <div className="flex flex-col items-center justify-center p-5 bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden group mt-3 backdrop-blur-xl select-none min-h-[140px] shadow-2xl">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute w-[200px] h-[200px] border-2 border-dashed border-accent-gold/30 rounded-full opacity-40 group-hover:opacity-100 group-hover:border-accent-gold/60 transition-all duration-500 pointer-events-none z-10"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.12, 1], y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-14 h-14 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)] border border-white/20 relative z-20 shrink-0 select-none group-hover:shadow-[0_0_55px_rgba(245,158,11,0.75)] duration-300"
                            >
                                <Award size={28} className="text-black font-black select-none" />
                            </motion.div>
                            <div className="text-center relative z-20 mt-3">
                                <p className="text-xs font-black text-white uppercase tracking-widest group-hover:text-accent-gold transition-colors">Premium Global Guarantee</p>
                                <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1 leading-snug uppercase">Official Authorized Partner</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl text-center mt-4 mb-2">
                        * 18% GST applicable extra.
                    </p>
                </motion.div>

            </div>

            <QuickAuthModal
                isOpen={isQuickAuthOpen}
                onClose={() => setIsQuickAuthOpen(false)}
                onSuccess={handleQuickAuthSuccess}
                initialProgram={selectedLevel}
                getFirstPhaseFee={getPhasePriceForLevel}
                getOriginalFirstPhaseFee={getOriginalPhasePriceForLevel}
                countryId={countryId}
                initialCoupon={coupon}
                initialDiscount={couponDiscount}
                hideRegistration={hideControls}
                loggedInEmail={userEmail}
                isPhase1Paid={isPhase1Paid}
            />

            <RazorpayGateway
                isOpen={isRazorpayOpen}
                onClose={() => setIsRazorpayOpen(false)}
                itemId="dynamic_fee"
                pricingParams={{ countryId, uniType, selectedLevel, applied, couponCode: coupon }}
                razorpayOrderId={paymentOrderId}
                userEmail={paymentEmail}
                userPassword={paymentPassword}
                onPaymentSuccess={handlePaymentSuccess}
                triggerWelcomeEmail={true}
            />

            {/* Coupon Generator Modal */}
            {showCouponModal && createPortal(
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.6)', // Darker dim
                    backdropFilter: 'blur(15px)', // Stronger background blur
                    WebkitBackdropFilter: 'blur(15px)',
                    zIndex: 100010,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'modalFadeIn 0.3s ease-out'
                }}>
                    <style>{`
                    @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                    }
                    @keyframes modalScaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
                    {/* Close Button Floating */}
                    <button
                        onClick={() => setShowCouponModal(false)}
                        style={{
                            position: 'absolute', top: '24px', right: '24px',
                            width: '60px', height: '60px',
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '28px', fontWeight: 300,
                            transition: 'all 0.2s', zIndex: 100011
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >✕</button>

                    <CouponPage onClose={() => setShowCouponModal(false)} defaultEmail={userEmail || ''} />
                </div>,
                document.body
            )}
        </div>
    );
};

export default FeesTable;
