import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, User, Globe, MapPin, Phone, Smartphone, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, ShieldCheck, Sparkles, GraduationCap, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { API_BASE_URL } from '../config';

const AuthModal = ({ type: initialProp, onClose }) => {
  const initialType = typeof initialProp === 'object' ? initialProp?.type : initialProp;
  const initialRole = typeof initialProp === 'object' ? initialProp?.role : 'student';

  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialType) setType(initialType);
    if (initialRole) setFormData(prev => ({ ...prev, role: initialRole }));
  }, [initialType, initialRole]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: null,
    state: null,
    city: null,
    phone: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    role: initialRole || 'student',
    // Freelancer specific fields
    currentCountry: null,
    passportCountry: null,
    occupation: '',
    registeredService: ''
  });

  // Country/State/City Data
  const countries = useMemo(() => {
    const all = Country.getAllCountries();
    const india = all.find(c => c.isoCode === 'IN');
    const others = all.filter(c => c.isoCode !== 'IN');
    return [india, ...others].filter(Boolean).map(c => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
      name: c.name,
      phonecode: c.phonecode.replace('+', '')
    }));
  }, []);

  const states = useMemo(() =>
    formData.country ? State.getStatesOfCountry(formData.country.value).map(s => ({
      value: s.isoCode,
      label: s.name
    })) : [], [formData.country]);

  const cities = useMemo(() =>
    (formData.country && formData.state) ? City.getCitiesOfState(formData.country.value, formData.state.value).map(c => ({
      value: c.name,
      label: c.name
    })) : [], [formData.country, formData.state]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields
      ...(field === 'country' ? { state: null, city: null } : {}),
      ...(field === 'state' ? { city: null } : {})
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        credentials: 'include',
        body: JSON.stringify({ identifier, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      sessionStorage.setItem('tab_session', 'active');
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Cannot connect to server.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          country: formData.country?.name,
          state: formData.state?.label,
          city: formData.city?.value,
          phone: `+${formData.country?.phonecode || '91'}${formData.phone}`,
          whatsapp: `+${formData.country?.phonecode || '91'}${formData.whatsapp}`,
          password: formData.password,
          role: formData.role,
          // Freelancer fields
          ...(formData.role === 'freelancer' ? {
            currentCountry: formData.country?.name, // Re-using step 2 country as current
            passportCountry: formData.passportCountry?.name,
            occupation: formData.occupation,
            registeredService: formData.registeredService
          } : {})
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setType('login');
      setError('Registration successful! Please login.');
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: state.isFocused ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      padding: '4px',
      color: 'white',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#0a0d18',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
      color: state.isFocused ? '#22d3ee' : 'white',
      cursor: 'pointer',
      '&:active': {
        background: 'rgba(6, 182, 212, 0.2)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white'
    }),
    input: (base) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.3)'
    })
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email) {
        setError('Please fill in required fields');
        return false;
      }
    } else if (step === 2) {
      if (!formData.country || !formData.state || !formData.city) {
        setError('Please select your location');
        return false;
      }
    }
    setError('');
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* CSS keyframes - must live outside overflow:hidden */}
      <style>{`
        @keyframes orbFloat1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(160px, -100px) scale(1.3); }
          66%  { transform: translate(-60px, 80px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-120px, 120px) scale(1.4); }
          66%  { transform: translate(80px, -60px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat3 {
          0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          50%  { transform: translate(-50%, -50%) scale(1.5); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
        }
        @keyframes orbFloat4 {
          0%   { transform: translate(0px, 0px); opacity: 0.3; }
          50%  { transform: translate(-80px, 100px); opacity: 0.7; }
          100% { transform: translate(0px, 0px); opacity: 0.3; }
        }
        @keyframes orbFloat5 {
          0%   { transform: translate(0px, 0px) scale(1); }
          40%  { transform: translate(100px, -80px) scale(1.2); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>

      {/* Orbs - z:0 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>

        {/* Cyan — top left */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-150px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.55) 0%, transparent 65%)',
          filter: 'blur(50px)',
          animation: 'orbFloat1 18s ease-in-out infinite'
        }} />
        {/* Indigo — bottom right */}
        <div style={{
          position: 'absolute', bottom: '-180px', right: '-180px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'orbFloat2 22s ease-in-out infinite -5s'
        }} />
        {/* Purple — center pulse */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 65%)',
          filter: 'blur(55px)',
          animation: 'orbFloat3 14s ease-in-out infinite -3s'
        }} />
        {/* Rose — top right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 65%)',
          filter: 'blur(55px)',
          animation: 'orbFloat4 16s ease-in-out infinite -8s'
        }} />
        {/* Teal — bottom left */}
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 65%)',
          filter: 'blur(50px)',
          animation: 'orbFloat5 20s ease-in-out infinite -11s'
        }} />
      </div>
      {/* Dark scrim sits ABOVE orbs but BELOW modal */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)', zIndex: 1 }} />
      <motion.div
        initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
        className="relative border border-white/10 rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col md:flex-row w-full max-w-6xl h-auto max-h-[90vh] overflow-hidden z-10"
        style={{ 
          background: 'rgba(5,8,20,0.72)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)', 
          position: 'relative', 
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 z-[70] text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
        >
          <X size={24} />
        </button>
        {/* === Sidebar glow orbs === */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
          <div style={{
            position: 'absolute', top: '-60px', left: '-60px',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orbFloat5 15s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orbFloat4 18s ease-in-out infinite',
            animationDelay: '-6s'
          }} />
        </div>

        {/* Progress Sidebar */}
        <div className="hidden md:flex flex-col justify-between p-12 w-1/3 border-r border-white/5 relative z-10 overflow-y-auto"
          style={{ background: 'linear-gradient(145deg, rgba(30,27,75,0.85) 0%, rgba(5,8,20,0.7) 100%)', flexShrink: 0 }}>
          <div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <GraduationCap className="text-cyan-400 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-white leading-tight mb-8">
              {type === 'login' ? 'Welcome Back Explorer' : 'Begin Your Global Journey'}
            </h2>

            {type === 'signup' && (
              <div className="space-y-8">
                {[
                  { n: 1, t: 'Account Identity', d: 'Basic credentials' },
                  { n: 2, t: 'Geographic Profile', d: 'Your location data' },
                  { n: 3, t: 'Security Access', d: 'Protect your account' }
                ].map((s) => (
                  <div key={s.n} className={`flex items-start gap-4 transition-all duration-500 ${step >= s.n ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${step === s.n ? 'bg-cyan-500 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' :
                      step > s.n ? 'bg-green-500 border-green-500 text-white' : 'border-white/20 text-white/40'
                      }`}>
                      {step > s.n ? <CheckCircle2 size={16} /> : s.n}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">{s.t}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 text-white/40 mb-2">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-10 flex flex-col relative z-10 bg-black/20 overflow-y-auto min-h-0 pb-10 rounded-r-[2.5rem]">

          <div className="max-w-xl mx-auto w-full">
            <div className="mb-6 text-center md:text-left">
              <span className="text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-1 block">
                {type === 'login' ? 'Authentication' : `Step ${step} of 3`}
              </span>
              <h3 className="text-2xl font-black text-white">
                {type === 'login' ? 'Sign In' : step === 1 ? 'Personal Info' : step === 2 ? 'Where are you from?' : 'Secure Your Identity'}
              </h3>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 ${error.includes('successful') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                <div className={`w-2 h-2 rounded-full ${error.includes('successful') ? 'bg-green-400' : 'bg-red-400'}`} />
                {error}
              </motion.div>
            )}

            {/* Role Selection Toggle */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl gap-2 mb-6">
              <button
                type="button"
                onClick={() => handleInputChange('role', 'student')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === 'student' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('role', 'freelancer')}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${formData.role === 'freelancer' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                Freelancer
              </button>
            </div>

            <form onSubmit={type === 'login' ? handleLogin : (e) => e.preventDefault()} className="space-y-4">
              {type === 'login' ? (
                <div className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1 group-focus-within:text-cyan-400 transition-colors">Identifier</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                      <input type="text" required value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition-all" placeholder="Enter Your Email" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 group-focus-within:text-cyan-400 transition-colors">Password</label>
                      <button type="button" className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">Recovery</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                      <input type={showPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition-all font-mono" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">First Name</label>
                            <input type="text" required value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all text-sm" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Last Name</label>
                            <input type="text" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all text-sm" placeholder="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                          <input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all text-sm" placeholder="john@example.com" />
                        </div>
                        {formData.role === 'freelancer' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Occupation</label>
                              <select 
                                value={formData.occupation} 
                                onChange={e => handleInputChange('occupation', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all appearance-none text-sm"
                                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                              >
                                <option value="" disabled style={{ background: '#0a0d18' }}>Select Occupation</option>
                                <option value="work" style={{ background: '#0a0d18' }}>Work</option>
                                <option value="student" style={{ background: '#0a0d18' }}>Student</option>
                                <option value="freelancer" style={{ background: '#0a0d18' }}>Freelancer</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Registered Service</label>
                              <select 
                                value={formData.registeredService} 
                                onChange={e => handleInputChange('registeredService', e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all appearance-none text-sm"
                                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                              >
                                <option value="" disabled style={{ background: '#0a0d18' }}>Select Service</option>
                                <option value="work visa" style={{ background: '#0a0d18' }}>Work Visa</option>
                                <option value="study visa" style={{ background: '#0a0d18' }}>Study Visa</option>
                                <option value="tourist visa" style={{ background: '#0a0d18' }}>Tourist Visa</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Select Country</label>
                          <Select options={countries} value={formData.country} onChange={v => handleInputChange('country', v)} styles={selectStyles} placeholder="Search countries..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Select State / Province</label>
                          <Select options={states} value={formData.state} onChange={v => handleInputChange('state', v)} styles={selectStyles} isDisabled={!formData.country} placeholder="Select state..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Select City</label>
                          <Select options={cities} value={formData.city} onChange={v => handleInputChange('city', v)} styles={selectStyles} isDisabled={!formData.state} placeholder="Select city..." />
                        </div>
                        {formData.role === 'freelancer' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Passport Issued Country</label>
                            <Select options={countries} value={formData.passportCountry} onChange={v => handleInputChange('passportCountry', v)} styles={selectStyles} placeholder="Search countries..." />
                          </div>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Phone</label>
                            <div className="flex gap-2">
                              <div className="w-16 px-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 flex items-center justify-center font-bold text-xs shrink-0">
                                +{formData.country?.phonecode || '91'}
                              </div>
                              <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  handleInputChange('phone', val);
                                }}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all text-sm"
                                placeholder="0000000000"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">WhatsApp</label>
                            <div className="flex gap-2">
                              <div className="w-16 px-2 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 flex items-center justify-center font-bold text-xs shrink-0">
                                +{formData.country?.phonecode || '91'}
                              </div>
                              <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={e => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  handleInputChange('whatsapp', val);
                                }}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all text-sm"
                                placeholder="0000000000"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Create Secure Password</label>
                          <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="w-full px-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all font-mono text-sm" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Confirm Password</label>
                          <div className="relative">
                            <input type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="w-full px-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400/50 transition-all font-mono text-sm" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="pt-4 flex gap-4">
                {type === 'signup' && step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-4 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all flex justify-center items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                )}

                <button
                  type={type === 'login' || step === 3 ? 'submit' : 'button'}
                  onClick={() => {
                    if (type === 'signup' && step < 3) {
                      if (validateStep()) setStep(step + 1);
                    } else if (type === 'signup' && step === 3) {
                      handleSignup();
                    }
                  }}
                  disabled={loading}
                  className="flex-[2] py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-white font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      <span>{type === 'login' ? 'Authenticate' : step === 3 ? 'Finalize' : 'Continue'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center pb-12">
              <button
                type="button"
                onClick={() => { setType(type === 'login' ? 'signup' : 'login'); setError(''); setStep(1); }}
                className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-colors"
              >
                {type === 'login' ? "Don't have an account? Join Now" : "Already a member? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
