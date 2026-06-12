import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Search, Edit2, ShieldAlert, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/all`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateValidity = async () => {
    if (!editingCoupon || !newDate) return;
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${editingCoupon._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ validUntil: newDate })
      });
      if (res.ok) {
        setEditingCoupon(null);
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete coupon ${code}? This action cannot be undone.`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (res.ok) {
          fetchCoupons();
          setSelectedCoupons(prev => prev.filter(cId => cId !== id));
        } else {
          alert('Failed to delete coupon.');
        }
      } catch (e) {
        console.error(e);
        alert('An error occurred while deleting.');
      }
    }
  };

  const filtered = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCoupons(filtered.map(c => c._id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedCoupons.includes(id)) {
      setSelectedCoupons(selectedCoupons.filter(cId => cId !== id));
    } else {
      setSelectedCoupons([...selectedCoupons, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCoupons.length === 0) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to permanently delete ${selectedCoupons.length} coupons?`)) return;
      
      try {
        await Promise.all(selectedCoupons.map(id => fetch(`${API_BASE_URL}/coupons/${id}`, { method: 'DELETE', credentials: 'include' })));
        setSelectedCoupons([]);
        fetchCoupons();
      } catch (e) { console.error(e); }
    } else if (action === 'activate') {
      try {
        await Promise.all(selectedCoupons.map(id => fetch(`${API_BASE_URL}/coupons/${id}`, {
          method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: true })
        })));
        setSelectedCoupons([]);
        fetchCoupons();
      } catch (e) { console.error(e); }
    } else if (action === 'deactivate') {
      try {
        await Promise.all(selectedCoupons.map(id => fetch(`${API_BASE_URL}/coupons/${id}`, {
          method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: false })
        })));
        setSelectedCoupons([]);
        fetchCoupons();
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div style={{ padding: '24px', background: 'var(--card-bg-solid)', borderRadius: '20px', border: '1px solid var(--glass-border)', height: '100%', overflowY: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '1.6rem', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🎟️ Coupons Management
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>View and manage all unique student-generated discount coupons.</p>
        </div>
        <button
          onClick={fetchCoupons}
          style={{ background: 'var(--input-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </header>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by Coupon Code or Student Email..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 42px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)' }}
          />
        </div>
        
        {selectedCoupons.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--input-bg)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginRight: '8px', fontWeight: 600 }}>
              {selectedCoupons.length} selected
            </span>
            <button onClick={() => handleBulkAction('activate')} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14}/> Activate</button>
            <button onClick={() => handleBulkAction('deactivate')} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={14}/> Deactivate</button>
            <button onClick={() => handleBulkAction('delete')} style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14}/> Delete</button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading coupons...</div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px', width: '40px', borderBottom: '1px solid var(--glass-border)' }}>
                  <input type="checkbox" checked={selectedCoupons.length === filtered.length && filtered.length > 0} onChange={handleSelectAll} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }} />
                </th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Code</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Student Email</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Phone</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Generated On</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Valid Until</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Status</th>
                <th style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedCoupons.includes(c._id) ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px' }}>
                    <input type="checkbox" checked={selectedCoupons.includes(c._id)} onChange={() => handleSelectOne(c._id)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }} />
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{c.code}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>{c.userEmail}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>{c.phone || 'N/A'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', color: new Date(c.validUntil) < new Date() ? '#ef4444' : 'var(--text-main)' }}>
                    {new Date(c.validUntil).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {c.isActive ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '100px', fontSize: '0.85rem' }}>
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '100px', fontSize: '0.85rem' }}>
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleToggleStatus(c._id, c.isActive)}
                        style={{ background: c.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: c.isActive ? '#ef4444' : '#10b981', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCoupon(c);
                          const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
                          const localISOTime = (new Date(new Date(c.validUntil) - tzoffset)).toISOString().slice(0, -1);
                          setNewDate(localISOTime.substring(0, 16));
                        }}
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCoupon(c._id, c.code)}
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Delete Coupon"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No coupons found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Validity Modal */}
      {editingCoupon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', width: '400px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-main)' }}>Edit Validity: {editingCoupon.code}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Validity Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setEditingCoupon(null)}
                  style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '10px 16px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateValidity}
                  style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
