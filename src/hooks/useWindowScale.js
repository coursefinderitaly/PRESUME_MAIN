import { useEffect } from 'react';

export default function useWindowScale(isPortal = false) {
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      
      if (isPortal) {
        document.documentElement.style.zoom = 1;
        document.documentElement.style.setProperty('--scale-factor', 1);
        document.documentElement.style.setProperty('--true-vw', `100vw`);
        document.documentElement.style.setProperty('--true-vh', `100vh`);
        return;
      }

      // External Pages Scaling Logic:
      if (windowWidth >= 1024) {
        // We use 1536px (standard large laptop / 1080p with 125% scale) as our baseline 1.0 scale.
        const baseWidth = 1536;
        let scale = windowWidth / baseWidth;
        
        // Cap the maximum scale so it doesn't get massively upscaled on 4K monitors (max 1.05)
        // Cap the minimum scale so it doesn't become illegible on small 1024px screens (min 0.75)
        scale = Math.max(0.75, Math.min(scale, 1.05));

        document.documentElement.style.zoom = scale;
        document.documentElement.style.setProperty('--scale-factor', scale);
        document.documentElement.style.setProperty('--true-vw', `${window.innerWidth / scale}px`);
        document.documentElement.style.setProperty('--true-vh', `${window.innerHeight / scale}px`);
      } else {
        // Reset scale for mobile and tablet to let native responsive CSS handle it
        document.documentElement.style.zoom = 1;
        document.documentElement.style.setProperty('--scale-factor', 1);
        document.documentElement.style.setProperty('--true-vw', `${window.innerWidth}px`);
        document.documentElement.style.setProperty('--true-vh', `${window.innerHeight}px`);
      }
    };

    // Run on mount
    handleResize();

    // Attach listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up
      document.documentElement.style.zoom = 1;
    };
  }, [isPortal]);
}
