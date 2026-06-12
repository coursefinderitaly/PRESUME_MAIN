import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, User, MapPin, Globe, Phone, Smartphone, Edit2, Save, X,
  Home, Search, Users, Briefcase, FileText, Bell, MonitorPlay, Building2, CheckSquare, KeyRound,
  Sun, Moon, Monitor, Menu, UploadCloud, MessageSquare, ChevronRight, ChevronLeft, Camera, Trash2, CreditCard, Sparkles, Copy, Check
} from 'lucide-react';
import './Dashboard.css';
import { useTheme } from './ThemeContext';


import DashboardHome from './components/DashboardHome';
import PaymentTestingModal from './components/PaymentTestingModal';
import VerticalApplicationTracker from './components/VerticalApplicationTracker';
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
import PaymentHistory from './components/PaymentHistory';
import Subscriptions from './components/Subscriptions';
import CouponPage from './coupon_generator/coupon';
import { API_BASE_URL } from './config';

// ========================================================
// PORTAL LAYOUT CONFIGURATION: Tweak Sidebar, Canvas, and Journey Bar sizes here!
// (Layout is now natively responsive via flexbox alignment)
// ========================================================
export const PORTAL_LAYOUT_CONFIG = {
  // Left Side Panel (Sidebar) size controls
  sidebar: {
    widthExpanded: '250px',       // Width when open
    widthCollapsed: '80px',       // Width when closed
  },

  // Main Dashboard Canvas size controls
  mainCanvas: {
    maxWidth: 'none',             // Sizing: Max width constraint for ultra-wide screens
  },

  // Journey Progress Bar size controls
  journeyTracker: {
    width: '35px',                // Sizing: Width of the tracker bar
  }
};

const AnimatedBackground = ({ activeTheme }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: 'var(--true-vw, 100vw)', height: 'var(--true-vh, 100vh)', zIndex: -1, overflow: 'hidden', background: 'var(--bg-primary)', transition: 'background 0.5s ease' }}>

    {/* Light Theme Milky Auto-Moving Effect */}
    {activeTheme === 'light' && (
      <div className="bg-light-gradient" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0
      }} />
    )}

    {/* Dark Theme Space Auto-Moving Effect */}
    {activeTheme === 'dark' && (
      <div className="bg-dark-gradient" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0
      }} />
    )}

    {/* Subtle Grid Overlay */}
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.04, backgroundImage: 'linear-gradient(var(--text-main) 1px, transparent 1px), linear-gradient(90deg, var(--text-main) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', zIndex: 1 }} />

    {/* Glowing Orbs using HTML divs for perfect blur scaling */}
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: activeTheme === 'light' ? 'linear-gradient(135deg, rgba(186,230,253,1), rgba(125,211,252,1))' : 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.15))',
          filter: 'blur(120px)',
          opacity: activeTheme === 'light' ? 0.85 : 0.75,
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: ["0%", "20%", "-10%", "0%"],
          y: ["0%", "-15%", "10%", "0%"],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: activeTheme === 'light' ? 'linear-gradient(135deg, rgba(219,234,254,1), rgba(191,219,254,1))' : 'linear-gradient(135deg, rgba(226,232,240,0.2), rgba(148,163,184,0.1))',
          filter: 'blur(150px)',
          opacity: activeTheme === 'light' ? 0.8 : 0.7,
          bottom: '-20%',
          right: '-10%',
        }}
        animate={{
          x: ["0%", "-20%", "10%", "0%"],
          y: ["0%", "15%", "-10%", "0%"],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: activeTheme === 'light' ? 'linear-gradient(135deg, rgba(224,231,255,1), rgba(199,210,254,1))' : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))',
          filter: 'blur(110px)',
          opacity: activeTheme === 'light' ? 0.75 : 0.7,
          top: '30%',
          left: '30%',
        }}
        animate={{
          x: ["0%", "15%", "-15%", "0%"],
          y: ["0%", "15%", "-15%", "0%"],
          scale: [0.8, 1.1, 0.9, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    {/* Dynamic Floating Particles */}
    {Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 15 + 5;
      const startX = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -20;
      return (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '4px',
            background: activeTheme === 'light' ? 'rgba(180, 170, 150, 0.4)' : 'var(--accent-primary)',
            opacity: Math.random() * 0.3 + 0.1,
            left: `${startX}vw`,
            bottom: '-10vh',
            boxShadow: activeTheme === 'light' ? 'none' : '0 0 10px var(--accent-glow)'
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, 360],
            opacity: [0, Math.random() * 0.3 + 0.1, 0]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: 'linear',
            delay: delay
          }}
        />
      );
    })}
  </div>
);

