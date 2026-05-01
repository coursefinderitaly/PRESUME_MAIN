import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Minimalist icons for the expanded UI
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const DUMMY_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80', title: 'Milan Architecture', subtitle: 'Experience cutting-edge design and engineering in the heart of Italy.' },
  { id: 2, url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80', title: 'Student Community', subtitle: 'Join a vibrant, international network of ambitious scholars.' },
  { id: 3, url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1200&q=80', title: 'Venice Programs', subtitle: 'Immerse yourself in history while floating on the iconic canals.' },
  { id: 4, url: 'https://images.unsplash.com/photo-1516483638261-f40af5baacce?w=1200&q=80', title: 'Florence Arts', subtitle: 'Study where the Renaissance began, surrounded by timeless art.' },
  { id: 5, url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80', title: 'Rome Traditions', subtitle: 'Walk the ancient streets while pursuing modern academic excellence.' },
];

const InteractiveAccordionGallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const selectedItem = DUMMY_IMAGES.find((item) => item.id === selectedId);

  return (
    <div className="relative w-full max-w-[700px] h-[300px] md:h-[400px] mx-auto flex items-center justify-center pointer-events-auto">
      
      {/* ── COMPACT FAN GALLERY STATE ── */}
      <div className="relative flex items-center justify-center w-full h-full">
        {DUMMY_IMAGES.map((item, index) => {
          const isHovered = hoveredId === item.id;
          const isSelected = selectedId === item.id;
          
          // Math for the fanned out cards (5 items, index 2 is center)
          const offset = index - 2; 
          
          return (
            <motion.div
              key={item.id}
              layoutId={`card-wrapper-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              animate={{
                rotate: isSelected ? 0 : isHovered ? 0 : offset * 12,
                x: isSelected ? 0 : isHovered ? offset * 40 : offset * 60,
                y: isSelected ? 0 : isHovered ? -40 : Math.abs(offset) * 15,
                zIndex: isSelected ? 100 : isHovered ? 50 : 10 - Math.abs(offset),
                scale: isSelected ? 1 : isHovered ? 1.05 : 1,
                opacity: selectedId && !isSelected ? 0 : 1
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className={`absolute w-[180px] md:w-[220px] h-[260px] md:h-[320px] rounded-2xl overflow-hidden shadow-2xl border-[3px] border-white/10 bg-[#0a0d18] origin-bottom ${selectedId === item.id ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}`}
            >
              <motion.img 
                layoutId={`card-image-${item.id}`} 
                src={item.url} 
                alt={item.title}
                className="w-full h-full object-cover" 
              />
              
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />

              {/* Interactive Expand Icon on Hover */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered && !isSelected ? 1 : 0, scale: isHovered && !isSelected ? 1 : 0.8 }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg"
              >
                <ExpandIcon />
              </motion.div>

              {/* Fan Card Title */}
              <motion.div className="absolute bottom-4 left-0 w-full px-4 text-center">
                <motion.h3 
                  layoutId={`card-title-${item.id}`}
                  className="text-white font-black tracking-tight text-sm md:text-base drop-shadow-md"
                >
                  {item.title}
                </motion.h3>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ── EXPANDED MODAL LIGHTBOX ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 md:p-8 pointer-events-auto"
            onClick={() => setSelectedId(null)}
          >
            {/* The actual Expanded Card */}
            <motion.div
              layoutId={`card-wrapper-${selectedItem.id}`}
              className="relative w-full max-w-[1000px] h-[85vh] max-h-[700px] bg-[#0a0d18] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              {/* Left Side Image */}
              <div className="relative w-full md:w-[55%] h-[40%] md:h-full overflow-hidden">
                <motion.img 
                  layoutId={`card-image-${selectedItem.id}`} 
                  src={selectedItem.url} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover" 
                />
                {/* Seamless fade to the black background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0d18] opacity-0 md:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d18] to-transparent opacity-100 md:opacity-0" />
              </div>

              {/* Right Side Content details */}
              <div className="relative w-full md:w-[45%] p-6 md:p-12 flex flex-col justify-center bg-[#0a0d18]">
                <div className="w-12 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-6 shadow-[0_0_15px_#22d3ee]" />
                
                <motion.h3 
                  layoutId={`card-title-${selectedItem.id}`}
                  className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight"
                >
                  {selectedItem.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-white/60 text-base md:text-lg mb-8 leading-relaxed"
                >
                  {selectedItem.subtitle}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-colors border border-white/10 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    Explore Details
                  </button>
                </motion.div>
              </div>

              {/* Close Modal Button */}
              <motion.button 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setSelectedId(null)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl z-10"
              >
                <CloseIcon />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveAccordionGallery;
