import { useState, useEffect } from 'react';

export default function useLocalLayoutScale(baseWidth = 1536) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // On small mobile screens, we usually let CSS handle responsive layout
      // so we don't zoom out too much and make text unreadable.
      if (width <= 768) {
        setScale(1);
        return;
      }

      // Calculate relative scale based on the locked base design width
      const newScale = width / baseWidth;
      
      // Clamp the scale to prevent extreme shrinking or enlarging
      setScale(Math.min(Math.max(newScale, 0.65), 1.6));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth]);

  return scale;
}
