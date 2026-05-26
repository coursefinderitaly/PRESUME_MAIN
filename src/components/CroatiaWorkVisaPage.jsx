import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronDown, Clock, Coins, FileText, Phone, Waves, HardHat, Monitor } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';

const sectors = [
  { icon: Waves, title: 'Tourism & Hospitality', desc: 'Hotels, restaurants, coastal resorts — booming year-round demand', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: HardHat, title: 'Construction', desc: 'Croatia\'s infrastructure boom creates strong demand for site workers', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { icon: Monitor, title: 'IT Services', desc: 'Zagreb\'s growing tech hub welcomes international IT professionals', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
];

const timeline = [
  { step: 1, title: 'Profile Review', desc: 'Skill and eligibility assessment by our Croatian work visa specialists.' },
  { step: 2, title: 'Employer Matching', desc: 'Connect you with vetted Croatian employers seeking international talent.' },
  { step: 3, title: 'Document Filing', desc: 'Full application package submitted to Croatian immigration authorities.' },
  { step: 4, title: 'Permit Issued', desc: 'Work permit granted — typically within 6–10 weeks of submission.' },
  { step: 5, title: 'Arrival Support', desc: 'Pre-departure orientation and post-arrival guidance included.' },
];

const faqs = [
  { q: 'Is Croatia part of the EU?', a: 'Yes, Croatia joined the EU in 2013 and the Schengen Zone in 2023, making travel across Europe seamless for work permit holders.' },
  { q: 'What is the cost of living in Croatia?', a: 'Croatia is notably affordable compared to Western EU countries. Monthly living expenses typically range €600–€1,000.' },
  { q: 'Do I need to speak Croatian?', a: 'For tourism and hospitality roles, English is often sufficient. For other sectors, basic Croatian phrases help but are not mandatory at entry level.' },
  { q: 'What is the process for Croatian work permit?', a: 'A Croatian employer must first get a work quota allocation, then sponsor your application to the Ministry of Interior. We handle this entire process end-to-end.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${open ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-white font-bold text-sm md:text-base">{q}</span>
        <ChevronDown size={18} className={`text-blue-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const pricingOptions = [
  { service: 'Seasonal work permit in tourism/hospitality', prep: '4 - 6 weeks', advance: '€200', post: '€200', total: '€400' },
  { service: '1 year work permit (Construction/Logistics)', prep: '5 - 8 weeks', advance: '€300', post: '€200', total: '€500' },
];

export default function CroatiaWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Animated Background Blur Loop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-teal-500/20 blur-[140px]" 
        />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden z-10">

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link to="/services/work-visa" className="text-gray-500 text-sm font-medium hover:text-blue-400 transition-colors">Work Visa</Link>
            <span className="text-gray-700">/</span>
            <span className="text-blue-400 text-sm font-bold tracking-wide">Croatia</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center justify-center gap-4 mb-6">
              <span className="text-7xl md:text-8xl drop-shadow-2xl">🇭🇷</span>
            </div>
            
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-4">Work Permit Program</p>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Work in the <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Mediterranean</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              With its recent entry into the Schengen zone, Croatia offers tremendous opportunities in tourism, hospitality, and construction, combining beautiful living with European stability.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/book-appointment" className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Average Salary', value: '€900–€1,800+', color: 'text-blue-400' },
              { label: 'Processing Time', value: '6–10 Weeks', color: 'text-cyan-400' },
              { label: 'Schengen Status', value: 'Joined 2023', color: 'text-teal-400' },
              { label: 'Contract Length', value: '1–2 Years', color: 'text-white' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl py-8 px-6 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all backdrop-blur-sm">
                <p className={`font-black text-xl md:text-2xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mobile stats */}
      <div className="xl:hidden max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Salary', value: '€1,000–€2,200+', color: 'text-blue-400' },
            { label: 'Processing', value: '6–10 Weeks', color: 'text-cyan-400' },
            { label: 'Zone', value: 'EU + Schengen', color: 'text-green-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 text-center">
              <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sectors */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Job Sectors</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Where You'll Work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {sectors.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`rounded-2xl border p-7 ${s.bg} hover:scale-[1.03] transition-all duration-300`}>
                <s.icon size={32} className={`${s.color} mb-4`} />
                <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Croatia */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Key Benefits</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">Why Croatia Is the Smart Choice</h2>
            <div className="space-y-4">
              {[
                { title: 'Full EU & Schengen Access', desc: 'Travel freely across 27 European countries with your Croatian permit.' },
                { title: 'Affordable Living', desc: 'Cost of living significantly lower than Germany or France while salaries remain competitive.' },
                { title: 'Tourism Boom', desc: 'One of Europe\'s fastest-growing tourism markets — jobs are plentiful and seasonal work leads to permanent placements.' },
                { title: 'Safe & Scenic', desc: 'Pristine Adriatic coastline, medieval towns, and one of Europe\'s lowest crime rates.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 bg-white/[0.02] border border-white/6 rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <CheckCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process vertical list */}
          <div>
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Process</p>
            <h2 className="text-3xl font-black text-white mb-8">How It Works</h2>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-lg shadow-blue-600/30">
                    {t.step}
                  </div>
                  <div className="bg-white/[0.02] border border-white/6 rounded-xl p-4 flex-1 hover:border-blue-500/20 transition-all">
                    <p className="text-white font-bold text-sm mb-1">{t.title}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Time & Salary */}
        <div className="grid md:grid-cols-2 gap-5 mt-12">
          <div className="flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <Clock size={28} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Processing Time</p>
              <p className="text-white font-black text-xl">6 – 10 Weeks</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <Coins size={28} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Salary Range</p>
              <p className="text-blue-400 font-black text-xl">€1,000 – €2,200+/month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Documents</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">What You Need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Valid Passport', 'Updated CV/Resume', 'Educational Certificates', 'Experience Letters', 'Passport Photographs', 'Aadhaar / National ID', 'Police Clearance', 'Medical Certificate'].map((doc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 bg-white/[0.02] border border-white/6 rounded-xl px-4 py-4 hover:border-blue-500/20 transition-all">
                <FileText size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm font-medium">{doc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Transparent Pricing</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Services & Costs</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Official work permits and documentation. Processing times include an extended 1-2 week buffer for reliable preparation.</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-5 text-gray-300 font-bold text-sm">Service</th>
                <th className="p-5 text-gray-300 font-bold text-sm">Prep Time</th>
                <th className="p-5 text-gray-300 font-bold text-sm">Advance</th>
                <th className="p-5 text-gray-300 font-bold text-sm">Postpaid</th>
                <th className="p-5 text-blue-400 font-black text-sm">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                  <td className="p-5 text-sm font-medium text-white">{opt.service}</td>
                  <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.advance}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.post}</td>
                  <td className="p-5 text-sm font-black text-blue-400">{opt.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <p className="text-blue-400 text-xs font-black tracking-[0.3em] uppercase mb-3">FAQs</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Your Questions, Answered</h2>
        </div>
        <div className="space-y-3">{faqs.map((faq, i) => <FAQ key={i} {...faq} />)}</div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 p-10 md:p-14 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          <span className="text-5xl mb-4 block">🌊</span>
          <h2 className="text-3xl font-black text-white mb-4">Live the Adriatic Dream</h2>
          <p className="text-gray-400 text-base mb-8 max-w-xl mx-auto">Our Croatia work visa specialists are ready to start your application. Get your eligibility check today — it's free.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-appointment" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-600/25">
              Book Free Consultation <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all">
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
