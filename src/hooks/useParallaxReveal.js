import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useParallaxReveal
 *
 * Attaches a parallax "pin + reveal" effect to a Hero / next-section pair.
 *
 * @param {React.RefObject} heroRef        - Ref pointing to the Hero <section> element.
 * @param {React.RefObject} revealRef      - Ref pointing to the element that slides up over Hero.
 * @param {object}          options
 * @param {number}          options.pinDuration    - How many px of scroll to keep Hero pinned. Default: 300.
 * @param {number}          options.heroScale       - How much Hero scales down while pinned. Default: 0.92.
 * @param {number}          options.heroOpacityEnd  - Hero opacity at the end of pin. Default: 0.
 * @param {number}          options.revealStartY    - revealRef starting translateY (px below viewport). Default: 120.
 * @param {number}          options.scrubStrength   - GSAP scrub factor. Default: 1.5.
 */
const useParallaxReveal = (heroRef, revealRef, options = {}) => {
  const {
    pinDuration    = 300,
    heroScale      = 0.92,
    heroOpacityEnd = 0,
    revealStartY   = 120,
    scrubStrength  = 1.5,
  } = options;

  // Store the ScrollTrigger instances so we can kill them precisely on cleanup
  const triggersRef = useRef([]);

  useEffect(() => {
    // Guard: both elements must be in the DOM
    if (!heroRef.current || !revealRef.current) return;

    const hero   = heroRef.current;
    const reveal = revealRef.current;

    // ── 1. Pin the Hero and scale/fade it as user scrolls ──────────────────
    //
    // `pin: true`  → Hero stays fixed in viewport while scroll advances `pinDuration` px.
    // `scrub`      → ties animation progress directly to scroll position (no React state).
    // `anticipatePin: 1` → prevents a 1-frame jump when the pin activates.
    //
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger:       hero,
        start:         'top top',       // pin starts when Hero hits top of viewport
        end:           `+=${pinDuration}`,
        pin:           true,
        scrub:         scrubStrength,
        anticipatePin: 1,
        // Store the instance reference so cleanup is exact — no anonymous callbacks
        onToggle: (self) => {
          // Optional: log for debugging without React state
          // console.log('[HeroPin] active:', self.isActive);
        },
      },
    });

    heroTimeline.to(hero, {
      scale:   heroScale,
      opacity: heroOpacityEnd,
      // transformOrigin stays 'center center' so Hero shrinks from the middle
      ease: 'none', // `none` = perfectly linear — scrub handles the easing
    });

    // ── 2. Slide the reveal section up over the pinned Hero ─────────────────
    //
    // Starts when Hero's ScrollTrigger activates (same `start` point).
    // The revealRef element slides from `revealStartY` px below its natural
    // position to its natural position — purely transform-based (GPU only).
    //
    const revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger:  hero,           // sync to Hero's scroll position, not revealRef
        start:    'top top',
        end:      `+=${pinDuration}`,
        scrub:    scrubStrength,
      },
    });

    revealTimeline.fromTo(
      reveal,
      {
        y:       revealStartY,
        opacity: 0,
      },
      {
        y:       0,
        opacity: 1,
        ease:    'power2.out',
      },
    );

    // ── Store for precise cleanup ────────────────────────────────────────────
    triggersRef.current = [
      heroTimeline.scrollTrigger,
      revealTimeline.scrollTrigger,
    ];

    // ── Cleanup on unmount / dependency change ───────────────────────────────
    // Kills only these two ScrollTriggers — does not touch any other GSAP animations.
    return () => {
      triggersRef.current.forEach((st) => st?.kill());
      triggersRef.current = [];
      heroTimeline.kill();
      revealTimeline.kill();
    };

    // We intentionally omit `options.*` from deps — they should be stable constants
    // passed from the parent. If they need to be reactive, wrap them in useMemo first.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroRef, revealRef]);
};

export default useParallaxReveal;
