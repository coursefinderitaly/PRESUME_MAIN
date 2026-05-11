import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarCheck, Clock, ShieldCheck, GraduationCap, 
    Briefcase, Plane, Compass, ChevronRight, Sparkles,
    ArrowRight, X, MapPin, Globe, Calendar, User, Mail, Phone,
    CheckCircle2, ChevronLeft
} from 'lucide-react';
import { Header } from './Header';

/* ─── Canvas Aurora + Particle Background ────────────────────────────────── */
const AnimatedBg = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let t = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Particles ──
        const NUM_PARTICLES = 160;
        const particles = Array.from({ length: NUM_PARTICLES }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2.8 + 0.6,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            alpha: Math.random() * 0.7 + 0.35,
            hue: Math.random() * 80 + 190, // blue–purple–violet range
        }));

        // ── Aurora blobs ──
        const blobs = [
            { x: 0.15, y: 0.25, r: 0.55, hue: 260, speed: 0.0006 },
            { x: 0.78, y: 0.55, r: 0.6, hue: 200, speed: 0.0005 },
            { x: 0.45, y: 0.80, r: 0.5, hue: 300, speed: 0.0007 },
            { x: 0.88, y: 0.18, r: 0.45, hue: 230, speed: 0.00055 },
            { x: 0.5, y: 0.4, r: 0.4, hue: 190, speed: 0.0004 },
        ];

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            t += 1;

            // deep dark bg
            ctx.fillStyle = '#050810';
            ctx.fillRect(0, 0, W, H);

            // ── Aurora blobs ──
            blobs.forEach((b, i) => {
                const cx = (b.x + Math.sin(t * b.speed + i) * 0.22) * W;
                const cy = (b.y + Math.cos(t * b.speed * 1.4 + i) * 0.18) * H;
                const radius = b.r * Math.min(W, H);
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                const pulse = 0.28 + 0.12 * Math.sin(t * 0.012 + i);
                grad.addColorStop(0, `hsla(${b.hue + Math.sin(t * 0.006) * 25}, 90%, 65%, ${pulse})`);
                grad.addColorStop(0.45, `hsla(${b.hue + 40}, 80%, 55%, ${pulse * 0.5})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, W, H);
            });

            // ── Grid lines ──
            ctx.strokeStyle = 'rgba(140,160,255,0.07)';
            ctx.lineWidth = 1;
            const gridSize = 55;
            for (let x = 0; x < W; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            // ── Particles ──
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;

                const twinkle = p.alpha * (0.55 + 0.45 * Math.sin(t * 0.04 + p.x * 0.01));

                // glow halo
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                glow.addColorStop(0, `hsla(${p.hue}, 95%, 85%, ${twinkle * 0.6})`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fill();

                // core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${twinkle})`;
                ctx.fill();
            });

            // ── Shooting stars (more frequent) ──
            if (t % 120 < 3) {
                const sx = Math.random() * W * 0.7;
                const sy = Math.random() * H * 0.4;
                const len = 140 + Math.random() * 180;
                const angle = Math.PI / 5;
                const ex = sx + len * Math.cos(angle);
                const ey = sy + len * Math.sin(angle);
                const grad = ctx.createLinearGradient(sx, sy, ex, ey);
                grad.addColorStop(0, 'rgba(255,255,255,0)');
                grad.addColorStop(0.4, 'rgba(220,240,255,1)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }

            // ── Vignette ──
            const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
            vig.addColorStop(0, 'transparent');
            vig.addColorStop(1, 'rgba(3,5,15,0.65)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, W, H);

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0, pointerEvents: 'none' }}
        />
    );
};

/* ─────────────────────────────────────────────────────────────────────────── */

