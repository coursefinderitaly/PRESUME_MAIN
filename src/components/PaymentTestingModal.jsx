import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PaymentTestingModal = ({ isOpen, onClose, onSuccess, userEmail }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);
            setPaymentFailed(false);

            // 1. Call backend to create order securely
            const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                body: JSON.stringify({ itemId: 'test_item_1', userEmail: userEmail || '' })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to create order');
            }

            // 2. Initialize Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Presume Overseas',
                description: 'Premium Testing Access',
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

                        setLoading(false);
                        setPaymentSuccess(true);

                        // Close modal after success animation
                        setTimeout(() => {
                            if (onSuccess) onSuccess(response);
                            setPaymentSuccess(false);
                            onClose();
                        }, 2500);

                    } catch (verifyError) {
                        try {
                            await fetch(`${API_BASE_URL}/payment/update-status`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                                body: JSON.stringify({
                                    razorpayOrderId: response.razorpay_order_id,
                                    status: 'failed',
                                    failureReason: verifyError.message || 'Payment verification failed'
                                })
                            });
                        } catch (dbErr) {
                            console.error('Failed to log verification failure to DB:', dbErr);
                        }

                        setError(verifyError.message);
                        setLoading(false);
                        setPaymentFailed(true);
                    }
                },
                prefill: {
                    name: 'User',
                    email: userEmail || 'user@example.com',
                },
                theme: {
                    color: '#06b6d4' // Cyan 500
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async function (response) {
                const failureDesc = response.error.description || 'Payment failed on checkout';
                try {
                    await fetch(`${API_BASE_URL}/payment/update-status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                        body: JSON.stringify({
                            razorpayOrderId: data.order.id,
                            status: 'failed',
                            failureReason: failureDesc
                        })
                    });
                } catch (dbErr) {
                    console.error('Failed to log checkout failure to DB:', dbErr);
                }

                setError(failureDesc);
                setLoading(false);
                setPaymentFailed(true);
            });
            rzp.open();

        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop Blur Layer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={!loading && !paymentSuccess && !paymentFailed ? onClose : undefined}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-[420px] bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Subtle Ambient Glow inside modal */}
                    <div className="absolute -top-[150px] -right-[150px] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-[150px] -left-[150px] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 p-8 flex flex-col h-full">

                        {paymentSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                >
                                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-50 mb-2">Payment Successful!</h3>
                                <p className="text-slate-400 text-center text-sm">Your premium access has been unlocked successfully. You will be redirected shortly.</p>
                            </motion.div>
                        ) : paymentFailed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(239,68,68,0.2)] border border-red-500/20"
                                >
                                    <XCircle className="w-10 h-10 text-red-400" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-50 mb-2">Payment Failed</h3>
                                <p className="text-slate-400 text-center text-sm mb-6">
                                    The transaction could not be completed.<br />
                                    <span className="text-red-400 font-medium bg-red-500/10 px-3 py-1.5 rounded-lg mt-3 inline-block border border-red-500/20">
                                        Reason: {error || 'Transaction was cancelled or declined'}
                                    </span>
                                </p>
                                <div className="flex gap-3 w-full z-20">
                                    <button
                                        onClick={() => {
                                            setPaymentFailed(false);
                                            setError(null);
                                            handlePayment();
                                        }}
                                        className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all shadow-[0_4px_12px_rgba(239,68,68,0.3)] text-sm"
                                    >
                                        Retry Payment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPaymentFailed(false);
                                            setError(null);
                                            onClose();
                                        }}
                                        className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all text-sm border border-slate-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20 disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>

                                <div className="relative z-20 flex flex-col items-center mt-2">
                                    {/* Icon Lock Shield */}
                                    <motion.div
                                        initial={{ y: -5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 border border-cyan-500/20 relative"
                                    >
                                        <motion.div
                                            animate={{ scale: isHovered ? 1.05 : 1 }}
                                            className="absolute inset-0 flex items-center justify-center transition-transform"
                                        >
                                            <Lock className="w-7 h-7 text-cyan-400" />
                                        </motion.div>
                                        <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 text-sky-400" />
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-2xl font-bold text-slate-50 mb-2 text-center"
                                    >
                                        Unlock Portal
                                    </motion.h2>

                                    <motion.p
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-slate-400 text-sm mb-8 text-center leading-relaxed"
                                    >
                                        Secure your account and gain full access by completing a quick ₹1.00 verification payment.
                                    </motion.p>

                                    {/* Payment Box */}
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-slate-700/50 flex justify-between items-center mb-6 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-200">Secure Checkout</span>
                                                <span className="text-xs text-slate-500 font-medium">Powered by Razorpay</span>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-white relative z-10">
                                            ₹1<span className="text-sm text-slate-400">.00</span>
                                        </div>
                                    </motion.div>

                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="w-full overflow-hidden mb-6"
                                            >
                                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                                    <span className="mt-0.5">{error}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Button */}
                                    <motion.button
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="relative w-full group overflow-hidden bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-all shadow-[0_4px_14px_rgba(6,182,212,0.4)] disabled:opacity-70"
                                    >
                                        <div className="relative py-3.5 px-6 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    <span className="text-white font-medium text-sm">Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 text-cyan-100" fill="currentColor" />
                                                    <span className="text-white font-medium text-sm">Authorize ₹1.00</span>
                                                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </motion.button>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-5 text-[11px] font-medium text-slate-500 flex items-center justify-center gap-1.5"
                                    >
                                        <Lock className="w-3 h-3" /> 256-BIT SSL ENCRYPTION
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentTestingModal;
