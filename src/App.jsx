import { lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

gsap.registerPlugin(ScrollTrigger);

// ── Minimal section-level loading skeleton ─────────────────────────────────
const SectionFallback = () => (
  <div className="w-full h-[100svh] bg-[#0a0d18] animate-pulse" />
);

// ── Stagger variants (triggers only once on first load) ────────────────────
const pageVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const sectionVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { mass: 1, stiffness: 90, damping: 20, type: 'spring' },
  },
};

// ── Wrapped lazy section with stagger slot ─────────────────────────────────
const AnimSection = ({ children }) => (
  <motion.div variants={sectionVariants}>
    {children}
  </motion.div>
);

function App() {
  const lenisRef = useRef(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d18] font-sans">
      {/* Header is eager — no animation delay */}
      <Header />

      {/* Page-level stagger container — runs only once on mount */}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero is eager — first visual, must appear instantly */}
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>

        {/* All below-the-fold sections are lazy + animated */}
        <Suspense fallback={<SectionFallback />}>
          <AnimSection><WhyChooseUs /></AnimSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AnimSection><Universities /></AnimSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AnimSection><TopCountries /></AnimSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AnimSection><ProcessTimeline /></AnimSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AnimSection><Testimonials /></AnimSection>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AnimSection><RegistrationForm /></AnimSection>
        </Suspense>
      </motion.main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;