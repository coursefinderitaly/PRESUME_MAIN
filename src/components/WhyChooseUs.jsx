import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Globe2, Target, Users, Award, Shield, Zap, Clock, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { id: 1, name: 'Partners', value: '500+', icon: Globe2, accent: '#06b6d4' },
  { id: 2, name: 'Success', value: '98%', icon: Target, accent: '#818cf8' },
  { id: 3, name: 'Students', value: '10k+', icon: Users, accent: '#34d399' },
  { id: 4, name: 'Grants', value: '$5M+', icon: Award, accent: '#f59e0b' },
  { id: 5, name: 'Network', value: 'Elite', icon: Shield, accent: '#ec4899' },
  { id: 6, name: 'Experts', value: '50+', icon: Star, accent: '#8b5cf6' },
  { id: 7, name: 'Express', value: 'Fast', icon: Zap, accent: '#10b981' },
];

const advantages = [
  { title: 'Global University Network', desc: 'Access to 500+ verified public universities across Europe.' },
  { title: 'Expert Visa Filing', desc: '98% success rate with our specialized documentation department.' },
  { title: 'End-to-End Support', desc: 'From initial counseling to post-arrival student assistance.' },
  { title: 'Scholarship Assistance', desc: 'Maximum financial aid and tuition waivers for eligible students.' },
];

// Static fallback background for performance
const ElegantBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0d18]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1)_0%,#0a0d18_100%)] z-10 pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-[1]" />
  </div>
);

// Pure CSS orbit — runs on GPU compositor, zero JS animation overhead
function OrbitingCard({ stat, index, total, radius }) {
  const angle = (index / total) * 360;
  const duration = 50; // seconds, same as before

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {/* CSS-driven orbit ring — identical visual, pure GPU */}
      <div
        className="w-full h-full relative"
        style={{
          animation: `orbit-cw ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto"
          style={{
            transform: `rotate(${angle}deg) translateY(-${radius}px)`,
            transformOrigin: `center ${radius}px`,
          }}
        >
          {/* Counter-rotate the initial angle so it starts upright */}
          <div style={{ transform: `rotate(-${angle}deg)` }}>
            {/* Counter-rotate the animation so it stays upright */}
            <div
              style={{
                animation: `orbit-ccw ${duration}s linear infinite`,
                willChange: 'transform',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, zIndex: 100 }}
                className="w-20 h-20 lg:w-[110px] lg:h-[110px] rounded-full bg-slate-900/80 backdrop-blur-[20px] border-2 border-white/20 flex flex-col items-center justify-center text-center p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden group"
                style={{ borderColor: `${stat.accent}60` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ color: stat.accent }} />
                <p className="text-sm lg:text-lg font-black text-white leading-none mb-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{stat.value}</p>
                <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-tight text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{stat.name}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [radius, setRadius] = useState(120);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDim = Math.min(width, height);
      // Increased radius to shift cards further apart
      if (width < 768) setRadius(minDim * 0.16);
      else setRadius(minDim * 0.20);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-[#0a0d18]"
    >
      <ElegantBackground />

      {/* Background Texture */}
      <div className="absolute inset-0 z-[5] opacity-30 pointer-events-none transform-gpu">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="max-w-[85rem] mx-auto w-full relative z-20 px-4 sm:px-6 lg:px-8">
        <div className="presume-advantage-bg rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.12)] p-6 lg:p-10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">

            {/* Left: Orbital Visualization */}
            <div className="lg:col-span-7 relative flex items-center justify-center h-[380px] lg:h-[520px]">
              {/* Central Core — rich glassmorphic ring */}
              <div className="absolute w-[260px] h-[260px] lg:w-[340px] lg:h-[340px] rounded-full bg-slate-900/70 backdrop-blur-[24px] border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(6,182,212,0.25),inset_0_0_40px_rgba(6,182,212,0.08)] z-0" />

              {/* Title area */}
              <div className="relative z-20 flex flex-col items-center text-center pointer-events-none">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight"
                >
                  <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">PRESUME</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                    ADVANTAGE
                  </span>
                </motion.h2>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {stats.map((stat, i) => (
                  <OrbitingCard
                    key={stat.id}
                    stat={stat}
                    index={i}
                    total={stats.length}
                    radius={radius}
                  />
                ))}
              </div>
            </div>

            {/* Right: Detailed List of Advantages */}
            <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-0.5 mb-1.5"
              >
                <span className="text-cyan-400 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-lg">The Core Benefits</span>
                <h3 className="text-white text-xl lg:text-2xl font-black tracking-tight leading-tight drop-shadow-xl">Expert Guidance for Your Global Career</h3>
              </motion.div>

              <div className="flex flex-col gap-2.5">
                {advantages.map((adv, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-4 p-4 rounded-xl border border-white/[0.1] bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] transition-all duration-300 group/item shadow-lg"
                  >
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <CheckCircle2 size={13} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold mb-0.5 group-hover/item:text-cyan-300 transition-colors">{adv.title}</h4>
                      <p className="text-white/40 text-[11px] leading-relaxed font-medium">{adv.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black tracking-widest uppercase hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(6,182,212,0.4)] border border-cyan-400/30"
                >
                  Start Free Consultation <ArrowRight size={14} />
                </a>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(2,6,23,0)_0%,rgba(2,6,23,0.9)_100%)] z-[15] pointer-events-none" />
    </section>
  );
};
