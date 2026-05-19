import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const PaymentTestingModal = ({ isOpen, onClose, onSuccess, userEmail }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

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
                            if(onSuccess) onSuccess(response);
                            setPaymentSuccess(false);
                            onClose();
                        }, 2500);

                    } catch (verifyError) {
                        setError(verifyError.message);
                        setLoading(false);
                    }
                },
                prefill: {
                    name: 'User',
                    email: 'user@example.com',
                },
                theme: {
                    color: '#6366f1' // Premium Indigo
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(response.error.description);
                setLoading(false);
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
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ duration: 0.4 }}
                    onClick={!loading && !paymentSuccess ? onClose : undefined}
                    className="absolute inset-0 bg-[#030712]/70"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-[420px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[32px] p-1 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    {/* Animated Edge Glow */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent opacity-30 animate-pulse blur-xl" style={{ animationDuration: '3s' }} />
                    
                    <div className="relative z-10 bg-[#0a0f1d] rounded-[28px] p-8 overflow-hidden h-full flex flex-col">
                        
                        {paymentSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
                                >
                                    <CheckCircle className="w-12 h-12 text-green-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                                <p className="text-gray-400 text-center text-sm">Your premium access has been unlocked successfully. You will be redirected shortly.</p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Subtle Inner Glow */}
                                <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-[#6366f1]/20 rounded-full blur-[60px] pointer-events-none" />
                                <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-[#a78bfa]/15 rounded-full blur-[60px] pointer-events-none" />

                                {/* Close Button */}
                                <button 
                                    onClick={onClose}
                                    disabled={loading}
                                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20 disabled:opacity-50"
                                >
                                    <X size={16} />
                                </button>

                                <div className="relative z-20 flex flex-col items-center mt-2">
                                    {/* Icon Lock Shield */}
                                    <motion.div 
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, type: "spring" }}
                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#312e81] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.3)] border border-[#6366f1]/30 relative"
                                    >
                                        <motion.div 
                                            animate={{ scale: isHovered ? 1.1 : 1 }}
                                            className="absolute inset-0 flex items-center justify-center transition-transform"
                                        >
                                            <Lock className="w-8 h-8 text-[#818cf8]" />
                                        </motion.div>
                                        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-[#c084fc] animate-pulse" />
                                    </motion.div>

                                    <motion.h2 
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-[24px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2 text-center tracking-tight"
                                    >
                                        Unlock Premium Features
                                    </motion.h2>

                                    <motion.p 
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-gray-400 text-[13px] font-medium mb-8 text-center leading-relaxed px-2"
                                    >
                                        Secure your account and gain full access by completing a quick ₹1.00 verification payment.
                                    </motion.p>

                                    {/* Payment Box */}
                                    <motion.div 
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center mb-6 backdrop-blur-md relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/0 via-[#6366f1]/10 to-[#6366f1]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                                                <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-semibold text-gray-200">Secure Checkout</span>
                                                <span className="text-[11px] text-gray-500 font-medium">Powered by Razorpay</span>
                                            </div>
                                        </div>
                                        <div className="text-[20px] font-black text-white relative z-10">
                                            ₹1<span className="text-[14px] text-gray-400">.00</span>
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
                                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-bold flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 shrink-0 mt-[1px]" />
                                                    <span>{error}</span>
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
                                        className="relative w-full group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="relative py-4 px-6 rounded-xl flex items-center justify-center gap-3">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    <span className="text-white font-bold tracking-wider text-[13px] uppercase">Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 text-[#e0e7ff]" fill="currentColor" />
                                                    <span className="text-white font-bold tracking-wider text-[13px] uppercase shadow-sm">Authorize ₹1.00</span>
                                                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </motion.button>
                                    
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-4 text-[10px] font-semibold text-gray-500 uppercase tracking-widest text-center flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-3 h-3" /> 256-bit SSL Encryption
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
