import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Clock, Euro, ChevronDown,
  Building2, FileText, Users, ShieldCheck, Phone
} from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import InteractiveBackground from './InteractiveBackground';

const benefits = [
  {
    icon: Euro,
    title: 'Attractive Salary',
    desc: 'Earn competitive salaries between €1,500–€3,500+ per month with overtime opportunities.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    icon: Building2,
    title: 'Accommodation Support',
    desc: 'Many German employers provide on-site accommodation or housing assistance packages.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Social Security',
    desc: 'Full access to German health insurance, pension, and employee benefit programs.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: Users,
    title: 'Family Reunification',
    desc: 'Eligible workers may apply to bring their families under German immigration law.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
];

const eligibility = [
  'Minimum age: 18 years',
  'Valid Passport',
  'Basic Educational Qualification',
  'Relevant Work Experience (preferred)',
  'Physically & Mentally Fit',
  'No Criminal Background',
  'Basic English Communication Skills',
];

const documents = [
  'Passport Copy',
  'Updated Resume/CV',
  'Passport Size Photographs',
  'Educational Certificates',
  'Experience Certificates',
  'Aadhaar Card / PAN Card',
  'Police Clearance Certificate (if required)',
  'Medical Fitness Report',
];

const steps = [
  { num: '01', title: 'Profile Evaluation', desc: 'Our team checks your eligibility and suitable job category.' },
  { num: '02', title: 'Documentation', desc: 'Complete document collection and verification process.' },
  { num: '03', title: 'Employer Matching', desc: 'Suitable job opportunities are arranged with verified German employers.' },
  { num: '04', title: 'Work Permit Application', desc: 'Official work permit and visa processing begins with German authorities.' },
  { num: '05', title: 'Visa & Departure', desc: 'Travel preparation, pre-departure briefing, and final guidance.' },
];

const faqs = [
  { q: 'Can I apply without IELTS?', a: 'Yes. For many work permit categories IELTS is not mandatory. Basic English communication is sufficient.' },
  { q: 'Is German language required?', a: 'Basic German knowledge improves your selection chances, but many employers accept English-speaking candidates for several job roles.' },
  { q: 'Can I settle permanently in Germany?', a: 'Yes. Eligible candidates may apply for long-term residence after meeting the required residency criteria under German immigration law.' },
  { q: 'Is accommodation provided?', a: 'Many employers provide on-site accommodation or financial support for housing. This varies by employer and job role.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${open ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-white/8 bg-white/[0.02] hover:border-white/20'}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-white font-bold text-sm md:text-base">{q}</span>
        <ChevronDown size={18} className={`text-yellow-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const pricingOptions = [
  { service: 'Skilled Worker Visa (Blue Card)', prep: '4 - 8 weeks', advance: '€400', post: '€400', total: '€800' },
  { service: 'Vocational Training (Ausbildung)', prep: '6 - 10 weeks', advance: '€300', post: '€300', total: '€600' },
];

export default function GermanyWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Interactive Animated Background */}
      <InteractiveBackground 
        color1="bg-amber-500/20" 
        color2="bg-yellow-500/20" 
        color3="bg-orange-500/20" 
      />

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden z-10">

        <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 bg-white/[0.03] backdrop-blur-md px-6 py-2 rounded-full border border-white/10 w-fit">
              <Link to="/services/work-visa" className="text-gray-400 text-xs font-medium hover:text-yellow-400 transition-colors uppercase tracking-wider">Work Visa</Link>
              <span className="text-gray-600">•</span>
              <span className="text-yellow-400 text-xs font-black tracking-widest uppercase">Germany</span>
            </div>

            <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-4">
              <span className="text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl">🇩🇪</span>
            </div>
            
            <p className="text-yellow-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-3">Work Permit Program</p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
              Work in <br className="hidden md:block" /><span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">Germany</span>
            </h1>
            
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
              Europe's strongest economy offers excellent career opportunities for skilled international workers — with high salaries, modern work environments, and long-term settlement pathways.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/book-appointment" className="group relative inline-flex items-center justify-center gap-3 bg-yellow-500 text-[#080b14] font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:scale-105 shadow-[0_0_40px_-10px_rgba(234,179,8,0.6)]">
                Start Your Journey 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto flex-1 max-w-2xl">
            {[
              { label: 'Avg. Salary', value: '€2,500+', color: 'text-yellow-400' },
              { label: 'Processing', value: '8–16 Weeks', color: 'text-cyan-400' },
              { label: 'Job Category', value: 'Logistics', color: 'text-purple-400' },
              { label: 'Settle', value: 'Yes', color: 'text-green-400' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-yellow-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xl shadow-2xl flex flex-col justify-center ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}>
                <p className={`font-black text-2xl lg:text-3xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Why Germany?</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">Built for Career<br />Growth & Stability</h2>
              <p className="text-gray-400 leading-relaxed mb-8">Germany combines economic strength with worker-friendly policies, making it one of the best destinations for international workers seeking long-term security.</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'High Salary Packages', 'Legal Work Permit Process', 'Long-Term Residence Opportunity',
                  'Safe & Developed European Country', 'Better Quality of Life', 'International Work Experience',
                  'Family Settlement Opportunities', 'Strong Demand for Skilled Workers'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 text-gray-300 text-sm font-medium"
                  >
                    <CheckCircle size={16} className="text-yellow-400 flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg. Salary', value: '€2,500+', sub: 'per month', color: 'text-yellow-400' },
                { label: 'Processing', value: '8–16', sub: 'weeks', color: 'text-cyan-400' },
                { label: 'Job Category', value: 'Warehouse', sub: '& Logistics', color: 'text-purple-400' },
                { label: 'Settle', value: 'Yes', sub: 'long-term residence', color: 'text-green-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-yellow-500/20 transition-all"
                >
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-20 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">What You Get</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Germany Work Permit Benefits</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`rounded-2xl border p-6 ${b.bg} hover:scale-[1.03] transition-all duration-300`}
              >
                <b.icon size={28} className={`${b.color} mb-4`} />
                <h3 className="text-white font-black text-base mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & Documents */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Eligibility */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Who Can Apply</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Eligibility Criteria</h2>
            <div className="space-y-3">
              {eligibility.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/6 rounded-xl px-5 py-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">What to Prepare</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Required Documents</h2>
            <div className="space-y-3">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/6 rounded-xl px-5 py-4">
                  <FileText size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-20 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Germany Work Permit Process</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/40 via-yellow-500/20 to-transparent" />
            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`hidden md:flex w-1/2 ${i % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                    <div className={`bg-white/[0.03] border border-white/8 rounded-2xl p-6 max-w-sm ${i % 2 === 0 ? 'text-right' : 'text-left'} hover:border-yellow-500/30 transition-all`}>
                      <h3 className="text-white font-black text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {/* Step number bubble */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center font-black text-[#080b14] text-sm shadow-lg shadow-yellow-500/30">
                    {step.num}
                  </div>
                  {/* Mobile card */}
                  <div className="md:hidden pl-16 w-full">
                    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                      <h3 className="text-white font-black text-base mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Processing Time */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-14 grid md:grid-cols-2 gap-5">
            <div className="flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <Clock size={28} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Avg. Processing Time</p>
                <p className="text-white font-black text-xl">8 – 16 Weeks</p>
                <p className="text-gray-500 text-xs mt-1">May vary depending on profile and employer</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <Euro size={28} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Salary Range</p>
                <p className="text-yellow-400 font-black text-xl">€1,500 – €3,500+</p>
                <p className="text-gray-500 text-xs mt-1">Per month, based on role & experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Transparent Pricing</p>
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
                <th className="p-5 text-yellow-400 font-black text-sm">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                  <td className="p-5 text-sm font-medium text-white">{opt.service}</td>
                  <td className="p-5 text-sm text-gray-400 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.advance}</td>
                  <td className="p-5 text-sm text-gray-400">{opt.post}</td>
                  <td className="p-5 text-sm font-black text-yellow-400">{opt.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-3">Got Questions?</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => <FAQ key={i} {...faq} />)}
        </div>
      </section>

      {/* Why Us + Contact CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-8">
            <p className="text-yellow-400 text-xs font-black tracking-[0.3em] uppercase mb-4">Why Apply With Us</p>
            <div className="space-y-3">
              {['Professional Guidance', 'Transparent Process', 'Complete Documentation Support', 'Interview Preparation', 'Visa Assistance', 'Trusted Overseas Consultation'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                  <CheckCircle size={16} className="text-yellow-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <Phone size={28} className="text-yellow-400 mb-4" />
              <h3 className="text-white font-black text-2xl mb-3">Start Your Germany Journey Today</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Contact us for eligibility check, job availability, documentation guidance, and complete processing support.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/book-appointment"
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#080b14] font-black text-sm tracking-wider px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Book Consultation <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/"
                className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-black text-sm tracking-wider px-6 py-4 rounded-xl transition-all duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
