import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const studyCountries = [
  {
    name: 'Italy',
    note: 'Public universities',
    code: 'ITA',
    path: '/study-in-italy',
    color: '#0f766e',
    accent: '#f4b66d',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
    city: 'Rome, Milan, Bologna',
    metric: 'Scholarship friendly',
  },
  {
    name: 'Australia',
    note: 'Career-ready degrees',
    code: 'AUS',
    path: '/study-in-australia',
    color: '#2563eb',
    accent: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
    city: 'Sydney, Melbourne',
    metric: 'Post-study routes',
  },
  {
    name: 'Canada',
    note: 'Study and settle',
    code: 'CAN',
    path: '/study-in-canada',
    color: '#dc2626',
    accent: '#22c55e',
    image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=900&q=80',
    city: 'Toronto, Vancouver',
    metric: 'PR pathways',
  },
  {
    name: 'France',
    note: 'Culture and research',
    code: 'FRA',
    path: '/study-in-france',
    color: '#315c91',
    accent: '#f97316',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    city: 'Paris, Lyon',
    metric: 'Research led',
  },
  {
    name: 'Germany',
    note: 'Low-cost excellence',
    code: 'DEU',
    path: '/study-in-germany',
    color: '#b7791f',
    accent: '#0f766e',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80',
    city: 'Berlin, Munich',
    metric: 'Low tuition',
  },
  {
    name: 'Ireland',
    note: 'Tech-led pathways',
    code: 'IRL',
    path: '/study-in-ireland',
    color: '#0c8f67',
    accent: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=900&q=80',
    city: 'Dublin, Cork',
    metric: 'Tech careers',
  },
  {
    name: 'UK',
    note: 'Global credentials',
    code: 'GBR',
    path: '/study-in-uk',
    color: '#0A2540',
    accent: '#dc2626',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    city: 'London, Manchester',
    metric: 'Top ranked',
  },
  {
    name: 'US',
    note: 'Flexible programs',
    code: 'USA',
    path: '/study-in-usa',
    color: '#7c3aed',
    accent: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    city: 'Boston, California',
    metric: 'Flexible majors',
  },
];

const workCountries = [
  {
    name: 'Bulgaria',
    note: 'European access',
    code: 'BGR',
    color: '#0f766e',
    accent: '#f59e0b',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sofia%2C_Bulgaria_2.jpg/1280px-Sofia%2C_Bulgaria_2.jpg',
    city: 'Sofia, Plovdiv',
    metric: 'EU access',
  },
  {
    name: 'Croatia',
    note: 'Hospitality careers',
    code: 'HRV',
    color: '#315c91',
    accent: '#22c55e',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Dubrovnik%2C_Croatia_%28Unsplash%29.jpg/1280px-Dubrovnik%2C_Croatia_%28Unsplash%29.jpg',
    city: 'Zagreb, Split',
    metric: 'Hospitality demand',
  },
  {
    name: 'Germany',
    note: 'Skilled worker routes',
    code: 'DEU',
    color: '#b7791f',
    accent: '#0f766e',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80',
    city: 'Berlin, Hamburg',
    metric: 'Skilled worker',
  },
  {
    name: 'Serbia',
    note: 'Fast placement support',
    code: 'SRB',
    color: '#0A2540',
    accent: '#dc2626',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Belgrade%2C_Serbia_%287182652103%29.jpg/1280px-Belgrade%2C_Serbia_%287182652103%29.jpg',
    city: 'Belgrade, Novi Sad',
    metric: 'Fast support',
  },
  {
    name: 'Czech Republic',
    note: 'Industrial openings',
    code: 'CZE',
    color: '#dc2626',
    accent: '#2563eb',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=900&q=80',
    city: 'Prague, Brno',
    metric: 'Industrial roles',
  },
];

