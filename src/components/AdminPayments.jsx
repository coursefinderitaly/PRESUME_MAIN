import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt, CheckCircle, XCircle, Clock, CreditCard,
  ShieldCheck, ShieldOff, RefreshCw, User, Download, Search
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingEmail, setTogglingEmail] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payment/admin/all`, {
        headers: { 'x-csrf-protected': '1' }
      });
      const data = await res.json();
      if (data.success) setPayments(data.payments);
    } catch (err) {
      console.error('Failed to fetch admin payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async (email, currentState) => {
    setTogglingEmail(email);
    try {
      const res = await fetch(`${API_BASE_URL}/payment/admin/toggle-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({ email, unlock: !currentState })
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev =>
          prev.map(p =>
            p.userEmail === email ? { ...p, portalUnlocked: !currentState } : p
          )
        );
        setMessage({ type: 'success', text: `Portal ${!currentState ? 'unlocked' : 'locked'} for ${email}` });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle access' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setTogglingEmail(null);
    }
  };

  const generateInvoice = (payment) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${payment.razorpayOrderId}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: 'Segoe UI', sans-serif; padding: 48px; color: #1e293b; max-width: 820px; margin: 0 auto; background: #f8fafc; }
            .card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 32px rgba(0,0,0,0.08); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 28px; margin-bottom: 32px; }
            .logo { font-size: 22px; font-weight: 900; color: #6366f1; letter-spacing: 2px; }
            .logo small { display: block; font-size: 11px; font-weight: 500; color: #94a3b8; margin-top: 2px; letter-spacing: 1px; }
            .badge { padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .badge.captured { background: #dcfce7; color: #15803d; }
            .badge.failed { background: #fee2e2; color: #b91c1c; }
            .badge.created { background: #fef3c7; color: #b45309; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
            .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 700; }
            .value { font-size: 15px; font-weight: 700; color: #1e293b; font-family: monospace; }
            .value.normal { font-family: 'Segoe UI', sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { text-align: left; padding: 12px 16px; background: #f1f5f9; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 18px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 600; font-size: 15px; }
            .total-row { background: #f8fafc; }
            .total-row td { font-size: 18px; font-weight: 900; color: #6366f1; }
            .footer { margin-top: 48px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; line-height: 1.8; }
            .razorpay-id { font-family: monospace; font-size: 12px; color: #64748b; background: #f1f5f9; padding: 8px 14px; border-radius: 8px; display: inline-block; margin-top: 4px; }
            @media print { body { background: white; padding: 0; } .card { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="logo">PRESUME OVERSEAS<small>Official Payment Receipt</small></div>
              </div>
              <div style="text-align:right">
                <div class="badge ${payment.status}">${payment.status.toUpperCase()}</div>
                <div style="font-size:12px;color:#94a3b8;margin-top:8px">${new Date(payment.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
              </div>
            </div>
            
            <div class="grid2">
              <div>
                <div class="label">Billed To</div>
                <div class="value normal">${payment.userName || 'Student'}</div>
                <div style="font-size:13px;color:#64748b;margin-top:4px">${payment.userEmail}</div>
              </div>
              <div style="text-align:right">
                <div class="label">Invoice Reference</div>
                <div class="razorpay-id">${payment.razorpayOrderId}</div>
                ${payment.razorpayPaymentId ? `<div style="margin-top:8px"><div class="label">Payment ID</div><div class="razorpay-id">${payment.razorpayPaymentId}</div></div>` : ''}
              </div>
            </div>

            <table>
              <thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr></thead>
              <tbody>
                <tr>
                  <td>${payment.itemName || 'Premium Portal Access'}</td>
                  <td style="text-align:center">1</td>
                  <td style="text-align:right">₹${payment.amount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align:right">Total Paid</td>
                  <td style="text-align:right">₹${payment.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              This is a computer-generated receipt and does not require a physical signature.<br>
              Powered by Razorpay · Presume Overseas · coursefinderitaly.com
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filtered = payments.filter(p =>
    p.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = payments.filter(p => p.status === 'captured').reduce((acc, p) => acc + p.amount, 0);
  const unlockedCount = [...new Set(payments.filter(p => p.portalUnlocked).map(p => p.userEmail))].length;

  return (
    <div style={{ padding: '24px', minHeight: '100%' }}>

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
              padding: '14px 20px', borderRadius: '14px', fontWeight: 700, fontSize: '0.85rem',
              background: message.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: message.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              backdropFilter: 'blur(12px)'
            }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Payment Management</h2>
            <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>All student transactions &amp; portal access control</p>
          </div>
        </div>
        <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Collected', value: `₹${totalCollected.toFixed(2)}`, color: '#10b981', icon: <CheckCircle size={18} /> },
          { label: 'Total Transactions', value: payments.length, color: '#6366f1', icon: <CreditCard size={18} /> },
          { label: 'Unlocked Portals', value: unlockedCount, color: '#f59e0b', icon: <ShieldCheck size={18} /> },
          { label: 'Failed Payments', value: payments.filter(p => p.status === 'failed').length, color: '#ef4444', icon: <XCircle size={18} /> },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by student name, email or order ID..."
          style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '14px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Payment List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading transactions...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <CreditCard size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ color: 'var(--text-main)', margin: 0 }}>No transactions found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((payment, i) => (
            <motion.div key={payment._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '18px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>

              {/* Left: User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '200px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: payment.status === 'captured' ? 'rgba(16,185,129,0.1)' : payment.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                  color: payment.status === 'captured' ? '#10b981' : payment.status === 'failed' ? '#ef4444' : '#f59e0b'
                }}>
                  {payment.status === 'captured' ? <CheckCircle size={20} /> : payment.status === 'failed' ? <XCircle size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{payment.userName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.userEmail}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{payment.razorpayOrderId}</div>
                </div>
              </div>

              {/* Middle: Details */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>₹{payment.amount.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Date</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{new Date(payment.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Portal</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: payment.portalUnlocked ? '#10b981' : '#ef4444' }}>
                    {payment.portalUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Download Invoice */}
                {payment.status === 'captured' && (
                  <button onClick={() => generateInvoice(payment)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', background: 'var(--accent-glow)', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>
                    <Download size={13} /> Receipt
                  </button>
                )}

                {/* Toggle Block/Unblock */}
                <button
                  disabled={togglingEmail === payment.userEmail}
                  onClick={() => toggleAccess(payment.userEmail, payment.portalUnlocked)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.2s',
                    background: payment.portalUnlocked ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: payment.portalUnlocked ? '#ef4444' : '#10b981',
                    opacity: togglingEmail === payment.userEmail ? 0.5 : 1
                  }}>
                  {payment.portalUnlocked ? <><ShieldOff size={13} /> Block</> : <><ShieldCheck size={13} /> Unlock</>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
