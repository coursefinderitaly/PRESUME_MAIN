import React from 'react';
import { motion } from 'framer-motion';
import amitPhoto from '../assets/amit.png';
import { Target, Eye, Users, Briefcase, GraduationCap, Building2, Quote, Sparkles } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';

const OurStoryPage = () => {
    const reasons = [
        {
            icon: <GraduationCap size={18} className="text-cyan-400" />,
            title: "For Students",
            desc: "Expert guidance on courses, scholarships, and universities across Europe, USA, UK, and more.",
            color: "from-cyan-500/10 to-cyan-500/0"
        },
        {
            icon: <Briefcase size={18} className="text-accent-gold" />,
            title: "For Professionals",
            desc: "Legitimate work permit assistance and direct placement pathways in top global markets.",
            color: "from-accent-gold/10 to-accent-gold/0"
        },
        {
            icon: <Users size={18} className="text-purple-400" />,
            title: "For Parents",
            desc: "Confidence and clarity through a verified university database and transparent visa processing.",
            color: "from-purple-500/10 to-purple-500/0"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0d18] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-600/5 blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-accent-gold/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-32 pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-16">
                
                {/* Hero + Founder Section in a Stylish Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: Heading & Context (Compact text) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] mb-5 w-fit">
                            <Building2 size={12} /> Since 2018
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl">
                            We turn global <span className="bg-gradient-to-r from-accent-gold via-yellow-300 to-amber-500 bg-clip-text text-transparent">aspirations</span> into reality.
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium mb-4">
                            The foundation of Presume Overseas Education (OPC) Pvt. Ltd. was laid in April 2018 as One Step Overseas, and in August 2021, it was registered under its current name. Over the years, we have grown into a trusted consultancy specializing in study and work permits.
                        </p>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                            We are a professionally managed organization with over 40+ experts. Moving beyond Italy's free education, we facilitate pathways across Europe, USA, Canada, UK, and Australia.
                        </p>
                    </motion.div>

                    {/* Right: Premium Founder Photo Block (Visuals) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-5 flex justify-center relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 via-transparent to-cyan-500/10 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border border-white/10 p-1 backdrop-blur-3xl shadow-[0_0_50px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_60px_rgba(212,175,55,0.25)] transition-shadow duration-500">
                            <div className="w-full h-full rounded-full bg-black/40 overflow-hidden relative">
                                <img 
                                    src={amitPhoto} 
                                    alt="Founder" 
                                    className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                        </div>

                        {/* Message Float Card */}
                        <div className="absolute -bottom-4 right-4 sm:-right-4 bg-[#0d121f]/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl max-w-[220px] shadow-2xl flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-accent-gold" />
                                <span className="text-xs font-black text-white uppercase tracking-wider">Leadership</span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 italic">"Our mission is simple: to make your global dreams a reality."</p>
                            <p className="text-[10px] font-black text-white text-right mt-1">— Amit Gautam, CEO</p>
                        </div>
                    </motion.div>
                </div>

                {/* Mission & Vision: Small & Compact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-[24px] bg-white/[0.01] border border-white/5 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Target className="w-20 h-20 text-cyan-400" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                <Target className="text-cyan-400 w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-white tracking-tight">Our Mission</h2>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium relative z-10">
                            To simplify your journey abroad by providing completely accurate, transparent, and personalized guidance. We offer trusted counseling, visa processing, and seamless placement support to turn your global career goals into reality.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-[24px] bg-white/[0.01] border border-white/5 relative overflow-hidden group flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Eye className="w-20 h-20 text-accent-gold" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center shrink-0">
                                <Eye className="text-accent-gold w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-white tracking-tight">Our Vision</h2>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium relative z-10">
                            To be the leading global consultancy that empowers individuals with verified information and expert counseling, becoming the most reliable partner for students and professionals seeking a better life abroad.
                        </p>
                    </motion.div>
                </div>

                {/* Why Choose Us: Minimal & Extremely Small Grid */}
                <div className="mb-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Why Choose Us?</h2>
                        <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Trusted Global Support</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {reasons.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-5 rounded-[20px] bg-gradient-to-br ${item.color} border border-white/5 hover:border-white/10 transition-all backdrop-blur-md flex flex-col justify-between h-full`}
                            >
                                <div className="mb-4 bg-black/30 w-fit p-2.5 rounded-xl border border-white/5">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white mb-2 tracking-tight">{item.title}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
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

export default OurStoryPage;
