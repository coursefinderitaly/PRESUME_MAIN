import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronDown, Clock, Coins, FileText, Phone, Zap, Factory, Construction } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';

const sectors = [
  { icon: Factory, title: 'Manufacturing', desc: 'Textiles, electronics, and automotive parts manufacturing.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { icon: Construction, title: 'Construction', desc: 'High demand for skilled and semi-skilled construction workers.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Zap, title: 'IT & Engineering', desc: 'Growing tech sector in Sofia needing international talent.', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
];

const faqs = [
  { q: 'What is the processing time for Bulgaria?', a: 'Bulgaria offers one of the fastest work permit processes in Europe, typically taking 4–8 weeks.' },
  { q: 'Is Bulgaria in the Schengen Area?', a: 'Yes, Bulgaria joined the Schengen Area (air and sea borders) in March 2024, improving mobility within Europe.' },
  { q: 'Do I need IELTS for Bulgaria?', a: 'No, IELTS is generally not required for most semi-skilled and skilled work permits in Bulgaria.' },
  { q: 'Can I bring my family?', a: 'Yes, family reunification is possible after you receive your residence permit and secure stable accommodation.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${open ? 'border-green-500/40 bg-green-500/5' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-white font-bold text-sm md:text-base">{q}</span>
        <ChevronDown size={18} className={`text-green-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
  { service: 'Seasonal work permit for 6 months', prep: '4 - 6 weeks', advance: '€200', post: '€180', total: '€380' },
  { service: 'Work permit for 1 year with employment', prep: '5 - 8 weeks', advance: '€300', post: '€200', total: '€500' },
];

export default function BulgariaWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Animated Background Blur Loop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-green-600/20 blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-teal-500/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[160px]" 
        />
      </div>

      <section className="relative pt-36 pb-28 px-4 overflow-hidden z-10">

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link to="/services/work-visa" className="text-gray-500 text-sm font-medium hover:text-green-400 transition-colors">Work Visa</Link>
            <span className="text-gray-700">/</span>
            <span className="text-green-400 text-sm font-bold tracking-wide">Bulgaria</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center justify-center gap-4 mb-6">
              <span className="text-7xl md:text-8xl drop-shadow-2xl">🇧🇬</span>
            </div>
            
            <p className="text-green-400 text-xs font-black tracking-[0.3em] uppercase mb-4">Work Permit Program</p>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Fast-Track to <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Bulgaria</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              With a low cost of living, rapid processing times, and an expanding industrial sector, Bulgaria is an excellent entry point into the European workforce.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/book-appointment" className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black text-sm tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)]">
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Average Salary', value: '€800–€1,500+', color: 'text-green-400' },
              { label: 'Processing Time', value: '4–8 Weeks', color: 'text-cyan-400' },
              { label: 'Schengen Status', value: 'Joined 2024', color: 'text-amber-400' },
              { label: 'Contract Length', value: '1–3 Years', color: 'text-white' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl py-8 px-6 hover:border-green-500/30 hover:bg-white/[0.04] transition-all backdrop-blur-sm">
                <p className={`font-black text-xl md:text-2xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Sectors</p>
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

      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-green-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Requirements</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Eligibility & Documents</h2>
            <div className="space-y-3 mb-8">
              {['Age 18–50 years', 'Valid Passport (1+ year validity)', 'Basic education & experience', 'Good medical health', 'Clear police background'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/6 rounded-xl px-5 py-4">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Passport', 'Updated CV', 'Photos', 'PCC', 'Medical Report', 'Experience Letters'].map((doc, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.02] border border-white/6 rounded-lg px-3 py-2">
                  <FileText size={14} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-400 text-xs">{doc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-green-600/10 to-transparent border border-green-600/20 rounded-3xl p-8">
              <h3 className="text-2xl font-black text-white mb-6">Why Bulgaria?</h3>
              <div className="space-y-6">
                {[
                  { title: 'Rapid Processing', desc: 'Get your work permit faster than most EU nations.' },
                  { title: 'Low Cost of Living', desc: 'Very affordable housing and daily expenses.' },
                  { title: 'Schengen Member', desc: 'Enjoy improved travel freedom within Europe.' },
                  { title: 'Path to Residency', desc: 'Secure long-term European residency options.' }
                ].map((perk, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-1">{perk.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-green-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Transparent Pricing</p>
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
                <th className="p-5 text-green-400 font-black text-sm">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                  <td className="p-5 text-sm font-medium text-white">{opt.service}</td>
                  <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.advance}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.post}</td>
                  <td className="p-5 text-sm font-black text-green-400">{opt.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">{faqs.map((faq, i) => <FAQ key={i} {...faq} />)}</div>
      </section>

      <MinimalFooter />
    </div>
  );
}
