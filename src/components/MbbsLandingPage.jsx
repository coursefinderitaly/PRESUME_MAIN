import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { GraduationCap, Globe, Stethoscope, Award, CheckCircle, MoveRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import AuthModal from './AuthModal';

const mbbsDestinations = [
  {
    country: "Italy",
    flag: "🇮🇹",
    title: "MBBS in Italy",
    tagline: "Study Medicine in Europe",
    fees: "€1,000 - €3,000 / Year (often Funded via DSU)",
    duration: "6 Years",
    exam: "IMAT Required",
    benefits: [
      "DSU scholarships covering tuition & living",
      "World-class European standard medical education",
      "Degree valid across the EU, UK, and India",
      "Highly advanced clinical practice and research",
      "Rich cultural heritage and high standard of living"
    ],
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    accent: "#60a5fa",
  },
  {
    country: "Georgia",
    flag: "🇬🇪",
    title: "MBBS in Georgia",
    tagline: "Highly Affordable & 100% English Medium",
    fees: "$4,000 - $8,000 / Year",
    duration: "6 Years",
    exam: "NEET Qualified",
    benefits: [
      "100% English medium instruction throughout",
      "WHO & NMC (MCI) recognized universities",
      "Highly affordable tuition & low cost of living",
      "Extremely safe environment for international students",
      "No IELTS or TOEFL required for admissions"
    ],
    color: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/30",
    accent: "#fb7185",
  },
  {
    country: "Russia",
    flag: "🇷🇺",
    title: "MBBS in Russia",
    tagline: "Government Subsidized World-Class Education",
    fees: "$3,000 - $7,000 / Year",
    duration: "6 Years",
    exam: "NEET Qualified",
    benefits: [
      "Government subsidized, making it highly affordable",
      "Globally recognized degree (WHO, NMC, FAIMER)",
      "World-class infrastructure and advanced hospitals",
      "Huge international student community",
      "Direct admissions with simple eligibility criteria"
    ],
    color: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-500/30",
    accent: "#38bdf8",
  }
];

const DestinationCard = ({ dest, idx, setModalOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group flex flex-col p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border-white/30 transition-all duration-500 relative overflow-hidden"
    >
      {/* Animated moving gradient blur on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-20%", "20%", "-20%"],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-50%] blur-[60px]"
          style={{ background: `radial-gradient(circle at center, ${dest.accent}30 0%, transparent 60%)` }}
        />
      </div>

      {/* Card Header */}
      <div className="relative z-10 flex flex-col mb-6 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{dest.flag}</span>
          <h3 className="text-3xl font-black text-white tracking-tight">{dest.title}</h3>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: dest.accent }}>{dest.tagline}</p>
      </div>

      {/* Key Details Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <span className="block text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Tuition Fees</span>
          <span className="text-sm font-bold text-white">{dest.fees}</span>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <span className="block text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Duration</span>
          <span className="text-sm font-bold text-white">{dest.duration}</span>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2 flex items-center gap-3">
          <Award size={18} className="text-amber-400" />
          <div>
            <span className="block text-[10px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Eligibility Exam</span>
            <span className="text-sm font-bold text-white">{dest.exam}</span>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="relative z-10 flex-1 mb-8">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <Stethoscope size={18} style={{ color: dest.accent }} />
          Key Benefits
        </h4>
        <ul className="space-y-3">
          {dest.benefits.map((benefit, bIdx) => (
            <li key={bIdx} className="flex items-start gap-3">
              <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: dest.accent }} />
              <span className="text-sm text-white/70 leading-snug">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
        className="relative z-10 w-full py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black tracking-wider text-sm flex items-center justify-center gap-2 transition-colors mt-auto"
      >
        Apply for {dest.country}
        <MoveRight size={16} />
      </motion.button>
    </motion.div>
  );
};

const MbbsLandingPage = () => {
  const [modalOpen, setModalOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden">

      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full bg-blue-600/10 blur-[180px]" />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-rose-600/8 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[15%] w-[800px] h-[800px] rounded-full bg-cyan-600/8 blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#030712_100%)]" />
      </div>

      <Header compact={false} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Global Medical Admissions Open
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md shadow-2xl shadow-blue-500/20"
        >
          <GraduationCap size={40} className="text-blue-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6 max-w-5xl"
        >
          Study MBBS
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
            Abroad
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl text-white/50 font-medium leading-relaxed max-w-2xl mb-12"
        >
          Fast-track your medical career with world-class education, affordable tuition,
          and globally recognized degrees in Italy, Georgia, and Russia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-white text-black font-black tracking-wider text-sm flex items-center gap-3 group shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-all"
          >
            Explore Countries
            <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32">

        {/* ─── DESTINATIONS GRID ─── */}
        <section id="destinations" className="mb-20 pt-10">
          <div className="text-center mb-16">
            <p className="text-blue-400 uppercase tracking-widest text-xs font-black mb-3">Top Destinations</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Choose Your Pathway</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Compare our most popular medical destinations tailored for international students seeking excellence and affordability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mbbsDestinations.map((dest, idx) => (
              <DestinationCard key={idx} dest={dest} idx={idx} setModalOpen={setModalOpen} />
            ))}
          </div>
        </section>

        {/* ─── WHY US SECTION ─── */}
        <section className="mt-32">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">Why Apply Through Presume Overseas?</h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  We specialize in medical admissions abroad. From university shortlisting to visa processing and pre-departure briefings, our expert counselors ensure a seamless journey to your dream medical college.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    "Expert Counseling & University Selection",
                    "Visa File Preparation & Support",
                    "Scholarship Assistance (e.g., Italy DSU)",
                    "Accommodation & Post-Landing Help"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                        <CheckCircle size={14} className="text-blue-400" />
                      </div>
                      <span className="text-white/80 font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-md aspect-square rounded-full border border-white/10 bg-white/5 relative flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                  <Globe size={120} className="text-white/10 animate-pulse" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.1),transparent)] rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <MinimalFooter />

      {/* Auth Modal via Portal */}
      {modalOpen && createPortal(
        <AnimatePresence>
          <AuthModal type={modalOpen.type} onClose={() => setModalOpen(null)} />
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default MbbsLandingPage;
