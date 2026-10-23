'use server'

// ─── Types ────────────────────────────────────────────────────────────────────

export type EstimateStatus = 'idle' | 'success' | 'error' | 'validation';

export interface EstimateState {
  status: EstimateStatus;
  /** Per-field validation error messages keyed by field name */
  errors?: Record<string, string>;
  /** Top-level message for success or server/network errors */
  message?: string;
}

// ─── Integration point ────────────────────────────────────────────────────────
//
// Set the following environment variable in .env.local (or your hosting
// platform's environment settings) before the form goes live:
//
//   ESTIMATE_WEBHOOK_URL=https://…
//
// The action POSTs validated form data as JSON to this URL on every submission.
// Any webhook-capable service works — Zapier, Make, n8n, or your own endpoint.
//
// JSON payload shape:
//   {
//     timestamp:    string   (ISO 8601)
//     fullName:     string
//     email:        string
//     phone:        string
//     zip:          string
//     propertyType: string
//     fenceType:    string
//     fenceLength?: string
//     fenceHeight?: string
//     gateCount?:   string
//     timeline:     string
//     notes?:       string
//   }
//
// The action treats an HTTP 2xx response as success; anything else is an error.
// ──────────────────────────────────────────────────────────────────────────────

// ─── Validators ───────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
}

function isValidZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitEstimate(
  _prevState: EstimateState,
  formData: FormData,
): Promise<EstimateState> {
  // Honeypot check — bots fill hidden fields, humans do not.
  // Return fake success so bots have no signal to retry with.
  const honeypot = (formData.get('website') as string | null) ?? '';
  if (honeypot.trim() !== '') {
    return { status: 'success' };
  }

  // ── Extract fields ──────────────────────────────────────────────────────────
  const get = (key: string) => ((formData.get(key) as string | null) ?? '').trim();

  const fullName     = get('fullName');
  const email        = get('email');
  const phone        = get('phone');
  const zip          = get('zip');
  const propertyType = get('propertyType');
  const fenceType    = get('fenceType');
  const fenceLength  = get('fenceLength');
  const fenceHeight  = get('fenceHeight');
  const gateCount    = get('gateCount');
  const timeline     = get('timeline');
  const notes        = get('notes');

  // ── Server-side validation ──────────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (!fullName)
    errors.fullName = 'Please enter your full name.';

  if (!email)
    errors.email = 'Please enter your email address.';
  else if (!isValidEmail(email))
    errors.email = 'Please enter a valid email address.';

  if (!phone)
    errors.phone = 'Please enter your phone number.';
  else if (!isValidPhone(phone))
    errors.phone = 'Please enter a valid US phone number (10 digits).';

  if (!zip)
    errors.zip = 'Please enter your ZIP code.';
  else if (!isValidZip(zip))
    errors.zip = 'Please enter a valid 5-digit ZIP code.';

  if (!propertyType)
    errors.propertyType = 'Please select a property type.';

  if (!fenceType)
    errors.fenceType = 'Please select a fencing type.';

  if (!timeline)
    errors.timeline = 'Please select a project timeline.';

  if (Object.keys(errors).length > 0) {
    return { status: 'validation', errors };
  }

  // ── Attempt delivery ────────────────────────────────────────────────────────
  const payload = {
    timestamp: new Date().toISOString(),
    fullName,
    email,
    phone,
    zip,
    propertyType,
    fenceType,
    ...(fenceLength && { fenceLength }),
    ...(fenceHeight && { fenceHeight }),
    ...(gateCount && { gateCount }),
    timeline,
    ...(notes && { notes }),
  };

  const webhookUrl = process.env.ESTIMATE_WEBHOOK_URL;

  if (!webhookUrl) {
    // Log the submission so the developer can verify the form is working
    // even without a configured endpoint.
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '[EstimateForm] Submission received — no ESTIMATE_WEBHOOK_URL configured.\n' +
        'Set ESTIMATE_WEBHOOK_URL in .env.local to enable delivery.\n',
        JSON.stringify(payload, null, 2),
      );
    }
    return {
      status: 'error',
      message:
        process.env.NODE_ENV !== 'production'
          ? 'No ESTIMATE_WEBHOOK_URL is configured. Add it to .env.local to enable form delivery. (Submission data has been logged to the server console.)'
          : "We couldn’t send your inquiry right now. Please call us directly or try again in a moment.",
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Webhook responded with HTTP ${res.status}`);
    }

    return { status: 'success' };
  } catch (err) {
    console.error('[EstimateForm] Webhook delivery failed:', err);
    return {
      status: 'error',
      message:
        "We couldn’t send your inquiry right now. Please call us directly or try again in a moment.",
    };
  }
}
