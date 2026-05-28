import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, CheckCircle, XCircle, Download, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PaymentHistory = ({ userEmail }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [userEmail]);

  const fetchHistory = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/payment/history?email=${encodeURIComponent(userEmail)}`, {
        headers: { 'x-csrf-protected': '1' },
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payment history', err);
    } finally {
      setLoading(false);
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
                <div class="badge ${payment.status === 'created' ? 'failed' : payment.status}">${payment.status === 'created' ? 'FAILED' : payment.status.toUpperCase()}</div>
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
              Powered by Razorpay &middot; Presume Overseas &middot; coursefinderitaly.com
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ padding: '24px', background: 'var(--bg-primary)', minHeight: '100%', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', boxShadow: '0 8px 24px rgba(99,102,241,0.2)' }}>
          <Receipt size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Payment History</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>View your transactions and download invoices</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading records...</div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <CreditCard size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>No payments found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>Your transaction history is empty.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {payments.map((payment, i) => (
            <motion.div 
              key={payment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: payment.status === 'captured' ? 'rgba(16, 185, 129, 0.1)' : (payment.status === 'failed' || payment.status === 'created') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: payment.status === 'captured' ? '#10b981' : (payment.status === 'failed' || payment.status === 'created') ? '#ef4444' : '#f59e0b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {payment.status === 'captured' ? <CheckCircle size={20} /> : (payment.status === 'failed' || payment.status === 'created') ? <XCircle size={20} /> : <Clock size={20} />}
                </div>
                
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {payment.itemName || 'Premium Service'}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(payment.createdAt).toLocaleString()}</span>
                    <span>Order: {payment.razorpayOrderId}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{payment.amount.toFixed(2)}</div>
                  <div style={{ 
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px',
                    color: payment.status === 'captured' ? '#10b981' : (payment.status === 'failed' || payment.status === 'created') ? '#ef4444' : '#f59e0b' 
                  }}>
                    {payment.status === 'created' ? 'failed' : payment.status}
                  </div>
                </div>

                {payment.status === 'captured' && (
                  <button 
                    onClick={() => generateInvoice(payment)}
                    style={{
                      background: 'var(--accent-glow)', border: 'none', color: 'var(--accent-secondary)',
                      padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                      cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--accent-secondary)'; }}
                  >
                    <Download size={14} /> Download Invoice
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
