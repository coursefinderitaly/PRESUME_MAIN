import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight, ShieldCheck, Phone, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../config';

const QuickAuthModal = ({ isOpen, onClose, onSuccess, initialProgram = 'Bachelors' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phonePrefix: '+91',
    phone: '',
    password: '',
    program: initialProgram
  });
  
  // Update formData.program when initialProgram prop changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, program: initialProgram }));
  }, [initialProgram]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
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
          ...formData,
          phone: `${formData.phonePrefix} ${formData.phone}`,
          role: 'student',
          deferWelcomeEmail: true // Defer welcome email until payment completes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      // Notify parent to proceed to payment
      onSuccess(formData.email, formData.password, formData.program);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.97, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.97, y: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-[200px] -right-[200px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-[70] text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 relative z-10">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-slate-50 mb-2">Create Account</h3>
            <p className="text-slate-400 text-sm">
              Quickly register to proceed with your payment securely.
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl mb-6 text-xs font-medium flex items-center gap-3 bg-red-500/10 text-red-400 border border-red-500/20 text-center justify-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-medium text-slate-300">Program Level</label>
              <select
                value={formData.program}
                onChange={e => handleInputChange('program', e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm appearance-none"
              >
                <option value="Bachelors" className="bg-slate-900">Bachelors</option>
                <option value="Masters" className="bg-slate-900">Masters</option>
                <option value="MBBS" className="bg-slate-900">MBBS</option>
              </select>
              <div className="absolute right-3 top-[34px] pointer-events-none text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">First Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  required 
                  value={formData.firstName} 
                  onChange={e => handleInputChange('firstName', e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" 
                  placeholder="John" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={e => handleInputChange('email', e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" 
                  placeholder="john@example.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Phone Number</label>
              <div className="flex bg-white/5 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
                <select
                  value={formData.phonePrefix}
                  onChange={e => handleInputChange('phonePrefix', e.target.value)}
                  className="bg-transparent border-none text-slate-300 pl-3 pr-2 py-2.5 outline-none text-sm cursor-pointer hover:bg-white/10"
                >
                  <option value="+91" className="bg-slate-800 text-slate-200">+91 (IN)</option>
                  <option value="+1" className="bg-slate-800 text-slate-200">+1 (US/CA)</option>
                  <option value="+44" className="bg-slate-800 text-slate-200">+44 (UK)</option>
                  <option value="+61" className="bg-slate-800 text-slate-200">+61 (AU)</option>
                  <option value="+971" className="bg-slate-800 text-slate-200">+971 (AE)</option>
                  <option value="+353" className="bg-slate-800 text-slate-200">+353 (IE)</option>
                  <option value="+49" className="bg-slate-800 text-slate-200">+49 (DE)</option>
                </select>
                <div className="w-px bg-slate-700/50 my-2"></div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, ''); 
                    const maxLen = formData.phonePrefix === '+91' ? 10 : 15;
                    if (val.length <= maxLen) handleInputChange('phone', val);
                  }}
                  className="w-full pl-3 pr-4 py-2.5 bg-transparent text-slate-100 placeholder:text-slate-500 outline-none text-sm"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={formData.password} 
                  onChange={e => handleInputChange('password', e.target.value)} 
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-medium shadow-[0_4px_14px_rgba(6,182,212,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <span>Continue to Payment</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-slate-500 mt-4">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-xs font-medium">Bank-grade encryption</span>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default QuickAuthModal;
