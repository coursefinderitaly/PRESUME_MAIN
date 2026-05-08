import React, { useState, useEffect } from 'react';
import { Activity, Clock, FileText, Users } from 'lucide-react';

const DashboardHome = ({ isPartner, profile, setActiveTab, stats, fetchStats, setPendingApplications, unreadMsgCount }) => {
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="view-home">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Welcome back, {profile.firstName}!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Overview of your current operations and metrics.</p>
      </div>

      {/* Admin message alert banner (student only) */}
      {!isPartner && unreadMsgCount > 0 && (
        <div
          onClick={() => setActiveTab('notifications')}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(109,40,217,0.05))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '1rem' }}>💬</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {unreadMsgCount} new message{unreadMsgCount !== 1 ? 's' : ''} from Admin
            </div>
          </div>
          <div style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 800 }}>
            VIEW
          </div>
        </div>
      )}
      
      {/* Top Level Metric Cards */}
      <div className="widget-grid">
        <div className="widget metric-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3>{isPartner ? 'Total Students' : 'Saved Courses'}</h3>
          <div className="metric" style={{ justifyContent: 'center' }}>{isPartner ? stats.totalStudents : 0}</div>
          {isPartner && <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '5px'}}>Including new leads</p>}
          <div style={{ position: 'absolute', top: '25px', right: '25px', color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>↑ 4%</div>
        </div>

        {isPartner && (
          <div className="widget metric-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3>Total Counselors</h3>
            <div className="metric" style={{ justifyContent: 'center' }}>{stats.totalCounselors || 0}</div>
            <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '5px'}}>Active sub-accounts</p>
          </div>
        )}

        {isPartner ? (
          <>
            <div className="widget metric-card" style={{ position: 'relative', padding: '20px' }}>
              <h3>Offer Status</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.studentsReceived || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Received</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--glass-border)', padding: '0 10px', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.studentsPending || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</div>
                </div>
              </div>
            </div>

            <div className="widget metric-card" style={{ position: 'relative', padding: '20px' }}>
              <h3>Student Status</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.studentsActive || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '0 10px', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.studentsBackout || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backout</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>{stats.studentsHold || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On Hold</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="widget metric-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3>Active Applications</h3>
            <div className="metric" style={{ justifyContent: 'center' }}>{profile.appliedUniversities ? profile.appliedUniversities.filter(u => u && typeof u === 'object' && u.id).length : 0}</div>
            <p className="text-muted" style={{fontSize: '0.8rem', marginTop: '5px'}}>Based on your final submissions</p>
          </div>
        )}
      </div>

      {/* Main Dashboard Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* Recent Activity Timeline */}
        <div className="widget profile-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, border: 'none', padding: 0 }}>
              <Activity size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px' }}/>
              Recent Activity
            </h3>
            <span onClick={() => setActiveTab('notifications')} style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', cursor: 'pointer' }}>View All</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-primary)' }}><FileText size={16} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>New application submitted</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Rahul Sharma applied to Toronto Univ.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '4px', alignItems: 'center' }}><Clock size={12}/> 2 hours ago</p>
              </div>
            </div>

            {isPartner && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}><Users size={16} /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>New Student Lead Registered</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sarah Connor was added to your pipeline.</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '4px', alignItems: 'center' }}><Clock size={12}/> 5 hours ago</p>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: '#f59e0b' }}><Activity size={16} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>System Update Completed</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ERP integration synchronized successfully.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '4px', alignItems: 'center' }}><Clock size={12}/> 1 day ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
