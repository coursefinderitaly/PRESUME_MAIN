import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthModal from './AuthModal';

import logo from '../assets/logo.png';

export const Header = ({ compact = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);
  
  // Use refs for scroll state to prevent React re-renders on scroll
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const isScrolledRef = useRef(false);

  // Site is fully dark-themed — header is always dark/glassmorphic
  const isDarkHeader = true;

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const shouldBeScrolled = window.scrollY > 20;
      
      if (shouldBeScrolled !== isScrolledRef.current) {
        isScrolledRef.current = shouldBeScrolled;
        
        if (headerRef.current) {
          if (shouldBeScrolled) {
            headerRef.current.classList.add('bg-black/10', 'backdrop-blur-[32px]', 'shadow-[0_10px_40px_rgba(0,0,0,0.4)]', 'py-2');
            headerRef.current.classList.remove('bg-transparent', 'py-6');
          } else {
            headerRef.current.classList.add('bg-transparent', 'py-6');
            headerRef.current.classList.remove('bg-black/10', 'backdrop-blur-[32px]', 'shadow-[0_10px_40px_rgba(0,0,0,0.4)]', 'py-2');
          }
        }
        
        if (logoRef.current) {
          if (shouldBeScrolled) {
            logoRef.current.classList.add(compact ? 'h-6' : 'h-10');
            logoRef.current.classList.remove(compact ? 'h-8' : 'h-14');
          } else {
            logoRef.current.classList.add(compact ? 'h-8' : 'h-14');
            logoRef.current.classList.remove(compact ? 'h-6' : 'h-10');
          }
        }
        
        if (navRef.current) {
          const navItems = navRef.current.querySelectorAll('.nav-item-container');
          navItems.forEach(item => {
            if (shouldBeScrolled) {
              item.classList.add(compact ? 'py-2' : 'py-3');
              item.classList.remove(compact ? 'py-3' : 'py-6');
            } else {
              item.classList.add(compact ? 'py-3' : 'py-6');
              item.classList.remove(compact ? 'py-2' : 'py-3');
            }
          });
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    updateHeader();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [compact]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 w-full z-[2000] transition-all duration-500 bg-transparent py-6 transform-gpu"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center gap-2">
              <img ref={logoRef} src={logo} alt="Presume Overseas" className={`transition-all duration-500 ${compact ? 'h-8' : 'h-14'} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transform-gpu`} />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav ref={navRef} className={`hidden md:flex items-center absolute left-1/2 -translate-x-1/2 ${compact ? 'gap-4' : 'gap-8'}`}>
            {[
              <NavItem
                key="services"
                isDarkHeader={isDarkHeader}
                compact={compact}
                title="SERVICES"
                items={[
                  {
                    label: 'Student Visa',
                    desc: 'Study in top global destinations',
                    subItems: [
                      { label: 'Italy', desc: 'Free education & €8,000 grants', path: '/study-in-italy' },
                      { label: 'Australia', desc: 'High-quality education system', path: '/study-in-australia' },
                      { label: 'Canada', desc: 'Post-study work opportunities', path: '/study-in-canada' },
                      { label: 'France', desc: 'Rich cultural & academic heritage', path: '/study-in-france' },
                      { label: 'Germany', desc: 'Zero tuition public universities', path: '/study-in-germany' },
                      { label: 'Ireland', desc: 'Fast-growing tech & research hub', path: '/study-in-ireland' },
                      { label: 'United Kingdom', desc: 'World-class academic excellence', path: '/study-in-uk' },
                      { label: 'United States', desc: 'Global leader in higher education', path: '/study-in-usa' }
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
              />,
              <NavItem
                key="programs"
                isDarkHeader={isDarkHeader}
                compact={compact}
                title="PROGRAMS"
                items={[
                  { label: 'Apple Academy', desc: 'Premium coding & design programs', path: '/apple-academy' }
                ]}
              />,

              <NavItem
                key="forms"
                isDarkHeader={isDarkHeader}
                compact={compact}
                title="FORMS"
                items={[
                  { label: 'Business Partner Registration', desc: 'Become an official partner', path: '/partner-registration' },
                  { label: 'Book an Appointment', desc: 'Schedule a free consultation', path: '/book-appointment' }
                ]}
              />,
              <NavItem
                key="company"
                isDarkHeader={isDarkHeader}
                compact={compact}
                title="COMPANY"
                items={[
                  { label: 'Our Story', desc: 'Mission to democratize education', path: '/our-story' },
                  { label: 'Contact Us', desc: 'Get in touch today', path: '/contact' }
                ]}
              />
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                {item}
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            {[
              <motion.button
                key="coursefinder"
                onClick={() => setModalOpen('signup')}
                className="font-black text-[15px] tracking-[0.18em] bg-gradient-to-r from-amber-300 via-orange-200 to-rose-300 bg-clip-text text-transparent hover:from-amber-200 hover:via-white hover:to-rose-200 hover:scale-105 transition-all duration-300 uppercase border-b border-amber-400/40 pb-0.5"
                animate={{ 
                  scale: [1, 1.04, 1], 
                  filter: ["brightness(1)", "brightness(1.25)", "brightness(1)"]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                COURSEFINDER
              </motion.button>,
              <div key="auth-group" className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-md">
                {/* LOGIN ITEM */}
                <div className="relative group/login-menu pb-4 -mb-4">
                  <button
                    onClick={() => setModalOpen({ type: 'login', role: 'student' })}
                    className={`font-black text-[11px] tracking-widest hover:text-accent-gold transition-colors px-4 py-2 rounded-full ${!isDarkHeader ? 'text-primary-blue' : 'text-white'}`}
                  >
                    LOGIN
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#0b0e17] border border-white/10 p-1.5 rounded-2xl flex flex-col gap-1 opacity-0 group-hover/login-menu:opacity-100 translate-y-2 group-hover/login-menu:translate-y-0 pointer-events-none group-hover/login-menu:pointer-events-auto transition-all duration-300 shadow-2xl backdrop-blur-xl z-[60] w-36">
                    <button
                      onClick={() => setModalOpen({ type: 'login', role: 'student' })}
                      className="px-4 py-2.5 text-[10px] font-black tracking-widest text-white/60 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all uppercase text-left"
                    >
                      As Student
                    </button>
                    <button
                      onClick={() => setModalOpen({ type: 'login', role: 'freelancer' })}
                      className="px-4 py-2.5 text-[10px] font-black tracking-widest text-white/60 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all uppercase text-left"
                    >
                      As Freelancer
                    </button>
                  </div>
                </div>

                {/* SIGN UP ITEM */}
                <div className="relative group/signup-menu pb-4 -mb-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
                    className="bg-accent-gold text-primary-blue px-5 py-2.5 rounded-full font-black text-[11px] tracking-wider hover:bg-yellow-400 transition-all shadow-md"
                  >
                    SIGN UP
                  </motion.button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#0b0e17] border border-white/10 p-1.5 rounded-2xl flex flex-col gap-1 opacity-0 group-hover/signup-menu:opacity-100 translate-y-2 group-hover/signup-menu:translate-y-0 pointer-events-none group-hover/signup-menu:pointer-events-auto transition-all duration-300 shadow-2xl backdrop-blur-xl z-[60] w-36">
                    <button
                      onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
                      className="px-4 py-2.5 text-[10px] font-black tracking-widest text-white/60 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all uppercase text-left"
                    >
                      As Student
                    </button>
                    <button
                      onClick={() => setModalOpen({ type: 'signup', role: 'freelancer' })}
                      className="px-4 py-2.5 text-[10px] font-black tracking-widest text-white/60 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all uppercase text-left"
                    >
                      As Freelancer
                    </button>
                  </div>
                </div>
              </div>
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              >
                {item}
              </motion.div>
            ))}
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
            className="fixed inset-0 z-[60] bg-[#0a0d18] p-8 flex flex-col h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img src={logo} alt="Presume Overseas" className="h-10 w-auto object-contain brightness-0 invert" />
              </Link>
              <button className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-full border border-white/10" onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-white" /></button>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'SERVICES', items: [
                    { label: 'Student Visa', subItems: ['Italy', 'Australia', 'Canada', 'France', 'Germany', 'Ireland', 'United Kingdom', 'United States'] },
                    { label: 'Work Visa', subItems: ['Bulgaria', 'Croatia', 'Czech Republic', 'Germany', 'Serbia'] }
                  ]
                },
                { title: 'PROGRAMS', items: [{ label: 'Apple Academy', path: '/apple-academy' }] },
                {
                  title: 'FORMS', items: [
                    { label: 'Business Partner Registration', path: '/partner-registration' },
                    { label: 'Book an Appointment', path: '/book-appointment' }
                  ]
                },
                { title: 'COMPANY', items: [{ label: 'Our Story', path: '/our-story' }, { label: 'Contact Us', path: '/contact' }] }
              ].map((section) => (
                <MobileNavItem key={section.title} section={section} />
              ))}
            </div>

            <div className="mt-auto pt-10 grid grid-cols-1 gap-4">
              <button
                onClick={() => { setModalOpen('signup'); setMobileMenuOpen(false); }}
                className="py-6 border-2 border-amber-400/20 hover:border-amber-400/50 transition-all rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden relative group"
              >
                <span className="font-black text-[28px] tracking-[0.2em] bg-gradient-to-r from-amber-300 via-orange-200 to-rose-300 bg-clip-text text-transparent uppercase">COURSEFINDER</span>
                <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <Link
                to="/test"
                target="_blank"
                className="py-5 font-black tracking-widest text-white border-2 border-white/10 hover:border-cyan-400 transition-colors rounded-2xl bg-white/5 flex items-center justify-center"
              >
                VIEW ANIMATION
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setModalOpen({ type: 'login', role: 'student' }); setMobileMenuOpen(false); }}
                  className="py-4 font-black tracking-wider text-xs text-white border border-white/10 hover:border-cyan-400 transition-colors rounded-xl bg-white/5 uppercase"
                >
                  Student Login
                </button>
                <button
                  onClick={() => { setModalOpen({ type: 'login', role: 'freelancer' }); setMobileMenuOpen(false); }}
                  className="py-4 font-black tracking-wider text-xs text-white border border-white/10 hover:border-cyan-400 transition-colors rounded-xl bg-white/5 uppercase"
                >
                  Freelancer Login
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setModalOpen({ type: 'signup', role: 'student' }); setMobileMenuOpen(false); }}
                  className="py-4 font-black tracking-wider text-xs text-primary-blue bg-accent-gold hover:bg-yellow-400 transition-all rounded-xl uppercase shadow-md"
                >
                  Student Sign Up
                </button>
                <button
                  onClick={() => { setModalOpen({ type: 'signup', role: 'freelancer' }); setMobileMenuOpen(false); }}
                  className="py-4 font-black tracking-wider text-xs text-primary-blue bg-accent-gold hover:bg-yellow-400 transition-all rounded-xl uppercase shadow-md"
                >
                  Freelancer Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal via Portal */}
      {modalOpen && createPortal(
        <AnimatePresence>
          <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

const NavItem = ({ title, items, isDarkHeader, compact }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className={`nav-item-container relative group transition-all duration-500 ${compact ? 'py-3' : 'py-6'}`}
      onMouseLeave={() => setActiveSubMenu(null)}
    >
      <div className={`flex items-center gap-1.5 ${compact ? 'text-[10px]' : 'text-[12px]'} font-black tracking-[0.2em] transition-all duration-300 cursor-pointer ${!isDarkHeader ? 'text-primary-blue/90' : 'text-white/90'
        } group-hover:text-accent-gold uppercase`}>
        {title}
        <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500 ease-out" />
      </div>

      {/* Main Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,transform,visibility] duration-250 ease-out translate-y-2 group-hover:translate-y-0 z-50 will-change-[transform,opacity] transform-gpu">
        <div className="relative rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] p-3 overflow-hidden border border-white/10 bg-[#0a0d18]">

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
                    <p className={`text-[15px] font-bold tracking-tight transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${activeSubMenu === idx ? 'text-accent-gold' : 'text-white hover:text-accent-gold'}`}>{item.label}</p>
                    <p className="text-[11px] font-medium text-gray-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{item.desc}</p>
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
              className="absolute top-0 left-[calc(100%+0.4rem)] w-[26rem] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.03)] p-3 z-[60] overflow-hidden transform-gpu max-h-[calc(100vh-100px)] border border-white/10 bg-[#0a0d18]"
            >

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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sub.path) {
                          navigate(sub.path);
                          setActiveSubMenu(null);
                        }
                      }}
                      className="group/sub flex items-center gap-3 px-3 py-3 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0">
                        <p className="text-[14px] font-bold text-gray-100 group-hover/sub:text-accent-gold truncate pr-1 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {sub.label}
                        </p>
                        <p className="text-[11px] font-medium text-gray-400 truncate transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
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
                onClick={(e) => {
                  e.stopPropagation();
                  const countryPathMap = {
                    'Italy': '/study-in-italy',
                    'Australia': '/study-in-australia',
                    'Canada': '/study-in-canada',
                    'France': '/study-in-france',
                    'Germany': '/study-in-germany',
                    'Ireland': '/study-in-ireland',
                    'United Kingdom': '/study-in-uk',
                    'United States': '/study-in-usa'
                  };
                  if (countryPathMap[sub]) {
                    navigate(countryPathMap[sub]);
                    setMobileMenuOpen(false);
                  }
                }}
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