import { useEffect } from 'react';

export default function useWindowScale() {
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      
      // We only want to scale desktop screens, let mobile handle itself
      if (windowWidth >= 1024) {
        // The design was likely optimized on a high-res display (e.g. 2560px or larger).
        // By setting targetWidth to 2560, a 1920x1080 display will correctly zoom out 
        // to ~0.75 scale, fitting the content perfectly as it looked on the large screen.
        const targetWidth = 2560; 
        
        let scale = windowWidth / targetWidth;
        
        // Cap the scale between 0.4 and 1.2 to prevent extreme sizes
        scale = Math.max(0.4, Math.min(scale, 1.2));

        // Apply scale using CSS zoom (supported in all major browsers including Firefox 126+)
        document.documentElement.style.zoom = scale;
      } else {
        // Reset for mobile/tablet devices
        document.documentElement.style.zoom = 1;
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
  }, []);
}
