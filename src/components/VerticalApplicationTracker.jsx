import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { PORTAL_LAYOUT_CONFIG } from '../Dashboard';
import { useTheme } from '../ThemeContext';

const STEPS = [
  { id: 1, label: 'Profile',   desc: 'Personal info'    },
  { id: 2, label: 'Academic',  desc: 'Education records' },
  { id: 3, label: 'Apply',     desc: 'University picks'  },
  { id: 4, label: 'Docs',      desc: 'Upload files'      },
  { id: 5, label: 'Decision',  desc: 'Await result'      },
];

const VerticalApplicationTracker = ({ profile, sidebarExpanded }) => {
  const { activeTheme } = useTheme();
  const isProfileComplete  = Boolean(profile?.firstName && profile?.phone);
  const isAcademicComplete = isProfileComplete && Boolean(profile?.highestLevelOfEducation || profile?.educationHistory?.some(edu => edu.universityName || edu.percentageObtained));
  const hasApplied         = isAcademicComplete && Boolean(profile?.country || profile?.appliedUniversities?.length > 0 || profile?.savedUniversitiesCart?.length > 0);
  const isDocsUploaded     = hasApplied && Boolean(profile?.documentZip || profile?.documents?.length > 0 || profile?.passportNo);
  const isApproved         = isDocsUploaded && Boolean(profile?.studentStatus === 'Active' || profile?.applicationStatus === 'approved');

  const isSubmitted        = Boolean(profile?.documentZip || profile?.applications?.length > 0);

  const completed = isSubmitted
    ? [true, true, true, true, true]
    : [isProfileComplete, isAcademicComplete, hasApplied, isDocsUploaded, isApproved];
  const activeIdx  = completed.findIndex(c => !c);
  const doneCount  = completed.filter(Boolean).length;
  const pct        = Math.round((doneCount / STEPS.length) * 100);
  const lineH      = activeIdx === -1 ? 100 : (activeIdx / (STEPS.length - 1)) * 100;

  const [hov, setHov] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{
        scale: 1.02,
        boxShadow: 'var(--card-shadow)',
        background: activeTheme === 'light' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(10, 10, 10, 0.6)',
        borderColor: 'var(--accent-primary)'
      }}
      className="vertical-journey-tracker"
      style={{
        position: 'relative',
        flexShrink: 0,
        width: PORTAL_LAYOUT_CONFIG.journeyTracker.width,
        height: 'calc(100% - 80px)',
        alignSelf: 'flex-start',
        background: activeTheme === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: activeTheme === 'light' ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0 16px',
        gap: 0,
        zIndex: 90,
        boxShadow: 'var(--card-shadow)',
        overflow: 'visible',
      }}>

      {/* Background glow orbs */}
      <div style={{ position:'absolute', inset:0, borderRadius:'20px', overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <motion.div animate={{ y:[0,30,0], opacity:[0.06,0.14,0.06] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'-10px', left:'-10px', width:'70px', height:'70px', background: activeTheme === 'light' ? '#3B82F6' : '#d97706', filter:'blur(22px)', borderRadius:'50%' }} />
        <motion.div animate={{ y:[0,-30,0], opacity:[0.04,0.1,0.04] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', bottom:'-10px', left:'-10px', width:'55px', height:'55px', background: activeTheme === 'light' ? '#60A5FA' : '#fcd34d', filter:'blur(20px)', borderRadius:'50%' }} />
      </div>

      {/* "Journey" label */}
      <div style={{ position:'relative', zIndex:1, writingMode:'vertical-rl', transform:'rotate(180deg)', fontSize:'0.5rem', fontWeight:800, color:'var(--text-dim)', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'16px' }}>
        Journey
      </div>

      {/* Steps + track */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', width:'100%', position:'relative', zIndex:1 }}>

        {/* Track background */}
        <div style={{ position:'absolute', top:'12px', bottom:'12px', width:'2px', background: activeTheme === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255,255,255,0.06)', borderRadius:'2px' }} />

        {/* Animated progress fill */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${lineH}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ position:'absolute', top:'12px', width:'2px', background:'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))', borderRadius:'2px', boxShadow:'0 0 10px var(--accent-glow)' }}
        />

        {STEPS.map((step, idx) => {
          const done   = completed[idx];
          const active = activeIdx === idx;
          return (
            <div key={step.id}
              onMouseEnter={() => setHov(step.id)}
              onMouseLeave={() => setHov(null)}
              style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', width:'100%', cursor:'pointer' }}>

              {/* Node */}
              <motion.div whileHover={{ scale: 1.25 }}
                style={{
                  width: active ? '22px' : '16px',
                  height: active ? '22px' : '16px',
                  borderRadius: '50%',
                  background: done ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : active ? 'var(--bg-primary)' : (activeTheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(128,128,128,0.1)'),
                  border: `2px solid ${done ? 'var(--accent-primary)' : active ? 'var(--accent-secondary)' : (activeTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(128,128,128,0.2)')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: done ? '0 0 14px var(--accent-glow)' : active ? '0 0 12px var(--accent-glow)' : 'none',
                  transition: 'all 0.3s',
                }}>
                {done
                  ? <Check size={9} strokeWidth={3} color="#fff" />
                  : active
                    ? <motion.div animate={{ scale:[1,1.6,1], opacity:[0.6,1,0.6] }} transition={{ duration:1.8, repeat:Infinity }}
                        style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent-secondary)', boxShadow:'0 0 8px var(--accent-secondary)' }} />
                    : null}
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {hov === step.id && (
                  <motion.div
                    initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:6 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position:'absolute', right:'60px', top:'50%', transform:'translateY(-50%)',
                      background:'var(--bg-secondary)', backdropFilter:'blur(12px)',
                      border:'1px solid var(--glass-border)', borderRadius:'10px',
                      padding:'7px 12px', whiteSpace:'nowrap', pointerEvents:'none',
                      boxShadow:'var(--card-shadow)',
                    }}>
                    <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--text-main)', marginBottom:'2px', display:'flex', alignItems:'center', gap:'6px' }}>
                      {step.label}
                      {done && <Check size={10} color="var(--accent-primary)" />}
                      {active && <ArrowRight size={10} color="var(--accent-secondary)" />}
                    </div>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontWeight:500 }}>{step.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Progress % */}
      <div style={{ position:'relative', zIndex:1, marginTop:'12px', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
        <div style={{ fontSize:'0.75rem', fontWeight:900, color: pct > 0 ? 'var(--accent-primary)' : 'var(--text-dim)', textShadow: pct > 0 ? '0 0 10px var(--accent-glow)' : 'none' }}>
          {pct}%
        </div>
        <div style={{ width:'24px', height:'3px', background: activeTheme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden' }}>
          <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1.2, ease:'easeOut' }}
            style={{ height:'100%', background:'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', borderRadius:'2px' }} />
        </div>
      </div>
    </motion.div>
  );
};

export default VerticalApplicationTracker;
