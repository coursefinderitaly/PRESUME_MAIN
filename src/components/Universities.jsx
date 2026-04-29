import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MousePointerClick } from 'lucide-react';
import DomeGallery from './DomeGallery';

// Import images from local src/uni folder
import bologna from '../uni/bologna.jpg';
import sapienza from '../uni/sapienza.jpg';
import milano from '../uni/milano.jpg';
import florence from '../uni/florence.jpg';
import padua from '../uni/padua.jpg';
import roma from '../uni/roma.jpg';
import progetto from '../uni/progetto.jpg';
import italyada from '../uni/italyada.jpg';
import eth from '../uni/eth.jpg';
import harvard from '../uni/harvard.jpg';
import melbourne from '../uni/melbourne.jpg';
import pisa from '../uni/pisa.jpg';
import sapienza_research from '../uni/sapienza_research.jpg';
import ucla from '../uni/ucla.jpg';
import campus1 from '../uni/campus1.jpg';
import campus2 from '../uni/campus2.jpg';
import campus3 from '../uni/campus3.jpg';
import campus4 from '../uni/campus4.jpg';
import campus5 from '../uni/campus5.jpg';

const universities = [
  { id: 1, name: 'Sapienza University of Rome', image: sapienza },
  { id: 2, name: 'University of Bologna', image: bologna },
  { id: 3, name: 'University of Milan', image: milano },
  { id: 4, name: 'University of Padua', image: padua },
  { id: 5, name: 'University of Florence', image: florence },
  { id: 6, name: 'University of Rome Tor Vergata', image: roma },
  { id: 7, name: 'University of Pisa', image: pisa },
  { id: 8, name: 'Politecnico di Milano', image: campus1 },
  { id: 9, name: 'University of Naples Federico II', image: campus2 },
  { id: 10, name: 'University of Turin', image: campus3 },
];

const DOME_IMAGES = [
  { src: sapienza, alt: 'Sapienza University of Rome' },
  { src: bologna, alt: 'University of Bologna' },
  { src: milano, alt: 'University of Milan' },
  { src: padua, alt: 'University of Padua' },
  { src: florence, alt: 'University of Florence' },
  { src: roma, alt: 'Rome Campus View' },
  { src: pisa, alt: 'Pisa Academic Square' },
  { src: eth, alt: 'ETH Zurich Partnership' },
  { src: harvard, alt: 'Global Exchange Program' },
  { src: melbourne, alt: 'International Studies' },
  { src: ucla, alt: 'Research Collaborations' },
  { src: sapienza_research, alt: 'Advanced Research Lab' },
  { src: progetto, alt: 'Modern Campus Project' },
  { src: italyada, alt: 'Student Life in Italy' },
  { src: campus1, alt: 'Historic Courtyard' },
  { src: campus2, alt: 'University Library' },
  { src: campus3, alt: 'Lecture Halls' },
  { src: campus4, alt: 'Student Hub' },
  { src: campus5, alt: 'Science Department' },
];