const DesignerTag = ({ isSidebarOpen }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // easily control the label size here:
  const designerFontSize = '0.85rem';

  if (!isSidebarOpen || window.innerWidth <= 768) return null;

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: (e.clientX - rect.left - rect.width / 2) / 5, y: (e.clientY - rect.top - rect.height / 2) / 5 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{
        marginTop: 'auto', padding: '20px 0 10px 0', textAlign: 'center', fontSize: designerFontSize,
        color: 'var(--text-muted)', letterSpacing: '2px', opacity: 0.4, cursor: 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 0.1s ease-out',
        fontFamily: "'Rosemary', cursive", fontWeight: 700, letterSpacing: '1px'
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
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [themePopupOpen, setThemePopupOpen] = useState(false);

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

  // Coupon state
  const [showCoupon, setShowCoupon] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [couponCopied, setCouponCopied] = useState(false);

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
          } catch (e) { }
        } else {
          setUnreadMsgCount(data.unread);
          if (data.unread === 0) { setShowMsgAlert(false); setLatestAdminMsg(null); }
        }
      }
    } catch (err) { }
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

  const fetchMyCoupon = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/my-coupon`, {
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveCoupon(data.coupon);
      }
    } catch (err) { }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchStats();
      fetchMyCoupon();
    }
  }, [profile]);

  useEffect(() => {
    if (!activeCoupon) return;
    const interval = setInterval(() => {
      const validUntil = new Date(activeCoupon.validUntil).getTime();
      const now = new Date().getTime();
      const distance = validUntil - now;
      if (distance < 0) {
        clearInterval(interval);
        setActiveCoupon(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCoupon]);

  // Start polling for updates every 30 seconds
  useEffect(() => {
    if (profile) {
      pollUnreadMessages();
      const interval = setInterval(pollUnreadMessages, 30000);
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
      <motion.button
        className={`nav-item ${activeTab === id ? 'active' : ''} ${locked ? 'locked' : ''}`}
        title={label}
        whileHover={locked ? {} : { backgroundColor: activeTheme === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(251, 191, 36, 0.08)', scale: 1.02, borderRadius: '12px', boxShadow: activeTheme === 'light' ? '0 4px 15px rgba(37, 99, 235, 0.15)' : '0 4px 15px rgba(251, 191, 36, 0.15)', color: activeTheme === 'light' ? '#1e40af' : '#fcd34d' }}
        whileTap={locked ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => {
          if (locked) {
            setActiveTab('subscriptions');
            return;
          }
          setActiveTab(id);
          setMessage({ text: '', type: '' });
          setEditMode(false);
        }}
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: expanded ? '12px' : '0',
          padding: expanded ? '10px 14px' : '10px 0',
          width: '100%',
          borderRadius: '12px',
          border: 'none',
          background: 'transparent',
          color: activeTab === id ? (activeTheme === 'light' ? '#000' : '#fff') : (activeTheme === 'light' ? '#334155' : 'inherit'),
        }}
      >
        <Icon size={expanded ? 18 : 22} style={{ position: 'relative', zIndex: 2, color: activeTab === id ? 'var(--accent-primary)' : 'inherit' }} />
        {expanded && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', position: 'relative', zIndex: 2, fontWeight: activeTab === id ? 800 : 600 }}>{label}</span>}
        {locked && expanded && <span className="badge-soon" style={{ position: 'relative', zIndex: 2, background: 'rgba(245,158,11,0.2)', color: activeTheme === 'light' ? '#b45309' : '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800 }}>LOCKED</span>}

        {/* Active tab static indicator */}
        {activeTab === id && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: activeTheme === 'light' ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(255, 255, 255, 0) 100%)' : 'linear-gradient(90deg, rgba(251, 191, 36, 0.25) 0%, rgba(23, 23, 23, 0) 100%)',
              borderRadius: '12px',
              border: activeTheme === 'light' ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
              boxShadow: activeTheme === 'light' ? 'inset 4px 0 15px rgba(37, 99, 235, 0.1)' : 'inset 4px 0 15px rgba(251, 191, 36, 0.2)',
              zIndex: 0
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', background: activeTheme === 'light' ? '#2563eb' : '#fbbf24', borderRadius: '0 4px 4px 0', boxShadow: activeTheme === 'light' ? '0 0 10px #2563eb' : '0 0 10px #fbbf24' }} />
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <>
      <PaymentTestingModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={(response) => console.log('Payment unlocked via sidebar!', response)}
        userEmail={profile?.email}
      />
      <AnimatedBackground activeTheme={activeTheme} />
      <div className="dash-universe dash-container" style={{
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: '16px',
        gap: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        // --- GLOBAL PORTAL SCALE ---
        // Change the zoom value below to scale the entire student portal globally!
        zoom: 1,
      }}>

        {/* ================================== */}
        {/* FLOATING SIDEBAR PANEL             */}
        <motion.aside
          className={`dash-sidebar ${!expanded ? 'collapsed' : ''}`}
          initial={false}
          animate={{
            width: expanded ? PORTAL_LAYOUT_CONFIG.sidebar.widthExpanded : PORTAL_LAYOUT_CONFIG.sidebar.widthCollapsed,
          }}
          transition={{
            type: "tween",
            ease: [0.16, 1, 0.3, 1],
            duration: 0.6
          }}
          style={{
            position: 'relative',
            height: '100%',
            flexShrink: 0,
            zIndex: 100,
          }}
        >
          {/* Inner Wrapper for Clipping */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '24px' }}>

            {/* Animated Background Orbs for Sidebar */}
            <motion.div
              animate={{ y: [0, -60, 0], opacity: [0.02, 0.08, 0.02], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '10%', left: '-20%', width: '150px', height: '150px', background: 'var(--accent-primary)', filter: 'blur(40px)', borderRadius: '50%', zIndex: 0 }}
            />
            <motion.div
              animate={{ y: [0, 80, 0], opacity: activeTheme === 'light' ? [0.01, 0.03, 0.01] : [0.02, 0.05, 0.02], x: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '20%', right: '-30%', width: '200px', height: '200px', background: activeTheme === 'light' ? 'rgba(180, 170, 150, 0.5)' : 'var(--accent-secondary)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }}
            />

            {/* Sidebar Header / Logo */}
            <div style={{ position: 'relative', zIndex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden', background: 'transparent' }}>
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
                  <span style={{ fontWeight: 900, color: activeTheme === 'light' ? '#000000' : 'var(--text-main)', fontSize: '0.7rem', whiteSpace: 'nowrap', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.9 }}>PRESUME</span>
                  <span style={{ fontWeight: 600, color: activeTheme === 'light' ? '#334155' : 'var(--accent-secondary)', fontSize: '0.55rem', whiteSpace: 'nowrap', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                    {isStudent ? 'Student Portal' : isPartner ? 'Partner Portal' : isCounselor ? 'Counselor Portal' : 'Freelancer Portal'}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Navigation Items */}
            <div
              className="sidebar-nav"
              style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto' }}
            >
              <style>{`.sidebar-nav::-webkit-scrollbar { display: none; }`}</style>

              <NavButton id="home" icon={Home} label="Dashboard" />

              {isStudent && (
                <>
                  <NavButton id="course-finder" icon={Search} label="Search Programs" />
                  <NavButton id="subscriptions" icon={Sparkles} label="Our Services" />
                  <NavButton id="applications" icon={FileText} label="Applications" locked={!profile.portalUnlocked} />
                  <NavButton id="applied-universities" icon={CheckSquare} label="Track Status" locked={!profile.portalUnlocked} />
                  <NavButton id="learning" icon={MonitorPlay} label="Learning Hub" locked={!profile.portalUnlocked} />
                  <NavButton id="notifications" icon={Bell} label="Notifications" locked={!profile.portalUnlocked} />
                </>
              )}

              {(isPartner || isCounselor || isFreelancer) && (
                <>
                  <NavButton id="register-student" icon={User} label="Register New" />
                  <NavButton id="students-list" icon={Users} label="My Students" />
                  <NavButton id="course-finder" icon={Search} label="Prog. Finder" />
                  <NavButton id="partner-applications" icon={FileText} label="Applications" />
                  <NavButton id="student-documents" icon={UploadCloud} label="Doc Vault" />
                  {isPartner && <NavButton id="counselors" icon={Briefcase} label="Manage Team" />}
                  <NavButton id="notifications" icon={Bell} label="Notifications" locked={isStudent ? !profile.portalUnlocked : false} />
                </>
              )}

              <NavButton id="payments" icon={CreditCard} label="Billing and Payments" />
              <NavButton id="profile" icon={User} label="Account Profile" />
            </div>

            {/* Sidebar Footer: Theme & Profile */}
            <div style={{
              padding: expanded ? '12px 16px' : '12px 8px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'transparent',
              alignItems: 'center'
            }}>

              {/* Theme Toggle */}
              <div style={{ position: 'relative', width: '100%' }}>
                {expanded ? (
                  <div style={{
                    display: 'flex',
                    background: 'var(--bg-tertiary)',
                    padding: '2px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                    <button onClick={() => setTheme('light')} style={{ flex: 1, background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Light Mode"><Sun size={14} /></button>
                    <button onClick={() => setTheme('dark')} style={{ flex: 1, background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Dark Mode"><Moon size={14} /></button>
                    <button onClick={() => setTheme('system')} style={{ flex: 1, background: theme === 'system' ? 'var(--accent-primary)' : 'transparent', color: theme === 'system' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="System Auto"><Monitor size={14} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => setThemePopupOpen(!themePopupOpen)} style={{ background: 'var(--bg-tertiary)', color: theme === 'light' ? '#f59e0b' : theme === 'dark' ? '#A855F7' : '#38bdf8', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Change Theme">
                      {theme === 'light' ? <Sun size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Monitor size={16} />}
                    </button>

                  </div>
                )}
              </div>

              {/* Profile Brief (Centered Row) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: expanded ? '12px' : '0',
                padding: '4px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                justifyContent: expanded ? 'flex-start' : 'center',
                width: '100%'
              }}>
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
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: activeTheme === 'light' ? '#000000' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}>{profile.firstName} {profile.lastName}</div>
                    <div style={{ fontSize: '0.6rem', color: activeTheme === 'light' ? '#334155' : 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profile.role}</div>
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
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                )}
              </div>

              {!expanded && (
                <button
                  onClick={handleLogout}
                  className="logout-btn-footer"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none',
                    padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '36px', height: '36px'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
            {/* End Inner Wrapper */}
          </div>

          {/* Theme Popup (Placed outside innerWrapper so it escapes overflow: hidden) */}
          <AnimatePresence>
            {!expanded && themePopupOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 16px)',
                  bottom: '72px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              >
                <button onClick={() => { setTheme('light'); setThemePopupOpen(false); }} style={{ background: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'transparent', color: theme === 'light' ? '#f59e0b' : '#94A3B8', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}><Sun size={14} /> Light</button>
                <button onClick={() => { setTheme('dark'); setThemePopupOpen(false); }} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'transparent', color: theme === 'dark' ? '#A855F7' : '#94A3B8', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}><Moon size={14} /> Dark</button>
                <button onClick={() => { setTheme('system'); setThemePopupOpen(false); }} style={{ background: theme === 'system' ? 'rgba(255,255,255,0.1)' : 'transparent', color: theme === 'system' ? '#38bdf8' : '#94A3B8', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}><Monitor size={14} /> System</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manual Toggle Button (Floating Circle) */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsSidebarExpanded(!isSidebarExpanded); }}
            style={{
              position: 'absolute', top: '50%', right: '-14px',
              transform: 'translateY(-50%)',
              width: '28px', height: '28px', borderRadius: '50%',
              background: activeTheme === 'light' ? '#ffffff' : 'rgba(15, 23, 42, 0.95)',
              border: activeTheme === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(99, 102, 241, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 101,
              boxShadow: activeTheme === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 0 10px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: activeTheme === 'light' ? 'var(--accent-primary)' : '#38bdf8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.borderColor = activeTheme === 'light' ? 'var(--accent-secondary)' : '#38bdf8';
              e.currentTarget.style.boxShadow = activeTheme === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.12)' : '0 0 14px rgba(56, 189, 248, 0.4), 0 4px 12px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.borderColor = activeTheme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(99, 102, 241, 0.35)';
              e.currentTarget.style.boxShadow = activeTheme === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 0 10px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0,0,0,0.3)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </div>
          </button>
        </motion.aside>

        {/* ================================== */}
        {/* MAIN DASHBOARD CONTENT AREA        */}
        {/* ================================== */}
        <main className="dash-main" style={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          height: '100%',
          maxWidth: PORTAL_LAYOUT_CONFIG.mainCanvas.maxWidth,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
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
            position: 'relative',
            flex: 1,
            padding: '16px',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: (activeTab === 'home' || activeTab === 'applications' || activeTab === 'course-finder' || activeTab === 'students-list' || activeTab === 'profile' || activeTab === 'subscriptions') ? 'hidden' : 'auto',
            overflowX: 'hidden'
          }}>
            {/* Ambient Animated Orbs behind Middle Canvas */}
            <motion.div
              animate={{ x: [-40, 40, -40], y: [-20, 20, -20], scale: [1, 1.3, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: activeTheme === 'light' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(56, 189, 248, 0.1)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}
            />
            <motion.div
              animate={{ x: [40, -40, 40], y: [20, -20, 20], scale: [1, 1.5, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: activeTheme === 'light' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}
            />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {message.text && (
                <div className={`dash-message ${message.type}`} style={{ padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: message.type === 'error' ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                  {message.text}
                </div>
              )}

              <AnimatePresence>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30, x: 10, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, x: -10, scale: 0.96, filter: 'blur(8px)', position: 'absolute', width: '100%' }}
                  transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
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
                      handleAvatarUpload={handleAvatarUpload}
                      avatarUploading={avatarUploading}
                      setShowCoupon={setShowCoupon}
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
                  {activeTab === 'payments' && <PaymentHistory userEmail={profile?.email} profile={profile} refreshProfile={fetchProfile} />}
                  {activeTab === 'course-finder' && (
                    <SearchProgram preselectedUnis={pendingApplications} onProceed={(selected) => { setPendingApplications(selected); if (isPartner || isCounselor || isFreelancer) { setActiveTab('students-list'); } else { setActiveTab('applications'); } }} />
                  )}
                  {activeTab === 'subscriptions' && (
                    <Subscriptions profile={profile} refreshProfile={fetchProfile} />
                  )}

                  {activeTab === 'profile' && (
                    <>
                      {!editMode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100%', overflowY: 'auto', paddingRight: '8px', paddingBottom: '30px' }}>
                          {/* Top Hero Card: Spans full width */}
                          <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: '30px', padding: '30px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '120px', height: '120px', borderRadius: '30px', overflow: 'hidden', border: '4px solid var(--accent-glow)', background: 'linear-gradient(135deg,#fbbf24,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(217,119,6,0.3)' }}>
                                {profile.avatarUrl
                                  ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <span style={{ color: '#fff', fontSize: '3rem', fontWeight: 800 }}>{(profile.firstName || 'U')[0].toUpperCase()}</span>
                                }
                              </div>
                              {avatarUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>Saving…</span></div>}
                            </div>

                            <div style={{ flex: '1 1 300px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, textTransform: 'capitalize', letterSpacing: '-0.5px' }}>{profile.firstName} {profile.lastName}</h2>
                                <span style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.2)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{profile.role}</span>
                              </div>
                              <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{profile.email}</p>

                              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Member Since</div>
                                  <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>{new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                                  <div style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 700 }}>Active / Verified</div>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
                              <label htmlFor="profile-avatar-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '12px', padding: '10px 16px', fontSize: '0.8rem', fontWeight: 700, cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.6 : 1, transition: 'all 0.2s' }}>
                                <Camera size={14} /> Upload Avatar
                              </label>
                              {profile.avatarUrl && (
                                <button
                                  type="button"
                                  onClick={handleRemoveAvatar}
                                  disabled={avatarUploading}
                                  style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                  <Trash2 size={14} /> Remove Photo
                                </button>
                              )}
                            </div>
                            <input id="profile-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={avatarUploading} />
                          </div>

                          {/* Bottom Grid: 3 Columns, uses all available left/right space */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>

                            {/* Col 1: Geospatial */}
                            <div className="profile-card" style={{ display: 'flex', flexDirection: 'column' }}>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                                <Globe size={18} style={{ color: '#fbbf24' }} /> Location Details
                              </h3>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Country</span><span className="value" style={{ fontWeight: 700 }}>{profile.country || 'N/A'}</span></div>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>State / Region</span><span className="value" style={{ fontWeight: 700 }}>{profile.state || 'N/A'}</span></div>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>City</span><span className="value" style={{ fontWeight: 700 }}>{profile.city || 'N/A'}</span></div>
                              </div>
                            </div>

                            {/* Col 2: Communication */}
                            <div className="profile-card" style={{ display: 'flex', flexDirection: 'column' }}>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                                <Phone size={18} style={{ color: '#fbbf24' }} /> Contact Details
                              </h3>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Direct Phone</span><span className="value" style={{ fontWeight: 700 }}>{profile.phoneCode} {profile.phone || 'N/A'}</span></div>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>WhatsApp</span><span className="value" style={{ fontWeight: 700 }}>{profile.whatsapp ? `${profile.whatsappCode} ${profile.whatsapp}` : 'Not Linked'}</span></div>
                                <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Account Status</span><span className="value" style={{ color: '#10b981', fontWeight: 700 }}>Verified Candidate</span></div>
                              </div>
                            </div>

                            {/* Col 3: Credentials */}
                            <div className="profile-card" style={{ display: 'flex', flexDirection: 'column' }}>
                              {isPartner ? (
                                <>
                                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                                    <Building2 size={18} style={{ color: '#fbbf24' }} /> Business Profile
                                  </h3>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Company</span><span className="value" style={{ fontWeight: 700 }}>{profile.companyName || 'N/A'}</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Designation</span><span className="value" style={{ fontWeight: 700 }}>{profile.designation || 'N/A'}</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team Size</span><span className="value" style={{ fontWeight: 700 }}>{profile.teamSize || 'N/A'}</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Prior Experience</span><span className="value" style={{ fontWeight: 700 }}>{profile.priorExperience ? 'Yes' : 'No'}</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>HQ Address</span><span className="value" style={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right' }}>{profile.companyAddress || 'N/A'}</span></div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                                    <KeyRound size={18} style={{ color: '#fbbf24' }} /> Student Credentials
                                  </h3>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student ID</span><span className="value" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{profile.studentUniqueId || 'PENDING'}</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Access Level</span><span className="value" style={{ fontWeight: 700, color: '#fbbf24' }}>Standard Student</span></div>
                                    <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Portal Unlock</span><span className="value" style={{ color: profile.portalUnlocked ? '#10b981' : '#ef4444', fontWeight: 700 }}>{profile.portalUnlocked ? 'Unlocked' : 'Locked'}</span></div>
                                  </div>
                                </>
                              )}
                            </div>

                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100%', overflowY: 'auto', paddingRight: '8px', paddingBottom: '30px' }}>
                          {/* Top Card: Identity Editing */}
                          <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> Account Identity</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', width: '100%' }}>
                              <div className="dash-input-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required className="dash-input" /></div>
                              <div className="dash-input-group"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="dash-input" /></div>
                              <div className="dash-input-group"><label>Email Address</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="dash-input" /></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Basic identity details used for communications, notifications, and invoicing.</p>
                          </div>

                          {/* Middle Grid: Location, Communication, Business/Student */}
                          <form id="profile-update-form" onSubmit={handleUpdate} style={{ display: 'contents' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
                              {/* Card 1: Location details */}
                              <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '4px' }}>
                                  <Globe size={18} style={{ color: '#fbbf24' }} /> Location Details
                                </h3>
                                <div className="dash-input-group"><label>Country</label><input type="text" name="country" value={formData.country || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>State</label><input type="text" name="state" value={formData.state || ''} onChange={handleChange} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>City</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} required className="dash-input" /></div>
                              </div>

                              {/* Card 2: Communication */}
                              <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '4px' }}>
                                  <Phone size={18} style={{ color: '#fbbf24' }} /> Communication
                                </h3>
                                <div className="dash-input-group"><label>Phone Number *</label><input type="tel" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 10) })} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>WhatsApp Number</label><input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.slice(0, 10) })} className="dash-input" /></div>
                              </div>

                              {/* Card 3: Business/Student details depending on Role */}
                              <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {isPartner ? (
                                  <>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '4px' }}>
                                      <Building2 size={18} style={{ color: '#fbbf24' }} /> Business Profile
                                    </h3>
                                    <div className="dash-input-group"><label>Company Name</label><input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} required className="dash-input" /></div>
                                    <div className="dash-input-group"><label>Team Size</label><input type="text" name="teamSize" value={formData.teamSize || ''} onChange={handleChange} required className="dash-input" /></div>
                                    <div className="dash-input-group"><label>Designation</label><input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} required className="dash-input" /></div>
                                    <div className="dash-input-group"><label>Company Address</label><input type="text" name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} required className="dash-input" /></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '5px' }}>
                                      <input type="checkbox" name="priorExperience" id="priorExperience" checked={formData.priorExperience || false} onChange={(e) => setFormData({ ...formData, priorExperience: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                                      <label htmlFor="priorExperience" style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-main)', margin: 0 }}> Prior experience in study abroad?</label>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '4px' }}>
                                      <KeyRound size={18} style={{ color: '#fbbf24' }} /> Student Profile
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
                                      <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student ID</span><span className="value" style={{ fontWeight: 700, letterSpacing: '0.1em' }}>{profile.studentUniqueId || 'PENDING'}</span></div>
                                      <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Access Status</span><span className="value" style={{ fontWeight: 700, color: '#10b981' }}>Active</span></div>
                                      <div className="data-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Portal Verification</span><span className="value" style={{ color: profile.portalUnlocked ? '#10b981' : '#ef4444', fontWeight: 700 }}>{profile.portalUnlocked ? 'Unlocked' : 'Pending Verification'}</span></div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%', marginTop: '10px' }}>
                              <button type="submit" form="profile-update-form" className="btn-save" style={{ background: '#fbbf24', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(251,191,36,0.3)' }}><Save size={16} /> Save Profile Changes</button>
                            </div>
                          </form>

                          {/* Security Settings Section (Password update) */}
                          <form onSubmit={handlePasswordUpdate} style={{ width: '100%', marginTop: '10px' }}>
                            <div className="profile-card">
                              <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}><KeyRound size={18} style={{ color: '#fbbf24' }} /> Security & Credentials</h3>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                <div className="dash-input-group" style={{ gridColumn: '1 / -1' }}><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required className="dash-input" /></div>
                                <div className="dash-input-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="dash-input" /><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Must be 8+ chars, with upper, lower, number & special char.</span></div>
                                <div className="dash-input-group"><label>Confirm New Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="dash-input" /></div>
                                <div className="edit-actions" style={{ gridColumn: '1 / -1', marginTop: '5px', display: 'flex', justifyContent: 'flex-end' }}><button type="submit" className="btn-save" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.2)' }}><Save size={16} /> Update Password</button></div>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
        {isStudent && <VerticalApplicationTracker profile={profile} sidebarExpanded={expanded} />}
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
                      } catch (err) { }
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
                    } catch (err) { }
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
          <motion.button
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
                  .catch(() => { });
              }
            }}
            title="Chat with Admin"
            animate={{
              scale: isChatOpen ? 0.92 : 1,
              rotate: isChatOpen ? 15 : 0
            }}
            whileHover={{
              scale: isChatOpen ? 0.98 : 1.15,
              rotate: isChatOpen ? 5 : -10,
              boxShadow: '0 12px 35px rgba(0,210,255,0.6), 0 4px 15px rgba(0,71,171,0.4)'
            }}
            whileTap={{ scale: 0.85, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            style={{
              position: 'fixed', bottom: '24px', right: '11px', zIndex: 99999,
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0047AB, #00D2FF)',
              border: 'none', cursor: 'pointer', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0,71,171,0.5), 0 4px 10px rgba(0,0,0,0.3)',
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
          </motion.button>


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

      {/* COUPON GENERATOR MODAL */}
      <AnimatePresence>
        {showCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CouponPage
              onClose={() => setShowCoupon(false)}
              defaultName={profile?.firstName ? `${profile.firstName} ${profile.lastName}` : ''}
              defaultEmail={profile?.email || ''}
              onGenerateSuccess={(coupon) => setActiveCoupon(coupon)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING COUPON TIMER */}
      <AnimatePresence>
        {activeCoupon && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '80px',
              zIndex: 9999,
              background: activeTheme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: activeTheme === 'light' ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '30px',
              padding: '6px 6px 6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: activeTheme === 'light' ? '0 4px 20px rgba(245, 158, 11, 0.15)' : '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={14} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px' }}>{activeCoupon.code}</div>
              <div style={{ height: '12px', width: '1px', background: 'var(--glass-border)' }} />
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeCoupon.code);
                  setCouponCopied(true);
                  setTimeout(() => setCouponCopied(false), 2000);
                }}
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: 'none',
                  color: '#f59e0b',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '4px',
                  transition: 'all 0.2s ease'
                }}
                title="Copy Coupon"
              >
                {couponCopied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
