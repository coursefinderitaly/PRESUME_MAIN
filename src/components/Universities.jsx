import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import InteractiveAccordionGallery from './InteractiveAccordionGallery';

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
  { id: 1, name: 'Sapienza University of Rome', image: sapienza, rank: '#140' },
  { id: 2, name: 'University of Bologna', image: bologna, rank: '#130' },
  { id: 3, name: 'University of Milan', image: milano, rank: '#150' },
  { id: 4, name: 'University of Padua', image: padua, rank: '#130' },
  { id: 5, name: 'University of Florence', image: florence, rank: '#256' },
  { id: 6, name: 'University of Rome Tor Vergata', image: roma, rank: '#392' },
  { id: 7, name: 'University of Pisa', image: pisa, rank: '#252' },
  { id: 8, name: 'Politecnico di Milano', image: campus1, rank: '#317' },
  { id: 9, name: 'University of Naples Federico II', image: campus2, rank: '#192' },
  { id: 10, name: 'University of Turin', image: campus3, rank: '#221' },
];


const VerticalMarquee = ({ images, align, direction = -1, speed = 30, isVisible }) => {
  // Duplicate array exactly twice so -50% is a perfect loop
  const loopImages = [...images, ...images, ...images, ...images, ...images, ...images, ...images, ...images];

  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className={`absolute ${align === 'left' ? 'left-3 sm:left-6 lg:left-8' : 'right-3 sm:right-6 lg:right-8'} top-0 bottom-0 w-[120px] sm:w-[140px] lg:w-[180px] overflow-hidden z-30 pointer-events-none hidden md:flex flex-col`}
    >
      {/* Top and Bottom faded mask */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0a0d18] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0a0d18] to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex flex-col gap-5 pt-5"
        animate={isVisible ? { y: direction === -1 ? ['0%', '-50%'] : ['-50%', '0%'] } : {}}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {loopImages.map((uni, idx) => (
          <div key={idx} className="relative flex-shrink-0 w-full h-[85px] sm:h-[100px] lg:h-[125px] rounded-[20px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/[0.08]  transform-gpu">
            <img src={uni.image} alt={uni.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu" />
            <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3 z-10 bg-black/40  border-t border-white/10 will-change-[backdrop-filter]">
              <h3 className="text-[9px] sm:text-[10px] lg:text-xs font-black text-white leading-tight drop-shadow-md">
                {uni.name}
              </h3>
              <div className="w-5 h-0.5 bg-[#f8d991] mt-1.5 rounded-full" />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};


export const Universities = () => {
  // ── SPEED CONTROLS ──────────────────────────────────────────────────────────
  // To adjust speeds, change the values below:
  //   marqueeSpeed : duration in seconds for one full loop — HIGHER = SLOWER
  const MARQUEE_SPEED = 70;   // ← change this to control side image scroll speed
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-safe relative isolate bg-transparent overflow-hidden"
      style={{ height: '100svh', minHeight: 'min(760px, 100svh)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Elegant static gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(197,168,128,0.15) 0%, rgba(56,189,248,0.08) 18%, rgba(10,13,24,0) 42%),
            radial-gradient(circle at 50% 24%, rgba(0,140,69,0.08) 0%, rgba(10,13,24,0) 34%),
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
        <VerticalMarquee images={universities} align="left" direction={-1} speed={MARQUEE_SPEED} isVisible={isVisible} />
        <VerticalMarquee images={universities} align="right" direction={1} speed={MARQUEE_SPEED} isVisible={isVisible} />

        <div
          className="absolute inset-x-3 sm:inset-x-8 inset-y-2 z-0 rounded-[24px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(197,168,128,0.16) 0%, rgba(30,58,138,0.16) 42%, rgba(10,13,24,0.0) 74%)',
          }}
        />

        {/* User Provided Interactive Accordion Gallery */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-auto z-40">
          <div className="w-full h-full max-h-[85vh] flex items-center justify-center">
            <InteractiveAccordionGallery />
          </div>
        </div>
      </div>
    </section>
  );
};
