import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { MapPin, Globe, Code, Rocket, GraduationCap, Briefcase, MoveRight, ShieldCheck, ExternalLink, ChevronRight, FileText, Award } from 'lucide-react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

import pastedImage from '../SuccessStories/Pasted image.png';
import pastedImage2 from '../SuccessStories/Pasted image (2).png';
import pastedImage3 from '../SuccessStories/Pasted image (3).png';
import pastedImage4 from '../SuccessStories/Pasted image (4).png';
import pastedImage5 from '../SuccessStories/Pasted image (5).png';

import binusLogo from '../unilogo/binus.png';
import federicoLogo from '../unilogo/federico.png';
import michiganLogo from '../unilogo/michigan.png';
import postechLogo from '../unilogo/postech.jpg';
import pucrioLogo from '../unilogo/puc rio.png';
import tuwaiqLogo from '../unilogo/tuwaiq.png';
// Apple logo as clean SVG
const AppleLogo = ({ size = 64 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="currentColor">
    <path d="M75.3 63.1c-.1-10.2 8.3-15.1 8.7-15.4-4.7-6.9-12.1-7.9-14.8-8-6.3-.6-12.3 3.7-15.5 3.7-3.2 0-8.1-3.6-13.3-3.5-6.8.1-13.1 4-16.6 10-7.1 12.3-1.8 30.6 5.1 40.6 3.4 4.9 7.4 10.4 12.7 10.2 5.1-.2 7-3.3 13.2-3.3 6.1 0 7.8 3.3 13.2 3.2 5.5-.1 9-5 12.4-9.9 3.9-5.6 5.5-11.1 5.6-11.4-.1-.1-10.7-4.2-10.7-16.2zM64.4 32.7c2.8-3.4 4.7-8.2 4.2-12.9-4.1.2-9 2.7-11.9 6.1-2.6 3-4.9 7.9-4.3 12.5 4.6.4 9.2-2.4 12-5.7z"/>
  </svg>
);

const locations = [
  {
    country: "Italy",
    city: "Naples",
    details: "University of Naples Federico II",
    extra: "The oldest public university in the world, powering the Federico II Apple Foundation Program.",
    flag: "🇮🇹",
    localLogo: federicoLogo,
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    accent: "#60a5fa",
  },
  {
    country: "United States",
    city: "Detroit",
    details: "Michigan State University",
    extra: "Empowering all Detroiters with a 9-month Academy and 4-week Foundation program in the world's most vibrant app ecosystem.",
    flag: "🇺🇸",
    localLogo: michiganLogo,
    logoBg: "bg-white",
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/30",
    accent: "#4ade80",
  },
  {
    country: "South Korea",
    city: "Pohang",
    details: "POSTECH",
    extra: "Pioneering the future of technology, fostering global innovators and next-generation developers in Asia.",
    flag: "🇰🇷",
    localLogo: postechLogo,
    color: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-500/30",
    accent: "#38bdf8",
  },
  {
    country: "Saudi Arabia",
    city: "Riyadh",
    details: "Tuwaiq Academy",
    extra: "The Middle East's premier hub for advanced Swift programming and tech entrepreneurship.",
    flag: "🇸🇦",
    localLogo: tuwaiqLogo,
    color: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/30",
    accent: "#fbbf24",
  },
  {
    country: "Indonesia",
    city: "Multiple Hubs",
    details: "Binus University",
    extra: "Accelerating Southeast Asia's digital economy through world-class iOS development training.",
    flag: "🇮🇩",
    localLogo: binusLogo,
    color: "from-orange-500/20 to-red-500/10",
    border: "border-orange-500/30",
    accent: "#fb923c",
  },
  {
    country: "Brazil",
    city: "Nationwide",
    details: "PUC-Rio & Partners",
    extra: "A massive ecosystem across Brazil driving creativity, design, and business logic using Apple tools.",
    flag: "🇧🇷",
    localLogo: pucrioLogo,
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
    accent: "#c084fc",
  },
];

const keyFeatures = [
  { icon: <Code size={28} />, title: "Swift & SwiftUI", desc: "Deep training in Apple's native programming languages powering all Apple platforms.", color: "#22d3ee" },
  { icon: <GraduationCap size={28} />, title: "University Partners", desc: "Collaborates with elite global universities to establish world-class developer academies.", color: "#fbbf24" },
  { icon: <Briefcase size={28} />, title: "Real-World Projects", desc: "Challenge-based learning with actual app launches on the App Store.", color: "#a78bfa" },
  { icon: <Globe size={28} />, title: "Global Network", desc: "Connect with 7,000+ alumni developers across 6 countries worldwide.", color: "#fb7185" },
];

const UniversityCard = ({ loc, idx }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group block p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/30 transition-all duration-400 relative overflow-hidden`}
    >
      {/* glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top right, ${loc.accent}15, transparent 60%)` }} />

      {/* University Logo and Pill */}
      <div className="relative z-10 flex items-start justify-between mb-5">
        <div className={`w-16 h-16 rounded-2xl ${loc.logoBg || 'bg-white/10'} border border-white/20 flex items-center justify-center overflow-hidden p-2 backdrop-blur-sm shadow-inner shrink-0`}>
          <img
            src={loc.localLogo}
            alt={loc.details}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <span className="text-base">{loc.flag}</span>
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{loc.country}</span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-black text-white mb-1 tracking-tight">{loc.city}</h3>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: loc.accent }}>{loc.details}</p>
        <p className="text-sm text-white/60 leading-relaxed mb-2">{loc.extra}</p>
      </div>
    </motion.div>
  );
};

