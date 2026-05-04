import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Landmark, Sparkles, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import FeesTable from './FeesTable';
import { countryData } from '../data/countryData';

const GenericCountryPage = ({ countryId }) => {
    const data = countryData[countryId?.toLowerCase()];

    // State for interactive document checklist
    const [checkedDocs, setCheckedDocs] = useState({});

    if (!data) {
        return <Navigate to="/" />;
    }

    const toggleDoc = (category, index) => {
        const key = `${category}-${index}`;
        setCheckedDocs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0d18] text-white font-sans overflow-x-hidden relative">
            {/* Blurred Background (Video or Image) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute inset-0">
                    {data.videoSrc ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover blur-[4px] opacity-40 scale-105"
                        >
                            <source src={data.videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={`/uni/bologna.jpg`}
                            alt="Background"
                            className="w-full h-full object-cover blur-[8px] opacity-20 scale-105 grayscale"
                        />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0d18] via-[#0a0d18]/80 to-transparent z-10"></div>
            </div>

            <Header />

            <main className="relative z-10 flex-1">
                {/* Hero Section */}
                <section className="h-[100svh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-10 w-full relative overflow-hidden">
                    <div className="max-w-screen-2xl w-full mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 h-full">

                        {/* Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="max-w-3xl relative z-20 w-full flex flex-col justify-center h-full"
                        >
                            <div className="flex items-center gap-4 mb-4 md:mb-6">
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.5, duration: 0.8 }}
                                    className="h-[2px] bg-accent-gold"
                                ></motion.div>
                                <span className="text-[10px] md:text-xs font-black tracking-[0.4em] text-accent-gold uppercase">{data.subtitle}</span>
                            </div>

                            <h1 className="text-[12vh] md:text-[15vh] lg:text-[18vh] font-black tracking-tighter leading-[0.8] mb-6 text-white relative select-none drop-shadow-2xl">
                                {data.heroText}<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-accent-gold">{data.heroHighlight}</span>
                            </h1>

                            <p className="text-sm md:text-lg lg:text-xl text-gray-300 font-medium leading-relaxed mb-8 max-w-xl border-l-2 border-white/20 pl-6 ">
                                {data.heroDesc}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto md:mt-0">
                                <button className="w-full sm:w-auto group relative px-8 py-4 md:px-10 md:py-5 bg-white text-[#0a0d18] rounded-full font-black tracking-widest text-[11px] md:text-[13px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
                                    <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                    <span className="relative flex items-center justify-center gap-3 group-hover:text-[#0a0d18] transition-colors duration-500">
                                        START APPLICATION <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Side: Orbital Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="hidden lg:flex relative w-full max-w-[600px] h-full items-center justify-center pointer-events-none select-none perspective-[1200px]"
                        >
                            <div className="absolute w-[45vh] h-[45vh] bg-accent-gold/10 rounded-full blur-[100px] animate-pulse"></div>
                            
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-[55vh] h-[55vh] rounded-full border border-white/[0.05] border-l-accent-gold/20" />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute w-[45vh] h-[45vh] rounded-full border border-white/[0.03] border-t-blue-500/20 border-dashed" />

                            <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                                {/* Center Card */}
                                <motion.div
                                    animate={{ y: [-12, 12, -12], rotateX: [0, 5, 0], rotateY: [0, -5, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute p-10 rounded-[40px] bg-gradient-to-br from-[#0a0d18]/95 to-yellow-900/40 backdrop-blur-[60px] border border-accent-gold/30 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex items-center gap-8 z-50"
                                >
                                    <div className="w-20 h-20 rounded-[24px] bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30">
                                        {data.currencyIcon}
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black text-white tracking-tighter mb-1">{data.currencyValue}</div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-accent-gold font-bold">{data.currencyText}</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 pb-20 pt-20">
                    {/* The Advantage */}
                    <div className="mb-32 relative z-20">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">The {data.name} Advantage</h2>
                                <p className="text-gray-400 text-lg font-medium">Unparalleled academic, financial, and cultural benefits.</p>
                            </div>
                            <Sparkles className="w-10 h-10 text-accent-gold/50 mb-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.opportunities.map((opp, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-8 rounded-[32px] backdrop-blur-[40px] border transition-all duration-500 shadow-xl group hover:-translate-y-1 ${opp.colSpan} ${opp.bg}`}
                                >
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform">
                                            {opp.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-3 text-white">{opp.title}</h3>
                                            <p className="text-gray-300 text-sm font-medium opacity-80">{opp.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Programs */}
                    <div className="mb-32 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Popular Programs</h2>
                            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">World-renowned degrees tailored for international students.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.popularCourses.map((course, idx) => (
                                <div key={idx} className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-[32px] hover:border-accent-gold/30 transition-all shadow-xl group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                                        {course.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-4">{course.category}</h3>
                                    <div className="space-y-2 mb-6 flex-1">
                                        {course.programs.map((prog, pIdx) => (
                                            <div key={pIdx} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0 mt-1.5"></div>
                                                <span className="text-sm text-gray-300 font-medium">{prog}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-white/10 mt-auto">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Top Institutions</div>
                                        <div className="text-xs text-gray-400 font-medium">{course.institutions}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compact Study Levels Grid */}
                    {data.studyLevels && (
                        <div className="mb-32 relative z-20">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Study Levels in {data.name}</h2>
                                <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Find the right path for your academic journey and prepare your documents.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full max-w-5xl bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

                                {data.studyLevels.map(level => (
                                    <div key={level.id} className={`p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-[30px] shadow-2xl relative overflow-hidden flex flex-col hover:border-white/20 transition-all`}>
                                        <div className={`absolute top-0 right-0 w-32 h-32 ${level.bgGlow} rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none`}></div>
                                        
                                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4 relative z-10">
                                            {level.icon}
                                            <h3 className="text-2xl font-black text-white tracking-tight">{level.title}</h3>
                                        </div>

                                        <div className="space-y-6 flex-1 relative z-10">
                                            {/* Eligibility */}
                                            <div>
                                                <h4 className={`text-xs font-bold ${level.themeColor} mb-2.5 uppercase tracking-wider`}>Eligibility</h4>
                                                <ul className="space-y-1.5">
                                                    {level.eligibility.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                                            <CheckCircle2 className={`w-3.5 h-3.5 ${level.themeColor} shrink-0 mt-0.5`} />
                                                            <span className="leading-snug">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Exam */}
                                            <div>
                                                <h4 className={`text-xs font-bold ${level.themeColor} mb-2.5 uppercase tracking-wider`}>Admissions / Exam</h4>
                                                <div className={`${level.bgBox} border ${level.borderBox} p-3 rounded-xl text-xs text-gray-300 leading-relaxed font-medium`}>
                                                    {level.exam}
                                                </div>
                                            </div>

                                            {/* Docs Checklist */}
                                            <div>
                                                <h4 className={`text-xs font-bold ${level.themeColor} mb-2.5 uppercase tracking-wider flex items-center gap-1.5`}>
                                                    <FileText className="w-3.5 h-3.5" /> Required Docs
                                                </h4>
                                                <div className="space-y-2 mb-6">
                                                    {level.docs.map((doc, i) => {
                                                        const isChecked = !!checkedDocs[`${level.id}-${i}`];
                                                        return (
                                                            <label key={i} className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${isChecked ? `${level.checkedBg} ${level.checkedBorder}` : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                                                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => toggleDoc(level.id, i)}
                                                                        className={`peer appearance-none w-4 h-4 border-2 border-gray-500 rounded bg-transparent ${level.checkedInput} cursor-pointer transition-colors`}
                                                                    />
                                                                    <CheckCircle2 className="absolute text-[#0a0d18] w-3 h-3 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={4} />
                                                                </div>
                                                                <span className={`text-[11px] leading-tight transition-colors ${isChecked ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                                    {doc}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>

                                                {/* Check Eligibility Button */}
                                                <button className={`w-full py-4 rounded-2xl bg-white/5 border ${level.borderBox} hover:${level.checkedBg} transition-all duration-300 group/btn`}>
                                                    <span className={`text-[10px] font-black tracking-[0.2em] ${level.themeColor} flex items-center justify-center gap-2 uppercase`}>
                                                        Check Eligibility 
                                                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tuition & Cost */}
                    <div className="mb-32 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Tuition & Costs</h2>
                            <p className="text-gray-400 text-lg font-medium">Estimated expenses for studying in {data.name}.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {data.tuitionCards.map((uni, idx) => (
                                <div key={idx} className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-[40px] overflow-hidden hover:border-accent-gold/30 transition-all shadow-2xl flex flex-col">
                                    <div className="p-10 pb-8 border-b border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Landmark className="w-32 h-32" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-3 relative z-10">{uni.university}</h3>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm relative z-10">{uni.description}</p>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col justify-center gap-4 bg-white/[0.01]">
                                        {uni.rows.map((row, rIdx) => (
                                            <div key={rIdx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-[#0a0d18]/40 border border-white/5 gap-4">
                                                <div>
                                                    <div className="text-white font-bold mb-1">{row.year}</div>
                                                </div>
                                                <div className="text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                                                    <div className="text-2xl font-black text-white">{row.total}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <FeesTable />

                    {/* Journey Timeline */}
                    <div className="relative py-24 rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-[40px] px-6 md:px-20 shadow-2xl z-20">
                        <div className="text-center mb-20 relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Your Road to {data.name}</h2>
                            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">From application to arrival, we guide you every step of the way.</p>
                        </div>
                        <div className="max-w-4xl mx-auto relative">
                            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-gold via-white/10 to-transparent md:-translate-x-1/2"></div>
                            <div className="space-y-12 relative z-10">
                                {data.journeySteps.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="flex-1 w-full md:text-right">
                                            <div className={`p-8 rounded-[32px] bg-white/5 border border-white/10  hover:bg-white/10 transition-colors ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-[#0a0d18] border-4 border-accent-gold flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(197,168,128,0.3)] relative ml-1 md:ml-0">
                                            <span className="text-xs font-black text-accent-gold">{item.step}</span>
                                        </div>
                                        <div className="flex-1 hidden md:block"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <MinimalFooter />
        </div>
    );
};

export default GenericCountryPage;
