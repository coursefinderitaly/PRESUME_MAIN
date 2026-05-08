import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, Book, FileText, Sparkles, Plane,
    Globe, X, Star, Compass, Headset, Map, ArrowRight, CheckCircle2,
    Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const EligibilityModal = ({ level, onClose, onEligibleAction, onNotEligibleAction }) => {
    const [step, setStep] = useState('form'); // 'form', 'eligible', 'ineligible'
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        percent11: '',
        percent12: '',
        percentGrad: '',
        stream: '',
        passingYear: '',
        interestedField: '',
        program: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sheets`);
                const data = await response.json();
                setAllCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Map internal level to Excel Program Level
    const excelLevel = useMemo(() => {
        if (level === 'bachelors') return 'Bachelor';
        if (level === 'masters') return 'Masters';
        if (level === 'mbbs') return 'Bachelor'; // MBBS is usually under Bachelor in the sheet
        return '';
    }, [level]);

    // Get unique Interested Fields for the selected level
    const interestedFields = useMemo(() => {
        const fields = allCourses
            .filter(c => (c['Program Level '] || '').trim() === excelLevel)
            .map(c => (c['InterestedField '] || '').trim())
            .filter(Boolean);
        return [...new Set(fields)].sort();
    }, [allCourses, excelLevel]);

    // Get Programs for selected Interested Field
    const programs = useMemo(() => {
        if (!formData.interestedField) return [];
        return allCourses
            .filter(c => 
                (c['Program Level '] || '').trim() === excelLevel && 
                (c['InterestedField '] || '').trim() === formData.interestedField
            )
            .map(c => (c['Program Name '] || '').trim())
            .filter(Boolean)
            .sort();
    }, [allCourses, excelLevel, formData.interestedField]);

    if (!level) return null;

    const streams = {
        bachelors: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts', 'Other'],
        masters: ['Engineering', 'Business', 'Arts & Design', 'Computer Science', 'Medicine', 'Other'],
        mbbs: ['Science (PCB)']
    };

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 1 - i);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset program if field changes
            ...(name === 'interestedField' ? { program: '' } : {})
        }));
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

        setStep(isEligible ? 'eligible' : 'ineligible');
    };

    const renderForm = () => (
        <form onSubmit={checkEligibility} className="relative z-10 flex flex-col gap-8 text-left max-w-sm mx-auto">
            <div className="text-center space-y-1.5">
                <h2 className="text-4xl font-black text-white tracking-tight">
                    Check <span className="text-blue-500">Eligibility</span>
                </h2>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em]">
                    For {level} programs
                </p>
            </div>

            <div className="space-y-5">
                {(level === 'bachelors' || level === 'mbbs') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">11th Grade (%)</label>
                            <input
                                required type="number" step="0.01" name="percent11"
                                value={formData.percent11} onChange={handleInputChange}
                                className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all placeholder-zinc-700 font-medium"
                                placeholder="00.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">12th Grade (%)</label>
                            <input
                                required type="number" step="0.01" name="percent12"
                                value={formData.percent12} onChange={handleInputChange}
                                className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all placeholder-zinc-700 font-medium"
                                placeholder="00.00"
                            />
                        </div>
                    </div>
                )}

                {level === 'masters' && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Graduation Score (%)</label>
                        <input
                            required type="number" step="0.01" name="percentGrad"
                            value={formData.percentGrad} onChange={handleInputChange}
                            className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all placeholder-zinc-700 font-medium"
                            placeholder="e.g. 75.50"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Academic Stream</label>
                    <div className="relative group">
                        <select
                            required name="stream" value={formData.stream} onChange={handleInputChange}
                            className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="" disabled className="bg-zinc-900 text-gray-500">Select your major</option>
                            {streams[level].map(s => (
                                <option key={s} value={s} className="bg-zinc-900">{s}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Interested Field</label>
                    <div className="relative group">
                        <select
                            required name="interestedField" value={formData.interestedField} onChange={handleInputChange}
                            className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all appearance-none cursor-pointer font-medium"
                            disabled={loading}
                        >
                            <option value="" disabled className="bg-zinc-900 text-gray-500">
                                {loading ? 'Loading Fields...' : 'Select Interest'}
                            </option>
                            {interestedFields.map(f => (
                                <option key={f} value={f} className="bg-zinc-900">{f}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 rotate-90" />}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Preferred Program</label>
                    <div className="relative group">
                        <select
                            required name="program" value={formData.program} onChange={handleInputChange}
                            className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all appearance-none cursor-pointer font-medium"
                            disabled={!formData.interestedField}
                        >
                            <option value="" disabled className="bg-zinc-900 text-gray-500">
                                {!formData.interestedField ? 'Select Field First' : 'Select Program'}
                            </option>
                            {programs.map(p => (
                                <option key={p} value={p} className="bg-zinc-900">{p}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Graduation Year</label>
                    <div className="relative group">
                        <select
                            required name="passingYear" value={formData.passingYear} onChange={handleInputChange}
                            className="w-full px-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:bg-zinc-800/50 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="" disabled className="bg-zinc-900 text-gray-500">Select year</option>
                            {years.map(y => (
                                <option key={y} value={y} className="bg-zinc-900">{y}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" disabled={loading} className="group relative w-full flex items-center justify-center gap-3 py-4 bg-white text-black text-sm font-black rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] disabled:opacity-50">
                <span className="relative z-10">{loading ? 'Please Wait...' : 'Check Now'}</span>
                {loading ? <Loader2 className="relative z-10 w-4 h-4 animate-spin" /> : <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </form>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <style>
                {`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
                @keyframes pulse-soft { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
                @keyframes fly-in { 0% { transform: translate(-20px, 20px) rotate(-20deg) scale(0.5); opacity: 0; } 100% { transform: translate(0, 0) rotate(12deg) scale(1); opacity: 1; } }
                @keyframes eligible-sparks-particle {
                    0% { opacity: 0; transform: translateY(20px) scale(0.5); }
                    20% { opacity: 1; transform: translateY(0px) scale(1.1); }
                    80% { opacity: 1; transform: translateY(-40px) scale(1); }
                    100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
                .animate-fly-in { animation: fly-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .eligible-sparks-effect { animation: eligible-sparks-particle 3s ease-out infinite; }
                .animation-delay-200 { animation-delay: 200ms; }
                .animation-delay-500 { animation-delay: 500ms; }
                `}
            </style>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-xl bg-zinc-950 border border-white/[0.05] rounded-[40px] p-10 overflow-hidden shadow-2xl"
            >
                {/* Premium Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors z-50 p-2"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ================= FORM STATE ================= */}
                {step === 'form' && renderForm()}

                {/* ================= ELIGIBLE STATE ================= */}
                {step === 'eligible' && (
                    <>
                        {/* FULL MODAL DYNAMIC PARTICLE SHOWER */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[40px]">
                            <div className="absolute top-[10%] left-[10%] eligible-sparks-effect"><GraduationCap className="w-8 h-8 text-white/20" /></div>
                            <div className="absolute top-[20%] left-[20%] eligible-sparks-effect animation-delay-200"><Star className="w-6 h-6 text-cyan-400/40" fill="currentColor" /></div>
                            <div className="absolute top-[15%] right-[15%] eligible-sparks-effect animation-delay-500"><Book className="w-8 h-8 text-purple-400/30" /></div>
                            <div className="absolute top-[40%] left-[10%] eligible-sparks-effect"><FileText className="w-7 h-7 text-white/20" /></div>
                            <div className="absolute top-[30%] right-[20%] eligible-sparks-effect animation-delay-200"><Sparkles className="w-10 h-10 text-yellow-400/40" /></div>
                            <div className="absolute bottom-[20%] left-[15%] eligible-sparks-effect animation-delay-500"><GraduationCap className="w-7 h-7 text-blue-400/30" /></div>
                            <div className="absolute bottom-[30%] right-[10%] eligible-sparks-effect"><Book className="w-7 h-7 text-cyan-400/30" /></div>
                            <div className="absolute bottom-[10%] right-[30%] eligible-sparks-effect animation-delay-200"><Star className="w-5 h-5 text-yellow-400/40" fill="currentColor" /></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-pop-in py-4">

                        <div className="relative mx-auto w-28 h-28 mt-8 mb-4 z-10 animate-float flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-600/30 rounded-full animate-pulse blur-xl"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-full flex items-center justify-center border-4 border-blue-400/40 shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                                <GraduationCap className="w-12 h-12 text-white" />
                            </div>
                            <Sparkles className="absolute -top-3 -right-3 text-yellow-400 w-9 h-9" />
                            <FileText className="absolute bottom-1 -left-1 text-white w-6 h-6 rotate-[-15deg] opacity-80" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white tracking-tight">
                                Congratulations!
                            </h2>
                            <motion.h3
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                                className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center justify-center gap-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            >
                                Pack Your Bags, Future Scholar!
                                <Plane className="w-7 h-7 text-blue-400 animate-fly-in shadow-blue-500/50" />
                            </motion.h3>
                            <p className="text-zinc-400 text-lg max-w-sm mx-auto font-medium leading-relaxed">
                                You are eligible for <span className="text-white">{level}</span> programs. Let's start your journey today.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <button
                                onClick={onEligibleAction}
                                className="group w-full flex items-center justify-center gap-3 py-4 bg-white text-black text-sm font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Start Application
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">

                            </p>
                        </div>
                    </div>
                    </>
                )}

                {/* ================= INELIGIBLE STATE ================= */}
                {step === 'ineligible' && (
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-pop-in py-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse-soft" />
                            <div className="relative w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                                <Compass className="w-12 h-12 text-amber-500" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">
                                Don't Worry!
                            </h2>
                            <p className="text-zinc-400 text-lg max-w-sm mx-auto font-medium leading-relaxed">
                                You may need some guidance. Our experts can help you find alternative pathways.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <button
                                onClick={onNotEligibleAction}
                                className="group w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 text-white text-sm font-black rounded-2xl transition-all hover:bg-zinc-700 active:scale-95"
                            >
                                Book Counselling
                                <Headset className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                100% Free Consultation
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default EligibilityModal;