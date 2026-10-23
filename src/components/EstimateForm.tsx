'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitEstimate, type EstimateState } from '@/app/actions/submitEstimate';
import {
  FENCE_TYPES,
  PROPERTY_TYPES,
  FENCE_LENGTHS,
  FENCE_HEIGHTS,
  GATE_COUNTS,
  TIMELINES,
} from '@/data/estimateFormOptions';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
.ef-layout {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: clamp(3rem, 6vw, 5rem);
  align-items: start;
  max-width: 1060px;
  margin: 0 auto;
}
@media (max-width: 860px) {
  .ef-layout { grid-template-columns: 1fr; gap: 2.5rem; }
}
.ef-sticky {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
@media (max-width: 860px) {
  .ef-sticky {
    position: static;
  }
}
.ef-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.ef-full { grid-column: 1 / -1; }
@media (max-width: 560px) {
  .ef-grid { grid-template-columns: 1fr; }
  .ef-full { grid-column: auto; }
}
.ef-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.ef-label {
  font-size: 0.8125rem;
  font-weight: 550;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.ef-req {
  color: #f87171;
  font-size: 0.9rem;
  line-height: 1;
}
.ef-input {
  width: 100%;
  padding: 0.6875rem 0.875rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9375rem;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.15s ease, background 0.15s ease, outline-color 0.15s ease;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
}
.ef-input::placeholder { color: rgba(255,255,255,0.22); }
.ef-input:hover:not(:disabled) {
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
}
.ef-input:focus {
  outline: 2px solid rgba(255,255,255,0.18);
  outline-offset: 1px;
  border-color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.08);
}
.ef-input[aria-invalid="true"] {
  border-color: rgba(248,113,113,0.6);
  background: rgba(248,113,113,0.05);
}
.ef-input[aria-invalid="true"]:focus {
  outline-color: rgba(248,113,113,0.25);
}
.ef-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ef-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.38)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.25rem;
  cursor: pointer;
}
.ef-select option { background: #1c1c1e; color: #fff; }
.ef-textarea { resize: vertical; min-height: 108px; line-height: 1.65; }
.ef-error {
  font-size: 0.8125rem;
  color: #f87171;
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
}
.ef-error::before {
  content: "!";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  min-width: 14px;
  border-radius: 50%;
  background: rgba(248,113,113,0.25);
  font-size: 0.625rem;
  font-weight: 700;
  margin-top: 0.05rem;
}
.ef-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background: #fff;
  color: #0a0a0a;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 650;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
.ef-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.9);
  transform: translateY(-1px);
  box-shadow: 0 7px 28px rgba(0,0,0,0.6);
}
.ef-btn:active:not(:disabled) { transform: translateY(0); }
.ef-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.ef-btn-loading::after {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0,0,0,0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: ef-spin 0.7s linear infinite;
  margin-left: 0.6rem;
  vertical-align: middle;
}
@keyframes ef-spin { to { transform: rotate(360deg); } }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="ef-error">
      {message}
    </span>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={`ef-field${className ? ` ${className}` : ''}`}>
      <label htmlFor={id} className="ef-label">
        {label}
        {required && <span className="ef-req" aria-hidden="true">*</span>}
        {optional && (
          <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.3)', textTransform: 'none', fontSize: '0.75rem', letterSpacing: 0 }}>
            optional
          </span>
        )}
      </label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

// ─── Success panel ────────────────────────────────────────────────────────────

function SuccessPanel({ focusRef }: { focusRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      aria-live="polite"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 'clamp(2rem, 5vw, 3rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.25rem',
        outline: 'none',
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(74,222,128,0.12)',
          border: '1.5px solid rgba(74,222,128,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4 4L19 7"
            stroke="rgba(74,222,128,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <h3
          style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            fontWeight: 650,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Your inquiry has been sent
        </h3>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            maxWidth: 380,
            margin: '0 auto',
          }}
        >
          We&apos;ve received your request and will follow up with a written estimate.
          Keep an eye on your inbox.
        </p>
      </div>
    </div>
  );
}

