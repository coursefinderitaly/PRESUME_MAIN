import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { MapPin, Globe, Code, Rocket, Cpu, Terminal, Sparkles, MoveRight, CheckCircle2, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

const AppleAcademyPage = () => {
    // Fetched Live Data from Partner University Portals
    const locations = [
        {
            country: "Italy",
            city: "Naples",
            details: "University of Naples Federico II",
            extra: "Education has never been so #efficient, #diverse and #fun. Features the renowned Federico II Apple Foundation Program.",
            link: "https://www.developeracademy.unina.it/en/"
        },
        {
            country: "United States",
            city: "Detroit",
            details: "Michigan State University",
            extra: "Empowering all Detroiters to thrive in the world’s most vibrant app ecosystem with a 9-month Academy and 4-week Foundation program.",
            link: "https://developeracademy.msu.edu"
        },
        {
            country: "South Korea",
            city: "Pohang",
            details: "POSTECH",
            extra: "Pioneering the future of technology, fostering global innovators and next-gen developers.",
            link: "https://developeracademy.postech.ac.kr/en/"
        },
        {
            country: "Saudi Arabia",
            city: "Riyadh",
            details: "Tuwaiq Academy",
            extra: "The Middle East's premier hub for advanced Swift programming and tech entrepreneurship.",
            link: "https://developeracademy.tuwaiq.edu.sa"
        },
        {
            country: "Indonesia",
            city: "Multiple Hubs",
            details: "Binus University & Others",
            extra: "Accelerating Southeast Asia's digital economy through world-class iOS development training.",
            link: "https://developeracademy.apps.binus.ac.id/bali/"
        },
        {
            country: "Brazil",
            city: "Nationwide",
            details: "PUC-Rio, Senac, Mackenzie, Eldorado",
            extra: "A massive ecosystem across Brazil driving creativity, design, and business logic using Apple tools.",
            link: "https://developeracademyucb.com.br"
        }
    ];

    const keyFeatures = [
        { icon: <Code className="text-cyan-400" size={26} />, title: "Focus on App Dev", desc: "Training in app development for Apple ecosystem (iOS, macOS, watchOS, tvOS)." },
        { icon: <GraduationCap className="text-accent-gold" size={26} />, title: "University Partners", desc: "Collaborates with global universities to establish world-class academies." },
        { icon: <Briefcase className="text-purple-400" size={26} />, title: "Real-World Projects", desc: "Engage in hands-on projects to provide practical skills and innovation." },
        { icon: <Globe className="text-rose-400" size={26} />, title: "Industry Curriculum", desc: "Meet industry standards with networking, inclusivity, and sustainability ethos." },
    ];

    const programs = [
        { phase: "01", title: "Foundation", desc: "A fast-paced introductory dive into Apple’s developer ecosystem." },
        { phase: "02", title: "Academics", duration: "9 Months", desc: "Intensive training program building professional development capabilities." },
        { phase: "03", title: "Academics", desc: "Extended mastery of Swift, SwiftUI, HIG, and full-stack integration." }
    ];

    return (
        <div className="min-h-screen bg-[#050914] text-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30">
            {/* Techy Futuristic Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-600/10 blur-[150px]" />
                <div className="absolute top-[40%] right-[-20%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[150px]" />
                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <div className="flex justify-center mb-6">
                        <img src="/apple-logo.png" alt="Apple Logo" className="h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                        <Globe size={14} /> Full & Free Global Curriculum
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
                        Apple Developer <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Academy</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto mb-10">
                        Designed by Apple Inc. to help aspiring developers learn app development, design, and entrepreneurship. Build the future with Swift, Xcode, and SwiftUI.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,211,238,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open('https://developer.apple.com/academies/', '_blank')}
                        className="px-8 py-4 rounded-full bg-white text-black font-black tracking-widest text-sm transition-all flex items-center gap-3 mx-auto group mb-16"
                    >
                        EXPLORE OFFICIAL ACADEMIES
                        <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <div className="flex flex-col items-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-6">Official Global University Partners</p>
                        <img src="/university-logos.png" alt="Partner Universities" className="w-full max-w-3xl object-contain opacity-80 hover:opacity-100 transition-opacity mix-blend-screen" />
                    </div>
                </motion.div>

                {/* Key Features */}
                <div className="mb-32">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Key Features & Aspects</h2>
                            <p className="text-cyan-500 uppercase tracking-widest text-xs font-bold">What makes the Academy unique</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {keyFeatures.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-md relative overflow-hidden group hover:-translate-y-2 shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="mb-8 bg-black/40 w-fit p-4 rounded-2xl border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black text-white mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Programs & Admissions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    {/* Types of Programs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight mb-8">Types of Programs</h2>
                        <div className="flex flex-col gap-4">
                            {programs.map((prog, idx) => (
                                <div key={idx} className="flex gap-6 items-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                                    <div className="text-4xl font-black text-white/10 shrink-0">{prog.phase}</div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-xl font-black text-white">{prog.title}</h4>
                                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full">{prog.duration}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium leading-relaxed">{prog.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Admissions & Requirements */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight mb-8">Admission Requirements</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#0d121f] border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <span className="text-sm font-bold text-white tracking-wide">Basic Coding<br />Required</span>
                            </div>
                            <div className="bg-[#0d121f] border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <span className="text-sm font-bold text-white tracking-wide">No Experience<br />Required</span>
                            </div>
                            <div className="bg-[#0d121f] border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <span className="text-sm font-bold text-white tracking-wide">No IELTS<br />Required</span>
                            </div>
                            <div className="bg-[#0d121f] border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={24} />
                                <span className="text-sm font-bold text-white tracking-wide">Only 18+<br />Mandate</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 p-8 rounded-3xl backdrop-blur-xl">
                            <h3 className="text-xl font-black text-white mb-4">Selection Procedure</h3>
                            <div className="flex justify-between items-center relative mb-8">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10"></div>
                                {['Apply', 'Test', 'Interview', 'Selection'].map((step, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 bg-[#050914] px-2 py-1 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-black text-xs">
                                            0{i + 1}
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{step}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 className="text-sm font-black text-white mb-2">Automated Assessment Test</h4>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                60-minute automated multiple-choice test (30 stems). Top 400 applicants advance based on score (+2 correct, -0.5 wrong). Max 60 points.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/5 text-white/70 text-[10px] font-black tracking-wider uppercase rounded-lg border border-white/10">Logical Reasoning</span>
                                <span className="px-3 py-1 bg-white/5 text-white/70 text-[10px] font-black tracking-wider uppercase rounded-lg border border-white/10">Swift OOP Basics</span>
                                <span className="px-3 py-1 bg-white/5 text-white/70 text-[10px] font-black tracking-wider uppercase rounded-lg border border-white/10">Apple HIG & Design</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Locations Section with Fetched Data */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Global Network</h2>
                            <p className="text-cyan-500 uppercase tracking-widest text-xs font-bold">Partner Universities & Hubs</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((loc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.96 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group p-8 rounded-[32px] bg-[#0d121f] border border-white/5 transition-all duration-500 relative overflow-hidden flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                            >
                                {/* Hover Tech Glow */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-blue-400" />
                                            <h3 className="text-sm font-black text-blue-400 tracking-widest uppercase">{loc.country}</h3>
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-2">{loc.city}</h4>
                                    <p className="text-xs text-accent-gold font-bold uppercase tracking-wider mb-4">{loc.details}</p>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{loc.extra}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </main>

            <MinimalFooter />
        </div>
    );
};

export default AppleAcademyPage;
