'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FINAL_CTA } from '@/data/finalCta';

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const content = contentRef.current;
    if (!content) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-fcta]', {
        y: 28,
        opacity: 0,
        scale: 0.97,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: content,
          start: 'top 82%',
          once: true,
        },
      });
    }, content);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="fcta-heading"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0a',
        color: '#fff',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3rem)',
        textAlign: 'center',
      }}
    >
      {/* ── Ambient lighting gradient ── */}
      {/* Top-center spotlight — suggests the soft overhead light of a dusk
          photograph without requiring an actual image asset. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(255,255,255,0.055) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Fine horizontal rule at the top — visual separator from the form above */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(100%, 960px)',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)',
        }}
      />

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          maxWidth: 720,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(1.25rem, 3vw, 1.75rem)',
        }}
      >
        {/* Overline label */}
        <p
          data-fcta
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}
        >
          {FINAL_CTA.label}
        </p>

        {/* Headline */}
        <h2
          id="fcta-heading"
          data-fcta
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
            maxWidth: '14ch',
          }}
        >
          {FINAL_CTA.heading}
        </h2>

        {/* Supporting copy */}
        <p
          data-fcta
          style={{
            fontSize: 'clamp(0.9375rem, 1.75vw, 1.0625rem)',
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            margin: 0,
          }}
        >
          {FINAL_CTA.body}
        </p>

        {/* CTA buttons */}
        <div
          data-fcta
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.875rem',
            justifyContent: 'center',
            marginTop: 'clamp(0.5rem, 1.5vw, 1rem)',
          }}
        >
          {/* Primary — matches site-wide CTA button style */}
          <a
            href={FINAL_CTA.primaryTarget}
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: primaryHover ? 'rgba(255,255,255,0.9)' : '#fff',
              color: '#0a0a0a',
              borderRadius: 9999,
              fontWeight: 650,
              fontSize: '0.9375rem',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              boxShadow: primaryHover
                ? '0 8px 32px rgba(255,255,255,0.14)'
                : '0 4px 20px rgba(0,0,0,0.5)',
              transform: primaryHover ? 'translateY(-1px)' : 'none',
              transition: 'background 0.18s ease, box-shadow 0.18s ease, transform 0.14s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {FINAL_CTA.primaryLabel}
          </a>

          {/* Secondary — ghost/outline style */}
          <a
            href={FINAL_CTA.secondaryTarget}
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: secondaryHover ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: secondaryHover ? '#fff' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${secondaryHover ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.18)'}`,
              borderRadius: 9999,
              fontWeight: 550,
              fontSize: '0.9375rem',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transform: secondaryHover ? 'translateY(-1px)' : 'none',
              transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.14s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {FINAL_CTA.secondaryLabel}
          </a>
        </div>
      </div>

      {/* ── Bottom fade-to-black edge ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
