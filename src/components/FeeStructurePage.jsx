import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { Wallet, Info, CheckCircle, GraduationCap, MapPin, Building, Globe } from 'lucide-react';

const feeData = [
  { 
    country: 'Italy', flag: '🇮🇹', 
    tuition: '€0 - €3,000', living: '€5,000', 
    popularFor: 'Medicine, Design, Architecture', 
    benefits: ['Full DSU Scholarship (Zero Tuition + Stipend)', 'No IELTS required for many programs', 'Rich cultural heritage & EU mobility'], 
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20'
  },
  { 
    country: 'Germany', flag: '🇩🇪', 
    tuition: '€0 - €1,500', living: '€11,200', 
    popularFor: 'Engineering, Auto, IT', 
    benefits: ['Zero tuition fees in public universities', '18-month post-study work visa', 'Strongest industrial economy in Europe'], 
    color: 'from-amber-500 to-red-600',
    shadow: 'shadow-red-500/20'
  },
  { 
    country: 'United States', flag: '🇺🇸', 
    tuition: '$25,000 - $55,000', living: '$15,000', 
    popularFor: 'CS, Tech, Business', 
    benefits: ['Up to 3-year STEM OPT extension', 'Highest graduate salaries globally', 'Unmatched tech networking (Silicon Valley)'], 
    color: 'from-indigo-500 to-rose-600',
    shadow: 'shadow-indigo-500/20'
  },
  { 
    country: 'United Kingdom', flag: '🇬🇧', 
    tuition: '£15,000 - £30,000', living: '£12,000', 
    popularFor: 'Management, Law, Arts', 
    benefits: ['2-year graduate route work visa', 'Intensive 1-year master’s programs', 'World-class Russell Group universities'], 
    color: 'from-blue-800 to-red-600',
    shadow: 'shadow-red-500/20'
  },
  { 
    country: 'Canada', flag: '🇨🇦', 
    tuition: 'CAD 20,000 - 40,000', living: 'CAD 15,000', 
    popularFor: 'IT, Healthcare, Engineering', 
    benefits: ['Up to 3-year Post-Graduation Work Permit', 'Clear and straightforward pathway to PR', 'Extremely welcoming to immigrants'], 
    color: 'from-red-500 to-red-700',
    shadow: 'shadow-red-500/20'
  },
  { 
    country: 'Australia', flag: '🇦🇺', 
    tuition: 'AUD 30,000 - 45,000', living: 'AUD 21,000', 
    popularFor: 'Accounting, IT, Nursing', 
    benefits: ['Up to 4-year post-study work visa', 'High minimum wage for part-time work', 'Excellent climate and standard of living'], 
    color: 'from-sky-500 to-emerald-500',
    shadow: 'shadow-emerald-500/20'
  },
  { 
    country: 'France', flag: '🇫🇷', 
    tuition: '€2,770 - €3,770', living: '€9,000', 
    popularFor: 'Business, Fashion, Tech', 
    benefits: ['CAF Housing subsidy (up to 40% rent covered)', '2-year post-study work visa', 'Global hub for luxury, business, and art'], 
    color: 'from-blue-600 to-red-500',
    shadow: 'shadow-blue-500/20'
  },
  { 
    country: 'Ireland', flag: '🇮🇪', 
    tuition: '€10,000 - €25,000', living: '€12,000', 
    popularFor: 'Data Science, Pharma', 
    benefits: ['2-year post-study work visa', 'European HQ for Google, Meta, and Apple', '100% English speaking nation'], 
    color: 'from-emerald-400 to-green-700',
    shadow: 'shadow-emerald-500/20'
  },
  { 
    country: 'Georgia', flag: '🇬🇪', 
    tuition: '$4,000 - $8,000', living: '$3,000', 
    popularFor: 'MBBS, Dentistry', 
    benefits: ['WHO & NMC (MCI) Recognized degrees', '100% English medium instruction', 'Very low cost of living and high safety'], 
    color: 'from-rose-400 to-red-600',
    shadow: 'shadow-rose-500/20'
  },
  { 
    country: 'Russia', flag: '🇷🇺', 
    tuition: '$3,000 - $7,000', living: '$2,500', 
    popularFor: 'MBBS, Engineering', 
    benefits: ['Government subsidized tuition fees', 'World-class hospital infrastructure', 'Direct admissions with simple eligibility'], 
    color: 'from-sky-400 to-blue-600',
    shadow: 'shadow-sky-500/20'
  },
];

