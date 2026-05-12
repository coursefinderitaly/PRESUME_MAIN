import React, { useState, useEffect, useRef } from 'react';

const FPSMeter = () => {
  const [fps, setFps] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(performance.now());

  useEffect(() => {
    const animate = (time) => {
      frameCountRef.current += 1;
      
      if (time - lastUpdateRef.current > 500) { // Update twice per second
        const calculatedFps = Math.round((frameCountRef.current * 1000) / (time - lastUpdateRef.current));
        setFps(calculatedFps);
        frameCountRef.current = 0;
        lastUpdateRef.current = time;
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Dynamic color based on perf sanity
  const getColor = () => {
    if (fps >= 55) return '#10b981'; // Green
    if (fps >= 40) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="relative flex items-center justify-center w-2 h-2">
          <div className="absolute w-full h-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: getColor() }} />
          <div className="relative w-2 h-2 rounded-full" style={{ backgroundColor: getColor() }} />
        </div>
        <span className="text-xs font-black text-white font-mono tracking-wider">{fps} <span className="text-white/40 text-[10px]">FPS</span></span>
      </div>
    </div>
  );
};

export default FPSMeter;
