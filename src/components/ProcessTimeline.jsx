import { motion } from 'framer-motion';
import {
  MessageCircle, FileText, GraduationCap, Stamp,
  Briefcase, Users, Building2, Plane, Sparkles,
  BookOpen, Briefcase as BriefcaseIcon,
} from 'lucide-react';

const stages = [
  {
    id: 1,
    label: 'Discover',
    study: { title: 'Expert Counselling', desc: 'Evaluate your academic profile and recommend best-fit courses globally.', icon: MessageCircle, color: '#06b6d4' },
    work: { title: 'Skills Evaluation', desc: 'Assess your professional background and match skills with European work routes.', icon: Users, color: '#818cf8' },
  },
  {
    id: 2,
    label: 'Apply',
    study: { title: 'Admission Process', desc: 'Handle document preparation, SOP reviews, and secure offers.', icon: FileText, color: '#38bdf8' },
    work: { title: 'Employer Matching', desc: 'Build a Europass resume, connect with verified employers, and secure a job offer.', icon: Briefcase, color: '#f59e0b' },
  },
  {
    id: 3,
    label: 'Secure',
    study: { title: 'Scholarships & Funds', desc: 'Guide you through securing tuition waivers, grants, and financial proofs.', icon: GraduationCap, color: '#34d399' },
    work: { title: 'Contract & Docs', desc: 'Coordinate employment contracts, work permits, and ensure legal compliance.', icon: Building2, color: '#f97316' },
  },
  {
    id: 4,
    label: 'Travel',
    study: { title: 'Visa & Departure', desc: 'Comprehensive support for visa filing, interview coaching, and departure.', icon: Stamp, color: '#a78bfa' },
    work: { title: 'Visa & Onboarding', desc: 'File your work visa, organize itineraries, and complete pre-arrival onboarding.', icon: Plane, color: '#2dd4bf' },
  },
];

const PathCard = ({ item, type }) => {
  const Icon = item.icon;
  const isStudy = type === 'study';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="relative flex flex-col p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] group w-full transition-all duration-300 transform-gpu"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500"
          style={{ boxShadow: `0 4px 20px ${item.color}15` }}
        >
          <Icon size={18} style={{ color: item.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5"
              style={{ color: item.color }}
            >
              {isStudy ? 'Study Path' : 'Work Path'}
            </span>
          </div>
          <h3 className="text-sm lg:text-base font-bold text-white leading-tight">{item.title}</h3>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-white/50 font-medium">{item.desc}</p>

      {/* Decorative accent */}
      <div
        className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: item.color }}
      />
    </motion.div>
  );
};

export const ProcessTimeline = () => {
  return (
    <section className="pt-16 pb-12 relative overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 process-section-bg" />

      {/* Animated aurora orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full process-orb-1" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full process-orb-2" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[700px] h-[300px] rounded-full process-orb-3" />
        {/* Subtle noise mesh */}
        <div className="absolute inset-0 process-section-mesh" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/80 mb-3"
          >
            The Journey
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Streamlined <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Process</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-8" />

          {/* Path Labels for Desktop */}
          <div className="hidden md:flex justify-between items-center max-w-[90%] mx-auto px-4 mt-8">
            <div className="text-center w-[calc(50%-2rem)]">
              <span className="inline-block px-5 py-2 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.15)] ">
                Study Path
              </span>
            </div>
            <div className="text-center w-[calc(50%-2rem)]">
              <span className="inline-block px-5 py-2 rounded-full bg-[#818cf8]/10 border border-[#818cf8]/30 text-[#818cf8] text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(129,140,248,0.15)] ">
                Work Path
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block -translate-x-1/2" />

          <div className="space-y-12">
            {stages.map((stage) => (
              <div key={stage.id} className="relative flex flex-col md:flex-row items-center gap-6 md:gap-0">

                {/* Left Card */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <PathCard item={stage.study} type="study" />
                </div>

                {/* Center Node */}
                <div className="hidden md:flex flex-col items-center justify-center w-16 shrink-0 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-[#0a0d18] border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 shadow-xl"
                  >
                    0{stage.id}
                  </motion.div>
                </div>

                {/* Right Card */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <PathCard item={stage.work} type="work" />
                </div>

                {/* Mobile Separator */}
                <div className="md:hidden flex items-center gap-2 w-full px-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] font-bold text-white/20">Step {stage.id}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
