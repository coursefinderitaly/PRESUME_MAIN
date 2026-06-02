import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Globe2 } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { API_BASE_URL } from '../config';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', interest: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });

        const names = (formData.fullName || '').trim().split(' ');
        const fname = names[0] || '';
        const lname = names.slice(1).join(' ') || '';

        try {
            const res = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                body: JSON.stringify({ fname, lname, email: formData.email, interest: formData.interest, message: formData.message })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', text: 'Message sent successfully. We will get back to you soon!' });
                setFormData({ fullName: '', email: '', interest: '', message: '' });
            } else {
                setStatus({ type: 'error', text: data.error || 'Failed to send message' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Server error. Please try again later.' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0d18] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-accent-gold/10 blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <Header compact={false} />

            <main className="flex-1 relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row gap-16 items-center">
                
                {/* Left Side: Contact Information */}
                <motion.div 
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-5/12 flex flex-col gap-10"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Globe2 size={12} /> Get in Touch
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
                            Let's map your <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">future.</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium max-w-md">
                            Welcome to Presume Overseas Education. Have a concern? Need assistance? Or just want to say hello? Our experts are here for you.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Address Card */}
                        <div className="group flex items-start gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <MapPin size={24} className="text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white mb-1">Indore HQ</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">410, 4th Floor, Apollo Premier,<br/>Vijay Nagar, Indore, Madhya Pradesh</p>
                            </div>
                        </div>

                        {/* Contact Methods Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <a href="tel:+918839330134" className="group flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-300">
                                    <Phone size={20} className="text-accent-gold" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Call Us</p>
                                    <p className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">+91-8839330134</p>
                                </div>
                            </a>

                            <a href="mailto:presumeoverseas@gmail.com" className="group flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:-rotate-12 transition-transform duration-300">
                                    <Mail size={20} className="text-purple-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Email Us</p>
                                    <p className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">presumeoverseas@gmail.com</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-7/12"
                >
                    <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                        {/* Form decorative background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-cyan-500/10 transition-colors duration-700" />
                        
                        <div className="relative z-10 mb-10">
                            <h2 className="text-3xl font-black text-white mb-2">Drop Us A Line</h2>
                            <p className="text-gray-400 text-sm font-medium">Don't hesitate to ask us anything. Our team usually responds within 2 hours.</p>
                        </div>

                        <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                            {status.text && (
                                <div className={`p-4 rounded-2xl mb-6 text-sm font-bold border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {status.text}
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 text-white rounded-2xl py-4 px-5 transition-all outline-none placeholder-white/20 font-medium" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 text-white rounded-2xl py-4 px-5 transition-all outline-none placeholder-white/20 font-medium" placeholder="john@example.com" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject / Interest</label>
                                <select name="interest" value={formData.interest} onChange={handleChange} className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 text-white rounded-2xl py-4 px-5 transition-all outline-none appearance-none font-medium">
                                    <option value="" disabled className="text-gray-500">Select your inquiry type</option>
                                    <option value="Study Visa" className="bg-gray-900">Study Visa Assistance</option>
                                    <option value="Work Visa" className="bg-gray-900">Work Visa Guidance</option>
                                    <option value="Business Partner" className="bg-gray-900">Business Partnership</option>
                                    <option value="Other" className="bg-gray-900">General Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                                <textarea rows="4" name="message" required value={formData.message} onChange={handleChange} className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 text-white rounded-2xl py-4 px-5 transition-all outline-none placeholder-white/20 resize-none font-medium" placeholder="How can we help you today?"></textarea>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-widest text-[13px] shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-3">
                                {loading ? 'Sending...' : 'Send Message'} <Send size={16} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </main>

            <MinimalFooter />
        </div>
    );
};

export default ContactUsPage;
