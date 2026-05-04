import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { MapPin, Globe, GraduationCap, Code, Rocket, BookOpen, ChevronRight } from 'lucide-react';

const AppleAcademyPage = () => {
    const locations = [
        { country: "Italy", city: "Naples", details: "University of Naples Federico II" },
        { country: "Indonesia", city: "Multiple Cities", details: "Bali, Batam, Central Jakarta, Surabaya, Tangerang" },
        { country: "Brazil", city: "Multiple Cities", details: "Brasília, Campinas, Curitiba, Fortaleza, Manaus, Porto Alegre, Recife, Rio de Janeiro, São Paulo" },
        { country: "Saudi Arabia", city: "Riyadh", details: "Tuwaiq Academy" },
        { country: "South Korea", city: "Pohang", details: "POSTECH" },
        { country: "United States", city: "Detroit", details: "Michigan State University" }
    ];

    const curriculum = [
        { icon: <Code className="text-cyan-400" size={24} />, title: "Coding & iOS Development", desc: "Master Swift, SwiftUI, and professional app architecture." },
        { icon: <Globe className="text-accent-gold" size={24} />, title: "App Design & UI/UX", desc: "Learn to design beautiful, user-centric interfaces." },
        { icon: <Rocket className="text-purple-400" size={24} />, title: "Professional Skills", desc: "Practice collaboration, presentation, and entrepreneurial skills." },
    ];

    return (
        <div className="min-h-screen bg-[#0a0d18] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-accent-gold/5 blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto w-full">
                
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold text-[11px] font-black uppercase tracking-[0.2em] mb-6">
                        <GraduationCap size={14} /> Full & Free Curriculum
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                        Future Developers at the <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Apple Developer Academies</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto">
                        Sharpen your development skills with a full, free curriculum. Students complete the app development cycle to learn to code, design great apps, and practice essential professional skills over a period of 30 days to 2 years.
                    </p>
                </motion.div>

                {/* Curriculum Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                    {curriculum.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all backdrop-blur-md relative overflow-hidden group"
                        >
                            <div className="mb-6 bg-black/20 w-fit p-3 rounded-2xl backdrop-blur-xl border border-white/5">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Locations Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Global Academies</h2>
                        <p className="text-gray-400 uppercase tracking-widest text-sm font-bold">Find an academy near you</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((loc, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group p-6 rounded-[24px] bg-white/[0.01] backdrop-blur-[20px] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden shadow-2xl flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin size={18} className="text-cyan-400" />
                                        <h3 className="text-lg font-black text-white tracking-widest uppercase">{loc.country}</h3>
                                    </div>
                                    <p className="text-xl font-bold text-white mb-2">{loc.city}</p>
                                    <p className="text-sm text-gray-500 font-medium">{loc.details}</p>
                                </div>

                                <div className="mt-8 flex items-center justify-between text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Learn More</span>
                                    <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
                    <BookOpen size={40} className="text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Identify problems. Solve them.</h2>
                    <p className="text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
                        Students identify problems in their communities and solve them with apps that truly enrich people's lives. University or technical school enrollment is required for participation.
                    </p>
                    <button onClick={() => window.open('https://developer.apple.com/academies/', '_blank')} className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        VIEW OFFICIAL SITE
                    </button>
                </motion.div>

            </main>

            <MinimalFooter />
        </div>
    );
};

export default AppleAcademyPage;
