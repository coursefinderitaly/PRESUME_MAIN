import React, { useEffect, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SmoothScroll = ({ children }) => {
  useLayoutEffect(() => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // Control scroll speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: 'vertical', 
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP ticker provides time in seconds, Lenis needs ms
    });

    // Disable GSAP lag smoothing to avoid jumps during heavy rendering
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup on unmount
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