// ─── Error banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        background: 'rgba(248,113,113,0.08)',
        border: '1px solid rgba(248,113,113,0.25)',
        borderRadius: 10,
        padding: '0.875rem 1rem',
        color: '#fca5a5',
        fontSize: '0.875rem',
        lineHeight: 1.55,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
          stroke="#fca5a5"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        {message ||
          "We couldn’t send your inquiry. Please check your connection and try again, or call us directly."}
      </span>
    </div>
  );
}

// ─── Trust signal list ────────────────────────────────────────────────────────

function TrustItem({ text }: { text: string }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        color: 'rgba(255,255,255,0.55)',
        fontSize: '0.9375rem',
        lineHeight: 1.5,
        listStyle: 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }} aria-hidden="true">
        <path
          d="M20 6L9 17l-5-5"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const INITIAL_STATE: EstimateState = { status: 'idle' };

export default function EstimateForm() {
  const [state, formAction, isPending] = useActionState(submitEstimate, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [fenceType, setFenceType] = useState('');

  // Read URL param to preselect fence type (e.g. ?type=wood or ?fenceType=vinyl)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('type') ?? params.get('fenceType') ?? '').toLowerCase();
    if (raw) {
      const match = FENCE_TYPES.find(
        (f) => f.value.toLowerCase() === raw || f.label.toLowerCase() === raw,
      );
      if (match) setFenceType(match.value);
    }
  }, []);

  // Focus first invalid field when server returns validation errors
  useEffect(() => {
    if (state.status !== 'validation' || !state.errors) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
  }, [state]);

  // Move focus to success panel on confirmation
  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus();
    }
  }, [state.status]);

  const errors = state.status === 'validation' ? (state.errors ?? {}) : {};

  const aria = (name: string) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` }
      : {};

  return (
    <section
      id="estimate"
      aria-labelledby="ef-heading"
      style={{
        background: '#0d0d0d',
        color: '#fff',
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 3rem)',
      }}
    >
      {/* Injected styles */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ef-layout">
        {/* ── Left: context panel ── */}
        <div className="ef-sticky">
          <div>
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 0.875rem',
              }}
            >
              Free Estimate
            </p>
            <h2
              id="ef-heading"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem',
              }}
            >
              Tell Us About Your Fencing Project
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Share the details of your project and we&apos;ll put together a
              written estimate — no obligation, no pressure.
            </p>
          </div>

          {/* Trust signals */}
          <ul
            style={{
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            <TrustItem text="No cost, no commitment to proceed" />
            <TrustItem text="Written estimate before any work begins" />
            <TrustItem text="Your information stays with us" />
          </ul>

          {/* Privacy note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              padding: '0.875rem 1rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.65"
              />
              <path
                d="M7 11V7a5 5 0 0110 0v4"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.65"
                strokeLinecap="round"
              />
            </svg>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We use this information only to prepare your estimate and follow up
              about your project. We do not sell or share your details with third parties.
            </p>
          </div>
        </div>

        {/* ── Right: form card ── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 'clamp(1.5rem, 4vw, 2.25rem)',
          }}
        >
          {state.status === 'success' ? (
            <SuccessPanel focusRef={successRef} />
          ) : (
            <>
              {state.status === 'error' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <ErrorBanner message={state.message} />
                </div>
              )}

              <form ref={formRef} action={formAction} noValidate>
                {/* Honeypot — hidden from users, fills in for bots */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="ef-website">Website (leave blank)</label>
                  <input
                    id="ef-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="ef-grid">
                  {/* Full Name */}
                  <Field id="fullName" label="Full Name" required error={errors.fullName}>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="ef-input"
                      placeholder="Jane Smith"
                      autoComplete="name"
                      required
                      disabled={isPending}
                      {...aria('fullName')}
                    />
                  </Field>

                  {/* Email */}
                  <Field id="email" label="Email Address" required error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="ef-input"
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      {...aria('email')}
                    />
                  </Field>

                  {/* Phone */}
                  <Field id="phone" label="Phone Number" required error={errors.phone}>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="ef-input"
                      placeholder="(555) 123-4567"
                      autoComplete="tel"
                      required
                      disabled={isPending}
                      {...aria('phone')}
                    />
                  </Field>

                  {/* ZIP */}
                  <Field id="zip" label="Property ZIP Code" required error={errors.zip}>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      inputMode="numeric"
                      className="ef-input"
                      placeholder="12345"
                      autoComplete="postal-code"
                      required
                      disabled={isPending}
                      {...aria('zip')}
                    />
                  </Field>

                  {/* Property Type */}
                  <Field id="propertyType" label="Property Type" required error={errors.propertyType}>
                    <select
                      id="propertyType"
                      name="propertyType"
                      className="ef-input ef-select"
                      required
                      disabled={isPending}
                      defaultValue=""
                      {...aria('propertyType')}
                    >
                      <option value="" disabled>Select type…</option>
                      {PROPERTY_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Timeline */}
                  <Field id="timeline" label="Project Timeline" required error={errors.timeline}>
                    <select
                      id="timeline"
                      name="timeline"
                      className="ef-input ef-select"
                      required
                      disabled={isPending}
                      defaultValue=""
                      {...aria('timeline')}
                    >
                      <option value="" disabled>Select timeline…</option>
                      {TIMELINES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Fencing Type — full width, key field */}
                  <Field
                    id="fenceType"
                    label="Preferred Fencing Type"
                    required
                    error={errors.fenceType}
                    className="ef-full"
                  >
                    <select
                      id="fenceType"
                      name="fenceType"
                      className="ef-input ef-select"
                      required
                      disabled={isPending}
                      value={fenceType}
                      onChange={(e) => setFenceType(e.target.value)}
                      {...aria('fenceType')}
                    >
                      <option value="" disabled>Select fencing type…</option>
                      {FENCE_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Approx Fence Length */}
                  <Field id="fenceLength" label="Approx. Fence Length" optional>
                    <select
                      id="fenceLength"
                      name="fenceLength"
                      className="ef-input ef-select"
                      disabled={isPending}
                      defaultValue=""
                    >
                      <option value="">Not sure / skip</option>
                      {FENCE_LENGTHS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Desired Height */}
                  <Field id="fenceHeight" label="Desired Fence Height" optional>
                    <select
                      id="fenceHeight"
                      name="fenceHeight"
                      className="ef-input ef-select"
                      disabled={isPending}
                      defaultValue=""
                    >
                      <option value="">Not sure / skip</option>
                      {FENCE_HEIGHTS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Gate Count */}
                  <Field id="gateCount" label="Number of Gates" optional className="ef-full">
                    <select
                      id="gateCount"
                      name="gateCount"
                      className="ef-input ef-select"
                      disabled={isPending}
                      defaultValue=""
                    >
                      <option value="">Not sure / skip</option>
                      {GATE_COUNTS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Project Notes */}
                  <Field
                    id="notes"
                    label="Project Description"
                    optional
                    className="ef-full"
                  >
                    <textarea
                      id="notes"
                      name="notes"
                      className="ef-input ef-textarea"
                      placeholder="Share anything that would help us understand your project — terrain, HOA requirements, existing structures, or how the fence will be used."
                      disabled={isPending}
                    />
                  </Field>
                </div>

                {/* Required field note */}
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.28)',
                    margin: '1rem 0 1.5rem',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#f87171' }}>*</span> Required fields
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className={`ef-btn${isPending ? ' ef-btn-loading' : ''}`}
                  aria-busy={isPending}
                >
                  {isPending ? 'Sending…' : 'Request My Free Estimate'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
