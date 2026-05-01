import React, { createContext, useContext, useEffect, useRef } from 'react';
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

  useEffect(() => {
    // Initialize Lenis
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
    // Bug in original: gsap.ticker.remove(newFn) never found the original.
    const rafLoop = (time) => {
      lenis.raf(time * 1000); // GSAP gives seconds; Lenis needs milliseconds
    };

    gsap.ticker.add(rafLoop);

    // Keep lagSmoothing at the GSAP default (500ms, 0.1) — setting it to 0
    // causes visual jerks when the tab re-focuses after being in background.
    gsap.ticker.lagSmoothing(500, 0.1);

    // ── Cleanup on unmount ──────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(rafLoop); // Removes the exact same function reference
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScrollLayout;
