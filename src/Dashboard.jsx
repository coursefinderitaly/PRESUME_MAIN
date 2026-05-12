import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, User, MapPin, Globe, Phone, Smartphone, Edit2, Save, X,
  Home, Search, Users, Briefcase, FileText, Bell, MonitorPlay, Building2, CheckSquare, KeyRound,
  Sun, Moon, Monitor, Menu, UploadCloud, MessageSquare, ChevronRight, ChevronLeft, Camera, Trash2
} from 'lucide-react';
import './Dashboard.css';
import { useTheme } from './ThemeContext';

import DashboardHome from './components/DashboardHome';
import StudentsList from './components/StudentsList';
import ManageCounselors from './components/ManageCounselors';
import Notifications from './components/Notifications';
import LearningResources from './components/LearningResources';
import SearchProgram from './components/SearchProgram';
import RegisterStudent from './components/RegisterStudent';
import DocumentUpload from './components/DocumentUpload';
import StudentDetails from './components/StudentDetails';
import AppliedUniversities from './components/AppliedUniversities';
import PartnerApplications from './components/PartnerApplications';
import StudentDocuments from './components/StudentDocuments';
import { API_BASE_URL } from './config';

const AnimatedBackground = () => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden', background: 'var(--bg-primary)', transition: 'background 0.5s ease' }}>
    {/* Floating Dream Orbs */}
    <motion.div
      animate={{ 
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
        x: [0, 50, -30, 40, 0],
        y: [0, 30, 60, -20, 0]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute', top: '10%', left: '10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)', 
        filter: 'blur(80px)', opacity: 0.15
      }}
    />
    <motion.div
      animate={{ 
        scale: [1.1, 0.9, 1.2, 1, 1.1],
        rotate: [360, 270, 180, 90, 0],
        x: [0, -40, 20, -50, 0],
        x: [0, -40, 20, -50, 0],
        y: [0, -20, -60, 30, 0]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute', bottom: '10%', right: '10%', width: '45vw', height: '45vw',
        background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)', 
        filter: 'blur(100px)', opacity: 0.12
      }}
    />
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.05, 0.1, 0.05]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100vw', height: '100vh',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 80%)', 
        filter: 'blur(60px)', zIndex: -1
      }}
    />
  </div>
);

