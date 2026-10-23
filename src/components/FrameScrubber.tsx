'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisScroll } from '@/hooks/useLenisScroll';

const TOTAL_FRAMES = 192;
const SCROLL_DISTANCE = 4000;
const FRAMES_BASE_URL = '/frames/fencing-hero/frame_';

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
    // source wider than dest — crop left/right
    const sh = srcH;
    const sw = sh * dstAspect;
    const sx = (srcW - sw) / 2;
    return [sx, 0, sw, sh];
  } else {
    // source taller than dest — crop top/bottom
    const sw = srcW;
    const sh = sw / dstAspect;
    const sy = (srcH - sh) / 2;
    return [0, sy, sw, sh];
  }
}

export default function FrameScrubber() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null),
  );
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useLenisScroll();

  // ── Canvas sizing ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Cap DPR at 2 — beyond that the extra resolution rarely improves perceived
    // quality on small screens but doubles/triples GPU memory and draw cost.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  // ── Frame drawing ──────────────────────────────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find the requested frame, fall back to nearest loaded one
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

  // ── Image preloading ───────────────────────────────────────────────────────
  useEffect(() => {
    const frames = framesRef.current;

    function onLoad(img: HTMLImageElement, i: number) {
      loadedCountRef.current += 1;
      const pct = loadedCountRef.current / TOTAL_FRAMES;
      setLoadProgress(pct);
      if (i === 0) {
        resizeCanvas();
        drawFrame(0);
        setFirstFrameReady(true);
      }
    }

    // Load frame 0 first, then the rest in order
    const loadFrame = (i: number) => {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => { onLoad(img, i); };
      img.onerror = () => { loadedCountRef.current += 1; };
      frames[i] = img;
    };

    loadFrame(0);
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      loadFrame(i);
    }

    return () => {
      // Cancel pending loads by clearing src
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (frames[i]) {
          frames[i]!.onload = null;
          frames[i]!.onerror = null;
        }
      }
    };
  }, [resizeCanvas, drawFrame]);

  // ── ScrollTrigger ──────────────────────────────────────────────────────────
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
        const idx = Math.round(self.progress * (TOTAL_FRAMES - 1));
        const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
        if (clamped !== currentFrameRef.current) {
          currentFrameRef.current = clamped;
          drawFrame(clamped);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [drawFrame]);

  // ── Resize handler ─────────────────────────────────────────────────────────
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
      aria-label="Fencing installation animation"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          willChange: 'contents',
        }}
      />

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
