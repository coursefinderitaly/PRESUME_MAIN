import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Wallet, FileText, Compass, Award, ShieldCheck, Ticket } from 'lucide-react';

const FeesTable = () => {
    const [coupon, setCoupon] = useState('');
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('Bachelors');

    const pricing = {
        'Bachelors': [30000, 15000, 40000, 35000],
        'Masters': [30000, 15000, 40000, 35000],
        'MBBS': [35000, 0, 65000, 60000]
    };

    const currentPhases = pricing[selectedLevel];
    const totalFee = currentPhases.reduce((a, b) => a + b, 0);
    const discountedTotal = 60000; // Fixed discounted total as per request

    const feeStructure = [
        {
            title: "Admission Process",
            price: `₹ ${currentPhases[0].toLocaleString('en-IN')}`,
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
            price: `₹ ${currentPhases[1].toLocaleString('en-IN')}`,
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
        {
            title: "Pre-enrollment & Scholarship Docs",
            price: `₹ ${currentPhases[2].toLocaleString('en-IN')}`,
            icon: <Compass className="text-yellow-400" size={18} />,
            color: "from-yellow-500/10 to-amber-500/10 hover:border-yellow-400/40",
            glow: "bg-yellow-500/10",
            items: [
                "HRD attestation assistance",
                "Apostille, translation & legalization",
                "Courier charges",
                "Pre-enrollment filing",
                "DOV process assistance",
                "Financial Guidance"
            ]
        },
        {
            title: "Scholarship application + Visa process",
            price: `₹ ${currentPhases[3].toLocaleString('en-IN')}`,
            icon: <ShieldCheck className="text-emerald-400" size={18} />,
            color: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-400/40",
            glow: "bg-emerald-500/10",
            items: [
                "Scholarship application & submission",
                "Visa application assistance",
                "Visa/Scholarship Documents Assistance",
                "1-year travel insurance & itinerary",
                "Accommodation proof assistance",
                "Mock interview prep"
            ]
        }
    ];

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
                    {applied ? (
                        <>
                            {/* Card 1: Admission & Post-Admission */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group relative p-6 rounded-[32px] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 backdrop-blur-3xl border border-cyan-500/30 overflow-hidden shadow-xl flex flex-col gap-5"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-cyan-500 text-black rounded-xl flex items-center justify-center font-black shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-tight">Admission & Post-Admission</h3>
                                            <p className="text-cyan-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Phases 01 & 02 Combined</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <div className="px-5 py-2 rounded-xl bg-black/60 border border-cyan-500/30 text-center">
                                            <span className="text-xl font-black text-white tracking-tighter">₹ 35,000</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                                    {[...feeStructure[0].items, ...(feeStructure[1].title === "After Admission" ? feeStructure[1].items : [])].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-1 shrink-0" />
                                            <span className="text-xs text-gray-300 font-medium leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Card 2: Pre-enrollment, Scholarship & Visa */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="group relative p-6 rounded-[32px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 backdrop-blur-3xl border border-emerald-500/30 overflow-hidden shadow-xl flex flex-col gap-5"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-emerald-500 text-black rounded-xl flex items-center justify-center font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
                                            <Compass size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white tracking-tight">Pre-enrollment, Scholarship & Visa</h3>
                                            <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Phases 03 & 04 Combined</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <div className="px-5 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-center">
                                            <span className="text-xl font-black text-white tracking-tighter">₹ 25,000</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                                    {[...feeStructure[feeStructure.length - 2].items, ...feeStructure[feeStructure.length - 1].items].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1 shrink-0" />
                                            <span className="text-xs text-gray-300 font-medium leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        feeStructure.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${item.color} backdrop-blur-2xl border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-xl flex flex-col gap-5 cursor-default select-none h-full`}
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
                                                <h3 className="text-xl font-black text-white group-hover:text-white transition-colors tracking-tight leading-tight">{item.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 w-full sm:w-auto">
                                        <span className="px-5 py-2.5 rounded-2xl bg-black/70 border border-white/10 text-sm font-black text-accent-gold tracking-widest shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)] group-hover:bg-accent-gold group-hover:text-black transition-all duration-300 block text-center min-w-[110px]">
                                            {item.price}
                                        </span>
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
                        )))}
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
                            <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-3">
                                Premium Support
                            </h2>
                        </div>

                        {/* Redesigned Large Sticker Banner Cards */}
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
                                        setApplied(false);
                                        setCoupon('');
                                        setError('');
                                        return;
                                    }
                                    if (!coupon.trim()) return;
                                    const code = coupon.toUpperCase();
                                    if (code === 'PRESUME' || code === 'NEET') {
                                        setApplied(true);
                                        setError('');
                                    } else {
                                        setApplied(false);
                                        setError('Invalid discount code');
                                    }
                                }}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 shadow-md shrink-0 ${applied ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-accent-gold text-primary-blue hover:bg-yellow-400'}`}
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
                        {/* Premium Features Included */}
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

                        {/* High-Impact Neon Visual Animated Object */}
                        <div className="flex flex-col items-center justify-center p-5 bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden group mt-3 backdrop-blur-xl select-none min-h-[140px] shadow-2xl">
                            {/* Rotating Neon Glow Ring in background */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute w-[200px] h-[200px] border-2 border-dashed border-accent-gold/30 rounded-full opacity-40 group-hover:opacity-100 group-hover:border-accent-gold/60 transition-all duration-500 pointer-events-none z-10"
                            />
                            {/* Inner pulsating glowing orb */}
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

                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl text-center mt-4">
                        * 18% GST applicable extra.
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default FeesTable;
