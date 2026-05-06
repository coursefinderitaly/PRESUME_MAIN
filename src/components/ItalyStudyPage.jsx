import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, GraduationCap, Coins, BookOpen, MapPin, Landmark, ArrowRight, ShieldCheck, ChevronDown, Euro, Briefcase, HeartHandshake, Building2, Stethoscope, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Header } from './Header';
import FeesTable from './FeesTable';
import MinimalFooter from './MinimalFooter';
import AuthModal from './AuthModal';
import EligibilityModal from './EligibilityModal';

const ItalyStudyPage = () => {
    // State for interactive document checklist
    const [checkedDocs, setCheckedDocs] = useState({});
    const [modalOpen, setModalOpen] = useState(null);
    const [eligibilityModalLevel, setEligibilityModalLevel] = useState(null);

    const toggleDoc = (category, index) => {
        const key = `${category}-${index}`;
        setCheckedDocs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const opportunities = [
        { title: "Regional Scholarships (DSU)", desc: "Need-based scholarships from regional governments covering tuition, accommodation, and offering a yearly €8,000 stipend.", icon: <Euro className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
        { title: "Post-Study Work Visa", desc: "Non-EU graduates can apply for a 12-month work visa.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
        { title: "Cultural Immersion", desc: "Live in an 'outdoor classroom' surrounded by thousands of years of history and art.", icon: <HeartHandshake className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
        { title: "Top-Tier Universities", desc: "Access to prestigious, globally-ranked institutions with very low tuition fees.", icon: <Building2 className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
        { title: "English-Taught Programs", desc: "With/Without IELTS. Full degree programs taught entirely in English.", icon: <BookOpen className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
    ];

    const popularCourses = [
        {
            category: "Engineering & Technology",
            programs: ["BSc/MSc Computer Science", "MSc Artificial Intelligence", "Mechanical & Aerospace"],
            institutions: "Politecnico di Milano, Politecnico di Torino",
            icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" />
        },
        {
            category: "Business & Economics",
            programs: ["BSc Business Administration", "MSc International Management", "Economics & Finance"],
            institutions: "Sapienza University, University of Bologna",
            icon: <Building2 className="w-6 h-6 text-accent-gold" />
        },
        {
            category: "Architecture & Design",
            programs: ["BSc Architectural Design", "MSc Interior Design", "Fashion Studies"],
            institutions: "Politecnico di Milano, Florence Design Academy",
            icon: <Sparkles className="w-6 h-6 text-purple-400" />
        }
    ];

    const journeySteps = [
        { step: "01", title: "Apply", desc: "Shortlist universities, prepare transcripts, and clear the IMAT or university interviews." },
        { step: "02", title: "Pre-Enrol", desc: "Complete mandatory pre-enrollment via the Universitaly platform to initiate the visa process." },
        { step: "03", title: "Funding", desc: "Apply for regional scholarships and legalize/translate your financial documents." },
        { step: "04", title: "Visa", desc: "Secure DOV/CIMEA certification and submit your completed file at VFS Global." },
        { step: "05", title: "Depart", desc: "Book your flight, pack essentials, and activate your international roaming pack." },
        { step: "06", title: "Arrive", desc: "Apply for your Codice Fiscale, Permesso di Soggiorno (Residence Permit), and open a bank account." }
    ];

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

    const mbbsDocs = [
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "Passport-size photographs",
        "IELTS and MOI Certificate",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs",
        "NEET Score Card"
    ];

    const bachelorsDocs = [
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "Passport-size photographs",
        "IELTS and MOI Certificate",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs"
    ];

    const mastersDocs = [
        "Bachelor's Degree and Transcripts",
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "IELTS and MOI Certificate",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs"
    ];

    const studyLevels = [
        {
            id: "bachelors",
            title: "Bachelors",
            icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
            themeColor: "text-blue-400",
            bgGlow: "bg-blue-500/10",
            bgBox: "bg-blue-500/5",
            borderBox: "border-blue-500/20",
            checkedBg: "bg-blue-500/10",
            checkedBorder: "border-blue-500/40",
            checkedInput: "checked:bg-blue-500 checked:border-blue-500",
            eligibility: [
                "12 years of formal education.",
                "Minimum 65% and above.",
                "With or without IELTS."
            ],
            exam: "Many programs require the CEnT-S or SAT exam for Engineering, Economics, etc.",
            docs: bachelorsDocs
        },
        {
            id: "masters",
            title: "Masters",
            icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
            themeColor: "text-emerald-400",
            bgGlow: "bg-emerald-500/10",
            bgBox: "bg-emerald-500/5",
            borderBox: "border-emerald-500/20",
            checkedBg: "bg-emerald-500/10",
            checkedBorder: "border-emerald-500/40",
            checkedInput: "checked:bg-emerald-500 checked:border-emerald-500",
            eligibility: [
                "Bachelor's degree (3 or 4 yrs).",
                "Minimum 70% and above.",
                "With or without IELTS."
            ],
            exam: "Based on academic profile, Portfolio and Interview (if required)",
            docs: mastersDocs
        },
        {
            id: "mbbs",
            title: "MBBS in Italy",
            icon: <Stethoscope className="w-8 h-8 text-accent-gold" />,
            themeColor: "text-accent-gold",
            bgGlow: "bg-accent-gold/10",
            bgBox: "bg-accent-gold/5",
            borderBox: "border-accent-gold/20",
            checkedBg: "bg-accent-gold/10",
            checkedBorder: "border-accent-gold/40",
            checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
            eligibility: [
                "10+2 with Science (PCB).",
                "Minimum 65% and above.",
                "Age 17+ by Dec 2025."
            ],
            exam: "Must clear the IMAT (mandatory for public medical universities).",
            docs: mbbsDocs
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0d18] text-white font-sans overflow-x-hidden relative">
            {/* Blurred Video Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover blur-[4px] opacity-40 scale-105 will-change-[transform,filter] transform-gpu"
                    >
                        <source src="/italy.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0d18] via-[#0a0d18]/70 to-transparent z-10"></div>
            </div>

            <Header />

            <main className="relative z-10 flex-1">
                {/* Hero Section - STRICTLY FIT TO SCREEN */}
                <section className="h-[100svh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-10 w-full relative overflow-hidden">
                    <div className="max-w-screen-2xl w-full mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 h-full">

                        {/* Left Side: Massive Typography & CTA */}
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
                                <span className="text-[10px] md:text-xs font-black tracking-[0.4em] text-accent-gold uppercase">Your Gateway to Europe</span>
                            </div>

                            {/* Fluid typography to fit within height */}
                            <h1 className="text-[12vh] md:text-[15vh] lg:text-[18vh] font-black tracking-tighter leading-[0.8] mb-6 text-white relative select-none drop-shadow-2xl">
                                STUDY<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-accent-gold">ITALY.</span>
                            </h1>

                            <p className="text-sm md:text-lg lg:text-xl text-gray-300 font-medium leading-relaxed mb-8 max-w-xl border-l-2 border-white/20 pl-6 ">
                                Secure <strong className="text-white">100% scholarships</strong> and <strong className="text-white">€8,000 annual grants</strong> in Europe's most historic public universities.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto md:mt-0">
                                <button
                                    onClick={() => setModalOpen('signup')}
                                    className="w-full sm:w-auto group relative px-8 py-4 md:px-10 md:py-5 bg-white text-[#0a0d18] rounded-full font-black tracking-widest text-[11px] md:text-[13px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                    <span className="relative flex items-center justify-center gap-3 group-hover:text-[#0a0d18] transition-colors duration-500">
                                        START APPLICATION <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-transparent border border-white/20 text-white rounded-full font-black tracking-widest text-[11px] md:text-[13px] hover:bg-white/10 transition-all ">
                                    BROWSE COURSES
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Side: Abstract Geometry & Orbital Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="hidden lg:flex relative w-full max-w-[600px] h-full items-center justify-center pointer-events-none select-none perspective-[1200px]"
                        >
                            {/* Background glow */}
                            <div className="absolute w-[45vh] h-[45vh] bg-accent-gold/10 rounded-full blur-[100px] animate-pulse will-change-[transform,filter] transform-gpu"></div>

                            {/* Outer Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[55vh] h-[55vh] rounded-full border border-white/[0.05] border-l-accent-gold/20"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[45vh] h-[45vh] rounded-full border border-white/[0.03] border-t-blue-500/20 border-dashed"
                            />

                            {/* Interactive Floating Stack */}
                            <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                                {/* Main Hero Card (Stipend) - Central Focal Point */}
                                <motion.div
                                    animate={{
                                        y: [-12, 12, -12],
                                        rotateX: [0, 5, 0],
                                        rotateY: [0, -5, 0]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute p-10 rounded-[40px] bg-gradient-to-br from-[#0a0d18]/95 to-yellow-900/40 backdrop-blur-[60px] border border-accent-gold/30 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex items-center gap-8 z-50 transform translate-z-20 will-change-[transform,filter] transform-gpu"
                                >
                                    <div className="w-20 h-20 rounded-[24px] bg-accent-gold/20 flex items-center justify-center border border-accent-gold/30 shadow-[0_0_30px_rgba(197,168,128,0.2)]">
                                        <Euro className="text-accent-gold w-10 h-10" />
                                    </div>
                                    <div>
                                        <div className="text-5xl font-black text-white tracking-tighter mb-1">€8,000</div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-accent-gold font-bold">Annual Stipend</div>
                                    </div>
                                </motion.div>

                                {/* Top Left: No IELTS */}
                                <motion.div
                                    animate={{
                                        y: [-15, 10, -15],
                                        x: [-10, 5, -10],
                                        rotateZ: [-3, 3, -3]
                                    }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-[10%] left-[0%] px-6 py-4 rounded-full bg-red-500/10 backdrop-blur-[40px] border border-red-500/30 shadow-2xl flex items-center gap-3 z-30 will-change-[transform,filter] transform-gpu"
                                >
                                    <PlaneTakeoff className="text-red-400 w-4 h-4" />
                                    <div className="text-xs font-black text-white uppercase tracking-widest">With or without IELTS</div>
                                </motion.div>

                                {/* Top Right: English Programs */}
                                <motion.div
                                    animate={{
                                        y: [15, -10, 15],
                                        x: [10, -5, 10],
                                        rotateZ: [3, -3, 3]
                                    }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute top-[18%] right-[0%] px-7 py-5 rounded-[30px] bg-white/5 backdrop-blur-[40px] border border-white/10 shadow-2xl flex items-center gap-4 z-40 will-change-[transform,filter] transform-gpu"
                                >
                                    <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                                        <ShieldCheck className="text-accent-gold w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-base font-black text-white">100% English</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Taught Programs</div>
                                    </div>
                                </motion.div>

                                {/* Bottom Left: Visa */}
                                <motion.div
                                    animate={{
                                        y: [-20, 15, -20],
                                        x: [-5, 10, -5],
                                        rotateY: [-10, 10, -10]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="absolute bottom-[12%] left-[2%] p-7 rounded-[35px] bg-white/5 backdrop-blur-[40px] border border-blue-500/20 shadow-2xl flex items-center gap-6 z-40"
                                >
                                    <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                        <Briefcase className="text-blue-400 w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-white tracking-tighter">12 Months</div>
                                        <div className="text-[11px] uppercase tracking-widest text-blue-400 font-bold mt-1">Post-Study Visa</div>
                                    </div>
                                </motion.div>

                                {/* Bottom Right: Public Unis */}
                                <motion.div
                                    animate={{
                                        y: [20, -15, 20],
                                        x: [10, -5, 10],
                                        rotateX: [10, -10, 10]
                                    }}
                                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    className="absolute bottom-[20%] right-[-8%] px-8 py-5 rounded-[30px] bg-indigo-500/10 backdrop-blur-[40px] border border-indigo-500/30 shadow-2xl flex items-center gap-5 z-30"
                                >
                                    <Building2 className="text-indigo-400 w-7 h-7" />
                                    <div className="text-[13px] font-bold text-white uppercase tracking-wider leading-tight">Top Public<br />Universities</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 pb-20 pt-20">
                    {/* Bento Box Features Grid */}
                    <div className="mb-32 relative z-20">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">The Italian Advantage</h2>
                                <p className="text-gray-400 text-lg font-medium">Unparalleled academic, financial, and cultural benefits.</p>
                            </div>
                            <Sparkles className="w-10 h-10 text-accent-gold/50 mb-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {opportunities.map((opp, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-8 rounded-[32px] backdrop-blur-[40px] border transition-all duration-500 shadow-xl group hover:-translate-y-1 ${opp.colSpan} ${opp.bg}`}
                                >
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                            {opp.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-3 text-white">{opp.title}</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed font-medium opacity-80">{opp.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Courses */}
                    <div className="mb-32 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Popular Programs</h2>
                            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">World-renowned degrees completely taught in English, tailored for international students.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {popularCourses.map((course, idx) => (
                                <div key={idx} className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-[32px] hover:border-accent-gold/30 transition-all duration-300 shadow-xl group">
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
                                        <div className="text-xs text-gray-400 font-medium leading-relaxed">{course.institutions}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compact Study Levels Grid (MBBS, Bachelors, Masters) */}
                    <div className="mb-32 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Study Levels in Italy</h2>
                            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">Find the right path for your academic journey and prepare your documents.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full max-w-5xl bg-blue-500/5 rounded-full blur-[150px] pointer-events-none will-change-[transform,filter] transform-gpu"></div>

                            {studyLevels.map(level => (
                                <div key={level.id} className={`p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-[30px] shadow-2xl relative overflow-hidden flex flex-col hover:border-white/20 transition-all will-change-[transform,filter] transform-gpu`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${level.bgGlow} rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none will-change-[transform,filter] transform-gpu`}></div>

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
                                            <div className="space-y-2 mb-6 pr-2">
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
                                            <button 
                                                onClick={() => setEligibilityModalLevel(level.id)}
                                                className={`w-full py-4 rounded-2xl bg-white/5 border ${level.borderBox} hover:${level.checkedBg} transition-all duration-300 group/btn`}
                                            >
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

                    <FeesTable />

                    {/* Vertical Journey Timeline */}
                    <div className="relative py-24 rounded-[48px] bg-white/[0.02] border border-white/10 backdrop-blur-[40px] px-6 md:px-20 shadow-2xl z-20 will-change-[transform,filter] transform-gpu">
                        <div className="text-center mb-20 relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Your Road to Italy</h2>
                            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">From application to arrival, we guide you every step of the way.</p>
                        </div>

                        <div className="max-w-4xl mx-auto relative">
                            {/* Vertical connecting line */}
                            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-[100px] w-[2px] bg-gradient-to-b from-accent-gold via-white/10 to-transparent md:-translate-x-1/2"></div>

                            <div className="space-y-12 relative z-10">
                                {journeySteps.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="flex-1 w-full md:text-right">
                                            {/* Content shifts side based on index on desktop */}
                                            <div className={`p-8 rounded-[32px] bg-white/5 border border-white/10  hover:bg-white/10 transition-colors ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                            </div>
                                        </div>

                                        {/* Center Node */}
                                        <div className="w-14 h-14 rounded-full bg-[#0a0d18] border-4 border-accent-gold flex items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(197,168,128,0.3)] relative ml-1 md:ml-0">
                                            <span className="text-xs font-black text-accent-gold">{item.step}</span>
                                        </div>

                                        <div className="flex-1 hidden md:block"></div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Call to Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex justify-center mt-20 relative z-10"
                            >
                                <button
                                    onClick={() => setModalOpen('signup')}
                                    className="group relative px-10 py-5 bg-gradient-to-r from-accent-gold to-yellow-500 rounded-full text-primary-blue text-sm font-black uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(250,204,21,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative z-10 flex items-center gap-2">Start Your Application <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Auth Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />
                )}
                {eligibilityModalLevel && (
                    <EligibilityModal 
                        level={eligibilityModalLevel} 
                        onClose={() => setEligibilityModalLevel(null)} 
                        onEligibleAction={() => {
                            setEligibilityModalLevel(null);
                            setModalOpen('signup');
                        }}
                        onNotEligibleAction={() => {
                            window.location.href = '/contact';
                        }}
                    />
                )}
            </AnimatePresence>
            <MinimalFooter />
        </div>
    );
};

export default ItalyStudyPage;
