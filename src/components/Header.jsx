import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

import logo from '../assets/logo.png';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);

  // Site is fully dark-themed — header is always dark/glassmorphic
  const isDarkHeader = true;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/10 backdrop-blur-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] py-2'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Presume Overseas" className={`transition-all duration-500 ${isScrolled ? 'h-10' : 'h-14'} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              title="SERVICES" 
              items={[
                { 
                  label: 'Student Visa', 
                  desc: 'Study in top global destinations',
                  subItems: [
                    { label: 'Italy', desc: 'Free education & €5,200 grants' },
                    { label: 'Australia', desc: 'High-quality education system' },
                    { label: 'Canada', desc: 'Post-study work opportunities' },
                    { label: 'France', desc: 'Rich cultural & academic heritage' },
                    { label: 'Germany', desc: 'Zero tuition public universities' },
                    { label: 'Ireland', desc: 'Fast-growing tech & research hub' },
                    { label: 'United Kingdom', desc: 'World-class academic excellence' },
                    { label: 'United States', desc: 'Global leader in higher education' }
                  ]
                },
                { 
                  label: 'Work Visa', 
                  desc: 'Build your career in Europe',
                  subItems: [
                    { label: 'Bulgaria', desc: 'Fast-track work permits' },
                    { label: 'Croatia', desc: 'Modern European workforce' },
                    { label: 'Czech Republic', desc: 'Strong industrial & tech base' },
                    { label: 'Germany', desc: 'Skilled worker migration' },
                    { label: 'Serbia', desc: 'Emerging tech & business hub' }
                  ]
                }
              ]} 
            />
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              title="PROGRAMS" 
              items={[
                { label: 'Apple Academy', desc: 'Premium coding & design programs' }
              ]} 
            />
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              title="RESOURCES" 
              items={[
                { label: 'Course Finder', desc: 'Find your perfect degree' },
                { label: 'Scholarship Guide', desc: 'Maximize your funding' },
                { label: 'Pre-Assessment', desc: 'Free profile evaluation' },
                { label: 'Expert Consultation', desc: '1-on-1 career mapping' }
              ]} 
            />
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              title="COMPANY" 
              items={[
                { label: 'Our Story', desc: 'Mission to democratize education' },
                { label: 'Careers', desc: 'Join our growing team' },
                { label: 'Contact Us', desc: 'Get in touch today' }
              ]} 
            />
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setModalOpen('login')}
              className={`font-black text-[13px] tracking-widest hover:text-accent-gold transition-colors ${!isDarkHeader ? 'text-primary-blue' : 'text-white'}`}
            >
              LOGIN
            </button>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(197,168,128,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen('signup')}
              className="bg-accent-gold text-primary-blue px-7 py-3 rounded-full font-black text-[12px] tracking-wider hover:bg-yellow-500 transition-all shadow-lg"
            >
              SIGN UP
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button className={`${!isDarkHeader ? 'text-primary-blue' : 'text-white'} md:hidden p-2`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <img src={logo} alt="Presume Overseas" className="h-10 w-auto object-contain" />
              <button className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full" onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-primary-blue" /></button>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'SERVICES', items: [
                  { label: 'Student Visa', subItems: ['Italy', 'Australia', 'Canada', 'France', 'Germany', 'Ireland', 'United Kingdom', 'United States'] },
                  { label: 'Work Visa', subItems: ['Bulgaria', 'Croatia', 'Czech Republic', 'Germany', 'Serbia'] }
                ]},
                { title: 'PROGRAMS', items: ['Apple Academy'] },
                { title: 'RESOURCES', items: ['Course Finder', 'Scholarship Guide', 'Pre-Assessment', 'Expert Consultation'] },
                { title: 'COMPANY', items: ['Our Story', 'Careers', 'Contact Us'] }
              ].map((section) => (
                <MobileNavItem key={section.title} section={section} />
              ))}
            </div>

            <div className="mt-auto pt-10 grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setModalOpen('login'); setMobileMenuOpen(false); }}
                className="py-5 font-black tracking-widest text-primary-blue border-2 border-gray-200 hover:border-accent-gold transition-colors rounded-2xl"
              >
                LOGIN
              </button>
              <button 
                onClick={() => { setModalOpen('signup'); setMobileMenuOpen(false); }}
                className="py-5 font-black tracking-widest text-white bg-primary-blue rounded-2xl shadow-xl shadow-primary-blue/20"
              >
                SIGN UP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem = ({ title, items, isScrolled, isDarkHeader }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  return (
    <div 
      className={`relative group transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}
      onMouseLeave={() => setActiveSubMenu(null)}
    >
      <div className={`flex items-center gap-1.5 text-[12px] font-black tracking-[0.2em] transition-all duration-300 cursor-pointer ${
        !isDarkHeader ? 'text-primary-blue/90' : 'text-white/90'
      } group-hover:text-accent-gold uppercase`}>
        {title} 
        <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500 ease-out" />
      </div>
      
      {/* Main Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-68 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-250 ease-out translate-y-2 group-hover:translate-y-0 z-50 will-change-[transform,opacity] transform-gpu">
        <div className="relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(168,85,247,0.4)] p-2 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #2d1b5e 0%, #251550 50%, #2e1a60 100%)' }}
        >
          {/* Gradient accent orbs */}
          <div className="pointer-events-none absolute -top-10 -left-6 w-32 h-32 rounded-full bg-violet-400/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-fuchsia-400/20 blur-2xl" />
          {/* Top gradient border line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
          <div className="relative z-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveSubMenu(item.subItems ? idx : null)}
              >
                <div className={`flex items-center justify-between px-4 py-3 hover:bg-violet-500/10 rounded-xl transition-all duration-200 cursor-pointer ${activeSubMenu === idx ? 'bg-violet-500/10' : ''}`}>
                  <div className="flex flex-col gap-0.5">
                    <p className={`text-[15px] font-bold tracking-tight transition-colors ${activeSubMenu === idx ? 'text-violet-300' : 'text-white hover:text-violet-300'}`}>{item.label}</p>
                    <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{item.desc}</p>
                  </div>
                  {item.subItems ? (
                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={14} className={`text-violet-400 transition-all duration-300 ${activeSubMenu === idx ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                    </div>
                  ) : (
                    <ArrowRight size={14} className="text-white/40 opacity-0 hover:opacity-100 -translate-x-1 hover:translate-x-0 transition-all" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Dropdown (Countries) — sibling to main panel, avoids mouse-gap dismissal */}
        <AnimatePresence>
          {activeSubMenu !== null && items[activeSubMenu]?.subItems && (
            <motion.div
              key={activeSubMenu}
              initial={{ opacity: 0, x: 8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onMouseEnter={() => setActiveSubMenu(activeSubMenu)}
              className="absolute top-0 left-[calc(100%+0.4rem)] w-[24rem] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(168,85,247,0.35)] p-3 z-[60] overflow-hidden transform-gpu max-h-[calc(100vh-100px)]"
              style={{ background: 'linear-gradient(145deg, #311a6a 0%, #281460 50%, #2e1868 100%)' }}
            >
              {/* Gradient accent orbs */}
              <div className="pointer-events-none absolute -top-8 right-0 w-28 h-28 rounded-full bg-violet-400/25 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 w-20 h-20 rounded-full bg-fuchsia-400/20 blur-2xl" />
              {/* Top gradient border line */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
              <div className="relative z-10">
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase">Select Destination</span>
                </div>
                {/* 2-column grid so 8 countries stay compact */}
                <div className="grid grid-cols-2 gap-1">
                  {items[activeSubMenu].subItems.map((sub, sIdx) => (
                    <div key={sIdx} className="group/sub flex items-center gap-2 px-3 py-3 hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                      <div className="flex flex-col min-w-0">
                        <p className="text-[14px] font-bold text-white group-hover/sub:text-cyan-400 truncate pr-1 transition-colors">
                          {sub.label}
                        </p>
                        <p className="text-[10px] font-medium text-white/50 truncate transition-colors">
                          {sub.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


const MobileNavItem = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 pb-6 pt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-3xl font-black tracking-tighter flex items-center justify-between w-full uppercase group transition-colors"
      >
        <span className={isOpen ? 'text-accent-gold' : 'text-primary-blue'}>{section.title}</span>
        <ChevronDown size={28} className={`text-accent-gold transition-transform duration-500 ${isOpen ? 'rotate-180 scale-110' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6 pl-4 border-l-2 border-gray-100 ml-1 mt-2">
              {section.items.map((item, idx) => (
                typeof item === 'string' ? (
                  <div key={idx} className="text-gray-500 font-black text-xl hover:text-accent-gold transition-colors cursor-pointer flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/40" />
                    {item}
                  </div>
                ) : (
                  <MobileSubItem key={idx} item={item} />
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileSubItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xl font-black flex items-center justify-between w-full group transition-colors"
      >
        <span className={isOpen ? 'text-accent-gold' : 'text-primary-blue'}>{item.label}</span>
        <ArrowRight size={20} className={`text-accent-gold transition-all duration-300 ${isOpen ? 'rotate-90 scale-125' : 'opacity-40 group-hover:opacity-100'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 gap-3 pl-4 overflow-hidden"
          >
            {item.subItems.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between text-gray-500 text-base font-black bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 hover:border-accent-gold/40 hover:text-primary-blue transition-all">
                {sub}
                <ArrowRight size={14} className="text-accent-gold opacity-50" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};