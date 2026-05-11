import React, { useState, useEffect } from 'react';
import {
  FileText, Users, Bell, ArrowRight, TrendingUp,
  BookOpen, Globe, CheckCircle2, GraduationCap,
  Building2, Zap, Shield, Clock, Sparkles, Activity,
  Star, MapPin, Target, BarChart3, ChevronRight, Download, Upload
} from 'lucide-react';
import { API_BASE_URL } from '../config';

/* ── Live Clock ── */
const LiveClock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
      {t.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
};

/* ── Metric Card ── */
const MetricCard = ({ icon: Icon, label, value, color, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '1.2rem',
        borderRadius: '16px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hov ? color + '40' : 'var(--glass-border)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? `0 12px 24px -8px ${color}20` : '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: `${color}15`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginTop: '4px' }}>
          {value}
        </div>
      </div>
    </div>
  );
};

/* ── Action Tile ── */
const ActionTile = ({ icon: Icon, label, sub, color, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
        background: h ? 'var(--glass-highlight)' : 'rgba(255,255,255,0.01)',
        border: h ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
        borderRadius: '16px', cursor: 'pointer', width: '100%',
        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        textAlign: 'left',
        boxShadow: h ? '0 10px 20px -10px rgba(0,0,0,0.3)' : 'none',
        transform: h ? 'translateY(-2px)' : 'none'
      }}
    >
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: h ? `${color}25` : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: h ? color : 'var(--text-muted)', flexShrink: 0, transition: 'all 0.25s', border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
      </div>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', opacity: h ? 1 : 0.5, transition: 'opacity 0.2s' }} />
    </button>
  );
};

