import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── 1. Register GSAP plugins once at module level ───────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── 2. Context — lets child components access the lenis instance if needed ──
export const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

// ─── 3. The wrapper component ─────────────────────────────────────────────────
const SmoothScrollLayout = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  // Detect if user is currently inside operational portal dashboard routes
  const isOperationalView = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  useEffect(() => {
    // IF operational view (Dashboard/Admin), bypass smooth scroll setup and fallback to native
    if (isOperationalView) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    // Initialize Lenis for landing and content pages
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // ── Sync Lenis scroll events → GSAP ScrollTrigger ──────────────────────
    lenis.on('scroll', ScrollTrigger.update);

    // ── Named RAF function so we can PRECISELY remove it later ─────────────
    const rafLoop = (time) => {
      lenis.raf(time * 1000); // GSAP gives seconds; Lenis needs milliseconds
    };

    gsap.ticker.add(rafLoop);
    gsap.ticker.lagSmoothing(500, 0.1);

    // ── Cleanup on unmount ──────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(rafLoop);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isOperationalView]); // Destroys/re-creates instance when navigating in/out of portal

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScrollLayout;
