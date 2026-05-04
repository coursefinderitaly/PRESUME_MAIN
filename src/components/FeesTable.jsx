import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const FeesTable = () => {
    const services = [
        { cat: "Consultation & Profile Evaluation", inc: "University shortlisting, career mapping, and academic audit", fee: "—" },
        { cat: "Application & Documentation", inc: "SOP/LOR assistance, portal management, and document translation", fee: "—" },
        { cat: "Visa Mentorship & Filing", inc: "DOV/CIMEA assistance, file preparation, and interview training", fee: "—" },
        { cat: "Post-Arrival Concierge", inc: "Accommodation assistance, residency permit, and local orientation", fee: "—" }
    ];

    return (
        <div className="relative z-20 w-full max-w-5xl mx-auto my-0">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tight">Our Fees Structure</h2>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Premium End-to-End Support</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {services.map((item, idx) => (
                    <div key={idx} className="group relative p-6 sm:p-8 rounded-[32px] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 hover:border-accent-gold/40 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
                            <h3 className="text-xl font-black text-white group-hover:text-accent-gold transition-colors">{item.cat}</h3>
                            <span className="px-5 py-2 rounded-2xl bg-black/50 border border-white/10 text-sm font-black text-white/50 group-hover:text-white transition-colors tracking-widest shadow-inner">{item.fee}</span>
                        </div>
                        
                        <div className="flex items-start gap-3 relative z-10 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                            <CheckCircle2 className="w-5 h-5 text-accent-gold shrink-0 mt-0.5 opacity-80" />
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.inc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
            
            <div className="mt-6 text-center">
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Taxes applicable extra.</p>
            </div>
        </div>
    );
};

export default FeesTable;
