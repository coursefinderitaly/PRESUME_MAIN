import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt, CheckCircle, XCircle, Download, Clock, CreditCard, ChevronRight,
  ShieldCheck, Loader2, Sparkles, CheckCircle2, Lock, ArrowRight, Award, Compass, Landmark, Briefcase
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { getPhases, getTaxRate } from '../config/feesHelper';

const COUNTRY_PHASE_INFOS = {
  italy: [
    {
      number: 1,
      title: "Academic Strategy & Profile Evaluation",
      desc: "Course selection, university application strategies, document checklists, and credential evaluation.",
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      number: 2,
      title: "University Admission & Portal Submissions",
      desc: "Course application filings, Universitaly portal pre-enrollment tracking, and admission monitoring.",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      number: 3,
      title: "Regional DSU Scholarship Processing",
      desc: "Filing translation, legalization, and regional scholarship submissions (tuition waiver + €8k stipend guidance).",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.15)"
    },
    {
      number: 4,
      title: "Embassy Visa Dossier & Arrival Integration",
      desc: "Embassy appointment setup, visa dossier review, block funding preparation, pre-departure briefs, and housing.",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.15)"
    }
  ],
  germany: [
    {
      number: 1,
      title: "Uni-Assist Profiling & VPD Shortlist",
      desc: "Qualification assessment (VPD verification), university program shortlisting, and application timeline mapping.",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      number: 2,
      title: "Direct Portals & VPD Submissions",
      desc: "Filing VPD requests, submitting applications, language requirement validation, and intake tracking.",
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      number: 3,
      title: "Blocked Account Setup & Visa Slots",
      desc: "Setting up your secure blocked bank account, scheduling German Embassy visa slots, and checklist verification.",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.15)"
    },
    {
      number: 4,
      title: "Pre-Departure & Anmeldung Registration",
      desc: "Health insurance activation, hostel matching guides, Anmeldung registration support, and travel assistance.",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.15)"
    }
  ],
  other: [
    {
      number: 1,
      title: "University Shortlisting & Strategy",
      desc: "Profile analysis, university/course matching, admissions timeline preparation, and SOP structure preparation.",
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      number: 2,
      title: "Direct Admission Filings & LORs",
      desc: "Completing application files, recommendation letters curation, submission tracking, and direct liaison.",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      number: 3,
      title: "Financial Clearances & Visa File",
      desc: "Preparing bank statements, financial sponsorship documents, visa checklists, and scheduling biometrics.",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.15)"
    },
    {
      number: 4,
      title: "Pre-Departure Briefing & Housing",
      desc: "Finding student accommodation, ticketing, currency exchange setup, and arrival orientation briefs.",
      color: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.15)"
    }
  ]
};

export const getPhaseNumberFromPayment = (payment) => {
  const name = (payment.itemName || '').toUpperCase();
  const itemId = payment.itemId || '';
  if (itemId === 'dynamic_fee' || itemId === 'application_fee' || itemId === 'bachelors_masters_fee' || itemId === 'mbbs_fee') return 1;
  if (name.includes('PHASE 1') || name.includes('APPLICATION') || name.includes('REGISTRATION')) return 1;
  if (name.includes('PHASE 2')) return 2;
  if (name.includes('PHASE 3')) return 3;
  if (name.includes('PHASE 4')) return 4;
  return null;
};

const parsePricingParams = (payment) => {
  if (!payment) return {};
  if (typeof payment.pricingParams === 'string') {
    try {
      return JSON.parse(payment.pricingParams);
    } catch (e) {
      return {};
    }
  }
  return payment.pricingParams || {};
};

