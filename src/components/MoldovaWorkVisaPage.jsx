import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, FileText, ClipboardList, Info, MousePointerClick } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import InteractiveBackground from './InteractiveBackground';

const requirements = [
  "Citizens of all countries",
  "Communicative English is required"
];

const requestedDocuments = [
  "Scanned copy of passport",
  "Photo (35mm × 45mm | face 80%)",
  "Photo of the main visa",
  "Valid travel ticket"
];

const questionnaire = [
  "Last Name & First Name",
  "Citizenship",
  "Candidate's phone number (with Country Code)",
  "Candidate's Email",
  "Country and City for Visa Registration",
  "Embassy Email"
];

const processSteps = [
  "Gather required documents and personal information.",
  "Book an appointment through Moldova's electronic eVisa system.",
  "Select visa type B — transit on the portal.",
  "Wait for processing (usually 15 to 20 working days)."
];

const pricingOptions = [
  { service: 'Transit visa type B for 5 days', prep: '7 - 10 days', total: '₹80,000' },
  { service: 'Transit visa type B for 5 days', prep: '20 - 25 days', total: '₹60,000' }
];

export default function MoldovaWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Interactive Animated Background */}
      <InteractiveBackground 
        color1="bg-blue-600/20" 
        color2="bg-indigo-600/20" 
        color3="bg-yellow-500/10" 
      />

      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden z-10">
        <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 lg:pl-12 xl:pl-24">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 bg-white/[0.03] backdrop-blur-md px-6 py-2 rounded-full border border-white/10 w-fit">
              <Link to="/services/work-visa" className="text-gray-400 text-xs font-medium hover:text-blue-400 transition-colors uppercase tracking-wider">Visas</Link>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400 text-xs font-black tracking-widest uppercase">Moldova</span>
            </div>

            <p className="text-blue-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-3">Transit Program</p>

            <h1 className="flex items-center justify-center lg:justify-start gap-4 flex-wrap text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 tracking-tighter">
              <span>Transit</span> <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Moldova</span> <span className="drop-shadow-2xl">🇲🇩</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
              Fast and reliable transit processing. Secure a Type B transit visa for your journey with streamlined electronic applications.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/book-appointment" className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)]">
                Start Your Journey
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto flex-1 max-w-2xl">
            {[
              { label: 'Processing', value: '7–25 Days', color: 'text-blue-400' },
              { label: 'Visa Type', value: 'Type B (5 Days)', color: 'text-indigo-400' },
              { label: 'Application', value: 'eVisa System', color: 'text-cyan-400' },
              { label: 'Success Rate', value: 'Very High', color: 'text-green-400' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xl shadow-2xl flex flex-col justify-center ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}>
                <p className={`font-black text-2xl lg:text-3xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Transparent Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Services & Costs</h2>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl mb-8">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Service</th>
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Preparation Time</th>
                <th className="p-6 text-blue-400 font-black text-lg md:text-xl uppercase tracking-wider">Total Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                  <td className="p-6 text-base md:text-lg font-bold text-white leading-snug">{opt.service}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-6 text-xl md:text-2xl font-black text-blue-400 drop-shadow-sm">{opt.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
           <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 flex items-start gap-4">
              <Info className="text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-gray-200 font-medium">The transit visa is paid separately after obtaining the main visa.</p>
           </div>
           <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 flex items-start gap-4">
              <Info className="text-indigo-400 flex-shrink-0 mt-1" />
              <p className="text-gray-200 font-medium">Total cost includes the embassy visa fee of <strong className="text-white">40 EUR</strong>.</p>
           </div>
        </div>
      </section>

      {/* Requirements & Info */}
      <section className="relative z-10 bg-white/[0.01] border-t border-white/5 py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* Documents */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 h-full shadow-xl flex flex-col gap-8">
              <div>
                <CheckCircle size={40} className="text-blue-400 mb-6 drop-shadow-md" />
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Eligibility</h3>
                <ul className="space-y-5 mb-10">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                      <span className="text-blue-400 mt-1 font-black">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-8 mt-auto">
                <FileText size={32} className="text-blue-400 mb-4 drop-shadow-md" />
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight">Requested Documents</h3>
                <ul className="space-y-4">
                  {requestedDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 font-medium text-sm md:text-base">
                      <span className="text-blue-400 mt-1 font-black">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Questionnaire */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 h-full shadow-xl flex flex-col">
              <ClipboardList size={40} className="text-blue-400 mb-8 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">Personal Info</h3>
              <ul className="space-y-5 flex-grow">
                {questionnaire.map((q, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                    <span className="text-blue-400 mt-1 font-black">•</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden flex flex-col shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <MapPin size={40} className="text-blue-400 mb-8 relative z-10 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 relative z-10 tracking-tight">eVisa Application</h3>
              <div className="space-y-6 relative z-10 flex-grow">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs md:text-sm font-black text-blue-300 shadow-lg">{i + 1}</div>
                      {i < processSteps.length - 1 && <div className="w-0.5 h-full bg-blue-500/30 my-2" />}
                    </div>
                    <p className="text-gray-100 font-bold text-base md:text-lg pb-4 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <a href="https://evisa.gov.md/" target="_blank" rel="noreferrer" className="mt-8 group relative z-10 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 transition-colors rounded-xl p-4 cursor-pointer">
                <MousePointerClick className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold tracking-wide">Visit evisa.gov.md</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
