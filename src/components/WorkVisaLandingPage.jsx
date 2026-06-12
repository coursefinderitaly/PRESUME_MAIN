import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Shield, TrendingUp, Globe } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';

const countries = [
  {
    id: 'czech-republic',
    name: 'Czech Republic',
    flagUrl: 'https://flagcdn.com/w80/cz.png',
    tagline: 'Strong industrial & tech base',
    highlight: '€1,000 – €2,000+/month',
    color: 'from-red-600/20 to-blue-800/10',
    accent: '#ef4444',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/10',
    jobs: ['Automotive', 'Manufacturing', 'Logistics'],
    badge: 'High Demand',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    path: '/services/work-visa/czech-republic',
  },

  {
    id: 'poland',
    name: 'Poland',
    flagUrl: 'https://flagcdn.com/w80/pl.png',
    tagline: 'Gateway to Central Europe',
    highlight: '€800 – €1,600+/month',
    color: 'from-red-600/20 to-rose-800/10',
    accent: '#dc2626',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/10',
    jobs: ['Logistics', 'Manufacturing', 'Construction'],
    badge: 'Popular Choice',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    path: '/services/work-visa/poland',
  },
  {
    id: 'portugal',
    name: 'Portugal',
    flagUrl: 'https://flagcdn.com/w80/pt.png',
    tagline: 'Western European opportunities',
    highlight: '€900 – €1,800+/month',
    color: 'from-emerald-600/20 to-teal-800/10',
    accent: '#10b981',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
    jobs: ['Agriculture', 'Tourism', 'Tech Support'],
    badge: 'Scenic Living',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    path: '/services/work-visa/portugal',
  },
  {
    id: 'moldova',
    name: 'Moldova (Transit visa)',
    flagUrl: 'https://flagcdn.com/w80/md.png',
    tagline: 'Schengen transit solutions',
    highlight: 'Fast transit processing',
    color: 'from-blue-600/20 to-indigo-800/10',
    accent: '#3b82f6',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/10',
    jobs: ['Transit Permit', 'Documentation Support'],
    badge: 'Easy Process',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    path: '/services/work-visa/moldova',
  },
  {
    id: 'serbia',
    name: 'Serbia',
    flagUrl: 'https://flagcdn.com/w80/rs.png',
    tagline: 'Emerging tech & business hub',
    highlight: '€600 – €1,200+/month',
    color: 'from-indigo-600/20 to-purple-800/10',
    accent: '#818cf8',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/10',
    jobs: ['Transport', 'Construction', 'Agriculture'],
    badge: 'Emerging Hub',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    path: '/services/work-visa/serbia',
  },
];

const stats = [
  { icon: Briefcase, value: '6+', label: 'Countries', color: 'text-amber-400' },
  { icon: Globe, value: '500+', label: 'Placements', color: 'text-cyan-400' },
  { icon: Shield, value: '100%', label: 'Legal Process', color: 'text-green-400' },
  { icon: TrendingUp, value: '8–16', label: 'Weeks Process', color: 'text-purple-400' },
];

export default function WorkVisaLandingPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden relative">
      <Header />
      
      {/* Interactive Background Blur Loop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], x: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[140px]" 
        />
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-10 px-4 z-10">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 flex-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md shadow-lg"
            >
              <Briefcase size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-black tracking-[0.2em] uppercase">Work Visa Programs</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.05]">
              <span className="text-white">Build Your</span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
                European Career
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-xl max-w-2xl leading-relaxed font-light mb-8">
              Legal work permits across 5 top European destinations. Competitive salaries, full documentation support, and a pathway to long-term settlement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto flex-1 max-w-2xl"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`flex flex-col items-center lg:items-start text-center lg:text-left gap-2 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-white/20 transition-all shadow-2xl ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}
              >
                <s.icon size={24} className={s.color} />
                <span className={`text-3xl lg:text-4xl font-black mt-2 ${s.color}`}>{s.value}</span>
                <span className="text-gray-500 text-xs font-bold tracking-wider uppercase">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Select Your Destination</h2>
          <p className="text-gray-500 text-base">Click on a country to explore detailed programs, eligibility, and salary ranges.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, i) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <Link to={country.path} className="block h-full">
                <div
                  className={`relative h-full overflow-hidden flex flex-col rounded-3xl border ${country.border} bg-gradient-to-br ${country.color} backdrop-blur-md p-7 cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl ${country.glow} hover:shadow-current`}
                  style={{ background: `linear-gradient(135deg, ${country.accent}15, rgba(255,255,255,0.02))` }}
                >
                  {/* Badge */}
                  <span className={`absolute top-5 right-5 text-xs font-black tracking-wider px-3 py-1.5 rounded-full border ${country.badgeColor} shadow-md`}>
                    {country.badge}
                  </span>

                  {/* Flag + Country */}
                  <div className="flex items-start gap-4 mb-6">
                    <img src={country.flagUrl} alt={`${country.name} flag`} className="w-12 h-auto drop-shadow-md rounded-sm" />
                    <div>
                      <h3 className="text-2xl font-black text-white">{country.name}</h3>
                      <p className="text-gray-400 text-sm mt-1 font-medium">{country.tagline}</p>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="mb-5 flex-1">
                    <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Salary Range</p>
                    <p className="text-white font-black text-xl" style={{ color: country.accent }}>{country.highlight}</p>
                  </div>

                  {/* Job Types */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {country.jobs.map((job, j) => (
                      <span key={j} className="text-xs font-bold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {job}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-black tracking-wider text-white group-hover:gap-3 transition-all duration-300" style={{ color: country.accent }}>
                    Explore Program
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Decorative glow orb */}
                  <div
                    className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ background: country.accent }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 p-10 md:p-14 text-center backdrop-blur-md"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Not Sure Which Country Is Right For You?</h2>
          <p className="text-gray-400 text-base mb-8 max-w-xl mx-auto">Our expert counselors will evaluate your profile and recommend the best work permit destination for your career.</p>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-[#080b14] font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            Book Free Consultation
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <MinimalFooter />
    </div>
  );
}