const DestinationCard = ({ country, index }) => {
  const navigate = useNavigate();
  return (
  <motion.article
    onClick={() => {
      if (country.path) {
        navigate(country.path);
      }
    }}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: index * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
    className="destination-card group relative flex h-full min-h-0 cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-white/20 bg-black/60 shadow-lg transition-all duration-300 hover:border-white/40 hover:shadow-[0_24px_52px_rgba(0,0,0,0.5)] transform-gpu"
    style={{
      '--destination-primary': country.color,
      '--destination-accent': country.accent,
      '--destination-image': `url(${country.image})`,
    }}
  >
    <div className="absolute inset-0 destination-card-photo transition duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 destination-card-gradient opacity-80" />

    <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 sm:left-3 sm:top-3">
      <span className="rounded-md border border-white/30 bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#0A2540] shadow-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
        {country.code}
      </span>
      <span className="hidden rounded-full border border-white/25 bg-black/40 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white lg:inline-flex">
        {country.metric}
      </span>
    </div>

    <div className="destination-card-copy relative z-10 p-3 sm:p-4 lg:p-5 mt-auto bg-black/40  border-t border-white/10">
      <div className="flex min-w-0 items-end justify-between gap-2">
        <div className="min-w-0">
          <h3 className="destination-card-title truncate text-base font-black tracking-normal sm:text-lg lg:text-2xl">{country.name}</h3>
          <p className="destination-card-subtitle mt-0.5 line-clamp-1 text-[11px] font-semibold text-white/90 sm:text-xs lg:text-sm">{country.note}</p>
          <p className="destination-card-meta mt-1 hidden truncate text-[10px] font-black uppercase tracking-[0.12em] text-white/75 sm:block">
            {country.city}
          </p>
        </div>
        <span className="grid h-7 w-7 flex-none place-items-center rounded-lg border border-white/20 bg-white/15 transition-transform duration-300 group-hover:translate-x-1 sm:h-8 sm:w-8">
          <ArrowRight size={15} />
        </span>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 h-1 w-10 transition-all duration-500 group-hover:w-full destination-card-line" />
  </motion.article>
  );
};

export const TopCountries = () => {
  const [activeTab, setActiveTab] = useState('study');
  const countries = activeTab === 'study' ? studyCountries : workCountries;
  const gridClass =
    activeTab === 'study'
      ? 'grid-cols-2 grid-rows-4 sm:grid-cols-4 sm:grid-rows-2'
      : 'grid-cols-1 grid-rows-5 sm:grid-cols-5 sm:grid-rows-1';

  return (
    <section
      id="countries"
      className="section-safe top-destinations-shell relative h-[100svh] overflow-hidden bg-transparent text-white"
    >
      <div className="absolute inset-0 pointer-events-none top-destinations-gradient" />
      <div
        className="absolute pointer-events-none w-[1200px] h-[1200px] left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(15,118,110,0.15) 0%, rgba(37,99,235,0.08) 25%, rgba(245,158,11,0.04) 45%, transparent 65%)'
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-screen-2xl flex-col px-3 pb-3 pt-[calc(var(--section-header-offset)+8px)] sm:px-5 sm:pb-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-none flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]  sm:text-[10px]">
              <Sparkles size={13} />
              Global destinations
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl lg:text-5xl">
              Top{' '}
              <span className="destination-title-gradient">
                Destinations
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-xs font-medium leading-relaxed text-white/60 sm:text-sm lg:text-base">
              Clean pathways for study and work visas, organized by country and handled with expert guidance.
            </p>
          </div>

          <div className="relative grid w-full max-w-md grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.2)]  lg:mb-1">
            <motion.div
              className="absolute bottom-1 top-1 rounded-lg bg-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.2)] border border-white/10"
              animate={{ left: activeTab === 'study' ? 4 : '50%', right: activeTab === 'study' ? '50%' : 4 }}
              transition={{ type: 'spring', stiffness: 330, damping: 32 }}
            />
            <button
              onClick={() => setActiveTab('study')}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition-colors sm:text-sm ${activeTab === 'study' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              <MapPin size={16} /> Study Visa
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition-colors sm:text-sm ${activeTab === 'work' ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Briefcase size={16} /> Work Visa
            </button>
          </div>
        </motion.div>

        <div className="min-h-0 flex-1 pt-4 sm:pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className={`grid h-full min-h-0 gap-2 sm:gap-3 lg:gap-4 ${gridClass}`}
            >
              {countries.map((country, index) => (
                <DestinationCard
                  key={country.name}
                  country={country}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
