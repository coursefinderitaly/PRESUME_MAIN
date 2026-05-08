import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Globe, ShieldCheck, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';

const RazorpayGateway = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
        <div style={{ background: '#fff', width: '100%', maxWidth: '450px', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'scaleIn 0.3s ease' }}>
          <style>{`
            @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes drawCheck { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
          `}</style>
          <div style={{ width: '80px', height: '80px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={48} color="#10b981" />
          </div>
          <h2 style={{ color: '#2b3448', margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 800 }}>Payment Successful</h2>
          <p style={{ color: '#828c96', margin: 0 }}>Your application has been submitted successfully.</p>
          <div style={{ marginTop: '30px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '720px', height: '540px', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        
        {/* TOP HEADER */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f2f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', background: '#3395FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.6rem', fontWeight: 900 }}>P</div>
             <div>
               <h3 style={{ margin: 0, color: '#2b3448', fontSize: '1.1rem', fontWeight: 800 }}>Presume Overseas</h3>
               <div style={{ fontSize: '0.8rem', color: '#828c96', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <ShieldCheck size={12} color="#10b981" /> Secured by Presume Pay
               </div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#828c96', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '2px' }}>Amount to pay</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2b3448' }}>₹{amount || '25,000'}</div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#828c96', cursor: 'pointer', padding: '5px' }}>
            <X size={20} />
          </button>
        </div>

        {/* MAIN BODY */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* LEFT SIDEBAR - METHODS */}
          <div style={{ width: '260px', background: '#f8f9fa', borderRight: '1px solid #f2f4f6', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 24px 16px', fontSize: '0.65rem', fontWeight: 800, color: '#828c96', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Methods</div>
            
            {[
              { id: 'card', label: 'Cards', sub: 'Visa, Mastercard, Rupay', icon: <CreditCard size={18} /> },
              { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, BHIM', icon: <Smartphone size={18} /> },
              { id: 'nb', label: 'Netbanking', sub: 'All major banks', icon: <Globe size={18} /> },
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  width: '100%', padding: '16px 24px', border: 'none', background: method === m.id ? '#fff' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: '16px', color: method === m.id ? '#3395FF' : '#515967',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  borderLeft: method === m.id ? '4px solid #3395FF' : '4px solid transparent'
                }}
              >
                <div style={{ opacity: method === m.id ? 1 : 0.6 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{m.label}</div>
                  <div style={{ fontSize: '0.65rem', color: '#828c96', fontWeight: 500 }}>{m.sub}</div>
                </div>
              </button>
            ))}

            <div style={{ marginTop: 'auto', padding: '24px', textAlign: 'center' }}>
               <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="RZP" style={{ width: '20px', opacity: 0.2, filter: 'grayscale(1)' }} />
            </div>
          </div>

          {/* RIGHT CONTENT - FORM */}
          <div style={{ flex: 1, padding: '40px', background: '#fff', position: 'relative', overflowY: 'auto' }}>
            {method === 'card' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ margin: '0 0 24px 0', color: '#2b3448', fontSize: '1rem', fontWeight: 800 }}>Enter Card Details</h4>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#828c96', marginBottom: '8px', textTransform: 'uppercase' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" placeholder="4321 4321 4321 4321" style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e6e9', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} />
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px' }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '12px' }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" style={{ height: '16px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#828c96', marginBottom: '8px', textTransform: 'uppercase' }}>Expiry</label>
                    <input type="text" placeholder="MM / YY" style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e6e9', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#828c96', marginBottom: '8px', textTransform: 'uppercase' }}>CVV</label>
                    <input type="password" placeholder="123" style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e6e9', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '32px' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontSize: '0.85rem', color: '#515967', fontWeight: 500 }}>Remember Card for future payments</span>
                </label>
              </div>
            )}

            {method === 'upi' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h4 style={{ margin: '0 0 24px 0', color: '#2b3448', fontSize: '1rem', fontWeight: 800 }}>Pay via UPI</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                   {['GPay', 'PhonePe', 'BHIM'].map(app => (
                     <div key={app} style={{ border: '1px solid #e2e6e9', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ width: '32px', height: '32px', background: '#f4f6f8', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>{app[0]}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#515967' }}>{app}</div>
                     </div>
                   ))}
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#828c96', marginBottom: '8px', textTransform: 'uppercase' }}>Enter UPI ID</label>
                  <input type="text" placeholder="username@upi" style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e6e9', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>
            )}

            {method === 'nb' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                 <h4 style={{ margin: '0 0 24px 0', color: '#2b3448', fontSize: '1rem', fontWeight: 800 }}>Netbanking</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                    {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                      <div key={bank} style={{ border: '1px solid #e2e6e9', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <div style={{ width: '24px', height: '24px', background: '#f4f6f8', borderRadius: '4px' }}></div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#515967' }}>{bank}</div>
                      </div>
                    ))}
                 </div>
                 <select style={{ width: '100%', padding: '14px 16px', border: '1px solid #e2e6e9', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
                    <option>Select another bank</option>
                    <option>Canara Bank</option>
                    <option>Punjab National Bank</option>
                 </select>
              </div>
            )}

            {/* PAY BUTTON */}
            <div style={{ position: 'sticky', bottom: 0, background: '#fff', paddingTop: '20px' }}>
              <button 
                onClick={handlePay}
                disabled={isProcessing}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  background: '#3395FF', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px', 
                  fontSize: '1.1rem', 
                  fontWeight: 800, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(51, 149, 255, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {isProcessing ? (
                  <>
                    <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    PROCESSING...
                  </>
                ) : (
                  <>PAY ₹{amount || '25,000'}</>
                )}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: '16px', borderTop: '1px solid #f2f4f6', background: '#fcfcfc', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={14} color="#10b981" />
          <div style={{ fontSize: '0.7rem', color: '#828c96', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trusted by 50L+ Businesses. Powered by Razorpay</div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayGateway;
