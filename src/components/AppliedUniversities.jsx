import React, { useState, useMemo } from 'react';
import { Building, MapPin, GraduationCap, CheckSquare, FileText, Filter, Clock } from 'lucide-react';
import ApplicationTracking from './ApplicationTracking';

const AppliedUniversities = ({ profile }) => {
  const appliedUniversities = (profile?.appliedUniversities || []).filter(u => u && typeof u === 'object' && u.id);

  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const uniqueLocations = useMemo(() =>
    Array.from(new Set(appliedUniversities.map(u => u.location).filter(Boolean))),
    [appliedUniversities]);

  const uniqueLevels = useMemo(() =>
    Array.from(new Set(appliedUniversities.map(u => u.level).filter(Boolean))),
    [appliedUniversities]);

  const uniqueUniversities = useMemo(() =>
    Array.from(new Set(appliedUniversities.map(u => u.name).filter(Boolean))).sort(),
    [appliedUniversities]);

  const filteredUniversities = useMemo(() =>
    appliedUniversities.filter(uni => {
      if (searchTerm && uni.name && uni.name !== searchTerm) return false;
      if (locationFilter && uni.location !== locationFilter) return false;
      if (levelFilter && uni.level !== levelFilter) return false;
      return true;
    }),
    [appliedUniversities, searchTerm, locationFilter, levelFilter]);

  if (selectedApp) {
    return (
      <ApplicationTracking
        student={profile}
        applications={appliedUniversities}
        initialSelectedAppId={selectedApp.id}
        onBack={() => setSelectedApp(null)}
      />
    );
  }

  return (
    <div className="view-standard" style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* ── Compact header (Phase 3) ── */}
      <header className="dash-header" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: '1rem', marginBottom: '1px' }}>Applied Universities</h1>
          <p style={{ fontSize: '0.72rem', margin: 0 }}>Review all academic applications submitted to your target institutions.</p>
        </div>
      </header>

      {/* ── Compact notice banner ── */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        padding: '8px 14px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ef4444'
      }}>
        <Clock size={14} />
        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
          Notice: Submitted applications are currently Under Process. Please allow up to 48 hours for updates.
        </span>
      </div>

      {appliedUniversities.length === 0 ? (
        <div className="widget placeholder-panel">
          <div className="empty-state" style={{ padding: '30px', textAlign: 'center' }}>
            <FileText size={40} style={{ color: 'var(--glass-border)', margin: '0 auto 12px auto' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '6px', fontSize: '1rem' }}>No Applications Filed</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>You have not submitted your profile to any universities yet. Use the Course Finder to begin your journey.</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Compact filter widget ── */}
          <div className="widget" style={{ padding: '12px 14px' }}>
            <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <Filter size={15} /> Filter Applications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Building size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select className="theme-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '30px', width: '100%', boxSizing: 'border-box', fontSize: '0.8rem', padding: '7px 10px 7px 30px' }}>
                  <option value="">All Universities</option>
                  {uniqueUniversities.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <select className="theme-input" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px' }}>
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <select className="theme-input" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px' }}>
                <option value="">All Levels</option>
                {uniqueLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>

          {/* ── University cards — compact glassmorphic ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredUniversities.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No applications match your filter criteria.
              </div>
            ) : (
              filteredUniversities.map((uni, idx) => (
                <div
                  key={idx}
                  className="widget"
                  onClick={() => setSelectedApp(uni)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '12px 14px',
                    border: '1px solid var(--glass-border)',
                    transition: 'all 0.2s ease',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: '1 1 auto' }}>
                      <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> {uni.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                        {uni.location && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {uni.location}</span>}
                        {uni.minPercentage && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><GraduationCap size={11} /> Min. {uni.minPercentage}%</span>}
                        {uni.intake && <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '1px 6px', borderRadius: '4px' }}>Intake: {uni.intake}</span>}
                        {uni.type && <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px' }}>{uni.type}</span>}
                        {uni.ranking && <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1px 6px', borderRadius: '4px' }}>{uni.ranking}</span>}
                        {uni.level && <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1px 6px', borderRadius: '4px' }}>{uni.level}</span>}
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#eab308', fontWeight: 600, background: 'rgba(234, 179, 8, 0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', whiteSpace: 'nowrap', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                      <Clock size={11} /> Under Process
                    </span>
                  </div>

                  {uni.programs && uni.programs.length > 0 && (
                    <div style={{ paddingTop: '10px', borderTop: '1px dashed var(--glass-border)' }}>
                      <h5 style={{ margin: '0 0 7px 0', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Applied Programs</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {uni.programs.map((prog, pIdx) => (
                          <div key={pIdx} style={{ background: 'var(--glass-highlight)', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                            <CheckSquare size={11} style={{ color: 'var(--text-muted)' }} />
                            {prog}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AppliedUniversities;
