import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Send, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const MinimalFooter = () => {
  return (
    <footer className="relative w-full py-10 mt-16 border-t border-white/5 bg-[#0a0d18]/60 backdrop-blur-[40px] overflow-hidden">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 select-none">
        <div className="absolute -top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-gold/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Premium Branding & Dynamic Rights */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <motion.img 
            whileHover={{ scale: 1.05, filter: "brightness(1.1) drop-shadow(0 0 15px rgba(212,175,55,0.2))" }}
            src={logo} 
            alt="Presume Overseas" 
            className="h-8 w-auto object-contain select-none transition-all duration-300" 
          />
          <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center md:text-left select-none">
            &copy; {new Date().getFullYear()} Presume Overseas. <span className="hidden sm:inline">Crafting global futures.</span>
          </p>
        </div>

        {/* Center: Interactive High-End Policy Links & Social Icons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-6">
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-accent-gold transition-all uppercase tracking-[0.25em]">Terms</a>
             <a href="#" className="text-[10px] font-black text-gray-400 hover:text-accent-gold transition-all uppercase tracking-[0.25em]">Privacy</a>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>
          
          <div className="flex items-center gap-4">
             <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent-gold/30 hover:bg-white/[0.06] hover:text-accent-gold transition-all duration-300 flex items-center justify-center text-gray-400">
                <Globe size={14} />
             </motion.a>
             <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.06] hover:text-cyan-400 transition-all duration-300 flex items-center justify-center text-gray-400">
                <MessageSquare size={14} />
             </motion.a>
             <motion.a whileHover={{ y: -3, scale: 1.1 }} href="#" className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.06] hover:text-blue-400 transition-all duration-300 flex items-center justify-center text-gray-400">
                <Send size={14} />
             </motion.a>
          </div>
        </div>

        {/* Right: Pulsing Designer Badge */}
        <div className="flex items-center">
            <motion.div 
               className="group relative cursor-pointer px-5 py-2.5 rounded-full border border-white/5 hover:border-cyan-500/30 bg-white/[0.01] hover:bg-cyan-500/5 transition-all duration-500"
               animate={{ y: [0, -3, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             >
               <span className="relative z-10 font-black uppercase tracking-[0.25em] text-[8px] text-gray-400 transition-all duration-300 group-hover:text-white flex items-center gap-1.5 select-none">
                 <Sparkles size={12} className="text-cyan-500/40 group-hover:text-cyan-400 group-hover:animate-pulse transition-colors" />
                 Handcrafted <span className="text-cyan-500/60 group-hover:text-cyan-300 transition-colors">@</span> NEET
               </span>
               <div className="absolute inset-0 rounded-full bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            </motion.div>
        </div>

      </div>
    </footer>
  );
};

export default MinimalFooter;
