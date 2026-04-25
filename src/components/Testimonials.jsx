import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const videos = [
  { 
    id: 'k_yNVJifegg', 
    title: 'Study in Italy - Student Success Story', 
    thumbnail: 'https://img.youtube.com/vi/k_yNVJifegg/maxresdefault.jpg',
    fallbackThumbnail: 'https://img.youtube.com/vi/k_yNVJifegg/hqdefault.jpg',
  },
  { 
    id: 'RnzvZt0OWfs', 
    title: 'Work Visa Experience - Germany', 
    thumbnail: 'https://img.youtube.com/vi/RnzvZt0OWfs/hqdefault.jpg',
    fallbackThumbnail: 'https://img.youtube.com/vi/RnzvZt0OWfs/mqdefault.jpg',
  },
  { 
    id: 'ghr4xUI5dac', 
    title: 'Presume Overseas - Student Testimonial', 
    thumbnail: 'https://img.youtube.com/vi/ghr4xUI5dac/maxresdefault.jpg',
    fallbackThumbnail: 'https://img.youtube.com/vi/ghr4xUI5dac/hqdefault.jpg',
  },
];

const VideoCard = ({ vid, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState(vid.thumbnail);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group h-full w-full flex flex-col min-h-0"
    >
      <div className="relative flex-1 w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10 min-h-0">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img 
                src={thumbnailSrc} 
                alt={vid.title} 
                onError={() => {
                  if (thumbnailSrc !== vid.fallbackThumbnail) {
                    setThumbnailSrc(vid.fallbackThumbnail);
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-accent-gold/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(197,168,128,0.5)]"
                >
                  <Play className="text-primary-blue ml-1 w-8 h-8 fill-current" />
                </motion.div>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
                >
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-accent-gold transition-colors">
                    {vid.title}
                  </h3>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${vid.id}?autoplay=1&rel=0`}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm border border-white/20 transition-all z-10"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  return (
    <section className="section-safe relative h-[100svh] min-h-[600px] overflow-hidden bg-[#0a0d18] flex flex-col justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col pt-[calc(var(--section-header-offset)+16px)] pb-8">
        <div className="text-center flex-none mb-8 lg:mb-12 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-accent-gold/10 border border-accent-gold/20"
          >
            <span className="text-accent-gold text-xs font-bold tracking-[0.2em] uppercase">Testimonials</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight"
          >
            Success Stories That <span className="bg-gradient-to-r from-accent-gold to-yellow-200 bg-clip-text text-transparent">Inspire</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Real stories from real students who achieved their dreams with Presume Overseas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 flex-1 min-h-0 w-full">
          {videos.map((vid, index) => (
            <VideoCard key={vid.id} vid={vid} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
