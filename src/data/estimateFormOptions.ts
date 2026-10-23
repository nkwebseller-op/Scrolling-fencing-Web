// Editable options for the inquiry form fields.
// Update labels or add/remove values here without changing the form component.

export interface SelectOption {
  value: string;
  label: string;
}

export const FENCE_TYPES: SelectOption[] = [
  { value: 'wood', label: 'Wood' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'chain-link', label: 'Chain-Link' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'steel', label: 'Steel / Ornamental Iron' },
  { value: 'composite', label: 'Composite' },
  { value: 'split-rail', label: 'Split Rail' },
  { value: 'farm', label: 'Farm / Agricultural' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const PROPERTY_TYPES: SelectOption[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial / Industrial' },
  { value: 'farm-rural', label: 'Farm / Rural' },
  { value: 'hoa', label: 'HOA / Community' },
];

export const FENCE_LENGTHS: SelectOption[] = [
  { value: 'under-50', label: 'Under 50 ft' },
  { value: '50-100', label: '50 – 100 ft' },
  { value: '100-200', label: '100 – 200 ft' },
  { value: '200-500', label: '200 – 500 ft' },
  { value: 'over-500', label: 'Over 500 ft' },
  { value: 'not-sure', label: "I'm not sure" },
];

export const FENCE_HEIGHTS: SelectOption[] = [
  { value: '3', label: '3 ft' },
  { value: '4', label: '4 ft' },
  { value: '5', label: '5 ft' },
  { value: '6', label: '6 ft' },
  { value: '8', label: '8 ft' },
  { value: 'not-sure', label: "I'm not sure" },
];

export const GATE_COUNTS: SelectOption[] = [
  { value: 'none', label: 'No gates needed' },
  { value: '1', label: '1 gate' },
  { value: '2', label: '2 gates' },
  { value: '3', label: '3 gates' },
  { value: '4+', label: '4 or more' },
  { value: 'not-sure', label: "I'm not sure" },
];

export const TIMELINES: SelectOption[] = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1 – 3 months' },
  { value: '3-6-months', label: '3 – 6 months' },
  { value: 'planning', label: 'Just planning for now' },
];
