import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Globe, Mail, Phone, Building, MapPin, MessageSquare, Briefcase, ArrowRight } from 'lucide-react';
import { Header } from './Header';

const BusinessPartnerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        email: '',
        phone: '+91 ',
        companyName: '',
        program: '',
        city: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log("Partner Registration Data:", formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const programs = [
        "Italy Study Visa",
        "Multicountry Study Visas",
        "Apple Academy Program",
        "General Programs"
    ];

    return (
        <div className="min-h-screen bg-[#0a0d18] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent-gold/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-32 pb-20 px-6 sm:px-12 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl"
                >
                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-gold/10 border border-accent-gold/30 mb-6 shadow-[0_0_30px_rgba(197,168,128,0.2)]"
                        >
                            <Briefcase className="w-8 h-8 text-accent-gold" />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Partner With Us</h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Join our global network of elite educational consultants and scale your business with Presume Overseas.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl relative">
                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 bg-[#0a0d18]/90 backdrop-blur-md rounded-[32px] z-50 flex flex-col items-center justify-center text-center p-8 border border-accent-gold/30"
                                >
                                    <CheckCircle2 className="w-20 h-20 text-accent-gold mb-6" />
                                    <h3 className="text-3xl font-black text-white mb-2">Request Received!</h3>
                                    <p className="text-gray-300">Thank you for your interest. Our partnership team will contact you shortly.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="John Doe" />
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="Global Edu Inc." />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="contact@company.com" />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="+91 9876543210" />
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Country</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="Your Country" />
                                    </div>
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50" placeholder="Your City" />
                                    </div>
                                </div>
                            </div>

                            {/* Program */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Choose Program of Interest</label>
                                <select required name="program" value={formData.program} onChange={handleChange} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-4 px-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50 appearance-none">
                                    <option value="" disabled className="bg-[#0a0d18] text-gray-500">Select a program...</option>
                                    {programs.map(p => (
                                        <option key={p} value={p} className="bg-[#0a0d18] text-white py-2">{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message / Proposal</label>
                                <div className="relative">
                                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                                        <MessageSquare className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-[#0a0d18]/50 border border-white/10 focus:border-accent-gold text-white rounded-xl py-3.5 pl-12 pr-4 transition-colors outline-none focus:ring-1 focus:ring-accent-gold/50 resize-none" placeholder="Tell us about your business and how we can collaborate..."></textarea>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-4">
                                <button type="submit" className="w-full group relative px-8 py-5 bg-white text-[#0a0d18] rounded-xl font-black tracking-widest text-[13px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
                                    <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                    <span className="relative flex items-center justify-center gap-3 group-hover:text-[#0a0d18] transition-colors duration-500 uppercase">
                                        Submit Registration <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default BusinessPartnerForm;
