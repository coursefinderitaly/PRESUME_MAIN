import { lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ── Eager-load only the above-the-fold components ──────────────────────────
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AIPetMascot } from './components/AIPetMascot';

// ── Lazy-load everything below the fold ────────────────────────────────────
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs').then(m => ({ default: m.WhyChooseUs })));
const Universities = lazy(() => import('./components/Universities').then(m => ({ default: m.Universities })));
const TopCountries = lazy(() => import('./components/TopCountries').then(m => ({ default: m.TopCountries })));
const ProcessTimeline = lazy(() => import('./components/ProcessTimeline').then(m => ({ default: m.ProcessTimeline })));
const Testimonials = lazy(() => import('./components/Testimonials').then(m => ({ default: m.Testimonials })));
const RegistrationForm = lazy(() => import('./components/RegistrationForm').then(m => ({ default: m.RegistrationForm })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Minimal section-level loading skeleton ─────────────────────────────────
const SectionFallback = () => (
  <div className="w-full h-[100svh] bg-[#0a0d18] animate-pulse" />
);

// ── Seamless Blur Divider between sections ─────────────────────────────────
const SectionDivider = () => (
  <div className="relative z-20 w-full h-0 pointer-events-none">
    <div className="absolute left-0 right-0 -top-12 h-24 backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)] will-change-[backdrop-filter,transform] transform-gpu" />
  </div>
);

// ── Global Settings ───────────────────────────────────────────────────────
// Change this value to control how blurry the background mesh is. 
// Examples: 'blur-[20px]' (soft), 'blur-[60px]' (very blurry), 'blur-[0px]' (sharp)
const GLOBAL_BG_BLUR = 'blur-[20px]';

// ── Global Moving Loop Background (Below Hero) ───────────────────────────
const GlobalMovingBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050814] transform-gpu">
    {/* Animated fluid mesh background (blurred based on setting above) */}
    <div className={`absolute inset-0 ${GLOBAL_BG_BLUR} will-change-[filter,transform] transform-gpu`}>
      <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,transparent_60%)] animate-[spin_20s_linear_infinite] origin-[100%_100%] scale-[2.5] will-change-transform transform-gpu" />
      <div className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,transparent_60%)] animate-[spin_30s_linear_infinite_reverse] origin-[0%_100%] scale-[2] will-change-transform transform-gpu" />
      <div className="absolute bottom-1/4 left-1/3 w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2)_0%,transparent_60%)] animate-[spin_40s_linear_infinite] origin-[50%_0%] scale-[2] will-change-transform transform-gpu" />
    </div>

    {/* Subtle texture overlay (placed outside the blur so it stays crisp) */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
  </div>
);

function LandingPage() {
  const lenisRef = useRef(null);
  const containerRef = useRef(null);

  // Stable RAF callback so gsap.ticker doesn't re-bind on re-renders
  const rafCallback = useCallback((time) => {
    lenisRef.current?.raf(time * 1000);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      syncTouch: false,
      prevent: (node) => node.classList?.contains('no-lenis'), // escape hatch
    });

    lenisRef.current = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [rafCallback]);

  // ── Global Page-Load Timeline using GSAP ─────────────────────────────────
  useGSAP(() => {
    const sections = gsap.utils.toArray('.gsap-stagger-section');

    sections.forEach((section, i) => {
      // Hero (first section) animates immediately, others on scroll
      if (i === 0) {
        gsap.fromTo(section,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 }
        );
      } else {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#0a0d18] font-sans">
      {/* Header is eager — no animation delay */}
      <Header />

      <main className="flex-1 flex flex-col relative">
        {/* Hero is eager — first visual, must appear instantly */}
        <div className="gsap-stagger-section relative z-30">
          <Hero />
        </div>
        <SectionDivider />

        {/* Container for all sections below Hero — gets the global background */}
        <div className="relative flex-1">
          <GlobalMovingBackground />

          {/* All below-the-fold sections are lazy + animated */}
          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><WhyChooseUs /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><Universities /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><TopCountries /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><ProcessTimeline /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><Testimonials /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="gsap-stagger-section"><RegistrationForm /></div>
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <AIPetMascot />
    </div>
  );
}

export default LandingPage;