import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, CheckCircle, Car, Tractor, Building2 } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';

const sectors = [
  { icon: Car, title: 'Transport & Logistics', desc: 'Serbia is a major transit hub. Huge demand for drivers and logistics personnel.', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { icon: Building2, title: 'Construction', desc: 'Infrastructure and real estate growth drive the need for construction workers.', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { icon: Tractor, title: 'Agriculture & Farming', desc: 'Seasonal and long-term agricultural work across the Serbian countryside.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const faqs = [
  { q: 'Is Serbia in the EU?', a: 'No, Serbia is not currently an EU member state, but it is an EU candidate country with a rapidly growing economy.' },
  { q: 'How easy is the visa process?', a: 'Serbia has one of the most straightforward and fastest work visa processes in Europe for Indian nationals.' },
  { q: 'Do I need to speak Serbian?', a: 'No, English is widely spoken in the business sector. For manual and semi-skilled labor, basic English is sufficient.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${open ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`} onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-white font-bold text-sm md:text-base">{q}</span>
        <ChevronDown size={18} className={`text-indigo-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
  { service: 'Documents for a 6-month Type D visa to apply for a 1-year TRC', prep: '5 - 6 weeks', advance: '€350', post: '€150', total: '€500' },
  { service: 'Registration on Welcome to Serbia (application form)', prep: '1 - 2 weeks', advance: '€0', post: '€50', total: '€50' },
];

export default function SerbiaWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Animated Background Blur Loop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-rose-600/20 blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[140px]" 
        />
      </div>

      <section className="relative pt-36 pb-28 px-4 overflow-hidden z-10">

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Link to="/services/work-visa" className="text-gray-500 text-sm font-medium hover:text-indigo-400 transition-colors">Work Visa</Link>
            <span className="text-gray-700">/</span>
            <span className="text-indigo-400 text-sm font-bold tracking-wide">Serbia</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center justify-center gap-4 mb-6">
              <span className="text-7xl md:text-8xl drop-shadow-2xl">🇷🇸</span>
            </div>
            
            <p className="text-indigo-400 text-xs font-black tracking-[0.3em] uppercase mb-4">Work Permit Program</p>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Work in <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">Serbia</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              An emerging European hub offering straightforward work permit procedures, affordable living, and growing opportunities in construction, agriculture, and logistics.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Link to="/book-appointment" className="inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Salary', value: '€600–€1,200+', color: 'text-indigo-400' },
              { label: 'Processing', value: '3–6 Weeks', color: 'text-rose-400' },
              { label: 'Visa Success', value: 'Very High', color: 'text-green-400' },
              { label: 'Language', value: 'English accepted', color: 'text-cyan-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl py-8 px-6 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all backdrop-blur-sm">
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
            <h2 className="text-3xl md:text-4xl font-black text-white">Top Job Sectors</h2>
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

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Transparent Pricing</p>
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
                <th className="p-5 text-indigo-400 font-black text-sm">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                  <td className="p-5 text-sm font-medium text-white">{opt.service}</td>
                  <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.advance}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.post}</td>
                  <td className="p-5 text-sm font-black text-indigo-400">{opt.total}</td>
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
