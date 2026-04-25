import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment, Sparkles } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Globe2, Target, Users, Award, Shield, Zap, Clock, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { id: 1, name: 'University Partners', value: '500+', icon: Globe2,  accent: '#06b6d4' },
  { id: 2, name: 'Visa Success Rate',   value: '98%',  icon: Target,  accent: '#818cf8' },
  { id: 3, name: 'Students Guided',     value: '10k+', icon: Users,   accent: '#34d399' },
  { id: 4, name: 'Scholarships Won',    value: '$5M+', icon: Award,   accent: '#f59e0b' },
  { id: 5, name: 'Verified Network',    value: 'Top Tier', icon: Shield, accent: '#ec4899' },
  { id: 6, name: 'Expert Counselors',   value: '50+',  icon: Star,   accent: '#8b5cf6' },
  { id: 7, name: 'Fast Processing',     value: 'Express', icon: Zap,    accent: '#10b981' },
  { id: 8, name: 'Support Hours',       value: '24/7', icon: Clock,  accent: '#f43f5e' },
];

const advantages = [
  { title: 'Global University Network', desc: 'Access to 500+ verified public universities across Europe.' },
  { title: 'Expert Visa Filing', desc: '98% success rate with our specialized documentation department.' },
  { title: 'End-to-End Support', desc: 'From initial counseling to post-arrival student assistance.' },
  { title: 'Scholarship Assistance', desc: 'Maximum financial aid and tuition waivers for eligible students.' },
];

const ThreeBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)] z-10 pointer-events-none" />
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere args={[2.5, 64, 64]} position={[-2, 0, -5]}>
          <MeshDistortMaterial color="#0ea5e9" distort={0.3} speed={1.5} roughness={0.1} metalness={0.8} opacity={0.15} transparent />
        </Sphere>
      </Float>
      <Sparkles count={150} scale={15} size={2} speed={0.3} opacity={0.2} color="#fff" />
      <Environment preset="city" />
    </Canvas>
  </div>
);

function OrbitingCard({ stat, index, total, radius }) {
  const angle = (index / total) * 360;

  return (
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="w-full h-full relative"
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto"
          style={{ 
            transform: `rotate(${angle}deg) translateY(-${radius}px)`,
            transformOrigin: `center ${radius}px`,
          }}
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="relative p-2.5 lg:p-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md flex flex-col items-center gap-1.5 min-w-[90px] lg:min-w-[110px]"
          >
            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/5">
              <stat.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" style={{ color: stat.accent }} />
            </div>
            <div className="text-center">
              <p className="text-xs lg:text-sm font-black text-white leading-none">{stat.value}</p>
              <p className="text-[7px] lg:text-[8px] font-bold uppercase tracking-wider text-white/40 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [radius, setRadius] = useState(180);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDim = Math.min(width, height);
      if (width < 768) setRadius(minDim * 0.22);
      else setRadius(minDim * 0.28);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-[#020617] py-12 px-6"
    >
      <ThreeBackground />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 h-full lg:h-auto">
        
        {/* Left/Top: Orbital Visualization */}
        <div className="lg:col-span-7 relative flex items-center justify-center h-[350px] lg:h-[500px]">
          <div className="relative z-20 flex flex-col items-center text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none"
            >
              PRESUME <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
                ADVANTAGE
              </span>
            </motion.h2>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {stats.map((stat, i) => (
              <OrbitingCard 
                key={stat.id} 
                stat={stat} 
                index={i} 
                total={stats.length} 
                radius={radius} 
              />
            ))}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.03] rounded-full z-0"
              style={{ width: radius * 2, height: radius * 2 }}
            />
          </div>
        </div>

        {/* Right: Detailed List of Advantages */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Benefits</span>
            <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight">Why students choose us?</h3>
          </div>

          <div className="flex flex-col gap-4">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <div className="shrink-0 mt-1">
                  <CheckCircle2 size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-1">{adv.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed font-medium">{adv.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300"
            >
              Book Free Consultation <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>

      </div>

      {/* Background radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(2,6,23,0)_0%,rgba(2,6,23,0.95)_100%)] z-[15] pointer-events-none" />
    </section>
  );
};
