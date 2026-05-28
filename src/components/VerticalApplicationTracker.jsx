import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Dot, ArrowRight } from 'lucide-react';

const VerticalApplicationTracker = ({ profile }) => {
  // Enforce strictly linear progress logic
  const isProfileComplete = Boolean(profile?.firstName && profile?.phone && profile?.nationality);
  const isAcademicComplete = isProfileComplete && Boolean(profile?.tenthPercentage || profile?.twelfthPercentage || profile?.ugCGPA);
  const hasApplied = isAcademicComplete && Boolean(profile?.appliedUniversities?.length > 0 || profile?.savedUniversitiesCart?.length > 0);
  const isDocsUploaded = hasApplied && Boolean(profile?.documentZip || profile?.documents?.length > 0);
  const isApproved = isDocsUploaded && Boolean(profile?.applicationStatus === 'approved' || profile?.applicationStatus === 'enrolled');

  const steps = [
    { id: 1, label: 'Profile', completed: isProfileComplete, active: !isProfileComplete },
    { id: 2, label: 'Academic', completed: isAcademicComplete, active: isProfileComplete && !isAcademicComplete },
    { id: 3, label: 'Apply', completed: hasApplied, active: isAcademicComplete && !hasApplied },
    { id: 4, label: 'Documents', completed: isDocsUploaded, active: hasApplied && !isDocsUploaded },
    { id: 5, label: 'Decision', completed: isApproved, active: isDocsUploaded && !isApproved }
  ];

  const [hoveredStep, setHoveredStep] = useState(null);

  // Calculate active progress height for the connecting line
  const activeIndex = steps.findIndex(s => s.active);
  const progressPercentage = activeIndex === -1 ? 100 : (activeIndex / (steps.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: '45px',
        height: 'calc(91vh - 32px)',
        margin: '16px 16px 16px 0',
        background: 'var(--card-bg-solid)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 0',
        gap: '20px',
        zIndex: 90,
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
      {/* Inner container for background effects to clip them inside rounded corners without clipping tooltips */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', borderRadius: '24px', zIndex: 0, pointerEvents: 'none' }}>
        {/* Animated Background Orbs */}
        <motion.div
          animate={{ y: [0, 50, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '-10px', left: '-10px', width: '60px', height: '60px', background: 'var(--accent-primary)', filter: 'blur(20px)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ y: [0, -50, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '50px', height: '50px', background: 'var(--accent-secondary)', filter: 'blur(20px)', borderRadius: '50%' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
        Journey
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>

        {/* Background Track Line */}
        <div style={{ position: 'absolute', top: '15px', bottom: '15px', width: '2px', background: 'var(--glass-border)', borderRadius: '2px', zIndex: 0 }}></div>

        {/* Active Glow Track Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: 'absolute', top: '15px', width: '2px', background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))', borderRadius: '2px', zIndex: 0, boxShadow: '0 0 10px var(--accent-glow)' }}
        />

        {steps.map((step, idx) => {
          const isCompleted = step.completed;
          const isActive = step.active;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', cursor: 'pointer' }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                style={{
                  width: isActive ? '20px' : '16px',
                  height: isActive ? '20px' : '16px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--accent-primary)' : isActive ? 'var(--bg-primary)' : 'var(--glass-bg)',
                  border: `2px solid ${isCompleted ? 'var(--accent-primary)' : isActive ? 'var(--accent-secondary)' : 'var(--glass-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? '#fff' : 'var(--text-muted)',
                  boxShadow: isCompleted || isActive ? '0 0 12px var(--accent-glow)' : 'none',
                  transition: 'all 0.3s'
                }}>
                {isCompleted ? <Check size={10} strokeWidth={3} /> : isActive ? <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '6px', height: '6px', background: 'var(--accent-secondary)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-secondary)' }} /> : null}
              </motion.div>

              {/* Minimal Tooltip */}
              <AnimatePresence>
                {hoveredStep === step.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 5, filter: 'blur(4px)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      right: '35px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(10, 10, 15, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '-4px 4px 15px rgba(0,0,0,0.3)',
                      pointerEvents: 'none'
                    }}
                  >
                    {step.label}
                    {isCompleted && <Check size={10} color="var(--accent-primary)" />}
                    {isActive && <ArrowRight size={10} color="var(--accent-secondary)" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VerticalApplicationTracker;
