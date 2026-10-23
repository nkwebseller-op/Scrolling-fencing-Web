'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS, type TestimonialItem } from '@/data/testimonials';

const GAP = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ── Star rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rounded ? '#111' : 'none'}
          stroke={i < rounded ? '#111' : '#ccc'}
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ── Source badge ──────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  yelp: 'Yelp',
  direct: 'Direct',
};

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      style={{
        fontSize: '0.6875rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: '#888',
        background: '#ebebed',
        borderRadius: 4,
        padding: '2px 6px',
      }}
    >
      {SOURCE_LABELS[source] ?? source}
    </span>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <article
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 'clamp(1.375rem, 3vw, 1.875rem)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Decorative quotation mark */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 16,
          right: 22,
          fontSize: '4.5rem',
          lineHeight: 1,
          color: 'rgba(0,0,0,0.045)',
          fontFamily: 'Georgia, "Times New Roman", serif',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        &ldquo;
      </span>

      {item.rating != null && <StarRating rating={item.rating} />}

      <p
        style={{
          fontSize: 'clamp(0.875rem, 1.15vw, 0.9375rem)',
          lineHeight: 1.72,
          color: '#333',
          margin: 0,
          flexGrow: 1,
        }}
      >
        &ldquo;{item.reviewText}&rdquo;
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          paddingTop: '0.875rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 650, fontSize: '0.875rem', color: '#111' }}>
          {item.displayName}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {item.reviewDate && (
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
              {formatDate(item.reviewDate)}
            </span>
          )}
          {item.source && <SourceBadge source={item.source} />}
        </div>
      </div>
    </article>
  );
}

// ── Nav arrow button ──────────────────────────────────────────────────────────

function NavArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={dir === 'prev' ? 'Previous review' : 'Next review'}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.12)',
        background: hover && !disabled ? '#ebebed' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.28 : 1,
        transition: 'background 0.14s, opacity 0.14s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {dir === 'prev' ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

// ── Development placeholder notice ───────────────────────────────────────────

function DevNotice() {
  return (
    <div
      role="note"
      aria-label="Developer notice"
      style={{
        background: '#fffbeb',
        border: '1px solid #fbbf24',
        borderRadius: 8,
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        marginBottom: '2.25rem',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: 1 }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.55 }}>
        <strong>Development placeholder —</strong> these reviews are not real customer feedback.
        Replace each item in{' '}
        <code
          style={{
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.06)',
            padding: '1px 4px',
            borderRadius: 3,
          }}
        >
          src/data/testimonials.ts
        </code>{' '}
        with verified customer reviews and remove the{' '}
        <code
          style={{
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.06)',
            padding: '1px 4px',
            borderRadius: 3,
          }}
        >
          isPlaceholder: true
        </code>{' '}
        flag before publishing.
      </p>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [navState, setNavState] = useState({ atStart: true, atEnd: false });
  const [ctaHover, setCtaHover] = useState(false);

  const items = TESTIMONIALS.items as ReadonlyArray<TestimonialItem>;
  const total = items.length;
  const hasPlaceholders = items.some((t) => t.isPlaceholder);

  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 320;
    return (track.children[0] as HTMLElement).offsetWidth;
  }, []);

  const updateNavState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setNavState({
      atStart: track.scrollLeft < 2,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
    });
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      track.scrollTo({ left: clamped * (getCardWidth() + GAP), behavior: 'smooth' });
    },
    [total, getCardWidth],
  );

  const onTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardW = getCardWidth();
    const idx = Math.round(track.scrollLeft / (cardW + GAP));
    setCurrentIndex(Math.max(0, Math.min(total - 1, idx)));
    updateNavState();
  }, [total, getCardWidth, updateNavState]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = trackRef.current?.scrollLeft ?? 0;
    setIsGrabbing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current);
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setIsGrabbing(false);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      }
    },
    [currentIndex, scrollToIndex],
  );

  // Compute initial nav state and keep it updated on resize
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateNavState();
    const ro = new ResizeObserver(updateNavState);
    ro.observe(track);
    return () => ro.disconnect();
  }, [updateNavState]);

  // GSAP entrance animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const header = headerRef.current;
    const track = trackRef.current;
    const footer = footerRef.current;
    if (!header || !track || !footer) return;

    const hCtx = gsap.context(() => {
      gsap.from('[data-t-header]', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: header, start: 'top 85%', once: true },
      });
    }, header);

    const tCtx = gsap.context(() => {
      gsap.from(track, {
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: track, start: 'top 88%', once: true },
      });
    });

    const fCtx = gsap.context(() => {
      gsap.from('[data-t-footer]', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
      });
    }, footer);

    return () => {
      hCtx.revert();
      tCtx.revert();
      fCtx.revert();
    };
  }, []);

  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{
        background: '#f5f5f7',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 5rem)',
      }}
    >
      {/* Responsive carousel styles */}
      <style>{`
        .t-track {
          display: flex;
          gap: ${GAP}px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          outline: none;
        }
        .t-track::-webkit-scrollbar { display: none; }
        .t-card {
          flex: 0 0 min(300px, 84vw);
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .t-card { flex: 0 0 calc(50% - ${GAP / 2}px); }
        }
        @media (min-width: 900px) {
          .t-card { flex: 0 0 calc(33.333% - ${((2 * GAP) / 3).toFixed(2)}px); }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Dev placeholder notice — hidden in production */}
        {hasPlaceholders && process.env.NODE_ENV !== 'production' && <DevNotice />}

        {/* ── Section header ── */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            maxWidth: 620,
            margin: '0 auto clamp(2.5rem, 4.5vw, 4rem)',
          }}
        >
          <h2
            id="testimonials-heading"
            data-t-header
            style={{
              fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: '#111',
              margin: '0 0 1rem',
            }}
          >
            {TESTIMONIALS.heading}
          </h2>
          <p
            data-t-header
            style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.0625rem)',
              color: '#666',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {TESTIMONIALS.description}
          </p>
        </div>

        {/* ── Carousel track ── */}
        <div
          ref={trackRef}
          className="t-track"
          role="region"
          aria-label="Customer reviews"
          tabIndex={0}
          style={{ cursor: isGrabbing ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onScroll={onTrackScroll}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <div key={item.id} className="t-card">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>

        {/* ── Navigation dots + arrows ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            marginTop: '1.75rem',
          }}
        >
          <NavArrow
            dir="prev"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={navState.atStart}
          />

          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to review ${i + 1} of ${total}`}
              aria-current={i === currentIndex ? true : undefined}
              style={{
                width: i === currentIndex ? 22 : 8,
                height: 8,
                borderRadius: 9999,
                border: 'none',
                padding: 0,
                background: i === currentIndex ? '#111' : 'rgba(0,0,0,0.18)',
                cursor: 'pointer',
                transition: 'width 0.22s ease, background 0.22s ease',
                flexShrink: 0,
              }}
            />
          ))}

          <NavArrow
            dir="next"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={navState.atEnd}
          />
        </div>

        {/* ── CTA ── */}
        <div
          ref={footerRef}
          style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 4.5vw, 4rem)' }}
        >
          <a
            data-t-footer
            href={TESTIMONIALS.ctaTarget}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              display: 'inline-block',
              padding: '0.9375rem 2.75rem',
              background: ctaHover ? '#222' : '#111',
              color: '#fff',
              borderRadius: 9999,
              fontWeight: 650,
              fontSize: '0.9375rem',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              boxShadow: ctaHover
                ? '0 8px 24px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(0,0,0,0.12)',
              transition: 'background 0.18s, box-shadow 0.18s',
            }}
          >
            {TESTIMONIALS.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
