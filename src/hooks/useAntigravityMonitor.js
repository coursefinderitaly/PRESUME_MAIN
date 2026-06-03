import { useState, useEffect } from 'react';

export default function useAntigravityMonitor() {
  const [scaleStyle, setScaleStyle] = useState({
    width: '1920px',
    height: '1080px',
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%) scale(1)',
    transformOrigin: 'top center',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // We only scale based on width to prevent horizontal squishing.
      // This allows the height to flow naturally based on browser UI (tabs, taskbar, etc)
      const scaleFactor = Math.min(currentWidth / 1920, 1);
      
      // Calculate inverse dimensions so that after scaling, it exactly fills the physical viewport
      const targetWidth = currentWidth > 1920 ? 1920 : currentWidth / scaleFactor;
      const targetHeight = currentHeight / scaleFactor;
      
      setScaleStyle({
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: `translateX(-50%) scale(${scaleFactor})`,
        transformOrigin: 'top center',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      });
    };

    // Run on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return scaleStyle;
}