const FeeStructurePage = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full bg-amber-600/10 blur-[180px]" />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-rose-600/8 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[15%] w-[800px] h-[800px] rounded-full bg-cyan-600/8 blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#030712_100%)]" />
      </div>

      <Header compact={false} />

      <main className="relative z-10 px-4 md:px-8 max-w-[1400px] mx-auto w-full pt-24 pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Wallet size={12} />
            Global Fee Comparison
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
          >
            Invest in Your <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">Future</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive, side-by-side vertical breakdown of tuition fees, living costs, and exclusive benefits across the world's most highly sought-after study destinations.
          </motion.p>
        </div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mb-8 max-w-3xl mx-auto bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex items-start gap-3 shadow-lg"
        >
          <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            <strong className="text-white">Note:</strong> The fees below represent average annual costs. Actual figures may vary. Destinations like <strong className="text-amber-400">Italy and Germany</strong> offer virtually free education through heavy government subsidies and grants.
          </p>
        </motion.div>

        {/* Comprehensive Comparison Table */}
        <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
          <div className="min-w-[1000px] bg-[#030712]/80 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
             
             {/* Header Row */}
             <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 p-6">
                <div className="col-span-3 text-[11px] font-black uppercase tracking-widest text-white/50 pl-4">Country & Flag</div>
                <div className="col-span-2 text-[11px] font-black uppercase tracking-widest text-white/50">Annual Tuition</div>
                <div className="col-span-2 text-[11px] font-black uppercase tracking-widest text-white/50">Living Cost (Est.)</div>
                <div className="col-span-2 text-[11px] font-black uppercase tracking-widest text-white/50">Popular Programs</div>
                <div className="col-span-3 text-[11px] font-black uppercase tracking-widest text-white/50">Key Benefits</div>
             </div>

             {/* Rows */}
             <div className="divide-y divide-white/5">
                {feeData.map((data, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ delay: idx * 0.05, duration: 0.5 }}
                     className="grid grid-cols-12 p-6 hover:bg-white/[0.03] transition-colors items-center group relative overflow-hidden"
                   >
                     {/* Dynamic Indicator Line */}
                     <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${data.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
                     
                     {/* Ambient Glow on Hover */}
                     <div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

                     {/* Country */}
                     <div className="col-span-3 flex items-center gap-5 pl-4">
                        <span className="text-5xl drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{data.flag}</span>
                        <div>
                           <h2 className="text-2xl font-black text-white tracking-tight">{data.country}</h2>
                           <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Study Destination</div>
                        </div>
                     </div>

                     {/* Tuition */}
                     <div className="col-span-2 pr-4">
                        <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 group-hover:border-amber-500/30 transition-colors relative overflow-hidden">
                          <GraduationCap size={40} className="absolute -right-2 -bottom-2 text-white/5" />
                          <p className="text-[9px] font-black text-amber-400/80 uppercase tracking-widest mb-1.5">Tuition</p>
                          <span className="text-base font-black text-white tracking-tight">{data.tuition}</span>
                        </div>
                     </div>

                     {/* Living */}
                     <div className="col-span-2 pr-4">
                        <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 group-hover:border-cyan-500/30 transition-colors relative overflow-hidden">
                          <MapPin size={40} className="absolute -right-2 -bottom-2 text-white/5" />
                          <p className="text-[9px] font-black text-cyan-400/80 uppercase tracking-widest mb-1.5">Living</p>
                          <span className="text-base font-black text-white tracking-tight">{data.living}</span>
                        </div>
                     </div>

                     {/* Popular Programs */}
                     <div className="col-span-2 pr-4">
                        <div className="flex items-start gap-2 text-white/80 text-sm font-medium">
                           <Building size={16} className="text-rose-400 shrink-0 mt-0.5" />
                           <span className="leading-snug">{data.popularFor}</span>
                        </div>
                     </div>

                     {/* Key Benefits */}
                     <div className="col-span-3">
                        <ul className="space-y-3">
                          {data.benefits.map((b, i) => (
                             <li key={i} className="flex items-start gap-2.5">
                                <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm text-white/70 font-medium leading-tight group-hover:text-white/90 transition-colors">{b}</span>
                             </li>
                          ))}
                        </ul>
                     </div>
                   </motion.div>
                ))}
             </div>
          </div>
        </div>

      </main>

      <MinimalFooter />
    </div>
  );
};

export default FeeStructurePage;