const DesignerTag = ({ isSidebarOpen }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  if (!isSidebarOpen || window.innerWidth <= 768) return null;

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: (e.clientX - rect.left - rect.width / 2) / 5, y: (e.clientY - rect.top - rect.height / 2) / 5 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{
        marginTop: 'auto', padding: '20px 0 10px 0', textAlign: 'center', fontSize: '0.6rem',
        color: 'var(--text-muted)', letterSpacing: '2px', opacity: 0.4, cursor: 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 0.1s ease-out',
        fontWeight: 'bold', textTransform: 'uppercase'
      }}>
        Designer @NEET
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // which sidebar section is open
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isSidebarExpanded || isHovered;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [pendingApplications, setPendingApplications] = useState([]);

  // Unread admin messages state (for student floating alert)
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [latestAdminMsg, setLatestAdminMsg] = useState(null);
  const [showMsgAlert, setShowMsgAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Chat popup state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSending, setChatSending] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
      setIsSidebarLocked(false);
    }
  }, []);

  const navigate = useNavigate();
  const { theme, setTheme, activeTheme } = useTheme();

  // Lifted Stats for dynamic re-fetching across child tabs
  const [stats, setStats] = useState({ totalStudents: 0, totalCounselors: 0, totalApplications: 0, pendingApps: 0 });

  // Poll for unread admin messages (student portal)
  const pollUnreadMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/erp/my-messages/unread`, { 
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unread > 0 && data.unread !== unreadMsgCount) {
          setUnreadMsgCount(data.unread);
          setAlertDismissed(false);
          setShowMsgAlert(true);
          // Fetch latest message for preview
          try {
            const msgRes = await fetch(`${API_BASE_URL}/erp/my-messages`, { 
              credentials: 'include',
              headers: { 'x-csrf-protected': '1' }
            });
            if (msgRes.ok) {
              const msgs = await msgRes.json();
              const adminMsgs = msgs.filter(m => !m.read && m.sender === 'admin');
              if (adminMsgs.length > 0) setLatestAdminMsg(adminMsgs[adminMsgs.length - 1]);
            }
          } catch (e) {}
        } else {
          setUnreadMsgCount(data.unread);
          if (data.unread === 0) { setShowMsgAlert(false); setLatestAdminMsg(null); }
        }
      }
    } catch (err) {}
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/erp/stats`, {
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (err) { }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) fetchStats();
  }, [profile]);

  // Start polling for student unread messages once profile loads
  useEffect(() => {
    if (profile && profile.role === 'student') {
      pollUnreadMessages();
      const interval = setInterval(pollUnreadMessages, 20000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.role === 'admin') {
          navigate('/admin');
          return;
        }
        setProfile(data);
        setFormData(data);
      } else {
        const errData = await resp.json().catch(() => ({}));
        console.warn('Profile fetch rejected:', errData);
        handleLogout();
      }
    } catch (err) {
      console.error('Critical Profile Fetch Error:', err);
      setMessage({ text: 'API unreachable. Contacting server...', type: 'error' });
      // Wait bit before auto-logout on network error to avoid blink issues
      setTimeout(() => navigate('/'), 3000);
    }
  };


  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, { 
      method: "POST", 
      credentials: "include",
      headers: { 'x-csrf-protected': '1' }
    }).catch(() => { });
    localStorage.removeItem('keepSignedIn');
    navigate('/');
  };

  const compressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
      };
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { 
      setMessage({ text: 'Please select an image file.', type: 'error' }); 
      return; 
    }
    
    setAvatarUploading(true);
    setMessage({ text: 'Compressing and uploading photo...', type: 'info' });
    
    try {
      // Auto compress to max 600px dimension and 0.75 quality
      const avatarUrl = await compressImage(file, 600, 600, 0.75);
      
      const res = await fetch(`${API_BASE_URL}/auth/avatar`, {
        method: 'PUT', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({ avatarUrl })
      });
      
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
        setMessage({ text: 'Profile photo updated!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to upload.', type: 'error' });
      }
    } catch (err) { 
      console.error(err);
      setMessage({ text: 'Failed during upload.', type: 'error' }); 
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    
    setAvatarUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/avatar`, {
        method: 'PUT', 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({ avatarUrl: "" })
      });
      
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, avatarUrl: null }));
        setMessage({ text: 'Profile photo removed.', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to remove photo.', type: 'error' });
      }
    } catch (err) { 
      console.error(err);
      setMessage({ text: 'Request failed.', type: 'error' }); 
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Updating Profile...', type: 'info' });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          lastName: formData.lastName,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          teamSize: formData.teamSize,
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          priorExperience: formData.priorExperience,
          designation: formData.designation,
          studentUniqueId: formData.studentUniqueId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Profile updated successfully.', type: 'success' });
        setProfile(data.user);
        setEditMode(false);
      } else {
        setMessage({ text: data.error || 'Failed to update.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server unreachable.', type: 'error' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    setMessage({ text: 'Updating password...', type: 'info' });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Password updated successfully.', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ text: data.error || 'Failed to update password.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server unreachable.', type: 'error' });
    }
  };

  if (!profile) {
    return (
      <div className="dash-universe loading">
        <div className="loader"></div>
        <p>Initializing Portal...</p>
      </div>
    );
  }

  const isPartner = profile.role === 'partner';
  const isCounselor = profile.role === 'counselor';
  const isFreelancer = profile.role === 'freelancer';
  const isStudent = profile.role === 'student';

  const NavButton = ({ id, icon: Icon, label, locked }) => {
    return (
      <button
        className={`nav-item ${activeTab === id ? 'active' : ''} ${locked ? 'locked' : ''}`}
        onClick={() => { 
          if (locked) return;
          setActiveTab(id); 
          setMessage({ text: '', type: '' }); 
          setEditMode(false); 
        }}
        disabled={locked}
      >
        <Icon size={expanded ? 18 : 22} />
        {expanded && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
        {locked && expanded && <span className="badge-soon">SOON</span>}
      </button>
    );
  };

  return (
    <>
      <AnimatedBackground />
      <div className="dash-universe" style={{ 
        height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'row', 
        background: 'var(--bg-primary)', boxSizing: 'border-box'
      }}>

        {/* ================================== */}
        {/* FLOATING SIDEBAR PANEL             */}
        {/* ================================== */}
        <motion.aside
          initial={false}
          animate={{ 
            width: expanded ? '270px' : '80px',
            x: 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30, 
            mass: 1,
            restDelta: 0.5 
          }}
          style={{ 
            height: 'calc(100vh - 32px)',
            margin: '16px',
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            display: 'flex', 
            flexDirection: 'column', 
            zIndex: 100,
            backdropFilter: 'blur(36px) saturate(160%)', 
            WebkitBackdropFilter: 'blur(36px) saturate(160%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'visible',
            position: 'relative'
          }}
        >
          {/* Inner Wrapper for Clipping */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '24px' }}>
            {/* Sidebar Header / Logo */}
            <div style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ height: '42px', minWidth: '42px', objectFit: 'contain', filter: activeTheme === 'light' ? 'invert(1) hue-rotate(180deg) contrast(1.2)' : 'none', transition: 'all 0.3s' }}
                />
                <div style={{ position: 'absolute', inset: -4, background: 'var(--accent-glow)', filter: 'blur(10px)', borderRadius: '50%', zIndex: -1, opacity: 0.5 }}></div>
              </div>
              {expanded && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.7rem', whiteSpace: 'nowrap', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.9 }}>PRESUME</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-secondary)', fontSize: '0.55rem', whiteSpace: 'nowrap', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                    {isStudent ? 'Student Portal' : isPartner ? 'Partner Portal' : isCounselor ? 'Counselor Portal' : 'Freelancer Portal'}
                  </span>
                </motion.div>
              )}
            </div>

          {/* Navigation Items */}
          <div className="sidebar-nav">
            <style>{`.sidebar-nav::-webkit-scrollbar { display: none; }`}</style>
            
            <NavButton id="home" icon={Home} label="Dashboard" />
            
            {isStudent && (
              <>
                <NavButton id="course-finder" icon={Search} label="Search Programs" />
                <NavButton id="applications" icon={FileText} label="Applications" locked />
                <NavButton id="applied-universities" icon={CheckSquare} label="Track Status" locked />
                <NavButton id="learning" icon={MonitorPlay} label="Learning Hub" locked />
                <NavButton id="alerts" icon={Bell} label="Alerts" locked />
              </>
            )}

            {(isPartner || isCounselor || isFreelancer) && (
              <>
                <NavButton id="register-student" icon={User} label="Register New" />
                <NavButton id="students-list" icon={Users} label="My Students" />
                <NavButton id="course-finder" icon={Search} label="Prog. Finder" />
                <NavButton id="partner-applications" icon={FileText} label="Applications" locked={(isPartner || isCounselor) && activeTab !== 'partner-applications'} />
                <NavButton id="student-documents" icon={UploadCloud} label="Doc Vault" />
                {isPartner && <NavButton id="counselors" icon={Briefcase} label="Manage Team" />}
                <NavButton id="notifications" icon={Bell} label="Alerts" locked />
              </>
            )}

            <NavButton id="profile" icon={User} label="Account Profile" />
          </div>

          {/* Sidebar Footer: Theme & Profile */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.05)' }}>
            
            {/* Theme Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: '12px', border: '1px solid var(--glass-border)', justifyContent: expanded ? 'space-between' : 'center' }}>
              <button onClick={() => setTheme('light')} style={{ flex: expanded ? 1 : 'none', background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Light Mode"><Sun size={14} /></button>
              <button onClick={() => setTheme('dark')} style={{ flex: expanded ? 1 : 'none', background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Dark Mode"><Moon size={14} /></button>
              {expanded && <button onClick={() => setTheme('system')} style={{ flex: 1, background: theme === 'system' ? 'var(--accent-primary)' : 'transparent', color: theme === 'system' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="System Auto"><Monitor size={14} /></button>}
            </div>

            {/* Profile Brief (Centered Row) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px', borderRadius: '12px', transition: 'all 0.2s' }}>
              <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
                <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', overflow: 'hidden', border: '2px solid var(--accent-glow)', borderRadius: '10px', background: 'var(--accent-primary)' }}>
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 800, color: '#fff' }}>{profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}</span>
                  }
                </div>
              </div>
              {expanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minWidth: 0, textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.firstName} {profile.lastName}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profile.role}</div>
                </motion.div>
              )}
              {expanded && (
                <button
                  onClick={handleLogout}
                  className="logout-btn-footer"
                  style={{ 
                    background: 'transparent', color: '#ef4444', border: 'none', 
                    padding: '6px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', cursor: 'pointer', opacity: 0.8, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </button>
              )}
            </div>

            {!expanded && (
              <button
                onClick={handleLogout}
                className="logout-btn-footer"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', 
                  padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                title="Logout"
              >
                <LogOut size={18} />
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
          {/* End Inner Wrapper */}
          </div>
            
          {/* Manual Toggle Button (Floating Circle) */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSidebarExpanded(!isSidebarExpanded); }}
            style={{ 
              position: 'absolute', top: '32px', right: '-14px', 
              width: '28px', height: '28px', borderRadius: '50%', 
              background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 101, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: 'var(--text-main)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            <div style={{ opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </div>
          </button>
        </motion.aside>

        {/* ================================== */}
        {/* MAIN CONTENT CARD                  */}
        {/* ================================== */}
        <main className="dash-main" style={{ 
          flex: 1, minHeight: 0, background: 'transparent', display: 'flex', flexDirection: 'column',
          margin: '16px 16px 16px 0'
        }}>
          {activeTab === 'profile' && (
            <header className="dash-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginBottom: '10px', background: 'transparent', borderBottom: 'none', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Profile Management</h1>
                {!editMode ? (
                  <button className="btn-edit" onClick={() => setEditMode(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent-glow)', color: 'var(--accent-secondary)', padding: '4px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}><Edit2 size={12} /> Edit</button>
                ) : (
                  <button className="btn-cancel" onClick={() => { setEditMode(false); setFormData(profile); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage({ text: '', type: '' }); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}><X size={12} /> Cancel</button>
                )}
              </div>
            </header>
          )}

          <div className="dash-content-area" style={{ 
            flex: 1, 
            padding: '16px', 
            minHeight: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            overflowY: (activeTab === 'applications' || activeTab === 'course-finder' || activeTab === 'students-list' || activeTab === 'profile') ? 'hidden' : 'auto' 
          }}>
            {message.text && (
              <div className={`dash-message ${message.type}`} style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                {message.text}
              </div>
            )}

            {activeTab === 'home' && (
              <DashboardHome
                profile={profile}
                isPartner={isPartner}
                isCounselor={isCounselor}
                isFreelancer={isFreelancer}
                setActiveTab={setActiveTab}
                stats={stats}
                fetchStats={fetchStats}
                setPendingApplications={setPendingApplications}
                unreadMsgCount={unreadMsgCount}
              />
            )}

            {activeTab === 'students-list' && (
              <StudentsList profile={profile} setMessage={setMessage} fetchStats={fetchStats} pendingApplications={pendingApplications} setPendingApplications={setPendingApplications} />
            )}
            {activeTab === 'register-student' && <RegisterStudent profile={profile} setMessage={setMessage} />}
            {activeTab === 'applications' && isStudent && (
              <StudentDetails student={profile} goBack={() => setActiveTab('home')} pendingApplications={pendingApplications} setPendingApplications={setPendingApplications} refreshProfile={fetchProfile} />
            )}
            {activeTab === 'applied-universities' && <AppliedUniversities profile={profile} />}
            {activeTab === 'partner-applications' && (isPartner || isCounselor || isFreelancer) && <PartnerApplications profile={profile} setMessage={setMessage} />}
            {activeTab === 'student-documents' && (isPartner || isCounselor || isFreelancer) && <StudentDocuments />}
            {activeTab === 'counselors' && <ManageCounselors setMessage={setMessage} />}
            {activeTab === 'notifications' && <Notifications profile={profile} />}
            {activeTab === 'learning' && <LearningResources />}
            {activeTab === 'course-finder' && (
              <SearchProgram preselectedUnis={pendingApplications} onProceed={(selected) => { setPendingApplications(selected); if (isPartner || isCounselor || isFreelancer) { setActiveTab('students-list'); } else { setActiveTab('applications'); } }} />
            )}

            {activeTab === 'profile' && (
              <>
                {!editMode ? (
                  <div className="profile-page-wrap">
                    <div className="profile-sidebar">
                      <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '100px', height: '100px', borderRadius: '25px', overflow: 'hidden', border: '3px solid var(--accent-glow)', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(167,139,250,0.4)' }}>
                            {profile.avatarUrl
                              ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800 }}>{(profile.firstName || 'U')[0].toUpperCase()}</span>
                            }
                          </div>
                          {avatarUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>Saving…</span></div>}
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>{profile.firstName} {profile.lastName}</h2>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{profile.role}</div>
                        </div>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label htmlFor="profile-avatar-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent-glow)', color: 'var(--accent-secondary)', borderRadius: '10px', padding: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.6 : 1, transition: 'all 0.2s' }}>
                            <Camera size={14} /> Change Photo
                          </label>
                          {profile.avatarUrl && (
                            <button 
                              type="button"
                              onClick={handleRemoveAvatar}
                              disabled={avatarUploading}
                              style={{ width: '100%', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                              <Trash2 size={14} /> Remove Photo
                            </button>
                          )}
                        </div>
                        <input id="profile-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={avatarUploading} />
                      </div>

                      <div className="profile-card" style={{ flex: 1 }}>
                        <h3><User size={14} /> Account Bio</h3>
                        <div className="data-row"><span className="label">Email Address</span><span className="value" style={{ fontSize: '0.75rem' }}>{profile.email}</span></div>
                        <div className="data-row"><span className="label">Member Since</span><span className="value">{new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span></div>
                        <div className="data-row"><span className="label">Account Type</span><span className="value" style={{ color: 'var(--accent-secondary)' }}>{profile.role.toUpperCase()}</span></div>
                      </div>
                    </div>

                    <div className="profile-main">
                      <div className="profile-main-grid">
                        <div className="profile-card">
                          <h3><Globe size={16} /> Geospatial</h3>
                          <div className="data-row"><span className="label">Country</span><span className="value">{profile.country}</span></div>
                          <div className="data-row"><span className="label">State / Region</span><span className="value">{profile.state}</span></div>
                          <div className="data-row"><span className="label">City</span><span className="value">{profile.city}</span></div>
                        </div>
                        <div className="profile-card">
                          <h3><Phone size={16} /> Connect</h3>
                          <div className="data-row"><span className="label">Direct Phone</span><span className="value">{profile.phoneCode} {profile.phone}</span></div>
                          <div className="data-row"><span className="label">WhatsApp</span><span className="value">{profile.whatsapp ? `${profile.whatsappCode} ${profile.whatsapp}` : 'Not Linked'}</span></div>
                          <div className="data-row"><span className="label">Status</span><span className="value" style={{ color: '#10b981' }}>Verified</span></div>
                        </div>

                        {isPartner ? (
                          <div className="profile-card full-width">
                            <h3><Building2 size={16} /> Professional Background</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                              <div className="data-row"><span className="label">Company</span><span className="value">{profile.companyName || 'N/A'}</span></div>
                              <div className="data-row"><span className="label">Designation</span><span className="value">{profile.designation || 'N/A'}</span></div>
                              <div className="data-row"><span className="label">Team Size</span><span className="value">{profile.teamSize || 'N/A'}</span></div>
                              <div className="data-row"><span className="label">Experience</span><span className="value">{profile.priorExperience ? 'Yes' : 'No'}</span></div>
                              <div className="data-row" style={{ gridColumn: '1 / -1' }}><span className="label">HQ Address</span><span className="value">{profile.companyAddress || 'N/A'}</span></div>
                            </div>
                          </div>
                        ) : (
                          <div className="profile-card full-width">
                            <h3><KeyRound size={16} /> Student Credentials</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                               <div className="data-row"><span className="label">Student ID</span><span className="value" style={{ letterSpacing: '0.1em' }}>{profile.studentUniqueId || 'PENDING'}</span></div>
                               <div className="data-row"><span className="label">Identity Status</span><span className="value" style={{ color: '#6366f1' }}>Active</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-page-wrap">
                    <div className="profile-sidebar">
                      <div className="profile-card">
                        <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '15px', fontWeight: 800 }}>Account Identity</h3>
                        <div className="dash-input-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group" style={{ marginTop: '10px' }}><label>Last Name</label><input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="dash-input" /></div>
                        <div className="dash-input-group" style={{ marginTop: '10px' }}><label>Email Address</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="dash-input" /></div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>Basic identity data used for communications and system identification.</p>
                      </div>
                      
                      <div className="profile-card" style={{ marginTop: 'auto' }}>
                         <button type="submit" form="profile-update-form" className="btn-save" style={{ width: '100%', background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}><Save size={16} /> Save Changes</button>
                      </div>
                    </div>

                    <div className="profile-main">
                      <form id="profile-update-form" onSubmit={handleUpdate}>
                        <div className="profile-grid">
                          <div className="profile-card">
                            <h3><Globe size={16} /> Location Details</h3>
                            <div className="dash-input-group"><label>Country</label><input type="text" name="country" value={formData.country || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="dash-input-group" style={{ marginTop: '10px' }}><label>State</label><input type="text" name="state" value={formData.state || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="dash-input-group" style={{ marginTop: '10px' }}><label>City</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} required className="dash-input" /></div>
                          </div>
                          
                          <div className="profile-card">
                            <h3><Phone size={16} /> Communication</h3>
                            <div className="dash-input-group"><label>Phone Number *</label><input type="tel" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 10) })} required className="dash-input" /></div>
                            <div className="dash-input-group" style={{ marginTop: '10px' }}><label>WhatsApp Number</label><input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.slice(0, 10) })} className="dash-input" /></div>
                          </div>

                          {isPartner && (
                            <div className="profile-card full-width">
                              <h3><Building2 size={16} /> Business Profile</h3>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                <div className="dash-input-group"><label>Company Name</label><input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>Team Size</label><input type="text" name="teamSize" value={formData.teamSize || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>Designation</label><input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="dash-input-group" style={{ gridColumn: '1 / -1' }}><label>Company Address</label><input type="text" name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="input-group col-span-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', gridColumn: '1 / -1' }}>
                                  <input type="checkbox" name="priorExperience" id="priorExperience" checked={formData.priorExperience || false} onChange={(e) => setFormData({ ...formData, priorExperience: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                                  <label htmlFor="priorExperience" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}> Prior experience in study abroad?</label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </form>

                      <form onSubmit={handlePasswordUpdate} style={{ marginTop: '20px' }}>
                        <div className="profile-card full-width">
                          <h3 style={{ marginBottom: '15px', color: 'var(--text-main)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><KeyRound size={18} /> Security Settings</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div className="dash-input-group" style={{ gridColumn: '1 / -1' }}><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required className="dash-input" /></div>
                            <div className="dash-input-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="dash-input" /><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Must be 8+ chars, with upper, lower, number & special char.</span></div>
                            <div className="dash-input-group"><label>Confirm New Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="dash-input" /></div>
                            <div className="edit-actions" style={{ gridColumn: '1 / -1', marginTop: '5px' }}><button type="submit" className="btn-save" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Save size={16} /> Update Password</button></div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* FLOATING CHAT FAB - only for students */}
      {isStudent && (
        <>
          {/* Chat Popup */}
          {isChatOpen && (
            <div className="fab-chat-popup" style={{
              position: 'fixed', bottom: '90px', right: '24px', zIndex: 99998,
              width: '340px',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              boxShadow: '0 24px 60px -8px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              animation: 'chatPopIn 0.35s cubic-bezier(0.16,1,0.3,1)'
            }}>
              <style>{`
                @keyframes chatPopIn {
                  from { transform: scale(0.85) translateY(20px); opacity: 0; }
                  to   { transform: scale(1) translateY(0);       opacity: 1; }
                }
                .chat-quick-btn {
                  background: var(--input-bg);
                  border: 1px solid var(--glass-border);
                  color: var(--text-muted);
                  padding: 6px 12px;
                  border-radius: 20px;
                  font-size: 0.74rem;
                  cursor: pointer;
                  transition: all 0.2s;
                  white-space: nowrap;
                  flex-shrink: 0;
                  font-family: inherit;
                }
                .chat-quick-btn:hover {
                  background: rgba(0,71,171,0.2);
                  border-color: rgba(0,71,171,0.5);
                  color: var(--text-main);
                }
                .chat-bubble-student {
                  background: linear-gradient(135deg, #0047AB, #00D2FF);
                  color: #fff;
                  border-radius: 14px 14px 4px 14px;
                  padding: 8px 12px;
                  font-size: 0.82rem;
                  max-width: 82%;
                  align-self: flex-end;
                  line-height: 1.5;
                  word-break: break-word;
                  box-shadow: 0 2px 8px rgba(0,71,171,0.3);
                }
                .chat-bubble-admin {
                  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                  color: #fff;
                  border-radius: 14px 14px 14px 4px;
                  padding: 8px 12px;
                  font-size: 0.82rem;
                  max-width: 82%;
                  align-self: flex-start;
                  line-height: 1.5;
                  word-break: break-word;
                  box-shadow: 0 2px 8px rgba(109,40,217,0.3);
                }
                .chat-time-label {
                  font-size: 0.63rem;
                  color: var(--text-muted);
                  margin-top: 2px;
                }
                .fab-chat-input:focus {
                  border-color: #0047AB !important;
                  box-shadow: 0 0 0 3px rgba(0,71,171,0.15);
                  outline: none;
                }
              `}</style>

              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #0047AB, #0070d2)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={16} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>Chat with Admin</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.75)' }}>We'll reply as soon as possible</div>
                </div>
                <button
                  onClick={() => { setIsChatOpen(false); setActiveTab('notifications'); setShowMsgAlert(false); setAlertDismissed(true); }}
                  title="Open full chat"
                  style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', padding: '4px 9px', borderRadius: '7px', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, fontFamily: 'inherit' }}
                >
                  <ChevronRight size={12} /> Expand
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Messages area */}
              <div id="fab-chat-msgs" className="fab-chat-section" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '240px', overflowY: 'auto', minHeight: '80px' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '20px 0', lineHeight: '1.7' }}>
                    <MessageSquare size={26} style={{ opacity: 0.15, display: 'block', margin: '0 auto 8px' }} />
                    No messages yet.<br />Send one below!
                  </div>
                ) : (
                  chatMessages.map((m, i) => {
                    const isMe = m.sender === 'student';
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div
                          className={isMe ? 'chat-bubble-student' : 'chat-bubble-admin'}
                          dangerouslySetInnerHTML={{ __html: m.text }}
                        />
                        <div className="chat-time-label" style={{ alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                          {isMe ? 'You' : '🛡️ Admin'} · {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    );
                  })
                )}
                <div id="fab-chat-bottom" />
              </div>

              {/* Quick message chips — scrollable, no visible scrollbar */}
              <div className="fab-chat-section fab-chat-chips-wrap" style={{ borderTop: '1px solid var(--glass-border)', flexShrink: 0, position: 'relative' }}>
                <div className="fab-chat-chips" style={{ padding: '8px 14px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                  {['When is my consultation?', 'Need help with docs', 'Application update?', 'Please call me'].map(q => (
                    <button key={q} className="chat-quick-btn" onClick={() => setChatInput(q)}>{q}</button>
                  ))}
                </div>
                {/* Fade mask indicating more chips */}
                <div className="fab-chips-fade" />
              </div>

              {/* Input area */}
              <div className="fab-chat-section" style={{ display: 'flex', gap: '8px', padding: '8px 14px 12px', flexShrink: 0 }}>
                <input
                  className="fab-chat-input"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter' && !e.shiftKey && chatInput.trim()) {
                      e.preventDefault();
                      const text = chatInput.trim();
                      setChatInput('');
                      setChatSending(true);
                      try {
                        const res = await fetch(`${API_BASE_URL}/erp/my-messages`, {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                          body: JSON.stringify({ text })
                        });
                        if (res.ok) {
                          const updated = await fetch(`${API_BASE_URL}/erp/my-messages`, { credentials: 'include' });
                          if (updated.ok) setChatMessages(await updated.json());
                        }
                      } catch(err) {}
                      setChatSending(false);
                      setTimeout(() => document.getElementById('fab-chat-bottom')?.scrollIntoView({ behavior: 'smooth' }), 80);
                    }
                  }}
                  placeholder="Type a message… (Enter to send)"
                  style={{
                    flex: 1, background: 'var(--input-bg)', border: '1px solid var(--input-border)',
                    color: 'var(--text-main)', padding: '9px 13px', borderRadius: '10px',
                    fontSize: '0.85rem', fontFamily: 'inherit',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                />
                <button
                  disabled={!chatInput.trim() || chatSending}
                  onClick={async () => {
                    const text = chatInput.trim();
                    if (!text) return;
                    setChatInput('');
                    setChatSending(true);
                    try {
                      const res = await fetch(`${API_BASE_URL}/erp/my-messages`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                        body: JSON.stringify({ text })
                      });
                      if (res.ok) {
                        const updated = await fetch(`${API_BASE_URL}/erp/my-messages`, { credentials: 'include' });
                        if (updated.ok) setChatMessages(await updated.json());
                      }
                    } catch(err) {}
                    setChatSending(false);
                    setTimeout(() => document.getElementById('fab-chat-bottom')?.scrollIntoView({ behavior: 'smooth' }), 80);
                  }}
                  style={{
                    background: chatInput.trim() && !chatSending ? 'linear-gradient(135deg, #0047AB, #00D2FF)' : 'var(--input-bg)',
                    border: '1px solid var(--glass-border)',
                    color: chatInput.trim() && !chatSending ? '#fff' : 'var(--text-muted)',
                    width: '38px', height: '38px', borderRadius: '10px',
                    cursor: !chatInput.trim() || chatSending ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* FAB Button */}
          <button
            onClick={() => {
              const next = !isChatOpen;
              setIsChatOpen(next);
              if (next) {
                fetch(`${API_BASE_URL}/erp/my-messages`, { credentials: 'include' })
                  .then(r => r.ok ? r.json() : [])
                  .then(data => {
                    setChatMessages(data);
                    setTimeout(() => document.getElementById('fab-chat-bottom')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  })
                  .catch(() => {});
              }
            }}
            title="Chat with Admin"
            style={{
              position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999,
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0047AB, #00D2FF)',
              border: 'none', cursor: 'pointer', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0,71,171,0.5), 0 4px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
              transform: isChatOpen ? 'scale(0.92) rotate(15deg)' : 'scale(1)'
            }}
          >
            {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
            {!isChatOpen && unreadMsgCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '20px', height: '20px', background: '#ef4444',
                borderRadius: '50%', border: '2px solid var(--bg-primary)',
                fontSize: '0.6rem', fontWeight: 800, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>{unreadMsgCount > 9 ? '9+' : unreadMsgCount}</span>
            )}
            {!isChatOpen && unreadMsgCount === 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '14px', height: '14px', background: '#22c55e',
                borderRadius: '50%', border: '2px solid var(--bg-primary)',
                animation: 'pulse 2s infinite'
              }} />
            )}
          </button>
        </>
      )}

      {/* FLOATING ADMIN MESSAGE ALERT - bottom right corner */}
      {isStudent && showMsgAlert && !alertDismissed && latestAdminMsg && activeTab !== 'notifications' && (
        <div style={{
          position: 'fixed', bottom: '94px', right: '24px', zIndex: 99999,
          width: '320px', background: 'var(--card-bg-solid)',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: '16px', boxShadow: '0 20px 60px -10px rgba(139,92,246,0.4), 0 8px 30px rgba(0,0,0,0.3)',
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}>
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(120%); opacity: 0; }
              to   { transform: translateX(0);   opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            @keyframes pingDot {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          `}</style>

          {/* Purple accent bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #8b5cf6, #6d28d9, #4f46e5)' }} />

          {/* Alert header */}
          <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} color="#fff" />
              </div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--card-bg-solid)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>🛡️ Message from Admin</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {unreadMsgCount} new message{unreadMsgCount !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => { setShowMsgAlert(false); setAlertDismissed(true); }}
              style={{ background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Message preview */}
          <div style={{ margin: '0 16px 14px', padding: '10px 12px', background: 'rgba(139,92,246,0.08)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              &ldquo;{latestAdminMsg.text}&rdquo;
            </p>
          </div>

          {/* Action button */}
          <div style={{ padding: '0 16px 16px' }}>
            <button
              onClick={() => {
                setActiveTab('notifications');
                setShowMsgAlert(false);
                setAlertDismissed(true);
              }}
              style={{ width: '100%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              View Messages <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
