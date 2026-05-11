import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, User, MapPin, Globe, Phone, Smartphone, Edit2, Save, X,
  Home, Search, Users, Briefcase, FileText, Bell, MonitorPlay, Building2, CheckSquare, KeyRound,
  Sun, Moon, Monitor, Menu, UploadCloud, MessageSquare, ChevronRight, Camera, Trash2
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

  // Improved Sidebar Link Generator
  const NavButton = ({ id, icon: Icon, label, isBadge = false, count = 0 }) => {
    const isActive = activeTab === id;
    return (
      <button
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          setActiveTab(id);
          setMessage({ text: '', type: '' });
          setEditMode(false);
          if (isBadge) { setShowMsgAlert(false); setAlertDismissed(true); }
        }}
        title={!isSidebarLocked && !isSidebarOpen ? label : ''}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Icon size={18} />
          {isBadge && count > 0 && (
            <span style={{ 
              position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', 
              borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, 
              animation: 'pulse 2s infinite', boxShadow: '0 0 8px rgba(239,68,68,0.5)' 
            }}>
              {count > 9 ? '9+' : count}
            </span>
          )}
        </div>
        <span className="nav-label" style={{
          opacity: (!isSidebarLocked && !isSidebarOpen) ? 0 : 1,
          transition: 'opacity 0.2s',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
      </button>
    );
  };

  // Dynamic Sidebar width calculation
  const sidebarWidth = isSidebarLocked ? '260px' : (isSidebarOpen ? '260px' : '76px');
  const isSidebarActuallyCollapsed = !isSidebarLocked && !isSidebarOpen;

  return (
    <div className="dash-universe">
      {/* Antigravity Dynamic Animated Backdrop Layers */}
      <div className="dash-bg">
        <div className="dash-grid"></div>
        <div className="dash-particles"></div>
        <div className="dash-blob"></div>
      </div>

      <div className="dash-container" style={{ display: 'flex', height: '100vh', width: '100%', padding: '1rem', gap: '1rem', boxSizing: 'border-box' }}>
        
        {/* 🛸 FLOATING DOCKER SIDEBAR */}
        <aside 
          className={`dash-sidebar ${isSidebarActuallyCollapsed ? 'collapsed' : ''}`}
          onMouseEnter={() => { if (!isSidebarLocked) setIsSidebarOpen(true); }}
          onMouseLeave={() => { if (!isSidebarLocked) setIsSidebarOpen(false); }}
          style={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Lock Toggle Icon */}
          <button 
            onClick={() => setIsSidebarLocked(!isSidebarLocked)}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text-dim)', opacity: isSidebarActuallyCollapsed ? 0 : 0.6,
              transition: 'opacity 0.2s'
            }}
            title={isSidebarLocked ? "Click to float sidebar" : "Click to lock sidebar"}
          >
            <Menu size={16} />
          </button>

          {/* Sidebar Brand Logo */}
          <div className="sidebar-brand" style={{ paddingBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: '32px', width: '32px', minWidth: '32px', objectFit: 'contain', filter: activeTheme === 'light' ? 'invert(1) hue-rotate(180deg) contrast(1.2)' : 'none' }}
            />
            <div className="nav-label" style={{ opacity: isSidebarActuallyCollapsed ? 0 : 1, transition: 'opacity 0.2s', minWidth: 0 }}>
              <h2>{isPartner ? 'Partner' : isCounselor ? 'Counselor' : isFreelancer ? 'Freelancer' : 'Student'}</h2>
              <span className="portal-badge" style={{ fontSize: '0.6rem', opacity: 0.6 }}>Secured Portal</span>
            </div>
          </div>

          {/* Scrollable Sidebar Navigation Stack */}
          <nav className="sidebar-nav" style={{ marginTop: '0.5rem' }}>
            <NavButton id="home" icon={Home} label="Dashboard Overview" />
            <div className="nav-divider" />
            
            {isStudent && (
              <>
                <NavButton id="course-finder" icon={Search} label="Search Programs" />
                <NavButton id="applications" icon={FileText} label="My Applications" />
                <NavButton id="applied-universities" icon={CheckSquare} label="Track Status" />
                <NavButton id="learning" icon={MonitorPlay} label="Learning Hub" />
                <NavButton id="notifications" icon={Bell} label="Alerts" isBadge={true} count={unreadMsgCount} />
              </>
            )}

            {isPartner && (
              <>
                <NavButton id="register-student" icon={User} label="Register New" />
                <NavButton id="students-list" icon={Users} label="My Students" />
                <NavButton id="course-finder" icon={Search} label="Program Finder" />
                <NavButton id="partner-applications" icon={FileText} label="Track Records" />
                <NavButton id="student-documents" icon={UploadCloud} label="Doc Vault" />
                <NavButton id="learning" icon={MonitorPlay} label="Resources" />
                <NavButton id="notifications" icon={Bell} label="Alerts" />
                <NavButton id="counselors" icon={Briefcase} label="Manage Team" />
              </>
            )}

            {isCounselor && (
              <>
                <NavButton id="register-student" icon={User} label="Register New" />
                <NavButton id="students-list" icon={Users} label="Student List" />
                <NavButton id="course-finder" icon={Search} label="Finder" />
                <NavButton id="partner-applications" icon={FileText} label="Track Apps" />
                <NavButton id="student-documents" icon={UploadCloud} label="Doc Vault" />
              </>
            )}

            {isFreelancer && (
              <>
                <NavButton id="register-student" icon={User} label="Register New" />
                <NavButton id="students-list" icon={Users} label="Clients" />
                <NavButton id="course-finder" icon={Search} label="Finder" />
                <NavButton id="partner-applications" icon={FileText} label="Applications" />
                <NavButton id="student-documents" icon={UploadCloud} label="Docs" />
              </>
            )}

            <div className="nav-divider" />
            <NavButton id="profile" icon={User} label="Account Profile" />
          </nav>

          {/* Sidebar Footer Widget Area (Theme, User info, Logout) */}
          <div className="sidebar-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Elegant Theme Toggle Pillar */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(255,255,255,0.03)', 
              padding: '4px', 
              borderRadius: '10px', 
              border: '1px solid var(--glass-border)',
              justifyContent: isSidebarActuallyCollapsed ? 'center' : 'space-between',
              alignItems: 'center'
            }}>
              <button onClick={() => setTheme('light')} style={{ background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', flex: isSidebarActuallyCollapsed ? 'none' : 1, display: 'flex', justifyContent: 'center' }} title="Light Mode"><Sun size={14} /></button>
              <button onClick={() => setTheme('dark')} style={{ background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', flex: isSidebarActuallyCollapsed ? 'none' : 1, display: 'flex', justifyContent: 'center' }} title="Dark Mode"><Moon size={14} /></button>
              {!isSidebarActuallyCollapsed && <button onClick={() => setTheme('system')} style={{ background: theme === 'system' ? 'var(--accent-primary)' : 'transparent', color: theme === 'system' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'center' }} title="System Auto"><Monitor size={14} /></button>}
            </div>

            {/* Mini User Identification Cell */}
            <div className="sidebar-user">
              <div className="avatar">
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt="U" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{(profile.firstName || 'U')[0].toUpperCase()}</span>
                }
              </div>
              <div className="user-info nav-label" style={{ opacity: isSidebarActuallyCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
                <div className="name">{profile.firstName} {profile.lastName || ''}</div>
                <div className="role">{isPartner ? profile.companyName || 'Partner' : 'Authenticated'}</div>
              </div>
            </div>

            {/* Integrated Session Termination */}
            <button
              onClick={handleLogout}
              className="nav-item logout-btn"
              style={{ justifyContent: isSidebarActuallyCollapsed ? 'center' : 'flex-start' }}
            >
              <LogOut size={16} />
              <span className="nav-label" style={{ opacity: isSidebarActuallyCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* 💻 MAIN CANVAS CONTAINER */}
        <main className="dash-main" style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Contextual Breadcrumb/Header Bar */}
          <header style={{ 
             padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', 
             display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 
          }}>
             <div>
               <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                 {activeTab.replace(/-/g, ' ')}
               </h2>
               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Welcome back, {profile.firstName}</p>
             </div>
          </header>
          {activeTab === 'profile' && (
            <header className="dash-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
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
                  <div className="profile-grid">
                    <div className="profile-card full-width" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 15px' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(167,139,250,0.5)', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(167,139,250,0.3)' }}>
                          {profile.avatarUrl
                            ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{(profile.firstName || 'U')[0].toUpperCase()}</span>
                          }
                        </div>
                        {avatarUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>Saving…</span></div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Profile Photo</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Auto-compressed storage active</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label htmlFor="profile-avatar-input" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.6 : 1 }}>
                            <Camera size={12} /> Change
                          </label>
                          {profile.avatarUrl && (
                            <button 
                              type="button"
                              onClick={handleRemoveAvatar}
                              disabled={avatarUploading}
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                        <input id="profile-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={avatarUploading} />
                      </div>
                    </div>

                    <div className="profile-card">
                      <h3>Core Identification</h3>
                      <div className="data-row"><span className="label">Full Name</span><span className="value">{profile.firstName} {profile.lastName || ''}</span></div>
                      <div className="data-row"><span className="label">Email Address</span><span className="value">{profile.email}</span></div>
                    </div>
                    <div className="profile-card">
                      <h3>Geospatial Data</h3>
                      <div className="data-row"><Globe size={16} className="data-icon" /><div><span className="label">Country</span><span className="value">{profile.country}</span></div></div>
                      <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">State / Region</span><span className="value">{profile.state}</span></div></div>
                      <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">City</span><span className="value">{profile.city}</span></div></div>
                    </div>
                    <div className={`profile-card ${!isPartner ? 'full-width' : ''}`}>
                      <h3>Contact Details</h3>
                      <div className="data-row"><Phone size={16} className="data-icon" /><div><span className="label">Phone</span><span className="value">{profile.phoneCode} {profile.phone}</span></div></div>
                      <div className="data-row"><Smartphone size={16} className="data-icon" /><div><span className="label">WhatsApp</span><span className="value">{profile.whatsapp ? `${profile.whatsappCode} ${profile.whatsapp}` : 'Not Configured'}</span></div></div>
                    </div>

                    {isPartner && (
                      <div className="profile-card">
                        <h3>Business Details</h3>
                        <div className="data-row"><Building2 size={16} className="data-icon" /><div><span className="label">Company Name</span><span className="value">{profile.companyName || 'N/A'}</span></div></div>
                        <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">Company Address</span><span className="value">{profile.companyAddress || 'N/A'}</span></div></div>
                        <div className="data-row"><Users size={16} className="data-icon" /><div><span className="label">Team Size</span><span className="value">{profile.teamSize || 'N/A'}</span></div></div>
                        <div className="data-row"><Briefcase size={16} className="data-icon" /><div><span className="label">Designation</span><span className="value">{profile.designation || 'N/A'}</span></div></div>
                        <div className="data-row"><KeyRound size={16} className="data-icon" /><div><span className="label">Student Unique ID</span><span className="value">{profile.studentUniqueId || 'N/A'}</span></div></div>
                        <div className="data-row"><CheckSquare size={16} className="data-icon" /><div><span className="label">Prior Experience</span><span className="value">{profile.priorExperience ? 'Yes' : 'No'}</span></div></div>
                      </div>
                    )}
                  </div>
                  </div>
                ) : (
                  <div className="profile-page-wrap">
                    <form onSubmit={handleUpdate} className="edit-form-grid">
                      <div className="profile-card full-width edit-card">
                        <div className="dash-input-group"><label>Email Address</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="dash-input" /></div>
                        <div className="dash-input-group"><label>Country</label><input type="text" name="country" value={formData.country || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>State</label><input type="text" name="state" value={formData.state || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>City</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>Phone Number *</label><input type="tel" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 10) })} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>WhatsApp Number</label><input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.slice(0, 10) })} className="dash-input" /></div>
                        
                        {isPartner && (
                          <>
                            <div className="dash-input-group"><label>Company Name</label><input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="dash-input-group"><label>Company Address</label><input type="text" name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="dash-input-group"><label>Team Size</label><input type="text" name="teamSize" value={formData.teamSize || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="dash-input-group"><label>Designation</label><input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} required className="dash-input" /></div>
                            <div className="input-group col-span-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', gridColumn: '1 / -1' }}>
                              <input type="checkbox" name="priorExperience" id="priorExperience" checked={formData.priorExperience || false} onChange={(e) => setFormData({ ...formData, priorExperience: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                              <label htmlFor="priorExperience" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}> Prior experience in study abroad?</label>
                            </div>
                          </>
                        )}
                        <div className="edit-actions" style={{ gridColumn: '1 / -1', marginTop: '15px' }}><button type="submit" className="btn-save" style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Save size={16} /> Save Changes</button></div>
                      </div>
                    </form>
                    <form onSubmit={handlePasswordUpdate} className="edit-form-grid" style={{ marginTop: '20px' }}>
                      <div className="profile-card full-width edit-card">
                        <h3 style={{ gridColumn: '1 / -1', marginBottom: '15px', color: 'var(--text-main)', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><KeyRound size={18} /> Security Settings</h3>
                        <div className="dash-input-group" style={{ gridColumn: '1 / -1' }}><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required className="dash-input" /></div>
                        <div className="dash-input-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="dash-input" /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Must be 8+ chars, with upper, lower, number & special char.</span></div>
                        <div className="dash-input-group"><label>Confirm New Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="dash-input" /></div>
                        <div className="edit-actions" style={{ gridColumn: '1 / -1', marginTop: '15px' }}><button type="submit" className="btn-save" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Save size={16} /> Update Password</button></div>
                      </div>
                    </form>
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
    </div>
  );
};

export default Dashboard;
