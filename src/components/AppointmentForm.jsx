import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, ArrowRight, X, CalendarCheck, Clock, ShieldCheck } from 'lucide-react';
import { Header } from './Header';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '+91 ',
        whatsapp: '+91 '
    });

    const [showSummary, setShowSummary] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        let { name, value } = e.target;
        const prefix = '+91 ';
        const digits = value.replace(prefix, '').replace(/[^\d]/g, '');
        const truncated = digits.slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: prefix + truncated }));
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        setShowSummary(true);
    };

    const handleConfirmBooking = () => {
        // Typically make API call here
        console.log("Appointment Booked:", formData);
        setShowSummary(false);
        setIsConfirmed(true);
        setTimeout(() => {
            setIsConfirmed(false);
            setFormData({ fullname: '', email: '', phone: '+91 ', whatsapp: '+91 ' });
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-[#0a0d18] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent-gold/10 rounded-full blur-[150px] -translate-x-1/2"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-32 pb-20 px-6 sm:px-12 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-2xl"
                >
                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                        >
                            <Calendar className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Book an Appointment</h1>
                        <p className="text-gray-400 text-lg max-w-lg mx-auto">Schedule a free 1-on-1 consultation with our expert advisors to map your international career.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        
                        {/* Success Message Overlay */}
                        <AnimatePresence>
                            {isConfirmed && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-[#0a0d18]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-8 border border-green-500/30 rounded-[32px]"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <ShieldCheck className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h3>
                                    <p className="text-gray-300">We have sent the meeting link to {formData.email}. We look forward to speaking with you!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleInitialSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input required type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="Jane Doe" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="jane@example.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone No */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="+91 9876543210" />
                                    </div>
                                </div>

                                {/* Whatsapp No */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-green-500/50" />
                                        </div>
                                        <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handlePhoneChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-green-500/50 text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-green-500/50" placeholder="+91 9876543210" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6 border-t border-white/5">
                                <button type="submit" className="w-full group relative px-8 py-5 bg-white text-[#0a0d18] rounded-xl font-black tracking-widest text-[13px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
                                    <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                    <span className="relative flex items-center justify-center gap-3 group-hover:text-[#0a0d18] transition-colors duration-500 uppercase">
                                        Request Appointment <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>

            {/* Popup Summary Modal */}
            <AnimatePresence>
                {showSummary && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-[#0a0d18] border border-white/20 rounded-[32px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-xl font-black text-white">Confirm Booking</h3>
                                <button onClick={() => setShowSummary(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center shrink-0">
                                        <CalendarCheck className="w-6 h-6 text-accent-gold" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 font-medium">Consultation Type</p>
                                        <p className="text-white font-bold">Free Expert Advisory</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm bg-black/20 p-5 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Name</span>
                                        <span className="font-bold text-white">{formData.fullname}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Email</span>
                                        <span className="font-bold text-white">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Phone</span>
                                        <span className="font-bold text-white">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">WhatsApp</span>
                                        <span className="font-bold text-white">{formData.whatsapp}</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 pt-2">
                                    <button 
                                        onClick={() => setShowSummary(false)}
                                        className="flex-1 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={handleConfirmBooking}
                                        className="flex-1 py-4 rounded-xl bg-accent-gold text-primary-blue font-black hover:bg-yellow-500 transition-colors shadow-[0_10px_20px_-10px_rgba(197,168,128,0.5)]"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AppointmentForm;
