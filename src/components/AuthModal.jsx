import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  ShieldCheck, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { API_BASE_URL } from '../config';

const AuthModal = ({ type: initialProp, onClose }) => {
  const initialType = typeof initialProp === 'object' ? initialProp?.type : initialProp;
  const initialRole = typeof initialProp === 'object' ? initialProp?.role : 'student';

  const [type, setType] = useState(initialType || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
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
      background: 'rgba(255, 255, 255, 0.03)',
      borderColor: state.isFocused ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '2px 5px',
      boxShadow: state.isFocused ? '0 0 0 1px rgba(6, 182, 212, 0.3)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.2)',
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 100,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? 'rgba(255, 255, 255, 0.1)' : state.isFocused ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      color: state.isSelected ? '#ffffff' : state.isFocused ? '#ffffff' : '#cbd5e1',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: '0.85rem',
      '&:active': {
        background: 'rgba(255, 255, 255, 0.15)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#f1f5f9',
      fontSize: '0.95rem'
    }),
    valueContainer: (base) => ({
      ...base,
      display: 'flex',
      flex: '1 1 auto',
      cursor: 'text',
      flexWrap: 'nowrap'
    }),
    input: (base) => ({
      ...base,
      color: '#f1f5f9',
      margin: 0,
      padding: 0,
      display: 'inline-flex',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      outline: 'none'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#64748b',
      fontSize: '0.95rem'
    }),
    indicatorSeparator: () => ({ display: 'none' })
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email) {
        setError('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (!formData.country || !formData.state || !formData.city) {
        setError('Please select your complete location');
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const switchType = () => {
    setDirection(1);
    setType(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
    setStep(1);
  };

  // Sliding animation variants
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 20 : -20, opacity: 0 })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Background Overlay - Reduced Blur from backdrop-blur-md to backdrop-blur-sm */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.97, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex flex-col md:flex-row w-full max-w-5xl bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow inside modal - Changed to Cyan/Sky */}
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-[70] text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Sidebar (Progress & Info) */}
        <div className="hidden md:flex flex-col justify-between p-10 w-[340px] border-r border-slate-700/30 bg-slate-950/30 relative z-10 shrink-0">
          <div>
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-8 border border-cyan-500/20">
              <Sparkles className="text-cyan-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-50 leading-tight mb-8">
              {type === 'login' ? 'Welcome back to your dashboard.' : 'Start your journey with us.'}
            </h2>

            {type === 'signup' && (
              <div className="space-y-6">
                {[
                  { n: 1, t: 'Personal Info', d: 'Your basic details' },
                  { n: 2, t: 'Location', d: 'Where you are based' },
                  { n: 3, t: 'Security', d: 'Secure your account' }
                ].map((s) => (
                  <div key={s.n} className={`flex items-start gap-4 transition-all duration-300 ${step >= s.n ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === s.n ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' :
                      step > s.n ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                      {step > s.n ? <CheckCircle2 size={14} /> : s.n}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${step >= s.n ? 'text-slate-200' : 'text-slate-400'}`}>{s.t}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span className="text-xs font-medium">Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Side (Forms) */}
        <div className="flex-1 p-6 sm:p-10 relative z-10 flex flex-col overflow-y-auto">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col">

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-50">
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                {type === 'login'
                  ? 'Enter your credentials to access your account.'
                  : 'Join thousands of students and freelancers globally.'}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 ${error.includes('successful') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {error}
              </motion.div>
            )}

            {/* Segmented Control for Role (Signup only) */}
            {type === 'signup' && (
              <div className="flex p-1 bg-slate-950/50 border border-slate-800 rounded-xl mb-8 relative">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'student')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative z-10 ${formData.role === 'student' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'freelancer')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative z-10 ${formData.role === 'freelancer' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  Freelancer
                </button>
                {/* Active Pill Background */}
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-800 rounded-lg shadow transition-all duration-300 z-0 ${formData.role === 'freelancer' ? 'translate-x-full left-[calc(0%+4px)]' : 'left-1'}`}
                />
              </div>
            )}

            <form onSubmit={type === 'login' ? handleLogin : (e) => e.preventDefault()} className="flex-1 flex flex-col">
              {type === 'login' ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <button type="button" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="space-y-5"
                    >
                      {step === 1 && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-300">First Name</label>
                              <input type="text" required value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" placeholder="John" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-300">Last Name</label>
                              <input type="text" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" placeholder="Doe" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email Address <span className="text-red-400">*</span></label>
                            <input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" placeholder="john@example.com" />
                          </div>

                          {formData.role === 'freelancer' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Occupation</label>
                                <select
                                  value={formData.occupation}
                                  onChange={e => handleInputChange('occupation', e.target.value)}
                                  className="w-full px-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none text-sm"
                                >
                                  <option value="" disabled className="bg-slate-900 text-slate-400">Select...</option>
                                  <option value="work" className="bg-slate-900">Work</option>
                                  <option value="student" className="bg-slate-900">Student</option>
                                  <option value="freelancer" className="bg-slate-900">Freelancer</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Service</label>
                                <select
                                  value={formData.registeredService}
                                  onChange={e => handleInputChange('registeredService', e.target.value)}
                                  className="w-full px-4 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none text-sm"
                                >
                                  <option value="" disabled className="bg-slate-900 text-slate-400">Select...</option>
                                  <option value="work visa" className="bg-slate-900">Work Visa</option>
                                  <option value="study visa" className="bg-slate-900">Study Visa</option>
                                  <option value="tourist visa" className="bg-slate-900">Tourist Visa</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Country</label>
                            <Select classNamePrefix="react-select" options={countries} value={formData.country} onChange={v => handleInputChange('country', v)} styles={selectStyles} placeholder="Search countries..." menuPortalTarget={document.body} menuPosition="fixed" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">State / Province</label>
                            <Select classNamePrefix="react-select" options={states} value={formData.state} onChange={v => handleInputChange('state', v)} styles={selectStyles} isDisabled={!formData.country} placeholder="Select state..." menuPortalTarget={document.body} menuPosition="fixed" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">City</label>
                            <Select classNamePrefix="react-select" options={cities} value={formData.city} onChange={v => handleInputChange('city', v)} styles={selectStyles} isDisabled={!formData.state} placeholder="Select city..." menuPortalTarget={document.body} menuPosition="fixed" />
                          </div>
                          {formData.role === 'freelancer' && (
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-300">Passport Issued Country</label>
                              <Select classNamePrefix="react-select" options={countries} value={formData.passportCountry} onChange={v => handleInputChange('passportCountry', v)} styles={selectStyles} placeholder="Search countries..." menuPortalTarget={document.body} menuPosition="fixed" />
                            </div>
                          )}
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-300">Phone</label>
                              <div className="flex gap-2">
                                <div className="w-[72px] px-2 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-400 flex items-center justify-center font-medium text-sm shrink-0">
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
                                  className="w-full px-3 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                                  placeholder=""
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-300">WhatsApp</label>
                              <div className="flex gap-2">
                                <div className="w-[72px] px-2 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-400 flex items-center justify-center font-medium text-sm shrink-0">
                                  +{formData.country?.phonecode || '91'}
                                </div>
                                <input
                                  type="tel"
                                  value={formData.whatsapp}
                                  onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleInputChange('whatsapp', val);
                                  }}
                                  className="w-full px-3 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800 my-4" />

                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Create Password</label>
                            <div className="relative">
                              <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="w-full pl-4 pr-11 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <div className="relative">
                              <input type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="w-full pl-4 pr-11 py-3 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" placeholder="••••••••" />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex gap-3 mt-auto">
                {type === 'signup' && step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors flex justify-center items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                <button
                  type={type === 'login' || step === 3 ? 'submit' : 'button'}
                  onClick={() => {
                    if (type === 'signup' && step < 3) {
                      nextStep();
                    } else if (type === 'signup' && step === 3) {
                      handleSignup();
                    }
                  }}
                  disabled={loading}
                  className="flex-[2] py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-medium shadow-[0_4px_14px_rgba(6,182,212,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>
                      <span>{type === 'login' ? 'Sign In' : step === 3 ? 'Create Account' : 'Continue'}</span>
                      {(!type === 'login' || step !== 3) && <ArrowRight size={16} />}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={switchType}
                className="text-slate-400 text-sm hover:text-cyan-400 transition-colors font-medium"
              >
                {type === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
