import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveBackground({ 
  color1 = "bg-indigo-600/20", 
  color2 = "bg-rose-600/20", 
  color3 = "bg-purple-500/20" 
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the interactive orb to trail behind the mouse slightly
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    
    // Default position to center of screen before mouse moves
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
    
    const handleMouseMove = (e) => {
      // Offset by half the orb size (200px) so the center of the orb follows the cursor
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Slow pulsing static background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full ${color1} blur-[150px] mix-blend-screen`}
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full ${color2} blur-[160px] mix-blend-screen`}
      />
      
      {/* Mouse interactive trailing orb */}
      {mounted && (
        <motion.div
          style={{ x: springX, y: springY }}
          className={`absolute top-0 left-0 w-[400px] h-[400px] rounded-full ${color3} blur-[140px] mix-blend-screen`}
        />
      )}
    </div>
  );
}
