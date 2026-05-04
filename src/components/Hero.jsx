import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GraduationCap, CheckCircle2, Star, Zap, Globe, MapPin, School } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthModal from './AuthModal';

// Import images from local src/uni folder
import bologna from '../uni/bologna.jpg';
import sapienza from '../uni/sapienza.jpg';
import milano from '../uni/milano.jpg';
import florence from '../uni/florence.jpg';
import padua from '../uni/padua.jpg';

const universities = [
  {
    name: "Bologna",
    fullName: "University of Bologna",
    city: "Bologna, Italy",
    img: bologna,
    rank: "#130"
  },
  {
    name: "Sapienza",
    fullName: "Sapienza University of Rome",
    city: "Rome, Italy",
    img: sapienza,
    rank: "#140"
  },
  {
    name: "Milan",
    fullName: "University of Milan",
    city: "Milan, Italy",
    img: milano,
    rank: "#150"
  },
  {
    name: "Florence",
    fullName: "University of Florence",
    city: "Florence, Italy",
    img: florence,
    rank: "#256"
  },
  {
    name: "Padua",
    fullName: "University of Padua",
    city: "Padua, Italy",
    img: padua,
    rank: "#130"
  }
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [modalOpen, setModalOpen] = useState(null);



  // Preloader with better state management
  useEffect(() => {
    universities.forEach((uni, idx) => {
      const img = new Image();
      img.src = uni.img;
      img.onload = () => setImagesLoaded(prev => ({ ...prev, [idx]: true }));
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % universities.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden bg-[#020817]">

        {/* 🌌 COOL ANIMATED IMAGE BACKGROUND 🌌 */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${universities[currentIndex].img})`,
                willChange: 'transform, opacity, filter',
                contain: 'layout style'
              }}
              className="absolute inset-0 bg-cover bg-center transform-gpu blur-[4px] scale-110"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/60 via-[#020817]/20 to-[#020817]"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
              className="flex flex-col items-start pt-12 pb-6"
            >


              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-2 tracking-tight text-left drop-shadow-[0_4px_12px_rgba(0,0,0,1)] relative z-20"
              >
                <span className="animate-gradient-text">FREE</span> Study In <br />
                <div className="relative h-[1.3em] overflow-visible inline-block min-w-[300px]">
                  <AnimatePresence>
                    <motion.div
                      key={currentIndex}
                      initial={{ y: 30, opacity: 0, rotateX: -90, filter: "blur(10px)" }}
                      animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
                      exit={{ y: -30, opacity: 0, rotateX: 90, filter: "blur(10px)" }}
                      transition={{
                        duration: 0.8,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      className="absolute left-0 top-0 block whitespace-nowrap pr-4 transform-gpu"
                      style={{ transformOrigin: "center" }}
                    >
                      <span className="hero-university-gradient font-black drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]" style={{ lineHeight: '1.4' }}>
                        {universities[currentIndex].name}
                      </span>
                      <motion.span 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="ml-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] md:text-[12px] font-black uppercase tracking-[0.1em] align-middle shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      >
                         Global Rank {universities[currentIndex].rank}
                      </motion.span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-5  relative z-20"
              >
                <Zap size={12} className="fill-current" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Elite Italian Education</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-base md:text-lg text-blue-50/80 mb-4 max-w-lg leading-relaxed font-medium text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                Join 10,000+ students in world-class public universities with <span className="text-accent-gold font-black">€8,000 annual grants</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-2 gap-x-12 gap-y-5 mb-10 w-full max-w-lg"
              >
                <FeatureItem Icon={School} title="Public Universities" />
                <FeatureItem Icon={Star} title="Zero Tuition" />
                <FeatureItem Icon={Globe} title="100% Scholarship" />
                <FeatureItem Icon={GraduationCap} title="Expert Mentors" />
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalOpen('signup')}
                  className="bg-accent-gold text-primary-blue px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-yellow-500 transition-all w-full sm:w-auto justify-center shadow-[0_20px_50px_-10px_rgba(197,168,128,0.3)]"
                >
                  Book Your University <ArrowRight size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* RIGHT VISUAL - LARGE CIRCULAR 3D CAROUSEL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:flex justify-center relative perspective-1000"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
                className="absolute -inset-8 border-2 border-dashed border-accent-gold/20 rounded-full transform-gpu"
              />

              {/* Direct-DOM rotation via ref — no React re-renders on mousemove */}
              <div
                className="relative z-10 w-[500px] h-[500px] rounded-full p-3 bg-white/5 border border-white/20 shadow-[0_0_100px_-20px_rgba(197,168,128,0.2)] overflow-hidden group transform-gpu"
              >
                <div className="relative h-full w-full rounded-full overflow-hidden bg-[#020817]">
                  <AnimatePresence>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100, scale: 0.8, }}
                      animate={{ opacity: 1, x: 0, scale: 1, }}
                      exit={{ opacity: 0, x: -100, scale: 1.1, }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-full overflow-hidden"
                    >
                      {!imagesLoaded[currentIndex] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                          <div className="w-8 h-8 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={universities[currentIndex].img}
                        className={`absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 ${imagesLoaded[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
                        alt={universities[currentIndex].name}
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent opacity-80"></div>

                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-8 text-center">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="relative z-10"
                        >
                          {/* Strong shadow glow for readability */}
                          <div className="absolute -inset-x-12 -inset-y-8 bg-[#020817]/60 blur-xl rounded-full -z-10"></div>

                          <div className="flex items-center justify-center gap-2 text-accent-gold font-black text-[10px] uppercase tracking-[0.3em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <MapPin size={14} /> {universities[currentIndex].city}
                          </div>
                          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-gold to-white bg-[length:200%_auto] animate-[gradient-flow_4s_linear_infinite] text-3xl font-black mb-4 leading-tight drop-shadow-[0_10px_20px_rgba(0,0,0,1)] pr-4">
                            {universities[currentIndex].fullName}
                          </h3>
                          <div className="inline-block px-5 py-1.5 rounded-full bg-accent-gold text-primary-blue font-black text-[10px] tracking-widest uppercase shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            {universities[currentIndex].rank}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent-gold rounded-full shadow-[0_0_20px_#C5A880] animate-pulse"></div>
            </motion.div>

          </div>
        </div>
      </section>
      {/* Auth Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const FeatureItem = ({ Icon, title }) => (
  <div className="flex items-center gap-4 group text-shadow">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/40 transition-all">
      <Icon className="text-accent-gold" size={20} />
    </div>
    <h4 className="text-white font-black text-sm uppercase tracking-widest leading-tight whitespace-nowrap">{title}</h4>
  </div>
);
