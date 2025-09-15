import { NextResponse } from 'next/server';

// Small dictionaries for normalization
const BRAND_ALIASES: Record<string, string> = {
  tesla: 'tesla', toyota: 'toyota', hyundai: 'hyundai', kia: 'kia', ford: 'ford',
  chevy: 'chevrolet', chevrolet: 'chevrolet', vw: 'volkswagen', volkswagen: 'volkswagen',
  bmw: 'bmw', mercedes: 'mercedes', nissan: 'nissan', audi: 'audi', honda: 'honda', volvo: 'volvo'
};

const MODEL_ALIASES: Record<string, string> = {
  'model y': 'model y', 'y model': 'model y', 'modely': 'model y',
  'model 3': 'model 3', '3 model': 'model 3', 'model3': 'model 3',
  'model s': 'model s', 'models': 'model s', 'model x': 'model x', 'modelx': 'model x'
};

const COLOR_ALIASES: Record<string, string> = {
  // english
  black: 'black', white: 'white', red: 'red', blue: 'blue', gray: 'gray', grey: 'gray', silver: 'silver',
  // common paint names → canonical
  'midnight black': 'black', 'obsidian black': 'black', 'pearl white': 'white',
  'midnight silver metallic': 'gray', 'midnight silver': 'gray', 'silver metallic': 'silver',
  // turkish
  siyah: 'black', beyaz: 'white', kirmizi: 'red', mavi: 'blue', gri: 'gray', gumus: 'silver', yesil: 'green'
};

const CITY_ALIASES: Record<string, string> = {
  sf: 'San Francisco', 's.f.': 'San Francisco', 'san fran': 'San Francisco',
  'san francisco': 'San Francisco', 'santa clara': 'Santa Clara', 'san jose': 'San Jose',
};

function canonicalizeBrand(input: string): string | undefined {
  const k = input.toLowerCase();
  return BRAND_ALIASES[k] || (k in BRAND_ALIASES ? BRAND_ALIASES[k] : undefined);
}

function canonicalizeModel(input: string): string | undefined {
  const k = input.toLowerCase();
  if (MODEL_ALIASES[k]) return MODEL_ALIASES[k];
  // try to find alias contained
  for (const key of Object.keys(MODEL_ALIASES)) {
    if (k.includes(key)) return MODEL_ALIASES[key];
  }
  return undefined;
}

function canonicalizeColor(text: string): string | undefined {
  const k = text.toLowerCase();
  if (COLOR_ALIASES[k]) return COLOR_ALIASES[k];
  for (const key of Object.keys(COLOR_ALIASES)) {
    if (k.includes(key)) return COLOR_ALIASES[key];
  }
  return undefined;
}

function canonicalizeCity(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower];
  // if "City, ST" format, take city part
  const cityPart = lower.split(',')[0].trim();
  if (CITY_ALIASES[cityPart]) return CITY_ALIASES[cityPart];
  // Title Case the city part
  if (cityPart.length > 1) {
    return cityPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return undefined;
}

function extractNumbers(text: string) {
  const maxPriceMatch = text.match(/(?:under|below|<=|alt[ıi]|altinda|max price|price\s*<)\s*\$?\s*([\d,\.]+|\d+\s*bin|\d+k)/i);
  const maxMilesMatch = text.match(/(?:under|below|<=|alt[ıi]|altinda|max\s*miles|mil(?:e)?s?\s*<)\s*([\d,\.]+|\d+\s*bin|\d+k)\s*(?:miles?|mil)/i);

  const norm = (raw?: string) => {
    if (!raw) return undefined;
    let v = raw.toLowerCase().replace(/[,\.\s]/g, '');
    if (v.endsWith('k')) return parseInt(v) * 1000;
    const m = v.match(/(\d+)bin/);
    if (m) return parseInt(m[1]) * 1000;
    const n = parseInt(v);
    return isNaN(n) ? undefined : n;
  };

  return { maxPrice: norm(maxPriceMatch?.[1]), maxMileage: norm(maxMilesMatch?.[1]) };
}

export async function POST(req: Request) {
  try {
    const { q } = await req.json().catch(() => ({ q: '' }));
    const text: string = (q || '').toString();
    const lower = text.toLowerCase();

    // brand
    let brand: string | undefined;
    for (const key of Object.keys(BRAND_ALIASES)) {
      if (lower.includes(key)) { brand = BRAND_ALIASES[key]; break; }
    }

    // model
    let model: string | undefined = canonicalizeModel(lower);

    // color
    let color: string | undefined = canonicalizeColor(lower);

    // location candidates
    let location: string | undefined;
    for (const key of Object.keys(CITY_ALIASES)) {
      if (lower.includes(key)) { location = CITY_ALIASES[key]; break; }
    }
    if (!location) {
      // pick last token with capitalized words separated by space/',' as a naive city
      const commaIdx = text.indexOf(',');
      if (commaIdx > 0) location = canonicalizeCity(text.slice(0, commaIdx));
    }

    const { maxPrice, maxMileage } = extractNumbers(text);

    const params = new URLSearchParams();
    params.set('category', 'ev-car');
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model), params.set('search', model);
    if (color) params.set('color', color);
    if (location) params.set('location', location);
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    if (maxMileage) params.set('maxMileage', String(maxMileage));

    return NextResponse.json({ params: params.toString() });
  } catch (e) {
    return NextResponse.json({ params: '' });
  }
}


