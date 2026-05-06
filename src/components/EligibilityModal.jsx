import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react';

const AnimatedSuccessBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center rounded-[32px]">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px]"
        />
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 1,
                    ease: "easeOut"
                }}
                className="absolute w-32 h-32 border border-emerald-400/30 rounded-full"
            />
        ))}
    </div>
);

const SideDecorations = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-[32px]">
        {/* Left Side Elements */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={`left-${i}`}
                initial={{ y: "120%", opacity: 0, x: -20 }}
                animate={{ y: "-20%", opacity: [0, 1, 1, 0], x: 0 }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeOut"
                }}
                className="absolute w-1 h-16 bg-gradient-to-t from-transparent via-emerald-400 to-transparent rounded-full blur-[1px]"
                style={{ left: `${Math.random() * 15}%` }}
            />
        ))}
        {/* Right Side Elements */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={`right-${i}`}
                initial={{ y: "120%", opacity: 0, x: 20 }}
                animate={{ y: "-20%", opacity: [0, 1, 1, 0], x: 0 }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeOut"
                }}
                className="absolute w-1 h-16 bg-gradient-to-t from-transparent via-emerald-400 to-transparent rounded-full blur-[1px]"
                style={{ right: `${Math.random() * 15}%` }}
            />
        ))}
    </div>
);

const EligibilityModal = ({ level, onClose, onEligibleAction, onNotEligibleAction }) => {
    console.log("EligibilityModal rendered with level:", level);
    const [step, setStep] = useState('form'); // 'form', 'eligible', 'not-eligible'
    const [formData, setFormData] = useState({
        percent11: '',
        percent12: '',
        percentGrad: '',
        stream: '',
        passingYear: ''
    });

    const streams = {
        bachelors: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts', 'Other'],
        masters: ['Engineering', 'Business', 'Arts & Design', 'Computer Science', 'Medicine', 'Other'],
        mbbs: ['Science (PCB)']
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 1 - i);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkEligibility = (e) => {
        e.preventDefault();
        let isEligible = false;

        if (level === 'bachelors') {
            const p12 = parseFloat(formData.percent12);
            if (p12 >= 65) isEligible = true;
        } else if (level === 'masters') {
            const pGrad = parseFloat(formData.percentGrad);
            if (pGrad >= 70) isEligible = true;
        } else if (level === 'mbbs') {
            const p12 = parseFloat(formData.percent12);
            const stream = formData.stream;
            if (p12 >= 65 && (stream.includes('PCB') || stream.includes('Science'))) {
                isEligible = true;
            }
        }

        setStep(isEligible ? 'eligible' : 'not-eligible');
    };

    const renderForm = () => (
        <form onSubmit={checkEligibility} className="flex flex-col gap-4 relative z-30">
            <h3 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-widest">
                Check {level} Eligibility
            </h3>
            
            {(level === 'bachelors' || level === 'mbbs') && (
                <>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">11th Percentage (%)</label>
                        <input required type="number" step="0.01" name="percent11" value={formData.percent11} onChange={handleInputChange} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent-gold transition-colors" placeholder="e.g. 75" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">12th Percentage (%)</label>
                        <input required type="number" step="0.01" name="percent12" value={formData.percent12} onChange={handleInputChange} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent-gold transition-colors" placeholder="e.g. 80" />
                    </div>
                </>
            )}

            {level === 'masters' && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Graduation Percentage (%)</label>
                    <input required type="number" step="0.01" name="percentGrad" value={formData.percentGrad} onChange={handleInputChange} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent-gold transition-colors" placeholder="e.g. 72" />
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stream / Major</label>
                <select required name="stream" value={formData.stream} onChange={handleInputChange} className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-accent-gold transition-colors appearance-none cursor-pointer">
                    <option value="" disabled className="bg-[#0a0d18]">Select Stream</option>
                    {streams[level].map(s => (
                        <option key={s} value={s} className="bg-[#0a0d18]">{s}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Passing Year</label>
                <select required name="passingYear" value={formData.passingYear} onChange={handleInputChange} className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-accent-gold transition-colors appearance-none cursor-pointer">
                    <option value="" disabled className="bg-[#0a0d18]">Select Year</option>
                    {years.map(y => (
                        <option key={y} value={y} className="bg-[#0a0d18]">{y}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="mt-4 w-full py-4 bg-accent-gold text-primary-blue rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Check Now
            </button>
        </form>
    );

    const renderEligible = () => (
        <div className="flex flex-col items-center justify-center text-center gap-6 py-6 relative">
            <AnimatedSuccessBackground />
            <SideDecorations />
            
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] relative z-30 border-4 border-[#0a0d18]"
            >
                <CheckCircle2 className="w-12 h-12 text-[#0a0d18]" strokeWidth={3} />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-30 bg-[#0a0d18]/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full"
            >
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 mb-4 drop-shadow-md">
                    Congratulations!
                </h3>
                
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-block bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 border border-emerald-400/50 px-6 py-3 rounded-full mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                    <div className="text-emerald-300 font-black uppercase tracking-[0.2em] text-sm md:text-[15px] drop-shadow-[0_2px_10px_rgba(16,185,129,0.8)]">
                        Pack Your Bags, Future Scholar! ✈️
                    </div>
                </motion.div>

                <p className="text-gray-300 font-medium text-sm leading-relaxed">
                    Great news! Your profile meets the criteria for <strong className="text-white">{level}</strong> programs. Let's fast-track your admission and unlock your global future.
                </p>
            </motion.div>

            <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onEligibleAction} 
                className="relative z-30 px-8 py-4 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors mt-2 w-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
                Start Application
            </motion.button>
        </div>
    );

    const renderNotEligible = () => (
        <div className="flex flex-col items-center justify-center text-center gap-6 py-8">
            <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/40 shadow-[0_0_40px_rgba(243,64,121,0.3)]">
                <AlertCircle className="w-12 h-12 text-rose-400" />
            </div>
            <div>
                <h3 className="text-3xl font-black text-white mb-2">Don't Worry!</h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                    Based on these inputs, you might not meet the standard criteria. 
                    <strong className="text-white block mt-2">But we can find a way!</strong>
                    Book a free counselling session with our experts to explore alternative pathways or foundation programs.
                </p>
            </div>
            <button onClick={onNotEligibleAction} className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-colors mt-4 w-full flex items-center justify-center gap-3">
                <PhoneCall className="w-4 h-4" /> Take a Counselling
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={onClose}
                className="absolute inset-0 bg-[#0a0d18]/80 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative z-10 w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 p-8 rounded-[32px] shadow-2xl overflow-hidden"
            >
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-50 cursor-pointer p-2"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === 'form' && renderForm()}
                {step === 'eligible' && renderEligible()}
                {step === 'not-eligible' && renderNotEligible()}
            </motion.div>
        </div>
    );
};

export default EligibilityModal;
