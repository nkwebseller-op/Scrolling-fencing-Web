// Editable content for the "Why Choose Us" section.
// Update headings, descriptions, and icon keys here without touching layout code.

export interface BenefitItem {
  id: string;
  iconKey:
    | 'shield'
    | 'level'
    | 'document'
    | 'sliders'
    | 'pin'
    | 'chat';
  heading: string;
  description: string;
}

export const WHY_CHOOSE_US = {
  label: 'Our Approach',
  heading: 'Why Homeowners Choose Us',
  description:
    'From the first site visit to the final walk-through, we focus on the details that make a fence last — the right materials for your conditions, careful installation, and clear communication throughout.',

  benefits: [
    {
      id: 'materials',
      iconKey: 'shield',
      heading: 'Materials Matched to Your Conditions',
      description:
        "We select fencing materials based on your property's specific exposure — moisture levels, sun, soil type, and HOA requirements — so the fence holds up well season after season.",
    },
    {
      id: 'installation',
      iconKey: 'level',
      heading: 'Posts Set Right, Panels Hung Plumb',
      description:
        'Every post is set at the correct depth, every panel is leveled, and every gate is hung for smooth, long-lasting operation — not just on day one, but years down the road.',
    },
    {
      id: 'estimates',
      iconKey: 'document',
      heading: 'Written Estimates Before Work Begins',
      description:
        'You receive an itemized written estimate before we start. No vague line items, no surprise additions — just a clear picture of the project scope and cost.',
    },
    {
      id: 'custom',
      iconKey: 'sliders',
      heading: 'Designed Around Your Property',
      description:
        'Every layout accounts for terrain changes, existing structures, HOA guidelines, and gate placement — so the finished fence works with your yard rather than against it.',
    },
    {
      id: 'site',
      iconKey: 'pin',
      heading: 'Utility Check Before We Dig',
      description:
        'We locate underground utilities and review site conditions prior to excavation, protecting your property and keeping the project on schedule.',
    },
    {
      id: 'communication',
      iconKey: 'chat',
      heading: 'Straightforward Project Updates',
      description:
        "You'll know your installation date, any schedule changes, and what to expect at each stage — from the first call to the day we clean up and leave.",
    },
  ] satisfies BenefitItem[],

  closingStatement:
    'Every estimate is in writing. Every commitment is kept.',
  ctaLabel: 'Get a Free Fencing Estimate',
  ctaTarget: '#estimate',
} as const;
