'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const DEMO_SESSION_KEY = 'ba-slider-demo-v1';

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const demoPlayedRef = useRef(false);
  const demoObj = useRef({ pos: 50 });

  const [pos, setPos] = useState(50);
  const [active, setActive] = useState(false);

  // ── Pointer drag (captured on handle, position calculated against container) ──
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    setActive(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    setPos(pct);
    demoObj.current.pos = pct;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setActive(false);
  }, []);

  // ── Keyboard accessibility ───────────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(p => Math.max(2, p - step)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setPos(p => Math.min(98, p + step)); }
    else if (e.key === 'Home') { e.preventDefault(); setPos(2); }
    else if (e.key === 'End') { e.preventDefault(); setPos(98); }
  }, []);

  // ── Header entrance animation ────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const header = headerRef.current;
    if (!header) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.from(header.querySelectorAll('[data-ba]'), {
          y: 28, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1,
        });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(header);
    return () => obs.disconnect();
  }, []);

  // ── One-time demo animation on first viewport entry ──────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      demoPlayedRef.current = true;
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    try {
      if (sessionStorage.getItem(DEMO_SESSION_KEY)) {
        demoPlayedRef.current = true;
        return;
      }
    } catch { /* sessionStorage may be blocked */ }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !demoPlayedRef.current) {
        demoPlayedRef.current = true;
        try { sessionStorage.setItem(DEMO_SESSION_KEY, '1'); } catch { /* ignore */ }
        obs.disconnect();

        // Brief demo: sweep to 26% revealing the AFTER, then back to 50%
        gsap.timeline({ delay: 0.9 })
          .to(demoObj.current, {
            pos: 26,
            duration: 1.3,
            ease: 'power2.inOut',
            onUpdate: () => { if (!isDragging.current) setPos(demoObj.current.pos); },
          })
          .to(demoObj.current, {
            pos: 50,
            duration: 1.0,
            ease: 'power2.out',
            delay: 0.6,
            onUpdate: () => { if (!isDragging.current) setPos(demoObj.current.pos); },
          });
      }
    }, { threshold: 0.5 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const clipBefore = `inset(0 ${(100 - pos).toFixed(3)}% 0 0)`;

  return (
    <section
      ref={sectionRef}
      id="before-after"
      aria-label="Before and after fence installation comparison"
      style={{ background: '#111214', color: '#fff' }}
    >
      {/* ── Header ── */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: 'clamp(3rem,6vw,5rem) 2rem 2.5rem',
          maxWidth: 680,
          margin: '0 auto',
        }}
      >
        <p
          data-ba
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.42)',
            marginBottom: '0.75rem',
            margin: '0 0 0.75rem',
          }}
        >
          Our Work
        </p>
        <h2
          data-ba
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 0 1rem',
          }}
        >
          See the Transformation
        </h2>
        <p
          data-ba
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.0625rem)',
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Drag the slider left and right to reveal the difference a professionally
          installed fence makes.
        </p>
      </div>

      {/* ── Slider ── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: '#000',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: 'col-resize',
          touchAction: 'pan-y',
        }}
      >
        {/* AFTER image — bottom layer, always fully visible */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/before-after/after.svg"
          alt="After: cedar privacy fence installed on residential property"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* BEFORE image — top layer, clipped to left of handle */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: clipBefore,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/before-after/before.svg"
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* BEFORE label */}
        <span
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(0,0,0,0.58)',
            backdropFilter: 'blur(8px)',
            borderRadius: 9999,
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: pos < 14 ? 0 : 1,
            transition: 'opacity 0.25s',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          Before
        </span>

        {/* AFTER label */}
        <span
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(0,0,0,0.58)',
            backdropFilter: 'blur(8px)',
            borderRadius: 9999,
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: pos > 86 ? 0 : 1,
            transition: 'opacity 0.25s',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          After
        </span>

        {/* Divider line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: 2,
            background: 'rgba(255,255,255,0.9)',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.55)',
            pointerEvents: 'none',
            zIndex: 8,
          }}
        />

        {/* Handle */}
        <div
          role="slider"
          aria-valuemin={2}
          aria-valuemax={98}
          aria-valuenow={Math.round(pos)}
          aria-label="Before and after comparison slider — use arrow keys to adjust"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pos}%`,
            transform: 'translate(-50%, -50%)',
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: active ? '#e5e5e5' : '#fff',
            border: '2.5px solid rgba(255,255,255,0.92)',
            boxShadow: active
              ? '0 0 0 5px rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.55)'
              : '0 2px 14px rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            cursor: 'col-resize',
            touchAction: 'none',
            outline: 'none',
            zIndex: 10,
            transition: 'background 0.12s, box-shadow 0.12s',
          }}
          // Visible focus ring via CSS in the div below
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 0 3px #fff, 0 0 0 6px rgba(255,255,255,0.4)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 2px 14px rgba(0,0,0,0.45)';
          }}
        >
          {/* Left chevron */}
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
            <path d="M8 2L2 8L8 14" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Right chevron */}
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
            <path d="M2 2L8 8L2 14" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ── Footer note ── */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.6875rem',
          color: 'rgba(255,255,255,0.22)',
          padding: '0.875rem 2rem 4rem',
          margin: 0,
          letterSpacing: '0.03em',
        }}
      >
        Sample illustrations shown — will be replaced with actual project photos
      </p>
    </section>
  );
}
