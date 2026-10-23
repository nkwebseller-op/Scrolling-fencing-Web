'use client';

// ─── ShowcaseScrubber ─────────────────────────────────────────────────────────
// Second scroll-driven canvas section. Reuses the same canvas/drawing/preload
// architecture as FrameScrubber. Deliberately does NOT call useLenisScroll()
// — Lenis + GSAP ticker are already set up by FrameScrubber on the same page.

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TOTAL_FRAMES = 192;
const SCROLL_DISTANCE = 4000;
const FRAMES_BASE_URL = '/frames/fencing-showcase/frame_';

function frameUrl(index: number): string {
  return `${FRAMES_BASE_URL}${String(index + 1).padStart(4, '0')}.jpg`;
}

function getObjectFitCoverRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): [number, number, number, number] {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;
  if (srcAspect > dstAspect) {
    const sh = srcH;
    const sw = sh * dstAspect;
    const sx = (srcW - sw) / 2;
    return [sx, 0, sw, sh];
  } else {
    const sw = srcW;
    const sh = sw / dstAspect;
    const sy = (srcH - sh) / 2;
    return [0, sy, sw, sh];
  }
}

export default function ShowcaseScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null),
  );
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);

  // Text overlay refs — we mutate opacity directly to avoid re-renders on each tick
  const textRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── Canvas sizing ────────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  // ── Frame drawing ────────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = framesRef.current[index];
    if (!img?.complete || !img.naturalWidth) {
      let found: HTMLImageElement | null = null;
      for (let d = 1; d < TOTAL_FRAMES && !found; d++) {
        const lo = index - d;
        const hi = index + d;
        if (lo >= 0 && framesRef.current[lo]?.complete && framesRef.current[lo]!.naturalWidth) {
          found = framesRef.current[lo];
        } else if (hi < TOTAL_FRAMES && framesRef.current[hi]?.complete && framesRef.current[hi]!.naturalWidth) {
          found = framesRef.current[hi];
        }
      }
      if (!found) return;
      img = found;
    }

    const [sx, sy, sw, sh] = getObjectFitCoverRect(
      img.naturalWidth,
      img.naturalHeight,
      canvas.width,
      canvas.height,
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, []);

  // ── Image preloading ─────────────────────────────────────────────────────────
  useEffect(() => {
    const frames = framesRef.current;

    function onLoad(img: HTMLImageElement, i: number) {
      loadedCountRef.current += 1;
      setLoadProgress(loadedCountRef.current / TOTAL_FRAMES);
      if (i === 0) {
        resizeCanvas();
        drawFrame(0);
        setFirstFrameReady(true);
      }
    }

    const loadFrame = (i: number) => {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => { onLoad(img, i); };
      img.onerror = () => { loadedCountRef.current += 1; };
      frames[i] = img;
    };

    loadFrame(0);
    for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i);

    return () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (frames[i]) {
          frames[i]!.onload = null;
          frames[i]!.onerror = null;
        }
      }
    };
  }, [resizeCanvas, drawFrame]);

  // ── ScrollTrigger + text fade ────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${SCROLL_DISTANCE}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        // Frame scrub
        const idx = Math.round(self.progress * (TOTAL_FRAMES - 1));
        const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
        if (clamped !== currentFrameRef.current) {
          currentFrameRef.current = clamped;
          drawFrame(clamped);
        }

        // Text overlay: fully visible at progress 0, fades to 0 by progress 0.18
        const textOpacity = Math.max(0, 1 - self.progress / 0.18);
        if (textRef.current) textRef.current.style.opacity = String(textOpacity);
        if (gradientRef.current) gradientRef.current.style.opacity = String(Math.min(1, textOpacity * 1.2));
      },
    });

    return () => { st.kill(); };
  }, [drawFrame]);

  // ── Text entrance animation ─────────────────────────────────────────────────
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    gsap.registerPlugin(ScrollTrigger);

    const labels = text.querySelectorAll('[data-animate]');
    const ctx = gsap.context(() => {
      gsap.from(labels, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Resize handler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, drawFrame]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
      aria-label="Residential fence installation showcase"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      />

      {/* Bottom-left gradient — provides contrast for the text overlay */}
      <div
        ref={gradientRef}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 28%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* Text overlay */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          left: 'clamp(1.5rem, 5vw, 5rem)',
          maxWidth: 540,
          zIndex: 10,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <p
          data-animate
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '0.6rem',
          }}
        >
          Installation Showcase
        </p>
        <h2
          data-animate
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: '#fff',
            margin: '0 0 0.85rem',
          }}
        >
          Crafted for Your Property
        </h2>
        <p
          data-animate
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Every installation is tailored to your terrain, HOA requirements, and aesthetic vision — from post setting to final hardware, handled by our experienced crew.
        </p>
      </div>

      {/* Loading progress bar */}
      {!firstFrameReady && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'rgba(255,255,255,0.15)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadProgress * 100}%`,
              background: '#fff',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}
    </section>
  );
}
