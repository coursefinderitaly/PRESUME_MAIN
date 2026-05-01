import logo from '../assets/logo.png';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = ['Study Visa', 'Work Visa', 'Destinations', 'Universities', 'Contact'];

const contactActions = [
  { label: '+91-8839330134', icon: Phone },
  { label: 'presumeoverseas@gmail.com', icon: Mail },
  { label: 'Vijaynagar, Indore', icon: MapPin },
];

export const Footer = () => {
  return (
    <footer className="footer-clean-shell relative overflow-hidden text-white">
      <div className="absolute inset-0 footer-clean-bg" />
      <div className="absolute inset-0 footer-clean-aurora" />
      <div className="absolute inset-0 footer-clean-wave" />
      <div className="absolute inset-0 footer-glass-field" />
      <div className="absolute inset-x-0 bottom-0 h-56 footer-bottom-mist" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <motion.img 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            src={logo} alt="Presume Overseas" className="mx-auto h-12 w-auto object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" 
          />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="footer-readable-title mt-4 text-2xl font-black tracking-normal sm:text-3xl"
          >
            Your next destination starts with one clear plan.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="footer-readable-copy mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/72 sm:text-base"
          >
            Study and work visa guidance made simple, focused, and practical.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 flex flex-wrap justify-center gap-2"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="footer-nav-pill rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-white/68 backdrop-blur transition-all hover:-translate-y-1 hover:border-slate-400/45 hover:text-white"
              >
                {link}
              </a>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-col gap-4 text-left md:flex-row md:items-center md:justify-center"
          >
            <a
              href="#"
              className="footer-primary-action inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-black text-[#050b14] transition-transform hover:-translate-y-1"
            >
              <MessageCircle size={16} />
              Book a Free Call
              <ArrowUpRight size={16} />
            </a>

            <div className="flex flex-wrap justify-center gap-4 md:justify-center">
              {contactActions.map(({ label, icon: Icon }) => (
                <div key={label} className="footer-contact-chip flex items-center justify-center gap-3 px-2 py-1 text-xs font-bold text-white/68 transition-all hover:text-white">
                  <Icon size={14} className="text-cyan-400" />
                  <span className="whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 pt-4 text-[10px] text-white/42 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="font-bold tracking-wider text-center md:text-left">&copy; 2026 Presume Overseas. All rights reserved.</p>
            <div className="flex gap-4 font-bold">
              <a href="#" className="transition-colors hover:text-white">Terms</a>
              <a href="#" className="transition-colors hover:text-white">Privacy</a>
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.div 
              className="group relative cursor-pointer px-2"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-cyan-400/20  transition-opacity duration-300 group-hover:opacity-100"
                animate={{ opacity: [0, 0.3, 0], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10 font-black uppercase tracking-[0.3em] text-white/50 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                Designer <span className="text-cyan-500/70 transition-colors group-hover:text-cyan-300">@</span> NEET
              </span>
              <div className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          </div>

          {/* Empty right column so it doesn't get covered by the AI Mascot */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </footer>
  );
};
