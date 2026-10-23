// ─────────────────────────────────────────────────────────────────────────────
// Testimonials data
//
// HOW TO ADD REAL REVIEWS
// 1. Copy one of the placeholder objects below as a template.
// 2. Fill in the customer's actual displayName, reviewText, rating, reviewDate,
//    and source (if you can verify where the review was posted).
// 3. Remove the `isPlaceholder: true` line from that object.
// 4. Delete any remaining placeholder objects before the site goes live.
//
// IMPORTANT: Do not publish placeholder objects to a live production site.
//   The Testimonials component shows a visible development notice whenever
//   ANY item has isPlaceholder: true.
// ─────────────────────────────────────────────────────────────────────────────

export type ReviewSource = 'google' | 'facebook' | 'yelp' | 'direct';

export interface TestimonialItem {
  id: string;
  /** Customer's actual name or approved display name (e.g. "Sarah M." or "Sarah Mitchell") */
  displayName: string;
  /** Verbatim review text, reproduced with the customer's permission */
  reviewText: string;
  /** Verified star rating 1–5; omit if unconfirmed */
  rating?: number;
  /** ISO date string of when the review was posted, e.g. "2025-06-20" */
  reviewDate?: string;
  /** Platform where the review was originally posted; omit if unknown */
  source?: ReviewSource;
  /** Set true on any item that has not yet been replaced with a verified review */
  isPlaceholder?: true;
}

export const TESTIMONIALS = {
  // ── Section copy ────────────────────────────────────────────────────────────
  heading: 'What Our Customers Say',
  description:
    'Read what homeowners have shared about their experience working with our team.',

  // ── CTA ─────────────────────────────────────────────────────────────────────
  ctaLabel: 'Request Your Fencing Estimate',
  ctaTarget: '#estimate',

  // ── Review items ────────────────────────────────────────────────────────────
  // Replace every item below with real, verified customer reviews.
  items: [
    {
      id: 'placeholder-1',
      displayName: 'Jessica R.',
      reviewText:
        'The crew arrived on time and finished a day ahead of schedule. Our new cedar privacy fence looks exactly the way we pictured it — clean lines, solid posts, and the gate swings perfectly. The yard feels completely different now.',
      reviewDate: undefined,
      source: undefined,
      isPlaceholder: true,
    },
    {
      id: 'placeholder-2',
      displayName: 'Mark T.',
      reviewText:
        'We got three quotes before going with this company. The estimate was itemized and honest about what the job actually required. Installation was efficient, and they cleaned up the site completely before leaving.',
      reviewDate: undefined,
      source: undefined,
      isPlaceholder: true,
    },
    {
      id: 'placeholder-3',
      displayName: 'Linda P.',
      reviewText:
        'Had them replace a deteriorating wood fence with vinyl panels along the back property line. The work was done in a day and a half. Very clean install — posts are level and the panels sit flush.',
      reviewDate: undefined,
      source: undefined,
      isPlaceholder: true,
    },
    {
      id: 'placeholder-4',
      displayName: 'David K.',
      reviewText:
        "They built a custom gate to match our existing ornamental iron fence. The metalwork is precise, the welds are clean, and it operates on ball-bearing hinges — no sagging. Exactly what we wanted.",
      reviewDate: undefined,
      source: undefined,
      isPlaceholder: true,
    },
  ] satisfies TestimonialItem[],
} as const;
