import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthModal from './AuthModal';

import logo from '../assets/logo.png';

export const Header = ({ compact = false }) => {
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
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Presume Overseas" className={`transition-all duration-500 ${isScrolled ? (compact ? 'h-6' : 'h-10') : (compact ? 'h-8' : 'h-14')} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`} />
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center ${compact ? 'gap-4' : 'gap-8'}`}>
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              compact={compact}
              title="SERVICES" 
              items={[
                { 
                  label: 'Student Visa', 
                  desc: 'Study in top global destinations',
                  subItems: [
                    { label: 'Italy', desc: 'Free education & €5,200 grants', path: '/study-in-italy' },
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
              compact={compact}
              title="PROGRAMS" 
              items={[
                { label: 'Apple Academy', desc: 'Premium coding & design programs' }
              ]} 
            />
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              compact={compact}
              title="RESOURCES" 
              items={[
                { label: 'Course Finder', desc: 'Find your perfect degree', url: 'https://coursefinderitaly.com/' },
                { label: 'Scholarship Guide', desc: 'Maximize your funding' },
                { label: 'Pre-Assessment', desc: 'Free profile evaluation' },
                { label: 'Expert Consultation', desc: '1-on-1 career mapping' }
              ]} 
            />
            <NavItem 
              isScrolled={isScrolled}
              isDarkHeader={isDarkHeader}
              compact={compact}
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
            className="fixed inset-0 z-[60] bg-[#0a0d18]/95 backdrop-blur-3xl p-8 flex flex-col h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="Presume Overseas" className="h-10 w-auto object-contain brightness-0 invert" />
              </Link>
              <button className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-full border border-white/10" onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-white" /></button>
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
                className="py-5 font-black tracking-widest text-white border-2 border-white/10 hover:border-accent-gold transition-colors rounded-2xl bg-white/5"
              >
                LOGIN
              </button>
              <button 
                onClick={() => { setModalOpen('signup'); setMobileMenuOpen(false); }}
                className="py-5 font-black tracking-widest text-primary-blue bg-accent-gold rounded-2xl shadow-xl"
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

const NavItem = ({ title, items, isScrolled, isDarkHeader, compact }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navigate = useNavigate();

  return (
    <div 
      className={`relative group transition-all duration-500 ${isScrolled ? (compact ? 'py-2' : 'py-3') : (compact ? 'py-3' : 'py-6')}`}
      onMouseLeave={() => setActiveSubMenu(null)}
    >
      <div className={`flex items-center gap-1.5 ${compact ? 'text-[10px]' : 'text-[12px]'} font-black tracking-[0.2em] transition-all duration-300 cursor-pointer ${
        !isDarkHeader ? 'text-primary-blue/90' : 'text-white/90'
      } group-hover:text-accent-gold uppercase`}>
        {title} 
        <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500 ease-out" />
      </div>
      
      {/* Main Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-250 ease-out translate-y-2 group-hover:translate-y-0 z-50 will-change-[transform,opacity] transform-gpu">
        <div className="relative rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-3 overflow-hidden border border-white/20 bg-[#0a0d18]/95 backdrop-blur-3xl">
          {/* Subtle accent orbs */}
          <div className="pointer-events-none absolute -top-10 -left-6 w-32 h-32 rounded-full bg-accent-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-blue-400/10 blur-3xl" />
          {/* Top gradient border line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="relative z-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveSubMenu(item.subItems ? idx : null)}
                onClick={() => {
                  if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
                  else if (item.path) navigate(item.path);
                }}
              >
                <div className={`flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer ${activeSubMenu === idx ? 'bg-white/10 shadow-inner' : ''}`}>
                  <div className="flex flex-col gap-1">
                    <p className={`text-[15px] font-bold tracking-tight transition-colors ${activeSubMenu === idx ? 'text-accent-gold' : 'text-white hover:text-accent-gold'}`}>{item.label}</p>
                    <p className="text-[11px] font-medium text-gray-300">{item.desc}</p>
                  </div>
                  {item.subItems ? (
                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={14} className={`text-accent-gold transition-all duration-300 ${activeSubMenu === idx ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
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
              className="absolute top-0 left-[calc(100%+0.4rem)] w-[26rem] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-3 z-[60] overflow-hidden transform-gpu max-h-[calc(100vh-100px)] border border-white/20 bg-[#0a0d18]/95 backdrop-blur-3xl"
            >
              {/* Subtle accent orbs */}
              <div className="pointer-events-none absolute -top-8 right-0 w-28 h-28 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 w-20 h-20 rounded-full bg-accent-gold/15 blur-3xl" />
              {/* Top gradient border line */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              
              <div className="relative z-10">
                <div className="px-4 py-3 border-b border-white/10 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold"></div>
                  <span className="text-[11px] font-bold text-gray-300 tracking-[0.2em] uppercase">Select Destination</span>
                </div>
                {/* 2-column grid so 8 countries stay compact */}
                <div className="grid grid-cols-2 gap-2">
                  {items[activeSubMenu].subItems.map((sub, sIdx) => (
                    <div 
                      key={sIdx} 
                      onClick={() => { if(sub.path) { navigate(sub.path); setActiveSubMenu(null); } }} 
                      className="group/sub flex items-center gap-3 px-3 py-3 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0">
                        <p className="text-[14px] font-bold text-gray-100 group-hover/sub:text-accent-gold truncate pr-1 transition-colors">
                          {sub.label}
                        </p>
                        <p className="text-[11px] font-medium text-gray-400 truncate transition-colors">
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
        <span className={isOpen ? 'text-accent-gold' : 'text-white'}>{section.title}</span>
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
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <button 
        onClick={() => {
          if (item.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
          } else if (item.subItems) {
            setIsOpen(!isOpen);
          } else if (item.path) {
            navigate(item.path);
          }
        }}
        className="text-xl font-black flex items-center justify-between w-full group transition-colors"
      >
        <span className={isOpen ? 'text-accent-gold' : 'text-white'}>{item.label}</span>
        {item.subItems ? (
          <ArrowRight size={20} className={`text-accent-gold transition-all duration-300 ${isOpen ? 'rotate-90 scale-125' : 'opacity-40 group-hover:opacity-100'}`} />
        ) : (
          <ArrowRight size={20} className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 gap-3 pl-4 overflow-hidden"
          >
            {item.subItems.map((sub, idx) => (
              <div 
                key={idx} 
                onClick={() => { if(sub === 'Italy') navigate('/study-in-italy'); }} 
                className="flex items-center justify-between text-gray-400 text-base font-bold bg-white/5 px-5 py-4 rounded-2xl border border-white/5 hover:border-accent-gold/40 hover:text-white transition-all cursor-pointer"
              >
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