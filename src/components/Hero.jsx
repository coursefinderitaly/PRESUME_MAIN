import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GraduationCap, CheckCircle2, Star, Zap, Globe, MapPin, School } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
    rank: "Oldest in Western World"
  },
  {
    name: "Sapienza",
    fullName: "Sapienza University of Rome",
    city: "Rome, Italy",
    img: sapienza,
    rank: "#1 in Italy"
  },
  {
    name: "Milan",
    fullName: "University of Milan",
    city: "Milan, Italy",
    img: milano,
    rank: "Medical Excellence"
  },
  {
    name: "Florence",
    fullName: "University of Florence",
    city: "Florence, Italy",
    img: florence,
    rank: "Historic Excellence"
  },
  {
    name: "Padua",
    fullName: "University of Padua",
    city: "Padua, Italy",
    img: padua,
    rank: "Science & Innovation"
  }
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

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
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[750px] flex items-center overflow-hidden bg-[#020817]">

      {/* 🌌 COOL ANIMATED IMAGE BACKGROUND 🌌 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            animate={{ opacity: 0.3, scale: 1, filter: 'blur(4px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundImage: `url(${universities[currentIndex].img})` }}
            className="absolute inset-0 bg-cover bg-center"
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
            className="flex flex-col items-start py-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-6 backdrop-blur-sm"
            >
              <Zap size={12} className="fill-current" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">Elite Italian Education</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter uppercase mb-8 flex flex-col items-start drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
            >
              <span className="block">Free Study in</span>
              <div className="relative h-[1.1em] w-full overflow-hidden mt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="hero-university-gradient absolute left-0 top-0 block whitespace-nowrap pr-4 font-black"
                  >
                    {universities[currentIndex].name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-lg text-blue-50/80 mb-8 max-w-lg leading-relaxed font-medium text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              Join 10,000+ students in world-class public universities with <span className="text-accent-gold font-black">€5,200 annual grants</span> guaranteed.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10 w-full max-w-sm"
            >
              <FeatureItem Icon={School} title="Public Universities" />
              <FeatureItem Icon={Star} title="Zero Tuition" />
              <FeatureItem Icon={Globe} title="100% Scholarship" />
              <FeatureItem Icon={GraduationCap} title="Expert Mentors" />
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              className="absolute -inset-8 border-2 border-dashed border-accent-gold/20 rounded-full"
            />

            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setRotate({ x: 0, y: 0 })}
              style={{ rotateX: rotate.x, rotateY: rotate.y }}
              className="relative z-10 w-[500px] h-[500px] rounded-full p-3 bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_0_100px_-20px_rgba(197,168,128,0.2)] overflow-hidden cursor-pointer group"
            >
              <div className="relative h-full w-full rounded-full overflow-hidden bg-[#020817]">
                <AnimatePresence>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -100, scale: 1.1, filter: 'blur(10px)' }}
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
                        {/* Precise shadow glow - very tight and only behind text */}
                        <div className="absolute -inset-6 bg-[#020817]/60 blur-2xl rounded-full -z-10"></div>

                        <div className="flex items-center justify-center gap-2 text-accent-gold font-black text-[10px] uppercase tracking-[0.3em] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          <MapPin size={14} /> {universities[currentIndex].city}
                        </div>
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-gold to-white bg-[length:200%_auto] animate-[gradient-flow_4s_linear_infinite] text-3xl font-black mb-4 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] pr-4">
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
            </motion.div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent-gold rounded-full shadow-[0_0_20px_#C5A880] animate-pulse"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ Icon, title }) => (
  <div className="flex items-center gap-4 group text-shadow">
    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/40 transition-all">
      <Icon className="text-accent-gold" size={20} />
    </div>
    <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
  </div>
);
