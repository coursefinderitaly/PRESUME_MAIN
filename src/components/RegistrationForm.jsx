import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export const RegistrationForm = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    fname: '', lname: '', email: '', phone: '+91 ', interest: '', message: ''
  });

  const handlePhoneChange = (e) => {
    let { name, value } = e.target;
    const prefix = '+91 ';
    const digits = value.replace(prefix, '').replace(/[^\d]/g, '');
    const truncated = digits.slice(0, 10);
    setFormData(prev => ({ ...prev, [name]: prefix + truncated }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="section-safe relative min-h-[100svh] overflow-hidden flex flex-col justify-center py-16"
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 contact-section-bg" />

      {/* Animated aurora orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-8%] -left-[8%] w-[580px] h-[580px] rounded-full contact-orb-1" />
        <div className="absolute bottom-[-8%] -right-[8%] w-[520px] h-[520px] rounded-full contact-orb-2" />
        <div className="absolute top-[45%] left-[45%] -translate-x-1/2 w-[440px] h-[440px] rounded-full contact-orb-3" />
        {/* Conic shimmer */}
        <div className="absolute inset-0 contact-section-shimmer" />
      </div>

      {/* Interactive mouse follow highlight */}
      {isClient && (
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          animate={{
            background: `radial-gradient(700px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.09), transparent 40%)`
          }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-[calc(var(--section-header-offset)+16px)]">
        <div className="text-center mb-8">

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg"
          >
            Contact <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Us</span>
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] rounded-[24px] shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col"
        >
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            
            {/* Left Info Panel */}
            <div className="lg:w-2/5 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden bg-black/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 mb-6"
              >
                <h3 className="text-2xl font-black text-white mb-2">Let's Talk About Your Future</h3>
                <p className="text-white/60 text-sm leading-relaxed">Whether you're looking to study abroad or find work in Europe, our counselors are here to guide you.</p>
              </motion.div>
              
              <div className="relative z-10 flex flex-col gap-5 mb-6 flex-1 min-h-0 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors text-cyan-400">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">Office Location</h4>
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed">410, 4th Floor, Apollo Premier,<br />Vijaynagar, Indore, MP 452010</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors text-blue-400">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">Email Us</h4>
                    <p className="text-xs sm:text-sm text-white/50 break-all">presumeoverseas@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20 group-hover:bg-green-500/20 transition-colors text-green-400">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">Call Us</h4>
                    <p className="text-xs sm:text-sm text-white/50">+91-8839330134</p>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative z-10 flex flex-col gap-3 mt-auto"
              >
                <div className="flex gap-3">
                  <a href="tel:+918839330134" className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg border border-white/10 transition-all text-sm font-bold shadow-sm">
                    <Phone size={16} className="text-blue-400" /> Call
                  </a>
                  <a href="mailto:presumeoverseas@gmail.com" className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg border border-white/10 transition-all text-sm font-bold shadow-sm">
                    <Mail size={16} className="text-purple-400" /> Email
                  </a>
                </div>
                <a href="https://wa.me/918839330134" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 p-3 rounded-lg border border-green-500/20 transition-all text-sm font-bold shadow-sm">
                  <MessageCircle size={18} /> WhatsApp Us
                </a>
              </motion.div>

            </div>

            {/* Right Form Panel */}
            <div className="lg:w-3/5 p-6 lg:p-10 relative flex flex-col justify-center overflow-y-auto">
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-black text-white mb-6"
              >
                Send Us A Message
              </motion.h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative group"
                  >
                    <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleChange} className="peer w-full pt-6 pb-2 px-4 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all placeholder-transparent" placeholder="First Name" />
                    <label htmlFor="fname" className="absolute left-4 top-2 text-white/40 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-cyan-400 font-medium pointer-events-none">First Name</label>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
                    className="relative group"
                  >
                    <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleChange} className="peer w-full pt-6 pb-2 px-4 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all placeholder-transparent" placeholder="Last Name" />
                    <label htmlFor="lname" className="absolute left-4 top-2 text-white/40 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-cyan-400 font-medium pointer-events-none">Last Name</label>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}
                    className="relative group"
                  >
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="peer w-full pt-6 pb-2 px-4 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all placeholder-transparent" placeholder="Email Address" />
                    <label htmlFor="email" className="absolute left-4 top-2 text-white/40 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-cyan-400 font-medium pointer-events-none">Email Address</label>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }}
                    className="relative group"
                  >
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handlePhoneChange} className="peer w-full pt-6 pb-2 px-4 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all placeholder-transparent" placeholder="+91 9876543210" />
                    <label htmlFor="phone" className="absolute left-4 top-2 text-white/40 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-cyan-400 font-medium pointer-events-none">Phone Number</label>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 }}
                  className="relative group"
                >
                  <select className="w-full pb-3 pt-3 px-4 rounded-xl border border-white/10 bg-black/40 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all appearance-none cursor-pointer">
                    <option value="" disabled selected className="text-gray-500">I am interested in...</option>
                    <option value="study" className="bg-gray-900">Study Visa</option>
                    <option value="work" className="bg-gray-900">Work Visa</option>
                    <option value="consultation" className="bg-gray-900">General Consultation</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">
                    ▼
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 }}
                  className="relative group"
                >
                  <textarea id="message" rows="3" className="peer w-full pt-6 pb-2 px-4 rounded-xl border border-white/10 bg-black/20 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all placeholder-transparent resize-none" placeholder="Your Message"></textarea>
                  <label htmlFor="message" className="absolute left-4 top-2 text-white/40 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-cyan-400 font-medium pointer-events-none">Your Message</label>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl text-sm font-black mt-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Message
                </motion.button>
              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};