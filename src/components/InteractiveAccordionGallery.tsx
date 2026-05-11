import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ExpandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

interface GalleryItem {
  id: number;
  url: string;
  title: string;
  city: string;
  subtitle?: string;
}

interface InteractiveAccordionGalleryProps {
  items?: GalleryItem[];
}

const InteractiveAccordionGallery: React.FC<InteractiveAccordionGalleryProps> = ({ items = [] }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center px-4 z-10 pointer-events-auto">
      <div className="flex items-stretch justify-center w-full h-full max-w-2xl md:max-w-3xl mx-auto gap-2 md:gap-3 py-4">
        {items.map((item, idx) => {
          const shiftDirection = idx % 2 === 0 ? 1 : -1;
          
          return (
            <motion.div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              whileHover="hover"
              initial="initial"
              variants={{
                initial: { flex: 1, scale: 1, zIndex: 10 },
                hover: { flex: 5, scale: 1.05, zIndex: 100 }
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="relative min-w-[30px] md:min-w-[45px] rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/20 bg-slate-900 cursor-pointer origin-center group pointer-events-auto"
            >
              {/* Image with zoom and shift */}
              <motion.img 
                src={item.url} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                variants={{
                  initial: { scale: 1.1, x: '0%' },
                  hover: { scale: 1.3, x: `${shiftDirection * 8}%` }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none opacity-90" />

              {/* Vertical Title (Collapsed) */}
              <motion.div
                variants={{
                  initial: { opacity: 0.7 },
                  hover: { opacity: 0 }
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <p className="text-white font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr] whitespace-nowrap drop-shadow-lg">
                  {item.title}
                </p>
              </motion.div>

              {/* Hover Content */}
              <motion.div 
                className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end pointer-events-none"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  hover: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative z-10">
                  <p className="text-[#f8d991] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {item.city}
                  </p>
                  <h3 className="text-white font-black text-xl md:text-2xl tracking-tight leading-tight mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-[10px] md:text-xs font-medium line-clamp-2 max-w-[240px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {item.subtitle}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[#f8d991] font-black text-[9px] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    EXPLORE <ExpandIcon />
                  </div>
                </div>
              </motion.div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8 pointer-events-auto"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="relative w-full max-w-[1100px] h-[80vh] max-h-[750px] bg-[#0a0d18] rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_150px_rgba(0,0,0,1)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full md:w-[60%] h-[40%] md:h-full overflow-hidden">
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0d18] hidden md:block" />
              </div>

              <div className="relative w-full md:w-[40%] p-10 md:p-16 flex flex-col justify-center bg-[#0a0d18]">
                <div className="flex items-center gap-3 text-[#f8d991] font-black text-xs tracking-widest uppercase mb-6">
                  <span className="w-10 h-px bg-[#f8d991]/40" />
                  {selectedItem.city}
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
                  {selectedItem.title}
                </h3>
                <p className="text-white/60 text-lg md:text-xl mb-12 leading-relaxed">
                  {selectedItem.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-10 py-5 bg-[#f8d991] text-[#0a0d18] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(248,217,145,0.2)] active:scale-95">
                    Apply Now
                  </button>
                  <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10 transition-all active:scale-95">
                    Brochure
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setSelectedId(null)} 
                className="absolute top-8 right-8 w-14 h-14 bg-white/5 hover:bg-red-500 transition-all rounded-full flex items-center justify-center text-white z-50 shadow-2xl border border-white/10 active:scale-90"
              >
                <CloseIcon />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveAccordionGallery;