const VerticalMarquee = ({ images, align, direction = -1, speed = 30 }) => {
  // Duplicate array exactly twice so -50% is a perfect loop
  const loopImages = [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images];

  return (
    <div className={`absolute ${align === 'left' ? 'left-3 sm:left-6 lg:left-8' : 'right-3 sm:right-6 lg:right-8'} top-0 bottom-0 w-[120px] sm:w-[140px] lg:w-[180px] overflow-hidden z-30 pointer-events-none hidden md:flex flex-col`}>
      {/* Top and Bottom faded mask */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0a0d18] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0a0d18] to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex flex-col gap-5 pt-5"
        animate={{ y: direction === -1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {loopImages.map((uni, idx) => (
          <div key={idx} className="relative flex-shrink-0 w-full h-[85px] sm:h-[100px] lg:h-[125px] rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/[0.08] backdrop-blur-md transform-gpu">
            <img src={uni.image} alt={uni.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu" />
            <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3 z-10 bg-black/40 backdrop-blur-md border-t border-white/10 will-change-[backdrop-filter]">
              <h3 className="text-[9px] sm:text-[10px] lg:text-xs font-black text-white leading-tight drop-shadow-md">
                {uni.name}
              </h3>
              <div className="w-5 h-0.5 bg-[#f8d991] mt-1.5 rounded-full" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const Universities = () => {
  const [marqueeSpeed, setMarqueeSpeed] = useState(40);
  const [domeSpeed, setDomeSpeed] = useState(0.04);

  // RAF-throttled cursor tracking — writes directly to DOM, zero React re-renders
  const gradientRef = useRef(null);
  const rafPendingRef = useRef(false);
  const cursorRef = useRef({ x: 50, y: 42 });

  const handleMouseMove = useCallback((event) => {
    if (rafPendingRef.current) return;
    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      rafPendingRef.current = false;
      const bounds = event.currentTarget?.getBoundingClientRect();
      if (!bounds || !gradientRef.current) return;
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      cursorRef.current = { x, y };
      gradientRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(197,168,128,0.34) 0%, rgba(56,189,248,0.18) 18%, rgba(10,13,24,0) 42%),
        radial-gradient(circle at ${100 - x}% ${Math.max(8, y - 18)}%, rgba(0,140,69,0.18) 0%, rgba(10,13,24,0) 34%),
        linear-gradient(135deg, #0a0d18 0%, #101827 46%, #060914 100%)`;
    });
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="section-safe relative isolate bg-transparent overflow-hidden"
      style={{ height: '100svh', minHeight: 'min(760px, 100svh)', display: 'flex', flexDirection: 'column' }}
    >
      {/* RAF-driven gradient bg — direct DOM, no React re-renders on mousemove */}
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(197,168,128,0.34) 0%, rgba(56,189,248,0.18) 18%, rgba(10,13,24,0) 42%),
            radial-gradient(circle at 50% 24%, rgba(0,140,69,0.18) 0%, rgba(10,13,24,0) 34%),
            linear-gradient(135deg, #0a0d18 0%, #101827 46%, #060914 100%)`,
          contain: 'layout style'
        }}
      />
      {/* Subtle depth overlay (replaces expensive full-viewport backdrop-blur-[42px]) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,13,24,0.3) 0%, rgba(6,9,20,0.7) 100%)',
          contain: 'layout style'
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div
        className="pointer-events-none absolute inset-x-3 sm:inset-x-8 top-4 bottom-4 sm:bottom-6 z-[1] rounded-[28px] border border-white/[0.12]"
        style={{
          background: 'radial-gradient(ellipse at 50% 48%, rgba(30,58,138,0.26) 0%, rgba(10,13,24,0.12) 72%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />

      {/* ── SECTION HEADER ── */}
      <div className="flex-none pb-1 px-4 z-10 text-center relative" style={{ paddingTop: 'calc(var(--section-header-offset) + 8px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-normal drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            Study in Top Italy{' '}
            <span className="bg-gradient-to-r from-[#f8d991] via-white to-[#8fd3c2] bg-clip-text text-transparent">
              Public Universities
            </span>
          </h2>
          <p className="text-white/65 text-sm sm:text-base md:text-lg font-semibold">
            100% Scholarships · No Tuition Fees · World-class Education
          </p>
          <p className="text-white/25 text-[10px] sm:text-xs tracking-widest uppercase">

          </p>
        </motion.div>
      </div>

      {/* ── DOME GALLERY ── */}
      <div className="relative flex-1 z-10 w-full" style={{ minHeight: 'min(390px, calc(100svh - 200px))' }}>
        <VerticalMarquee images={universities} align="left" direction={-1} speed={marqueeSpeed} />
        <VerticalMarquee images={universities} align="right" direction={1} speed={marqueeSpeed} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="pointer-events-none absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-black/40 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <MousePointerClick size={16} className="text-[#f8d991]" />
          Drag to explore · Click to enlarge
        </motion.div>

        {/* Speed Controls - High-end Glassmorphism UI */}
        <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-3 scale-90 sm:scale-100 origin-bottom-right">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a0d18]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 min-w-[240px]"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#f8d991] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Motion Controls</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Side Flow</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">Marquee Speed</span>
                </div>
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-mono text-[#f8d991] border border-white/5">
                  {Math.round((60 - marqueeSpeed + 10) / 0.5)}%
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={60 - marqueeSpeed + 10} 
                onChange={(e) => setMarqueeSpeed(60 - parseInt(e.target.value) + 10)}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#f8d991] hover:accent-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Gallery</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">Auto Rotation</span>
                </div>
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-mono text-[#8fd3c2] border border-white/5">
                  {Math.round(domeSpeed * 2000)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1"
                value={domeSpeed * 100} 
                onChange={(e) => setDomeSpeed(parseFloat(e.target.value) / 100)}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#8fd3c2] hover:accent-white transition-all"
              />
            </div>

            <div className="mt-1 pt-4 border-t border-white/5">
              <p className="text-[9px] text-white/30 font-medium italic text-center">
                * Adjust speeds for optimal visual comfort
              </p>
            </div>
          </motion.div>
        </div>

        {/* Frosted glass / blur background card so the dome looks like a floating 3D object */}
        <div
          className="absolute inset-x-3 sm:inset-x-8 inset-y-2 z-0 rounded-[24px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(197,168,128,0.16) 0%, rgba(30,58,138,0.16) 42%, rgba(10,13,24,0.0) 74%)',
          }}
        />

        {/* DomeGallery itself */}
        <div className="absolute inset-0">
          <DomeGallery
            images={DOME_IMAGES}
            fit={0.38}
            minRadius={300}
            maxRadius={470}
            overlayBlurColor="#0a0d18"
            grayscale={false}
            dragSensitivity={16}
            dragDampening={1.8}
            imageBorderRadius="16px"
            openedImageBorderRadius="20px"
            openedImageWidth="340px"
            openedImageHeight="340px"
            segments={28}
            autoRotateSpeed={domeSpeed}
          />
        </div>
      </div>



    </section>
  );
};