const AppointmentForm = () => {
    const [step, setStep] = useState('SERVICES'); // SERVICES, DESTINATIONS, CALENDAR, INFO, SUMMARY
    const [formData, setFormData] = useState({
        consultancyType: 'Study Visa Consultancy',
        subOption: '',
        date: '',
        time: '',
        fullname: '',
        email: '',
        phone: ''
    });
    const [currentDate, setCurrentDate] = useState(new Date());

    const consultancyTypes = [
        { 
            id: 'study', 
            label: 'Study Visa Consultancy', 
            icon: GraduationCap, 
            options: [
                "Germany Visa Consultancy", "Europian Union Visa Consultancy", "Italy Visa Consultancy", 
                "USA Visa Consultancy", "United Kingdom Visa Consultancy", "Canada Visa Consultancy", 
                "Australia Visa Consultancy", "Other Country Visa Consultancy"
            ]
        },
        { 
            id: 'work', 
            label: 'Work Visa Consultancy', 
            icon: Briefcase, 
            options: [
                "Europian Union Visa Consultancy", "Czech Republic Visa Consultancy", "Serbia Visa Consultancy", 
                "Germany Visa Consultancy", "Other Country Visa Consultancy"
            ]
        },
        { 
            id: 'tourist', 
            label: 'Tourist Visa Consultancy', 
            icon: Plane, 
            options: [
                "Europian Union Visa Consultancy", "USA Visa Consultancy", "Canada Visa Consultancy", 
                "UAE Visa Consultancy", "Malaysia Visa Consultancy", "Japan Visa Consultancy", 
                "Other Country Visa Consultancy"
            ]
        },
        { 
            id: 'program', 
            label: 'Program Visa Consultancy', 
            icon: Compass, 
            options: [
                "Norway Visa Consultancy", "Neitherlands Visa Consultancy", "Italy Visa Consultancy", 
                "France Visa Consultancy", "Germany Visa Consultancy", "Other Country Visa Consultancy"
            ]
        }
    ];

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Country dial-code data
    const countries = [
        { name: 'India', code: 'IN', dial: '+91', maxDigits: 10 },
        { name: 'United States', code: 'US', dial: '+1', maxDigits: 10 },
        { name: 'United Kingdom', code: 'GB', dial: '+44', maxDigits: 10 },
        { name: 'Canada', code: 'CA', dial: '+1', maxDigits: 10 },
        { name: 'Australia', code: 'AU', dial: '+61', maxDigits: 9 },
        { name: 'Germany', code: 'DE', dial: '+49', maxDigits: 11 },
        { name: 'France', code: 'FR', dial: '+33', maxDigits: 9 },
        { name: 'Italy', code: 'IT', dial: '+39', maxDigits: 10 },
        { name: 'UAE', code: 'AE', dial: '+971', maxDigits: 9 },
        { name: 'Saudi Arabia', code: 'SA', dial: '+966', maxDigits: 9 },
        { name: 'Pakistan', code: 'PK', dial: '+92', maxDigits: 10 },
        { name: 'Bangladesh', code: 'BD', dial: '+880', maxDigits: 10 },
        { name: 'Nepal', code: 'NP', dial: '+977', maxDigits: 10 },
        { name: 'Sri Lanka', code: 'LK', dial: '+94', maxDigits: 9 },
        { name: 'Malaysia', code: 'MY', dial: '+60', maxDigits: 9 },
        { name: 'Singapore', code: 'SG', dial: '+65', maxDigits: 8 },
        { name: 'Japan', code: 'JP', dial: '+81', maxDigits: 10 },
        { name: 'China', code: 'CN', dial: '+86', maxDigits: 11 },
        { name: 'Norway', code: 'NO', dial: '+47', maxDigits: 8 },
        { name: 'Netherlands', code: 'NL', dial: '+31', maxDigits: 9 },
        { name: 'Czech Republic', code: 'CZ', dial: '+420', maxDigits: 9 },
        { name: 'Serbia', code: 'RS', dial: '+381', maxDigits: 9 },
    ];
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default India

    const handleTypeSelect = (label) => {
        setFormData(prev => ({ ...prev, consultancyType: label, subOption: '' }));
        setStep('DESTINATIONS');
    };

    const handleSubOptionSelect = (option) => {
        setFormData(prev => ({ ...prev, subOption: option }));
        setStep('CALENDAR');
    };

    const handleFinalBook = () => {
        setIsConfirmed(true);
        setTimeout(() => {
            setIsConfirmed(false);
            setStep('SERVICES');
            setFormData({
                consultancyType: 'Study Visa Consultancy',
                subOption: '',
                date: '',
                time: '',
                fullname: '',
                email: '',
                phone: ''
            });
        }, 4000);
    };

    const activeType = consultancyTypes.find(t => t.label === formData.consultancyType);

    // Dynamic Calendar Logic
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const currentDaysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();
    const startingBlankDays = (firstDayOfMonth + 6) % 7; // Monday = 0
    const blankDaysArray = Array.from({ length: startingBlankDays }, (_, i) => i);
    const daysInMonth = Array.from({ length: currentDaysInMonth }, (_, i) => i + 1);
    const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

    const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));

    const stepVariants = {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
        exit: { opacity: 0, y: -12, transition: { duration: 0.2 } }
    };

    const stepIndex = { SERVICES: 1, DESTINATIONS: 2, CALENDAR: 3, INFO: 4, SUMMARY: 5 };
    const stepLabel = {
        SERVICES: 'Choose Service',
        DESTINATIONS: 'Select Destination',
        CALENDAR: 'Select Date & Time',
        INFO: 'Your Information',
        SUMMARY: 'Review & Book'
    };

    const goBack = () => {
        if (step === 'DESTINATIONS') setStep('SERVICES');
        if (step === 'CALENDAR') setStep('DESTINATIONS');
        if (step === 'INFO') setStep('CALENDAR');
        if (step === 'SUMMARY') setStep('INFO');
    };

    return (
        <div className="h-screen bg-[#050810] text-white font-sans flex flex-col relative overflow-hidden">
            
            {/* ── ANIMATED CANVAS BACKGROUND ───────────────────────── */}
            <AnimatedBg />

            <Header />

            <main className="flex-1 relative z-10 flex items-center justify-center px-4 py-4" style={{ overflow: 'hidden', minHeight: 0 }}>
                <motion.div
                    layout
                    style={{ width: '100%', maxWidth: '900px', maxHeight: '100%' }}
                    className="flex flex-col relative overflow-hidden rounded-[36px]
                               bg-white/[0.04] border border-white/10
                               shadow-[0_40px_100px_rgba(0,0,0,0.8)]
                               backdrop-blur-2xl"
                >
                    {/* ── INNER POPUP VIDEO + BLOBS ─────────────────── */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[36px]">
                        <video autoPlay loop muted playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-[0.12] mix-blend-color-dodge"
                            style={{ filter: 'blur(14px)' }}>
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-purple-neon-lights-tunnel-in-black-background-4340-large.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d18]/95 via-[#0a0d18]/60 to-[#0a0d18]/95" />

                        {/* animated glowing orbs */}
                        <motion.div
                            animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                            className="absolute -top-1/3 -right-1/4 w-[55%] h-[55%] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(197,168,128,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }}
                        />
                        <motion.div
                            animate={{ scale: [1.2, 0.9, 1.2], rotate: [0, -180, -360] }}
                            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                            className="absolute -bottom-1/3 -left-1/4 w-[55%] h-[55%] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }}
                        />
                        <motion.div
                            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
                            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/2 left-1/2 w-[30%] h-[30%] rounded-full"
                            style={{ transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
                        />
                    </div>

                    {/* ── MODAL CONTENT ─────────────────────────────── */}
                    <div className="relative z-10 flex flex-col h-full min-h-0 p-6 sm:p-8" style={{ overflow: 'hidden' }}>

                        {/* ── HEADER ROW (no overlap!) ──────────────── */}
                        <div className="flex-shrink-0 mb-5">
                            {/* Step pills */}
                            <div className="flex items-center justify-center gap-1.5 mb-4">
                                {Object.keys(stepLabel).map((s, i) => (
                                    <div key={s} className={`h-1 rounded-full transition-all duration-500 ${
                                        stepIndex[step] > i 
                                            ? 'bg-amber-400 w-8' 
                                            : stepIndex[step] === i + 1 
                                                ? 'bg-amber-400 w-10' 
                                                : 'bg-white/20 w-6'
                                    }`} />
                                ))}
                            </div>

                            {/* Title row — back button LEFT, title CENTER, step label RIGHT */}
                            <div className="grid grid-cols-3 items-center">
                                <div className="flex justify-start">
                                    {step !== 'SERVICES' && (
                                        <button onClick={goBack}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-300 hover:text-white text-sm font-bold">
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                    )}
                                </div>
                                <div className="text-center">
                                    <AnimatePresence mode="wait">
                                        <motion.h2
                                            key={step}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-xl sm:text-2xl font-black uppercase tracking-[0.12em] text-white"
                                            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
                                        >
                                            {stepLabel[step]}
                                        </motion.h2>
                                    </AnimatePresence>
                                </div>
                                <div className="flex justify-end">
                                    <span className="text-[10px] text-amber-400 font-black uppercase tracking-[0.25em] bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
                                        {stepIndex[step]} / 5
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex-shrink-0 h-px bg-white/8 mb-5" />

                        {/* ── STEP CONTENT ──────────────────────────── */}
                        <div className="flex-1 min-h-0 pr-1" style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(251,191,36,0.3) transparent'
                        }}>
                            <AnimatePresence mode="wait">

                                {/* STEP 1 — Services */}
                                {step === 'SERVICES' && (
                                    <motion.div key="services" {...stepVariants} className="grid grid-cols-2 gap-4 p-1">
                                        {consultancyTypes.map((type) => (
                                            <motion.button
                                                key={type.id}
                                                whileHover={{ y: -3, boxShadow: '0 12px 40px -8px rgba(251,191,36,0.35)' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleTypeSelect(type.label)}
                                                className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-amber-400/30 transition-all group flex flex-col items-center gap-3 overflow-hidden"
                                            >
                                                <div className="p-4 rounded-2xl bg-white/10 group-hover:bg-amber-400 text-gray-200 group-hover:text-black transition-all shadow-lg">
                                                    <type.icon size={30} />
                                                </div>
                                                <span className="text-sm font-black uppercase tracking-wider text-center text-white/90 group-hover:text-white">{type.label}</span>
                                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* STEP 2 — Destinations */}
                                {step === 'DESTINATIONS' && (
                                    <motion.div key="destinations" {...stepVariants} className="grid grid-cols-2 gap-3">
                                        {activeType?.options.map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSubOptionSelect(option)}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-amber-400/40 hover:bg-white/[0.08] transition-all text-left group"
                                            >
                                                <span className="text-sm font-bold text-gray-300 group-hover:text-white">{option}</span>
                                                <ArrowRight size={16} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* STEP 3 — Calendar (two-column layout) */}
                                {step === 'CALENDAR' && (
                                    <motion.div key="calendar" {...stepVariants} className="grid grid-cols-2 gap-6">

                                        {/* LEFT: Calendar */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-black text-sm text-white uppercase tracking-widest">{currentMonth} {currentYear}</h4>
                                                <div className="flex gap-1.5">
                                                    <button onClick={handlePrevMonth} className="p-1.5 bg-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all">
                                                        <ChevronLeft size={16}/>
                                                    </button>
                                                    <button onClick={handleNextMonth} className="p-1.5 bg-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all">
                                                        <ChevronRight size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-500 mb-1.5 uppercase">
                                                {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1">
                                                {blankDaysArray.map(d => <div key={`b-${d}`} className="h-8" />)}
                                                {daysInMonth.map(d => (
                                                    <button
                                                        key={d}
                                                        onClick={() => setFormData(p => ({ ...p, date: `${currentMonth} ${d}, ${currentYear}` }))}
                                                        className={`h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                                                            formData.date === `${currentMonth} ${d}, ${currentYear}`
                                                                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.6)] scale-105'
                                                                : 'hover:bg-white/15 text-white/80 hover:text-white bg-white/5'
                                                        }`}
                                                    >{d}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* RIGHT: Time slots + Continue */}
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Available Time Slots</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {times.map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData(p => ({ ...p, time: t }))}
                                                            className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all text-center ${
                                                                formData.time === t
                                                                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                                                                    : 'bg-white/5 border-white/15 text-gray-300 hover:border-white/40 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >{t}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Selected summary */}
                                            {(formData.date || formData.time) && (
                                                <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl p-3 text-xs text-amber-300 font-bold space-y-1">
                                                    {formData.date && <div>📅 {formData.date}</div>}
                                                    {formData.time && <div>🕐 {formData.time}</div>}
                                                </div>
                                            )}

                                            <button
                                                disabled={!formData.date || !formData.time}
                                                onClick={() => setStep('INFO')}
                                                className="mt-auto w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl font-black uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(251,191,36,0.25)] transition-all active:scale-95"
                                            >
                                                Continue →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4 — Info */}
                                {step === 'INFO' && (
                                    <motion.div key="info" {...stepVariants} className="space-y-4 max-w-lg mx-auto w-full">

                                        {/* Full Name */}
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={formData.fullname}
                                                onChange={(e) => {
                                                    setFormData(p => ({ ...p, fullname: e.target.value }));
                                                    if (e.target.value) setFormErrors(p => ({ ...p, fullname: '' }));
                                                }}
                                                className={`w-full bg-white/[0.06] border rounded-2xl py-4 pl-12 pr-5 text-sm text-white font-semibold focus:outline-none focus:bg-white/[0.1] transition-all placeholder:text-gray-600 ${
                                                    formErrors.fullname ? 'border-red-500/60' : 'border-white/15 focus:border-amber-400'
                                                }`}
                                            />
                                            {formErrors.fullname && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{formErrors.fullname}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                type="email"
                                                placeholder="Email Address (e.g. name@gmail.com)"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData(p => ({ ...p, email: e.target.value }));
                                                    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
                                                    setFormErrors(p => ({ ...p, email: valid ? '' : 'Enter a valid email address' }));
                                                }}
                                                className={`w-full bg-white/[0.06] border rounded-2xl py-4 pl-12 pr-5 text-sm text-white font-semibold focus:outline-none focus:bg-white/[0.1] transition-all placeholder:text-gray-600 ${
                                                    formErrors.email ? 'border-red-500/60' : 'border-white/15 focus:border-amber-400'
                                                }`}
                                            />
                                            {formErrors.email && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1">{formErrors.email}</p>}
                                        </div>

                                        {/* Country + Phone */}
                                        <div className="space-y-2">
                                            {/* Country Selector */}
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                <select
                                                    value={selectedCountry.code}
                                                    onChange={(e) => {
                                                        const c = countries.find(x => x.code === e.target.value);
                                                        setSelectedCountry(c);
                                                        setFormData(p => ({ ...p, phone: '' }));
                                                        setFormErrors(p => ({ ...p, phone: '' }));
                                                    }}
                                                    className="w-full bg-white/[0.06] border border-white/15 rounded-2xl py-4 pl-12 pr-5 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 focus:bg-white/[0.1] transition-all appearance-none cursor-pointer"
                                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                                >
                                                    {countries.map(c => (
                                                        <option key={c.code} value={c.code} style={{ background: '#0d1117', color: '#fff' }}>
                                                            {c.name} ({c.dial})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
                                            </div>

                                            {/* Phone with dial prefix */}
                                            <div className="relative group flex items-stretch">
                                                {/* Prefix badge */}
                                                <div className="flex items-center px-4 bg-white/[0.08] border border-white/15 border-r-0 rounded-l-2xl text-sm font-black text-amber-400 whitespace-nowrap flex-shrink-0">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                    {selectedCountry.dial}
                                                </div>
                                                <input
                                                    type="tel"
                                                    placeholder={`${selectedCountry.maxDigits}-digit number`}
                                                    value={formData.phone}
                                                    maxLength={selectedCountry.maxDigits}
                                                    onChange={(e) => {
                                                        const digits = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxDigits);
                                                        setFormData(p => ({ ...p, phone: digits }));
                                                        const err = digits.length < selectedCountry.maxDigits && digits.length > 0
                                                            ? `${selectedCountry.name} numbers require ${selectedCountry.maxDigits} digits`
                                                            : '';
                                                        setFormErrors(p => ({ ...p, phone: err }));
                                                    }}
                                                    className={`flex-1 bg-white/[0.06] border rounded-r-2xl py-4 px-4 text-sm text-white font-semibold focus:outline-none focus:bg-white/[0.1] transition-all placeholder:text-gray-600 ${
                                                        formErrors.phone ? 'border-red-500/60' : 'border-white/15 focus:border-amber-400'
                                                    }`}
                                                />
                                            </div>
                                            {formErrors.phone && <p className="text-red-400 text-[10px] font-bold ml-1">{formErrors.phone}</p>}
                                            {formData.phone.length > 0 && !formErrors.phone && formData.phone.length === selectedCountry.maxDigits && (
                                                <p className="text-green-400 text-[10px] font-bold ml-1">✓ Valid phone number</p>
                                            )}
                                        </div>

                                        <button
                                            disabled={!formData.fullname || !formData.email || formData.phone.length !== selectedCountry.maxDigits || !!formErrors.email}
                                            onClick={() => setStep('SUMMARY')}
                                            className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black rounded-2xl font-black uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(251,191,36,0.25)] transition-all active:scale-95 mt-2"
                                        >
                                            Review Summary
                                        </button>
                                    </motion.div>
                                )}

                                {/* STEP 5 — Summary (2-col compact, no scroll) */}
                                {step === 'SUMMARY' && (
                                    <motion.div key="summary" {...stepVariants} className="w-full flex flex-col gap-3">

                                        {/* 2-col grid of summary cards */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { label: 'Service', value: formData.consultancyType, icon: Globe },
                                                { label: 'Destination', value: formData.subOption, icon: MapPin },
                                                { label: 'Date', value: formData.date, icon: CalendarCheck },
                                                { label: 'Time', value: formData.time, icon: Clock },
                                                { label: 'Name', value: formData.fullname, icon: User },
                                                { label: 'Contact', value: `${selectedCountry.dial} ${formData.phone} · ${formData.email}`, icon: Mail },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                                                        <item.icon size={15} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{item.label}</p>
                                                        <p className="text-xs font-semibold text-white mt-0.5 truncate">{item.value || '—'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleFinalBook}
                                            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Confirm Booking <CheckCircle2 size={18} />
                                        </button>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── SUCCESS OVERLAY ───────────────────────────── */}
                    <AnimatePresence>
                        {isConfirmed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 z-[100] bg-[#050810]/97 flex flex-col items-center justify-center text-center p-10 rounded-[36px] backdrop-blur-xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border border-green-500/40"
                                    style={{ boxShadow: '0 0 60px rgba(34,197,94,0.25)' }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Appointment Booked</h3>
                                <p className="text-gray-400 text-sm max-w-xs leading-relaxed">Your premium consultation session is confirmed. Check your email for full details.</p>
                                <button
                                    onClick={() => setIsConfirmed(false)}
                                    className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-gray-300"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
};

export default AppointmentForm;
