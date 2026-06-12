import { useEffect } from 'react';

export default function useWindowScale(isPortal = false) {
  useEffect(() => {
    // Zoom scaling disabled to prevent conflicts with antigravity monitor
    const scale = 1;

    document.documentElement.style.zoom = scale;
    document.documentElement.style.setProperty('--scale-factor', scale);
    document.documentElement.style.setProperty('--true-vw', `${100 / scale}vw`);
    document.documentElement.style.setProperty('--true-vh', `${100 / scale}vh`);
  }, [isPortal]);
}
