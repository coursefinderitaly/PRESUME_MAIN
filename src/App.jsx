import { lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ── Eager-load only the above-the-fold components ──────────────────────────
import { Header }     from './components/Header';
import { Hero }       from './components/Hero';

// ── Lazy-load everything below the fold ────────────────────────────────────
const WhyChooseUs      = lazy(() => import('./components/WhyChooseUs').then(m => ({ default: m.WhyChooseUs })));
const Universities     = lazy(() => import('./components/Universities').then(m => ({ default: m.Universities })));
const TopCountries     = lazy(() => import('./components/TopCountries').then(m => ({ default: m.TopCountries })));
const ProcessTimeline  = lazy(() => import('./components/ProcessTimeline').then(m => ({ default: m.ProcessTimeline })));
const Testimonials     = lazy(() => import('./components/Testimonials').then(m => ({ default: m.Testimonials })));
const RegistrationForm = lazy(() => import('./components/RegistrationForm').then(m => ({ default: m.RegistrationForm })));
const Footer           = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Minimal section-level loading skeleton ─────────────────────────────────
const SectionFallback = () => (
  <div className="w-full h-[100svh] bg-[#0a0d18] animate-pulse" />
);

function App() {
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
    
    gsap.fromTo(
      sections,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1, // brief delay to ensure DOM is ready
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#0a0d18] font-sans">
      {/* Header is eager — no animation delay */}
      <Header />

      <main>
        {/* Hero is eager — first visual, must appear instantly */}
        <div className="gsap-stagger-section">
          <Hero />
        </div>

        {/* All below-the-fold sections are lazy + animated */}
        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><WhyChooseUs /></div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><Universities /></div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><TopCountries /></div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><ProcessTimeline /></div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><Testimonials /></div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div className="gsap-stagger-section"><RegistrationForm /></div>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;