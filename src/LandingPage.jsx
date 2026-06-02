import { lazy, Suspense, useRef } from 'react';

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



// ── Minimal section-level loading skeleton ─────────────────────────────────
const SectionFallback = () => (
  <div className="w-full h-[100svh] bg-[#0a0d18] animate-pulse" />
);

// ── Seamless Blur Divider between sections ─────────────────────────────────
const SectionDivider = () => (
  <div className="relative z-20 w-full h-0 pointer-events-none">
    <div className="absolute left-0 right-0 -top-12 h-24 bg-gradient-to-b from-transparent via-[#050814]/80 to-transparent z-20" />
  </div>
);

// ── Global Settings ───────────────────────────────────────────────────────
// Change this value to control how blurry the background mesh is. 
// Examples: 'blur-[20px]' (soft), 'blur-[60px]' (very blurry), 'blur-[0px]' (sharp)
const GLOBAL_BG_BLUR = 'blur-[20px]';



function LandingPage() {
  const containerRef  = useRef(null);
  const heroSectionRef  = useRef(null); 
  const whyChooseUsRef  = useRef(null); 

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#0a0d18] font-sans">
      {/* Header is eager — no animation delay */}
      <Header />

      <main className="flex-1 flex flex-col relative">
        {/* Hero is eager — first visual, must appear instantly */}
        <div ref={heroSectionRef} className="gsap-stagger-section relative z-30">
          <Hero />
        </div>
        <SectionDivider />

        {/* Container for all sections below Hero — gets the global background */}
        <div className="relative flex-1">

          {/* All below-the-fold sections are lazy + animated */}
          <Suspense fallback={<SectionFallback />}>
            <div ref={whyChooseUsRef} className="gsap-stagger-section"><WhyChooseUs /></div>
          </Suspense>
          <SectionDivider />

          <Suspense fallback={<SectionFallback />}>
            <div className="relative"><Universities /></div>
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