/* ── Simple Progress Bar ── */
const ProgressBar = ({ label, value, total, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, width: '60px' }}>{label}</span>
    <div style={{ flex: 1, height: '8px', background: 'var(--table-header-bg)', borderRadius: '100px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.round((value / (total || 1)) * 100)}%`, background: color, borderRadius: '100px', transition: 'width 1s ease' }} />
    </div>
    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', width: '30px', textAlign: 'right' }}>{value}</span>
  </div>
);

const DashboardHome = ({ isPartner, isCounselor, isFreelancer, profile, setActiveTab, stats, fetchStats, unreadMsgCount }) => {
  const [greeting, setGreeting] = useState('');

  // ── PROFILE PHOTO CONFIG ───────────────────
  // Adjust these variables easily to control the size and position
  const avatarConfig = {
    size: '150px',        // Square size dimension
    top: '50px',         // Distance from Top edge 
    right: '40px',       // Distance from Right edge
  };
  // ────────────────────────────────────────────

  const isStudent = !isPartner && !isCounselor && !isFreelancer;
  const applied = (profile?.appliedUniversities || []).filter(u => u?.id).length;

  let progressPoints = 0;
  if (isStudent) {
    const fields = [
      'firstName', 'lastName', 'email', 'phone', 'dob', 'gender',
      'nationality', 'passportNo', 'issueDate', 'expiryDate',
      'mailingAddress1', 'mailingCity', 'mailingState', 'mailingPincode',
      'highestLevelOfEducation'
    ];
    fields.forEach(f => { if (profile?.[f]) progressPoints++; });
    if (profile?.documents?.length > 0) progressPoints++;
    if (profile?.appliedUniversities?.length > 0) progressPoints++;
    if (profile?.secondaryEducation) progressPoints++;
    if (profile?.graduation) progressPoints++;
    if (profile?.applicationStatus === 'submitted' || profile?.applicationStatus === 'approved') progressPoints++;
  }
  const appProgressPercentage = Math.min(100, Math.round((progressPoints / 20) * 100));


  useEffect(() => {
    fetchStats?.();
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const COLORS = {
    indigo: '#6366f1', purple: '#a78bfa', teal: '#14b8a6',
    blue: '#3b82f6', rose: '#f43f5e', amber: '#f59e0b', green: '#10b981'
  };

  const quickActions = [
    { icon: Globe, label: 'Find Courses', sub: 'Explore global programs', color: COLORS.blue, tab: 'course-finder' },
    { icon: FileText, label: isStudent ? 'My Applications' : 'Applications', sub: 'Track submissions', color: COLORS.purple, tab: isStudent ? 'applications' : 'partner-applications' },
    { icon: Building2, label: 'Universities', sub: 'View target institutions', color: COLORS.teal, tab: 'applied-universities' },
    { icon: BookOpen, label: 'Learning Hub', sub: 'Access digital resources', color: COLORS.rose, tab: 'learning' },
    { icon: Bell, label: 'Notifications', sub: unreadMsgCount > 0 ? `${unreadMsgCount} unread` : 'Recent events', color: COLORS.amber, tab: 'notifications' },
    ...(!isStudent ? [{ icon: Users, label: 'Students', sub: 'Manage pipeline', color: COLORS.indigo, tab: 'students-list' }] : []),
    { icon: GraduationCap, label: 'My Profile', sub: 'Access user settings', color: COLORS.indigo, tab: 'profile' },
  ];

  const partnerTotal = (stats.studentsActive || 0) + (stats.studentsHold || 0) + (stats.studentsBackout || 0) + (stats.studentsReceived || 0) || 1;

  return (
    <div className="dash-home-wrap" style={{ height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.4s ease' }}>

        {/* ── Top Row: Header & Metrics ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(450px, 2fr)', gap: '16px' }}>

          {/* Welcome Card */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left',
            padding: '20px 24px', background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px', border: '1px solid var(--glass-border)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />

            {/* Floating Avatar — Absolute Positioned so it doesn't affect surrounding text layout */}
            {profile?.role === 'student' && (
              <div
                style={{
                  position: 'absolute',
                  top: avatarConfig.top,
                  right: avatarConfig.right,
                  width: avatarConfig.size,
                  height: avatarConfig.size,
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '2px solid var(--glass-border)',
                  cursor: 'default',
                  zIndex: 2,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '5px' }}>
                    <Upload size={16} color="#fff" style={{ opacity: 0.8 }} />
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9, textAlign: 'center' }}>
                      Add Photo
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: 'fit-content' }}>
                    <Sparkles size={12} color="var(--accent-primary)" />
                    <LiveClock />
                  </div>

                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '12px 0 6px', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {greeting}, <br /><span style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{profile?.firstName || 'User'}</span>
                  </h1>
                </div>

              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', lineHeight: 1.4 }}>
                {isPartner ? 'Overview of your student pipeline. Ready to manage your leads?' : isCounselor ? 'Monitor your active students and applications.' : isFreelancer ? 'Track referred students and view progress.' : 'Welcome to your academic journey portal. Your next big step starts here.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', zIndex: 1 }}>
              <button onClick={() => setActiveTab('course-finder')} style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: '#fff',
                border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}>
                <Globe size={14} /> Explore Courses
              </button>
              {!isStudent && (
                <button onClick={() => setActiveTab('register-student')} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--glass-highlight)', color: 'var(--text-main)',
                  border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
                }}>
                  <Users size={14} /> Add Student
                </button>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {isStudent ? (
              <>
                <MetricCard icon={BookOpen} label="Saved Courses" value={profile?.savedUniversitiesCart?.length || 0} color={COLORS.blue} onClick={() => setActiveTab('course-finder')} />
                <MetricCard icon={Building2} label="Applied Unis" value={applied} color={COLORS.purple} onClick={() => setActiveTab('applied-universities')} />
                <MetricCard icon={CheckCircle2} label="Documents" value={profile?.documentZip ? 'Uploaded' : 'Pending'} color={COLORS.teal} onClick={() => setActiveTab('applications')} />
                <MetricCard icon={Shield} label="Account Status" value="Active" color={COLORS.green} />
              </>
            ) : (
              <>
                <MetricCard icon={Users} label="Total Students" value={stats.totalStudents || 0} color={COLORS.blue} onClick={() => setActiveTab('students-list')} />
                <MetricCard icon={Activity} label="Active Applications" value={stats.studentsActive || 0} color={COLORS.teal} />
                <MetricCard icon={TrendingUp} label="Offers Received" value={stats.studentsReceived || 0} color={COLORS.green} />
                <MetricCard icon={Clock} label="Pending Review" value={stats.studentsPending || 0} color={COLORS.amber} />
              </>
            )}
          </div>
        </div>

        {/* ── Bottom Row: Quick Actions & Extras ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isStudent ? '1fr 340px' : '1fr 380px', gap: '16px' }}>

          {/* Left: Quick Actions & Discover */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="var(--accent-primary)" /> Quick Navigation
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                {quickActions.map((a, i) => (
                  <ActionTile key={a.tab} icon={a.icon} label={a.label} sub={a.sub} color={a.color} onClick={() => setActiveTab(a.tab)} />
                ))}
              </div>
            </div>

          </div>

          {/* Right: Status / Progress / Side Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {!isStudent ? (
              <div style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="var(--accent-primary)" /> Pipeline Analytics
                </h2>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <ProgressBar label="Active" value={stats.studentsActive || 0} total={partnerTotal} color={COLORS.teal} />
                  <ProgressBar label="On Hold" value={stats.studentsHold || 0} total={partnerTotal} color={COLORS.amber} />
                  <ProgressBar label="Backout" value={stats.studentsBackout || 0} total={partnerTotal} color={COLORS.rose} />
                  <ProgressBar label="Received" value={stats.studentsReceived || 0} total={partnerTotal} color={COLORS.green} />
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Enrolled</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{stats.totalStudents || 0}</div>
                  </div>
                  <button onClick={() => setActiveTab('students-list')} style={{
                    background: 'transparent', border: 'none', color: 'var(--accent-primary)',
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    View All <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="var(--accent-primary)" /> Profile Completion
                </h2>

                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                }}>
                  {/* Subtle background decoration inside card */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(30px)', opacity: 0.5 }}></div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Application Readiness
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Verification Score</div>
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, letterSpacing: '-1px' }}>{appProgressPercentage}%</div>
                    </div>

                    {/* Modern Rectangular Progress Bar */}
                    <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--glass-border)', position: 'relative' }}>
                      <div style={{
                        height: '100%',
                        width: `${appProgressPercentage}%`,
                        background: 'linear-gradient(90deg, var(--accent-primary), #a78bfa)',
                        borderRadius: '20px',
                        transition: 'width 1.5s cubic-bezier(0.19, 1, 0.22, 1)',
                        position: 'relative',
                        boxShadow: '0 0 10px var(--accent-glow)'
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                          backgroundSize: '1rem 1rem',
                          opacity: 0.3,
                          animation: 'progressStripes 1s linear infinite'
                        }} />
                      </div>
                    </div>
                    <style>{`
                    @keyframes progressStripes {
                      from { background-position: 1rem 0; }
                      to { background-position: 0 0; }
                    }
                  `}</style>
                  </div>
                </div>

                <button onClick={() => setActiveTab('profile')} style={{
                  background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)', color: 'var(--text-main)',
                  padding: '12px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', width: '100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-highlight)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                  Complete Profile <ArrowRight size={14} />
                </button>


              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
