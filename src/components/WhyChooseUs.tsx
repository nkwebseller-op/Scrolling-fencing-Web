'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHY_CHOOSE_US, type BenefitItem } from '@/data/whyChooseUs';

// ── Icons (Feather-style, 24×24 stroke) ─────────────────────────────────────

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L4.5 7v5c0 4.83 3.33 9.36 7.5 10.5 4.17-1.14 7.5-5.67 7.5-10.5V7L12 3z"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconLevel() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="20" height="10" rx="2"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2"
        stroke="#fff" strokeWidth="1.65"/>
      <path d="M2 12h2M20 12h2"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round"/>
    </svg>
  );
}

function IconDocument() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 13h8M8 17h5"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round"/>
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round"/>
      <path d="M1 14h6M9 8h6M17 16h6"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round"/>
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s-8-6.91-8-12a8 8 0 0116 0c0 5.09-8 12-8 12z"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3"
        stroke="#fff" strokeWidth="1.65"/>
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke="#fff" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ICON_MAP = {
  shield: <IconShield />,
  level: <IconLevel />,
  document: <IconDocument />,
  sliders: <IconSliders />,
  pin: <IconPin />,
  chat: <IconChat />,
} as const;

// ── Benefit card ─────────────────────────────────────────────────────────────

function BenefitCard({ item }: { item: BenefitItem }) {
  return (
    <div
      data-wcu-card
      style={{
        background: 'rgba(255,255,255,0.028)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {ICON_MAP[item.iconKey]}
      </div>

      {/* Text */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 650,
            letterSpacing: '-0.01em',
            color: '#fff',
            margin: '0 0 0.5rem',
            lineHeight: 1.3,
          }}
        >
          {item.heading}
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

export default function WhyChooseUs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const header = headerRef.current;
    const grid = gridRef.current;
    const footer = footerRef.current;
    if (!header || !grid || !footer) return;

    const headerCtx = gsap.context(() => {
      gsap.from('[data-wcu-header]', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: header, start: 'top 85%', once: true },
      });
    }, header);

    const gridCtx = gsap.context(() => {
      gsap.from('[data-wcu-card]', {
        y: 32,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });
    }, grid);

    const footerCtx = gsap.context(() => {
      gsap.from('[data-wcu-footer]', {
        y: 20,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: footer, start: 'top 88%', once: true },
      });
    }, footer);

    return () => {
      headerCtx.revert();
      gridCtx.revert();
      footerCtx.revert();
    };
  }, []);

  return (
    <section
      aria-labelledby="wcu-heading"
      style={{
        background: 'linear-gradient(180deg, #111214 0%, #0a0a0a 100%)',
        color: '#fff',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 5rem)',
      }}
    >
      {/* ── Header ── */}
      <div
        ref={headerRef}
        style={{
          textAlign: 'center',
          maxWidth: 680,
          margin: '0 auto clamp(3rem, 5vw, 4.5rem)',
        }}
      >
        <p
          data-wcu-header
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.38)',
            margin: '0 0 0.875rem',
          }}
        >
          {WHY_CHOOSE_US.label}
        </p>
        <h2
          id="wcu-heading"
          data-wcu-header
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 0 1.25rem',
          }}
        >
          {WHY_CHOOSE_US.heading}
        </h2>
        <p
          data-wcu-header
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.0625rem)',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {WHY_CHOOSE_US.description}
        </p>
      </div>

      {/* ── Benefits grid ── */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(0.875rem, 2vw, 1.25rem)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {WHY_CHOOSE_US.benefits.map((item) => (
          <BenefitCard key={item.id} item={item} />
        ))}
      </div>

      {/* ── Closing + CTA ── */}
      <div
        ref={footerRef}
        style={{
          textAlign: 'center',
          marginTop: 'clamp(3rem, 5vw, 4.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
        }}
      >
        {/* Divider */}
        <div
          data-wcu-footer
          style={{
            width: 40,
            height: 1,
            background: 'rgba(255,255,255,0.14)',
          }}
        />
        <p
          data-wcu-footer
          style={{
            fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.01em',
            margin: 0,
          }}
        >
          {WHY_CHOOSE_US.closingStatement}
        </p>
        <a
          data-wcu-footer
          href={WHY_CHOOSE_US.ctaTarget}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: 'inline-block',
            padding: '0.9375rem 2.75rem',
            background: btnHover ? 'rgba(255,255,255,0.88)' : '#fff',
            color: '#0a0a0a',
            borderRadius: 9999,
            fontWeight: 650,
            fontSize: '0.9375rem',
            letterSpacing: '-0.01em',
            textDecoration: 'none',
            boxShadow: btnHover
              ? '0 8px 32px rgba(255,255,255,0.12)'
              : '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'background 0.18s, box-shadow 0.18s',
          }}
        >
          {WHY_CHOOSE_US.ctaLabel}
        </a>
      </div>
    </section>
  );
}
