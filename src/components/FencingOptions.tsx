'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FENCE_TYPES,
  PRICE_DISCLAIMER,
  PRIVACY_SCORE,
  DURABILITY_SCORE,
  MAINTENANCE_LABEL,
  PRIVACY_LABEL,
  DURABILITY_LABEL,
  type FenceType,
  type MaterialCategory,
  type PrivacyLevel,
  type BudgetCategory,
} from '@/data/fencing';

// ─── Filter types ─────────────────────────────────────────────────────────────
type ActiveMaterial = MaterialCategory | 'all';
type ActivePrivacy = PrivacyLevel | 'all';
type ActiveBudget = BudgetCategory | 'all';

// ─── Dot indicator ─────────────────────────────────────────────────────────────
function DotRating({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: i < score ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      ))}
    </span>
  );
}

// ─── Filter pill button ────────────────────────────────────────────────────────
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 1rem',
        borderRadius: 9999,
        border: `1px solid ${active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        fontSize: '0.8125rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s, background 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ─── Individual fence card ─────────────────────────────────────────────────────
function FenceCard({ fence }: { fence: FenceType }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-fence-card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1e1e1e' : '#161616',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.25s, border-color 0.25s, transform 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        willChange: 'transform',
      }}
    >
      {/* Accent strip */}
      <div style={{ height: 3, background: fence.accentColor, flexShrink: 0 }} />

      {/* Card body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0 }}>
              {fence.name}
            </h3>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: fence.accentColor,
              background: `${fence.accentColor}18`,
              border: `1px solid ${fence.accentColor}40`,
              borderRadius: 4,
              padding: '2px 7px',
              whiteSpace: 'nowrap',
              marginLeft: 8,
              flexShrink: 0,
            }}>
              {fence.budget === 'budget' ? 'Budget' : fence.budget === 'mid-range' ? 'Mid-Range' : 'Premium'}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', margin: 0, fontStyle: 'italic' }}>
            {fence.tagline}
          </p>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, margin: 0 }}>
          {fence.description}
        </p>

        {/* Ratings row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          padding: '0.875rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
              Privacy
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <DotRating score={PRIVACY_SCORE[fence.privacyLevel]} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                {PRIVACY_LABEL[fence.privacyLevel]}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
              Durability
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <DotRating score={DURABILITY_SCORE[fence.durability]} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                {DURABILITY_LABEL[fence.durability]}
              </span>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
              Maintenance
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
              {MAINTENANCE_LABEL[fence.maintenance]} — {fence.maintenanceNote}
            </span>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
              Lifespan
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
              {fence.durabilityNote}
            </span>
          </div>
        </div>

        {/* Advantages */}
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            Key Advantages
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fence.advantages.map((adv) => (
              <li key={adv} style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ color: fence.accentColor, marginTop: 2, flexShrink: 0 }}>›</span>
                {adv}
              </li>
            ))}
          </ul>
        </div>

        {/* Applications */}
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            Applications
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {fence.applications.map((app) => (
              <span key={app} style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                padding: '2px 8px',
              }}>
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Styles */}
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            Available Styles
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {fence.styles.map((style) => (
              <span key={style} style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                background: `${fence.accentColor}12`,
                border: `1px solid ${fence.accentColor}25`,
                borderRadius: 4,
                padding: '2px 8px',
              }}>
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff' }}>
              {fence.priceDisplay}
            </span>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.5rem 1rem',
                borderRadius: 9999,
                background: fence.accentColor,
                color: '#fff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Get a Quote
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </article>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function FencingOptions() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeMaterial, setActiveMaterial] = useState<ActiveMaterial>('all');
  const [activePrivacy, setActivePrivacy] = useState<ActivePrivacy>('all');
  const [activeBudget, setActiveBudget] = useState<ActiveBudget>('all');

  const filtered = FENCE_TYPES.filter((f) => {
    if (activeMaterial !== 'all' && f.material !== activeMaterial) return false;
    if (activePrivacy !== 'all' && f.privacyLevel !== activePrivacy) return false;
    if (activeBudget !== 'all' && f.budget !== activeBudget) return false;
    return true;
  });

  // ── ScrollTrigger entrance animations ────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // Filter bar
      if (filtersRef.current) {
        gsap.from(filtersRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards when filter changes or on scroll
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('[data-fence-card]');
    if (!cards.length) return;

    // Kill any existing ScrollTriggers on these cards
    ScrollTrigger.getAll()
      .filter((st) => cards && [...cards].some((c) => st.trigger === c))
      .forEach((st) => st.kill());

    // Set initial state
    gsap.set(cards, { y: 50, opacity: 0 });

    // Animate in with stagger triggered from the grid
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        once: true,
      },
    });
  }, [filtered.length, activeMaterial, activePrivacy, activeBudget]);

  return (
    <section
      ref={sectionRef}
      id="fencing-options"
      style={{ background: '#0d0d0d', color: '#fff', overflow: 'hidden' }}
    >
      {/* Top fade */}
      <div style={{ height: 80, background: 'linear-gradient(to bottom, #000, #0d0d0d)' }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem 6rem' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
            Our Services
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 auto 1.25rem',
            maxWidth: 700,
          }}>
            Explore Our Fencing Options
          </h2>
          <p style={{
            fontSize: '1.0625rem',
            color: 'rgba(255,255,255,0.52)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            From rustic split rail to ornamental iron, every fence we install is backed by expert craftsmanship and a commitment to lasting quality.
          </p>
        </div>

        {/* ── Filters ────────────────────────────────────────────────────────── */}
        <div
          ref={filtersRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '3rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
          }}
        >
          {/* Material filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>Material:</span>
            {(['all', 'natural-wood', 'synthetic', 'metal', 'composite'] as const).map((m) => (
              <FilterPill key={m} active={activeMaterial === m} onClick={() => setActiveMaterial(m)}>
                {m === 'all' ? 'All' : m === 'natural-wood' ? 'Natural Wood' : m === 'synthetic' ? 'Synthetic' : m === 'metal' ? 'Metal' : 'Composite'}
              </FilterPill>
            ))}
          </div>

          {/* Privacy filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>Privacy:</span>
            {(['all', 'high', 'moderate', 'low', 'none'] as const).map((p) => (
              <FilterPill key={p} active={activePrivacy === p} onClick={() => setActivePrivacy(p)}>
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </FilterPill>
            ))}
          </div>

          {/* Budget filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>Budget:</span>
            {(['all', 'budget', 'mid-range', 'premium'] as const).map((b) => (
              <FilterPill key={b} active={activeBudget === b} onClick={() => setActiveBudget(b)}>
                {b === 'all' ? 'All' : b === 'budget' ? 'Budget-Friendly' : b === 'mid-range' ? 'Mid-Range' : 'Premium'}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* ── Results count ───────────────────────────────────────────────────── */}
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', textAlign: 'right' }}>
          {filtered.length} of {FENCE_TYPES.length} fence types
        </p>

        {/* ── Card grid ──────────────────────────────────────────────────────── */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {filtered.map((fence) => (
            <FenceCard key={fence.id} fence={fence} />
          ))}
          {filtered.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '1rem',
            }}>
              No fence types match your filters.{' '}
              <button
                onClick={() => { setActiveMaterial('all'); setActivePrivacy('all'); setActiveBudget('all'); }}
                style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ── Price disclaimer ────────────────────────────────────────────────── */}
        <p style={{
          marginTop: '2.5rem',
          fontSize: '0.8125rem',
          color: 'rgba(255,255,255,0.28)',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 680,
          margin: '2.5rem auto 0',
        }}>
          <strong style={{ color: 'rgba(255,255,255,0.4)' }}>Pricing note:</strong>{' '}
          {PRICE_DISCLAIMER}
        </p>

      </div>
    </section>
  );
}
