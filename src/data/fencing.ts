// ─── Fence Types Data ────────────────────────────────────────────────────────
// Edit priceDisplay values to reflect your current installed rates.
// All estimates should include a range and clearly be labeled "(est.)".
// Set priceDisplay to "Request a Custom Quote" for any type without set pricing.
// See PRICE_DISCLAIMER below for the recommended customer-facing note.

export type PrivacyLevel = 'none' | 'low' | 'moderate' | 'high';
export type MaterialCategory = 'natural-wood' | 'synthetic' | 'metal' | 'composite';
export type BudgetCategory = 'budget' | 'mid-range' | 'premium';
export type MaintenanceLevel = 'very-low' | 'low' | 'low-moderate' | 'moderate' | 'high';
export type DurabilityRating = 'moderate' | 'high' | 'very-high';

export interface FenceType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  advantages: string[];
  applications: string[];
  styles: string[];
  maintenance: MaintenanceLevel;
  maintenanceNote: string;
  privacyLevel: PrivacyLevel;
  durability: DurabilityRating;
  durabilityNote: string;
  priceDisplay: string;
  material: MaterialCategory;
  budget: BudgetCategory;
  accentColor: string;
}

export const FENCE_TYPES: FenceType[] = [
  {
    id: 'wood-privacy',
    name: 'Wood Privacy',
    tagline: 'Timeless natural beauty',
    description:
      'Classic wood privacy fencing delivers a warm, natural aesthetic with full visual screening. Cedar and pressure-treated pine are popular choices for longevity and finish acceptance.',
    advantages: [
      'Natural, customizable appearance',
      'Excellent noise dampening',
      'Easy to stain or paint any color',
      'Can be built to custom heights',
    ],
    applications: ['Residential backyards', 'Property line separation', 'Pool enclosures', 'Garden screening'],
    styles: ['Dog-ear', 'Board-on-board', 'Shadowbox', 'Lattice-top', 'Stockade'],
    maintenance: 'high',
    maintenanceNote: 'Stain or seal every 2–3 years; inspect annually for rot',
    privacyLevel: 'high',
    durability: 'moderate',
    durabilityNote: '10–20 years with regular upkeep',
    priceDisplay: 'Request a Custom Quote',
    material: 'natural-wood',
    budget: 'mid-range',
    accentColor: '#C47F3A',
  },
  {
    id: 'vinyl-pvc',
    name: 'Vinyl / PVC',
    tagline: 'Zero maintenance, lasting color',
    description:
      'Premium vinyl fencing mimics the look of painted wood without the upkeep. UV-stabilized resins hold color for decades and resist cracking, warping, and insect damage.',
    advantages: [
      'No painting or staining needed',
      'Impervious to rot and insects',
      'Stays white or colored indefinitely',
      'Cleans with just soap and water',
    ],
    applications: ['Residential privacy', 'Pool surrounds', 'Front yard picket', 'HOA-friendly properties'],
    styles: ['Full privacy', 'Semi-privacy', 'Picket', 'Ranch rail', 'Lattice top'],
    maintenance: 'very-low',
    maintenanceNote: 'Occasional rinse; no sanding, painting, or sealing',
    privacyLevel: 'high',
    durability: 'high',
    durabilityNote: '20–30 years; manufacturer warranties often 20+ yrs',
    priceDisplay: 'Request a Custom Quote',
    material: 'synthetic',
    budget: 'mid-range',
    accentColor: '#4A8FA8',
  },
  {
    id: 'chain-link',
    name: 'Chain-Link',
    tagline: 'Reliable security at any scale',
    description:
      'Galvanized or vinyl-coated chain-link is the most cost-effective way to secure large perimeters. Privacy slats can be woven through the mesh for added screening.',
    advantages: [
      'Lowest installed cost per linear foot',
      'Nearly maintenance-free',
      'Excellent ventilation and light',
      'Privacy slats available in many colors',
    ],
    applications: ['Commercial lots', 'Sports fields', 'Pet runs & dog kennels', 'Industrial perimeters'],
    styles: ['Galvanized', 'Vinyl-coated (black/green)', 'Privacy slats add-on', 'Barbed-wire top option'],
    maintenance: 'low',
    maintenanceNote: 'Inspect for rust annually; re-tension if sagging',
    privacyLevel: 'low',
    durability: 'high',
    durabilityNote: '15–20 years; vinyl-coated typically outlasts galvanized',
    priceDisplay: 'Request a Custom Quote',
    material: 'metal',
    budget: 'budget',
    accentColor: '#6B7A8D',
  },
  {
    id: 'ornamental-aluminum',
    name: 'Ornamental Aluminum',
    tagline: 'Elegant, rust-proof curb appeal',
    description:
      'Powder-coated aluminum delivers the classic look of wrought iron at a fraction of the weight and without the rust risk. Perfect for decorative or boundary applications.',
    advantages: [
      'Permanent powder-coat finish',
      'Will never rust or corrode',
      'Lightweight and easy to install',
      'Available in dozens of styles and colors',
    ],
    applications: ['Front yard boundaries', 'Pool code-compliant fencing', 'Decorative landscaping', 'Driveway borders'],
    styles: ['Flat-top panel', 'Spear-top', 'Finial-top', 'Arched gates', 'Custom scrollwork'],
    maintenance: 'very-low',
    maintenanceNote: 'Rinse occasionally; touch up chips with aluminum paint',
    privacyLevel: 'low',
    durability: 'very-high',
    durabilityNote: '40+ years; powder coat resists chipping and fading',
    priceDisplay: 'Request a Custom Quote',
    material: 'metal',
    budget: 'mid-range',
    accentColor: '#8B9DAE',
  },
  {
    id: 'steel-wrought-iron',
    name: 'Steel / Wrought Iron',
    tagline: 'Maximum strength, timeless grandeur',
    description:
      'Heavy-gauge steel and true wrought iron represent the pinnacle of fence craftsmanship. These fences are often custom-fabricated and can last well over 50 years with proper care.',
    advantages: [
      'Unmatched strength and security',
      'Fully customizable forge-work',
      'Adds significant property value',
      'Historical and architectural authenticity',
    ],
    applications: ['High-end residential estates', 'Historic properties', 'Commercial security', 'Government facilities'],
    styles: ['Spear-top', 'Flat-top heavy-gauge', 'Custom scrollwork', 'Panel designs', 'Estate gates'],
    maintenance: 'moderate',
    maintenanceNote: 'Paint every 5–7 years to prevent rust; inspect welds annually',
    privacyLevel: 'low',
    durability: 'very-high',
    durabilityNote: '50+ years with rust-prevention maintenance',
    priceDisplay: 'Request a Custom Quote',
    material: 'metal',
    budget: 'premium',
    accentColor: '#5C6370',
  },
  {
    id: 'composite',
    name: 'Composite',
    tagline: 'Wood look, modern endurance',
    description:
      'Composite fencing blends recycled wood fiber and plastic into boards that look like natural wood but resist the elements far better. An eco-conscious choice that stays beautiful.',
    advantages: [
      'Authentic wood grain appearance',
      'Made from recycled materials',
      'Resists rot, insects, and moisture',
      'Holds color without staining',
    ],
    applications: ['Modern residential', 'Deck transitions', 'Upscale privacy screening', 'Eco-conscious projects'],
    styles: ['Horizontal plank', 'Vertical board', 'Tongue-and-groove privacy', 'Lattice top'],
    maintenance: 'low',
    maintenanceNote: 'Annual wash with mild soap; no sealing required',
    privacyLevel: 'high',
    durability: 'high',
    durabilityNote: '25–30 years; most products carry 25-year warranties',
    priceDisplay: 'Request a Custom Quote',
    material: 'composite',
    budget: 'mid-range',
    accentColor: '#5D8B6A',
  },
  {
    id: 'split-rail',
    name: 'Split Rail',
    tagline: 'Rustic charm, open boundary',
    description:
      'Split-rail fencing uses natural, un-milled logs split lengthwise for a classic rural aesthetic. It defines property lines and adds character without creating a visual barrier.',
    advantages: [
      'Natural, low-profile appearance',
      'Defines boundaries without blocking views',
      'Easy to add wire mesh for pet containment',
      'Works beautifully with landscaping',
    ],
    applications: ['Rural and suburban yards', 'Horse properties', 'Garden accents', 'Driveway entry markers'],
    styles: ['2-rail', '3-rail', 'Wire mesh insert', 'Cedar or locust wood'],
    maintenance: 'low-moderate',
    maintenanceNote: 'Treat every 3–5 years; replace individual rails as needed',
    privacyLevel: 'none',
    durability: 'moderate',
    durabilityNote: '10–20 years depending on wood species and treatment',
    priceDisplay: 'Request a Custom Quote',
    material: 'natural-wood',
    budget: 'budget',
    accentColor: '#8B6940',
  },
  {
    id: 'farm-ranch',
    name: 'Farm / Ranch',
    tagline: 'Built for wide-open acreage',
    description:
      'Farm and ranch fencing is engineered to cover large parcels cost-effectively. From high-tensile wire to board-and-post designs, these systems keep livestock in and predators out.',
    advantages: [
      'Most cost-effective for long runs',
      'Livestock-safe with proper wire gauge',
      'Multiple configurations for different animals',
      'Low per-foot cost at scale',
    ],
    applications: ['Cattle and horse pastures', 'Large rural properties', 'Wildlife containment', 'Agricultural use'],
    styles: ['High-tensile wire', 'Board and post', 'T-post and wire', 'Woven wire (non-climb)', 'Barbed wire'],
    maintenance: 'low-moderate',
    maintenanceNote: 'Walk the fence line seasonally; re-tension wire as needed',
    privacyLevel: 'low',
    durability: 'high',
    durabilityNote: '20–30 years for high-tensile; 15–20 for standard wire',
    priceDisplay: 'Request a Custom Quote',
    material: 'natural-wood',
    budget: 'budget',
    accentColor: '#6B8B5D',
  },
];

export const PRIVACY_SCORE: Record<PrivacyLevel, number> = {
  none: 0,
  low: 2,
  moderate: 3,
  high: 5,
};

export const DURABILITY_SCORE: Record<DurabilityRating, number> = {
  moderate: 2,
  high: 4,
  'very-high': 5,
};

export const MAINTENANCE_LABEL: Record<MaintenanceLevel, string> = {
  'very-low': 'Very Low',
  low: 'Low',
  'low-moderate': 'Low–Moderate',
  moderate: 'Moderate',
  high: 'High',
};

export const PRIVACY_LABEL: Record<PrivacyLevel, string> = {
  none: 'None',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
};

export const DURABILITY_LABEL: Record<DurabilityRating, string> = {
  moderate: 'Moderate',
  high: 'High',
  'very-high': 'Very High',
};

// Shown below the pricing section on the FencingOptions component.
export const PRICE_DISCLAIMER =
  'Installed price estimates vary based on linear footage, gate count, terrain, old fence removal, ' +
  'permit requirements, and local labor rates. Contact us for a free on-site assessment and written quote.';
