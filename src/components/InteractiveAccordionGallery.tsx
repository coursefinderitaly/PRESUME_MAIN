import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center px-4 z-10 pointer-events-auto">
      <div className="flex items-stretch justify-center w-full h-full max-w-2xl md:max-w-3xl mx-auto gap-2 md:gap-3 py-4">
        {items.map((item, idx) => {
          const shiftDirection = idx % 2 === 0 ? 1 : -1;
          
          return (
            <motion.div
              key={item.id}
              onClick={() => navigate('/login')}
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
                    APPLY NOW <ExpandIcon />
                  </div>
                </div>
              </motion.div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveAccordionGallery;
