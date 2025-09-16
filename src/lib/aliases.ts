// Utilities to normalize free-text values to canonical forms used in filtering

export function normalizeBrand(input?: string): string | undefined {
  if (!input) return undefined;
  const value = input.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'vw': 'volkswagen',
    'merc': 'mercedes',
    'mercedes-benz': 'mercedes',
    'chevy': 'chevrolet',
    'bimmer': 'bmw',
  };
  return aliases[value] || value;
}

export function normalizeModel(input?: string): string | undefined {
  if (!input) return undefined;
  const value = input.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'model3': 'model 3',
    'model y performance': 'model y',
    'model y long range': 'model y',
    'model s plaid': 'model s',
    'mode l3': 'model 3',
    'm3': 'model 3',
    'mach e': 'mach-e',
    'mache': 'mach-e',
    'ioniq5': 'ioniq 5',
    'ev 6': 'ev6',
  };
  // prefer the longest known normalization
  const norm = aliases[value];
  if (norm) return norm;
  return value;
}

export function normalizeColor(input?: string): string | undefined {
  if (!input) return undefined;
  const value = input.toLowerCase().trim();
  const aliases: Record<string, string> = {
    grey: 'gray',
    charcoal: 'gray',
    graphite: 'gray',
    navy: 'blue',
    burgundy: 'red',
    maroon: 'red',
    silver: 'silver',
    white: 'white',
    black: 'black',
  };
  return aliases[value] || value;
}

export function normalizeCity(input?: string): string | undefined {
  if (!input) return undefined;
  const value = input.toLowerCase().trim();
  const aliases: Record<string, string> = {
    sf: 'san francisco',
    's.f.': 'san francisco',
    la: 'los angeles',
    'santa clara county': 'santa clara',
  };
  return aliases[value] || value;
}

export function normalizeParsed<T extends {
  brand?: string;
  model?: string;
  color?: string;
  city?: string;
  maxPrice?: number;
  maxMileage?: number;
}>(parsed: T): T {
  return {
    ...parsed,
    brand: normalizeBrand(parsed.brand),
    model: normalizeModel(parsed.model),
    color: normalizeColor(parsed.color),
    city: normalizeCity(parsed.city),
  };
}