const AppleAcademyPage = () => {
  const [modalOpen, setModalOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden">

      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full bg-cyan-600/8 blur-[180px]" />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[15%] w-[800px] h-[800px] rounded-full bg-purple-600/8 blur-[180px]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#030712_100%)]" />
      </div>

      <Header compact={false} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-black uppercase tracking-[0.2em] text-cyan-400 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Official Apple Education Partner Program
        </motion.div>

        {/* Apple Logo – clean SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-white mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          <AppleLogo size={72} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6 max-w-5xl"
        >
          Apple Developer
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Academy
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl text-white/40 font-medium leading-relaxed max-w-2xl mb-4"
        >
          Designed by Apple to help the next generation of developers learn app development,
          design, and entrepreneurship — completely free.
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-10 mt-4"
        >
          {[['6', 'Countries'], ['7,000+', 'Alumni'], ['100%', 'Free'], ['9 Months', 'Program']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-white">{val}</div>
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
            className="px-8 py-4 rounded-full bg-white text-black font-black tracking-wider text-sm flex items-center gap-3 group shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            Explore Official Academies
            <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black tracking-wider text-sm hover:bg-white/10 transition-all"
          >
            View Global Locations
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-2 text-white/20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll to explore</span>
        </motion.div>
      </section>

      <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full pb-24">

        {/* ─── KEY FEATURES ─── */}
        <section className="mb-28">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6 gap-4">
            <div>
              <p className="text-cyan-500 uppercase tracking-widest text-xs font-black mb-2">Why Apple Academy</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">What Makes It Unique</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {keyFeatures.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/30 transition-all duration-400 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at bottom left, ${item.color}12, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{ color: item.color, background: `${item.color}15` }}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── PROGRAMS & ADMISSIONS ─── */}
        <section className="mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Programs */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-cyan-500 uppercase tracking-widest text-xs font-black mb-2">Curriculum</p>
              <h2 className="text-3xl font-black text-white tracking-tight mb-8">Types of Programs</h2>
              <div className="flex flex-col gap-4">
                {[
                  { phase: "01", title: "Foundation", badge: "4 Weeks", desc: "A fast-paced introductory dive into Apple's developer ecosystem, design thinking, and Swift basics." },
                  { phase: "02", title: "Academy", badge: "9 Months", desc: "Intensive challenge-based training building professional development capabilities and App Store launches." },
                  { phase: "03", title: "Advanced Track", badge: "Extended", desc: "Deep mastery of Swift, SwiftUI, Human Interface Guidelines, and full-stack Apple integration." },
                ].map((prog, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-5 items-start bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] p-5 rounded-2xl hover:border-cyan-500/30 transition-all"
                  >
                    <div className="text-4xl font-black text-white/8 shrink-0 leading-none mt-1">{prog.phase}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h4 className="text-lg font-black text-white">{prog.title}</h4>
                        <span className="px-3 py-0.5 bg-cyan-500/15 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20">{prog.badge}</span>
                      </div>
                      <p className="text-sm text-white/40 font-medium leading-relaxed">{prog.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Admissions */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-purple-400 uppercase tracking-widest text-xs font-black mb-2">Eligibility</p>
              <h2 className="text-3xl font-black text-white tracking-tight mb-8">Admission Requirements</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  "No IELTS Required",
                  "No Coding Experience",
                  "Age 18+ Only",
                  "100% Free to Join",
                ].map((req) => (
                  <div key={req} className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_4px_16px_0_rgba(255,255,255,0.02)] p-4 rounded-2xl flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                    <span className="text-sm font-bold text-white/80">{req}</span>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] p-8 md:p-10 rounded-3xl mt-8 w-full relative overflow-hidden group"
              >
                {/* Background glow */}
                <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700"></div>

                <div className="flex items-center gap-3 mb-10 relative z-10">
                   <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                     <Rocket size={20} className="text-cyan-400" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Selection Process</h3>
                </div>

                <div className="flex flex-col relative mb-10 ml-2">
                  {/* Vertical Line with glowing gradient */}
                  <div className="absolute left-[27px] top-[30px] bottom-[30px] w-[2px] bg-gradient-to-b from-cyan-400/80 via-blue-500/50 to-purple-500/20 z-0"></div>
                  
                  {[
                    { title: 'Application', desc: 'Submit your profile and basic details.', icon: <FileText size={20}/>, color: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-500/10' },
                    { title: 'Online Test', desc: '60-minute automated logic & coding assessment.', icon: <Code size={20}/>, color: 'text-blue-400', border: 'border-blue-400/50', bg: 'bg-blue-500/10' },
                    { title: 'Interview', desc: 'Technical & behavioral discussion with Apple mentors.', icon: <Globe size={20}/>, color: 'text-indigo-400', border: 'border-indigo-400/50', bg: 'bg-indigo-500/10' },
                    { title: 'Enrollment', desc: 'Welcome to the Apple Developer Academy.', icon: <Award size={20}/>, color: 'text-purple-400', border: 'border-purple-400/50', bg: 'bg-purple-500/10' }
                  ].map((step, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2 }}
                      className="flex items-start gap-6 relative z-10 pb-10 last:pb-0 group/step"
                    >
                      <div className={`w-14 h-14 shrink-0 rounded-2xl bg-[#030712] border-2 ${step.border} flex items-center justify-center ${step.color} shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover/step:scale-110 transition-transform duration-300 relative`}>
                         <div className={`absolute inset-0 ${step.bg} rounded-xl blur-md -z-10 opacity-0 group-hover/step:opacity-100 transition-opacity`}></div>
                         {step.icon}
                      </div>
                      <div className="flex-1 pt-2">
                        <span className="text-xl font-black uppercase text-white tracking-widest">{step.title}</span>
                        <p className="text-sm text-white/50 mt-1">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 relative z-10">
                  {['Logical Reasoning', 'Swift OOP Basics', 'Apple HIG & Design'].map(t => (
                    <span key={t} className="px-4 py-2 bg-white/5 text-white/70 text-xs font-black tracking-wider uppercase rounded-xl border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default shadow-md">{t}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── SUCCESS STORIES / MOMENTS ─── */}
        <section className="mb-28">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6 gap-4">
            <div>
              <p className="text-cyan-500 uppercase tracking-widest text-xs font-black mb-2">Moments</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Success Stories</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             <img src={pastedImage} className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-transform duration-500" alt="Success Story 1" />
             <img src={pastedImage2} className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-transform duration-500" alt="Success Story 2" />
             <img src={pastedImage3} className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-transform duration-500" alt="Success Story 3" />
             <img src={pastedImage4} className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-transform duration-500" alt="Success Story 4" />
             <img src={pastedImage5} className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-transform duration-500 lg:col-span-2" alt="Success Story 5" />
          </div>
        </section>

        {/* ─── GLOBAL LOCATIONS ─── */}
        <section id="locations" className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6 gap-4">
            <div>
              <p className="text-cyan-500 uppercase tracking-widest text-xs font-black mb-2">Worldwide Campuses</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Global Partner Network</h2>
            </div>
            <p className="text-white/30 text-sm max-w-xs text-right">6 countries, 1 mission — building the next generation of Apple developers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((loc, idx) => (
              <UniversityCard key={idx} loc={loc} idx={idx} />
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(34,211,238,0.08),transparent)]" />
          <div className="relative z-10 text-white mb-3">
            <AppleLogo size={40} />
          </div>
          <h2 className="relative z-10 text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Build the Future?
          </h2>
          <p className="relative z-10 text-white/40 text-base mb-8 max-w-lg mx-auto">
            Join thousands of developers worldwide. Apply to your nearest Apple Developer Academy — it's completely free.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,211,238,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
            className="relative z-10 px-10 py-4 rounded-full bg-white text-black font-black tracking-wider text-sm flex items-center gap-3 mx-auto group"
          >
            Apply Now — It's Free
            <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.section>

      </main>

      <MinimalFooter />

      {/* Auth Modal via Portal */}
      {modalOpen && createPortal(
        <AnimatePresence>
          <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AppleAcademyPage;
