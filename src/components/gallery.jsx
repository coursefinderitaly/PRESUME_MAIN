import React from 'react';
import { motion } from 'framer-motion';

const Gallery3D = () => {
    // Replace these with your actual photo URLs or imports
    const galleryItems = [
        { id: 1, title: 'Milan Campus', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop' },
        { id: 2, title: 'Rome Facilities', image: 'https://images.unsplash.com/photo-1516483638261-f40af5edca57?q=80&w=800&auto=format&fit=crop' },
        { id: 3, title: 'Student Housing', image: 'https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=800&auto=format&fit=crop' },
        { id: 4, title: 'Florence Labs', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop' },
        { id: 5, title: 'Padua Library', image: 'https://images.unsplash.com/photo-1513622470522-26c308a2d2eb?q=80&w=800&auto=format&fit=crop' },
        { id: 6, title: 'Graduation', image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=800&auto=format&fit=crop' },
    ];

    // The distance the photos sit from the center of the 3D ring. 
    // Increase this if you add more photos so they don't overlap.
    const radius = 350;

    return (
        <div className="relative w-full h-[700px] bg-slate-950 flex items-center justify-center overflow-hidden font-sans [perspective:1000px]">

            {/* Background Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header/Title */}
            <div className="absolute top-12 left-0 w-full text-center z-10">
                <h2 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">Campus Life</h2>
                <p className="text-slate-400 text-sm">Experience your future in Italy</p>
            </div>

            {/* The 3D Rotating Wrapper */}
            <motion.div
                animate={{ rotateY: -360 }}
                transition={{
                    duration: 40, // Controls how fast the carousel spins
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="relative w-[300px] h-[400px]"
                style={{ transformStyle: "preserve-3d" }}
            >
                {galleryItems.map((item, index) => {
                    // Calculate the angle for each photo to form a perfect circle
                    const angle = (index / galleryItems.length) * 360;

                    return (
                        <div
                            key={item.id}
                            className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group bg-slate-900"
                            style={{
                                // This is where the 3D magic happens
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                // 'backface-visibility: hidden' makes it so you don't see the reverse of the images as they spin behind the center
                                backfaceVisibility: "hidden",
                            }}
                        >
                            {/* The Photo */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Bottom Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80" />

                            {/* Photo Title */}
                            <div className="absolute bottom-6 left-0 w-full text-center px-4">
                                <h3 className="text-white font-bold text-lg tracking-wide shadow-black drop-shadow-md">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Top and Bottom gradient overlays to blend the 3D object into the background */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />

        </div>
    );
};

export default function App() {
    return (
        <div className="min-h-screen bg-slate-950">
            <Gallery3D />
        </div>
    );
}