const PaymentHistory = ({ userEmail, profile, refreshProfile }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingIndex, setPayingIndex] = useState(null);
  const [error, setError] = useState(null);
  const capturedPayments = payments.filter(p => p.status === 'captured');

  const lockedPayment = useMemo(() => {
    return capturedPayments.find(p => getPhaseNumberFromPayment(p) === 1);
  }, [capturedPayments]);

  const countryId = profile?.country?.toLowerCase() || 'italy';
  const activeLevel = useMemo(() => {
    const currentEdu = profile?.highestLevelOfEducation;
    if (['Bachelors', 'Masters', 'MBBS'].includes(currentEdu)) return currentEdu;
    if (currentEdu === '12th or equivalent') return 'Bachelors';
    return 'Bachelors'; // Default fallback
  }, [profile?.highestLevelOfEducation]);
  const uniType = 'Public';

  const getPaymentCountry = (p) => {
    const params = parsePricingParams(p);
    if (params.countryId) return params.countryId.toLowerCase();
    if (params.countryName) return params.countryName.toLowerCase();
    
    const name = (p.itemName || '').toLowerCase();
    if (name.includes('italy')) return 'italy';
    if (name.includes('germany')) return 'germany';
    
    // For test payments (dynamic_fee) with no metadata, lock to italy to prevent jumping
    return 'italy';
  };



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
  }; const generateInvoice = (payment) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${payment.razorpayOrderId}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
              padding: 48px 24px; 
              color: #f1f5f9; 
              max-width: 820px; 
              margin: 0 auto; 
              background: #090d16; 
              position: relative;
              overflow-x: hidden;
              min-height: 100vh;
            }
            .glow { position: absolute; border-radius: 50%; pointer-events: none; z-index: -1; opacity: 0.15; }
            .glow-1 { top: 5%; left: 10%; width: 250px; height: 250px; background: #fbbf24; filter: blur(100px); }
            .glow-2 { bottom: 10%; right: 5%; width: 300px; height: 300px; background: #f59e0b; filter: blur(120px); }
            
            .card { 
              background: rgba(255, 255, 255, 0.02); 
              border: 1px solid rgba(255, 255, 255, 0.08);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border-radius: 24px; 
              padding: 40px; 
              box-shadow: 0 20px 40px rgba(0,0,0,0.5); 
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
              padding-bottom: 28px; 
              margin-bottom: 32px; 
            }
            .logo { 
              font-size: 22px; 
              font-weight: 900; 
              color: #a5b4fc; 
              letter-spacing: 2px; 
              text-transform: uppercase;
            }
            .logo small { 
              display: block; 
              font-size: 11px; 
              font-weight: 700; 
              color: #64748b; 
              margin-top: 4px; 
              letter-spacing: 1px; 
            }
            .badge { 
              padding: 6px 14px; 
              border-radius: 20px; 
              font-weight: 800; 
              font-size: 11px; 
              text-transform: uppercase; 
              letter-spacing: 1px; 
              display: inline-block;
            }
            .badge.captured { 
              background: rgba(16, 185, 129, 0.15); 
              color: #34d399; 
              border: 1px solid rgba(16, 185, 129, 0.3);
              box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
            }
            .badge.failed { 
              background: rgba(239, 68, 68, 0.15); 
              color: #f87171; 
              border: 1px solid rgba(239, 68, 68, 0.3);
            }
            .badge.created { 
              background: rgba(245, 158, 11, 0.15); 
              color: #fbbf24; 
              border: 1px solid rgba(245, 158, 11, 0.3);
            }
            .grid2 { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 32px; 
              margin-bottom: 40px; 
            }
            .label { 
              font-size: 10px; 
              color: #64748b; 
              text-transform: uppercase; 
              letter-spacing: 1.5px; 
              margin-bottom: 6px; 
              font-weight: 700; 
            }
            .value { 
              font-size: 15px; 
              font-weight: 700; 
              color: #f8fafc; 
              font-family: monospace; 
            }
            .value.normal { 
              font-family: 'Segoe UI', system-ui, sans-serif; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 8px; 
            }
            th { 
              text-align: left; 
              padding: 12px 16px; 
              background: rgba(255, 255, 255, 0.03); 
              border-bottom: 1px solid rgba(255, 255, 255, 0.08);
              font-size: 11px; 
              color: #94a3b8; 
              font-weight: 700; 
              text-transform: uppercase; 
              letter-spacing: 1px; 
            }
            td { 
              padding: 18px 16px; 
              border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
              font-weight: 600; 
              font-size: 14px;
              color: #e2e8f0;
            }
            .total-row { 
              background: rgba(255, 255, 255, 0.01); 
            }
            .total-row td { 
              font-size: 18px; 
              font-weight: 900; 
              color: #818cf8; 
              border-top: 1px solid rgba(255, 255, 255, 0.08);
            }
            .footer { 
              margin-top: 48px; 
              font-size: 11px; 
              color: #64748b; 
              text-align: center; 
              border-top: 1px solid rgba(255, 255, 255, 0.08); 
              padding-top: 20px; 
              line-height: 1.8; 
            }
            .razorpay-id { 
              font-family: monospace; 
              font-size: 12px; 
              color: #cbd5e1; 
              background: rgba(255, 255, 255, 0.04); 
              padding: 6px 12px; 
              border-radius: 8px; 
              border: 1px solid rgba(255, 255, 255, 0.05);
              display: inline-block; 
              margin-top: 4px; 
            }
            @media print { 
              body { 
                background: #090d16 !important; 
                color: #f1f5f9 !important;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              } 
              .card { 
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                box-shadow: none !important; 
              } 
            }
          </style>
        </head>
        <body>
          <div class="glow glow-1"></div>
          <div class="glow glow-2"></div>
          
          <div class="card">
            <div class="header">
              <div>
                <div class="logo">PRESUME OVERSEAS<small>Official Payment Receipt</small></div>
              </div>
              <div style="text-align:right">
                <div class="badge ${payment.status === 'created' ? 'failed' : payment.status}">${payment.status === 'created' ? 'FAILED' : payment.status.toUpperCase()}</div>
                <div style="font-size:12px;color:#64748b;margin-top:8px">${new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            
            <div class="grid2">
              <div>
                <div class="label">Billed To</div>
                <div class="value normal">${payment.userName || 'Student'}</div>
                <div style="font-size:13px;color:#94a3b8;margin-top:4px">${payment.userEmail}</div>
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

  // Phase Stepper Calculations
  const isStudent = profile?.role === 'student';

  const handlePayPhase = async (phaseObj, countryKey, packageUniType) => {
    try {
      setPayingIndex(`${countryKey}_${phaseObj.index}`);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({
          itemId: 'phase_payment',
          userEmail: profile?.email || '',
          pricingParams: {
            amount: phaseObj.totalAmount,
            phaseNumber: phaseObj.phaseNumber,
            countryName: countryKey,
            selectedLevel: activeLevel,
            uniType: packageUniType || uniType
          }
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: data.key_id || '',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Presume Overseas',
        description: `${countryKey.toUpperCase()} - Phase ${phaseObj.phaseNumber} Payment (${activeLevel})`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            setPayingIndex(null);
            fetchHistory();
            if (refreshProfile) await refreshProfile();
          } catch (verifyError) {
            setError(verifyError.message);
            setPayingIndex(null);
          }
        },
        prefill: {
          name: `${profile?.firstName || ''} ${profile?.lastName || ''}`,
          email: profile?.email || '',
        },
        theme: {
          color: '#fbbf24'
        },
        modal: {
          ondismiss: function () {
            setPayingIndex(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
} catch (err) {
      setError(err.message || 'Payment setup failed.');
      setPayingIndex(null);
    }
  };

  // Active packages calculations
  const activePackages = [];
  
  const paymentsByCountry = {};
  capturedPayments.forEach(p => {
    const pCountry = getPaymentCountry(p) || 'other';
    if (!paymentsByCountry[pCountry]) paymentsByCountry[pCountry] = [];
    paymentsByCountry[pCountry].push(p);
  });

  const hasAnyPayments = capturedPayments.length > 0;
  
  if (!hasAnyPayments && countryId) {
    paymentsByCountry[countryId.toLowerCase()] = [];
  }

  Object.keys(paymentsByCountry).forEach(cKey => {
    const countryPayments = paymentsByCountry[cKey];
    const hasPayments = countryPayments.length > 0;
    
    // Show a package if it has payments. 
    // If user has NO payments at all, show their active profile country as an empty tracker.
    const showPackage = hasPayments || (!hasAnyPayments && countryId === cKey);

    if (showPackage) {
      // Find the Phase 1 payment for THIS specific country package to lock its specific level/type
      const firstPhasePayment = countryPayments.find(p => getPhaseNumberFromPayment(p) === 1);
      
      const pLevel = (() => {
        if (firstPhasePayment) {
          const params = parsePricingParams(firstPhasePayment);
          if (params.selectedLevel) return params.selectedLevel;
          const name = (firstPhasePayment.itemName || '').toLowerCase();
          if (name.includes('master')) return 'Masters';
          if (name.includes('mbbs')) return 'MBBS';
          if (name.includes('bachelor')) return 'Bachelors';
        }
        return activeLevel;
      })();

      const pUniType = (() => {
        if (firstPhasePayment) {
          const params = parsePricingParams(firstPhasePayment);
          if (params.uniType) return params.uniType;
          const name = (firstPhasePayment.itemName || '').toLowerCase();
          if (name.includes('private')) return 'Private';
        }
        return uniType;
      })();

      // Phase payments for this specific package
      const countryPhasePayments = countryPayments.filter(p => {
        const num = getPhaseNumberFromPayment(p);
        const itemId = p.itemId;
        return num !== null || itemId === 'dynamic_fee' || itemId === 'phase_payment';
      });

      const paidPhases = new Set();
      countryPhasePayments.forEach(p => {
        const num = getPhaseNumberFromPayment(p);
        if (num) paidPhases.add(num);
      });

      let nextFill = 1;
      countryPhasePayments.forEach(p => {
        if (!getPhaseNumberFromPayment(p)) {
          while (paidPhases.has(nextFill) && nextFill <= 4) {
            nextFill++;
          }
          if (nextFill <= 4) {
            paidPhases.add(nextFill);
            nextFill++;
          }
        }
      });

      // Calculate phases amounts using the locked parameters for THIS package
      const phases = getPhases(cKey, pUniType, pLevel, '');
      const taxRate = getTaxRate(cKey);

      const countryPhaseDetails = phases.map((basePrice, idx) => {
        const phaseNum = idx + 1;
        const tax = Math.round(basePrice * taxRate);
        const totalAmount = basePrice + tax;
        const countryInfos = COUNTRY_PHASE_INFOS[cKey] || COUNTRY_PHASE_INFOS['other'];
        const info = countryInfos[idx] || COUNTRY_PHASE_INFOS['other'][idx];
        const isPaid = paidPhases.has(phaseNum);

        return {
          index: idx,
          phaseNumber: phaseNum,
          basePrice,
          tax,
          totalAmount,
          isPaid,
          ...info
        };
      });

      const totalPaidForCountry = countryPayments.reduce((sum, p) => sum + p.amount, 0);

      const packageTotal = countryPhaseDetails.reduce((sum, p) => sum + p.totalAmount, 0);
      const remaining = Math.max(0, packageTotal - totalPaidForCountry);
      const percentPaid = packageTotal > 0 ? Math.min(100, Math.round((totalPaidForCountry / packageTotal) * 100)) : 0;

      const formattedCountry = cKey === 'other' || !cKey ? 'Premium Global' : (cKey.charAt(0).toUpperCase() + cKey.slice(1));
      const packageName = `${formattedCountry} Study Visa Package`;

      const nextPendingPhase = countryPhaseDetails.find(p => !p.isPaid);

      activePackages.push({
        key: cKey,
        name: packageName,
        total: packageTotal,
        paid: totalPaidForCountry,
        remaining,
        percent: percentPaid,
        track: pLevel,
        uniType: pUniType,
        phases: countryPhaseDetails,
        nextPendingPhase
      });
    }
  });

  return (
    <>
      <style>{`
        [data-theme="light"] .payment-history-container {
          background: var(--bg-main) !important;
          animation: none !important;
        }
      `}</style>
      <div className="payment-history-container" style={{
        padding: '24px',
        background: 'linear-gradient(-45deg, #07070a, #1a0f08, #1c0e2b, #150909)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        minHeight: '100%',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        position: 'relative'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', boxShadow: '0 8px 24px rgba(99,102,241,0.2)' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Payments</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track academic processing phase milestones and pay your remains.</p>
          </div>
          
          {/* Purchased Package Labels Removed as cards now self-identify */}
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '14px', padding: '12px 18px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {isStudent ? (
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Left Column: Enrolled Packages with their specific Phase records */}
            <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '320px' }}>

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Briefcase size={20} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-main)', margin: 0 }}>Purchased Packages & Records</h3>
                </div>

                {/* Study Track Read-only badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current Track:
                  </span>
                  <span style={{
                    background: 'var(--accent-glow)',
                    color: 'var(--accent-secondary)',
                    padding: '5px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {activeLevel}
                  </span>
                </div>
              </div>

              {/* Packages Grid */}
              {activePackages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--glass-bg)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                  <Briefcase size={40} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>No Purchased Packages</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>You have not enrolled in any study visa packages yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                  {activePackages.map((pkg) => (
                    <div
                      key={pkg.key}
                      style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '24px',
                        padding: '24px',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {/* Package Title & Percent */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{pkg.name}</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {pkg.uniType} • {pkg.track} track
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          background: pkg.remaining === 0 ? 'rgba(16, 185, 129, 0.15)' : 'var(--accent-glow)',
                          color: pkg.remaining === 0 ? '#10b981' : 'var(--accent-secondary)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {pkg.percent}% Paid
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '6px', background: 'var(--input-border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${pkg.percent}%`,
                          height: '100%',
                          background: pkg.remaining === 0 ? '#10b981' : 'linear-gradient(90deg, #10b981, var(--accent-primary))',
                          borderRadius: '3px',
                          boxShadow: pkg.remaining === 0 ? '0 0 10px rgba(16,185,129,0.3)' : '0 0 10px rgba(99, 102, 241, 0.3)'
                        }} />
                      </div>

                      {/* Package Cost Ledger Breakdown */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--input-bg)', padding: '14px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Total Cost</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{Math.round(pkg.total).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Paid</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>₹{Math.round(pkg.paid).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Remaining</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: pkg.remaining === 0 ? '#10b981' : '#f59e0b' }}>
                            {pkg.remaining === 0 ? '✓ Paid' : `₹${Math.round(pkg.remaining).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>

                      {/* Specific Phase Stepper Component */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--glass-bg)', padding: '16px', borderRadius: '18px', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Phases Funding Progress
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 8px' }}>
                          {/* Background progress line */}
                          <div style={{ position: 'absolute', left: '16px', right: '16px', height: '2px', background: 'var(--input-border)', zIndex: 0 }} />

                          {pkg.phases.map((ph, idx) => {
                            const isCurrentPending = pkg.nextPendingPhase?.phaseNumber === ph.phaseNumber;

                            return (
                              <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div
                                  style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: ph.isPaid ? 'rgba(16, 185, 129, 0.2)' : isCurrentPending ? 'rgba(99, 102, 241, 0.2)' : 'var(--input-bg)',
                                    border: ph.isPaid ? '1px solid #10b981' : isCurrentPending ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: ph.isPaid ? '#10b981' : isCurrentPending ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    fontSize: '0.65rem', fontWeight: 900
                                  }}
                                  title={`${ph.title}: ${ph.isPaid ? 'Paid' : 'Pending'}`}
                                >
                                  {ph.isPaid ? '✓' : ph.phaseNumber}
                                </div>
                                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: ph.isPaid ? '#10b981' : isCurrentPending ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                  Ph {ph.phaseNumber}
                                </span>
                                <span style={{ fontSize: '0.55rem', fontWeight: 800, color: ph.isPaid ? '#10b981' : 'var(--text-dim)', letterSpacing: '0.5px' }}>
                                  ₹{ph.totalAmount.toLocaleString('en-IN')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pending Phase Checkout Action */}
                      {pkg.nextPendingPhase ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Sparkles size={12} style={{ color: pkg.nextPendingPhase.color }} /> Next Phase Pending:
                            </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Phase {pkg.nextPendingPhase.phaseNumber} - {pkg.nextPendingPhase.title}</span>
                            <span style={{ fontSize: '0.68rem', fontStyle: 'italic' }}>({pkg.nextPendingPhase.desc})</span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePayPhase(pkg.nextPendingPhase, pkg.key, pkg.uniType)}
                            disabled={payingIndex === `${pkg.key}_${pkg.nextPendingPhase.index}`}
                            style={{
                              background: `linear-gradient(90deg, ${pkg.nextPendingPhase.color}, ${pkg.nextPendingPhase.color}dd)`,
                              color: '#000',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '10px 16px',
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: `0 4px 12px ${pkg.nextPendingPhase.glowColor}`,
                              transition: 'all 0.3s',
                              marginTop: '4px'
                            }}
                          >
                            {payingIndex === `${pkg.key}_${pkg.nextPendingPhase.index}` ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard size={12} />
                                <span>Pay Phase {pkg.nextPendingPhase.phaseNumber} (₹{pkg.nextPendingPhase.totalAmount.toLocaleString('en-IN')})</span>
                                <ArrowRight size={12} />
                              </>
                            )}
                          </motion.button>
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
                          color: '#10b981', fontSize: '0.75rem', fontWeight: 800, marginTop: '8px'
                        }}>
                          <ShieldCheck size={16} />
                          <span>All Phases Fully Funded!</span>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Transaction History ledger (Sticky sidebar styling) */}
            <div style={{
              flex: '0.3 1 350px',
              minWidth: '350px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '24px',
              backdropFilter: 'blur(20px)',
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Compass size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Transaction & Invoices</h3>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
                  <span>Loading records...</span>
                </div>
              ) : payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                  <CreditCard size={32} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>No payments found</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {payments.map((payment, i) => (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        borderBottom: i === payments.length - 1 ? 'none' : '1px solid var(--glass-border)',
                        padding: '12px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      {/* Top Row: Icon + Name (Wrapped, no clipping) */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                          background: payment.status === 'captured' ? 'rgba(16, 185, 129, 0.1)' : (payment.status === 'failed' || payment.status === 'created') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: payment.status === 'captured' ? '#10b981' : (payment.status === 'failed' || payment.status === 'created') ? '#ef4444' : '#f59e0b',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                        }}>
                          {payment.status === 'captured' ? <CheckCircle size={14} /> : (payment.status === 'failed' || payment.status === 'created') ? <XCircle size={14} /> : <Clock size={14} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3', wordBreak: 'break-word' }}>
                            {payment.itemName || 'Premium Service'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                            <span>{new Date(payment.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <span style={{ color: 'var(--glass-border)' }}>|</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.62rem' }}>{payment.razorpayOrderId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Amount & Invoice Trigger */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '42px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>₹{payment.amount}</span>
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                            color: payment.status === 'captured' ? '#10b981' : (payment.status === 'failed' || payment.status === 'created') ? '#ef4444' : '#f59e0b'
                          }}>
                            ({payment.status === 'created' ? 'failed' : payment.status})
                          </span>
                        </div>

                        {payment.status === 'captured' && (
                          <button
                            onClick={() => generateInvoice(payment)}
                            style={{
                              background: 'var(--accent-glow)', border: 'none', color: 'var(--accent-secondary)',
                              padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px',
                              cursor: 'pointer', fontWeight: 800, fontSize: '0.65rem', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--accent-secondary)'; }}
                          >
                            <Download size={10} /> Invoice
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Full width layout for admin/counselors/partners */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Compass size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Transaction & Invoices History</h3>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
                <span>Loading records...</span>
              </div>
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
        )}

      </div>
    </>
  );
};

export default PaymentHistory;
