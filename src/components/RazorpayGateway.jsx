import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RazorpayGateway = ({ isOpen, onClose, itemId, pricingParams, razorpayOrderId, userEmail, userPassword, onPaymentSuccess, onPaymentFailure, triggerWelcomeEmail = false }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            initiatePayment();
        }
    }, [isOpen]);

    const initiatePayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // 1. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                setError('Failed to load Razorpay SDK. Are you online?');
                setIsProcessing(false);
                return;
            }

            // 2. Create Order on Backend securely without passing flat amount
            const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-csrf-protected': '1'
                },
                body: JSON.stringify({ itemId: itemId || 'application_fee', pricingParams, userEmail })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // 3. Initialize Razorpay Options
            const options = {
                key: orderData.key_id, // Passed securely from our backend
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Presume Overseas',
                description: 'Student Visa Processing Fee',
                image: 'https://presumeoverseas.com/logo.png', // Or absolute path to logo
                order_id: orderData.order.id,
                prefill: {
                    email: userEmail,
                },
                theme: {
                    color: '#3395FF',
                },
                handler: async function (response) {
                    try {
                        // 4. Verify Payment on Backend
                        const verifyRes = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (!verifyRes.ok) {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }

                        // 5. Trigger Welcome Email if applicable
                        if (triggerWelcomeEmail && userEmail) {
                            fetch(`${API_BASE_URL}/auth/send-welcome`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                                body: JSON.stringify({ email: userEmail, password: userPassword })
                            }).catch(e => console.error('Failed to trigger welcome email:', e));
                        }

                        if (onPaymentSuccess) onPaymentSuccess();
                        onClose();
                    } catch (err) {
                        console.error('Verification Error:', err);
                        setError(err.message);
                        if (onPaymentFailure) onPaymentFailure();
                    }
                },
                modal: {
                    ondismiss: function () {
                        // User closed the Razorpay popup without paying
                        if (userEmail) {
                            fetch(`${API_BASE_URL}/auth/send-payment-failed`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                                body: JSON.stringify({ email: userEmail, errorMessage: 'User cancelled or dismissed the payment window.' })
                            }).catch(e => console.error('Failed to trigger payment cancelled email:', e));
                        }
                        
                        setIsProcessing(false);
                        onClose();
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                const errorDesc = response.error.description;
                setError(errorDesc);
                
                // Trigger backend to send payment failure email
                if (userEmail) {
                    fetch(`${API_BASE_URL}/auth/send-payment-failed`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                        body: JSON.stringify({ email: userEmail, errorMessage: errorDesc })
                    }).catch(e => console.error('Failed to trigger payment failure email:', e));
                }

                if (onPaymentFailure) onPaymentFailure();
            });
            paymentObject.open();

        } catch (err) {
            console.error(err);
            setError(err.message || 'Payment initiation failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={20} color="#828c96" />
                </button>
                
                {error ? (
                    <div>
                        <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Payment Error</div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</div>
                        <button onClick={initiatePayment} style={{ background: '#3395FF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
                    </div>
                ) : (
                    <div>
                        <Loader2 size={40} color="#3395FF" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Initializing Razorpay...</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Please wait while we set up your secure checkout.</div>
                    </div>
                )}
                
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <div style={{ fontSize: '0.7rem', color: '#828c96', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>100% Secure Transaction</div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default RazorpayGateway;
