// Lightweight natural-language to filter parser for vehicle searches
// Supports simple Turkish/English phrases like:
// "tesla model 3 palo alto çevresinde 30 bin dolar altı 20 bin mil altı"

export type ParsedFilters = {
  brand?: string;
  model?: string;
  maxPrice?: number;
  minPrice?: number;
  maxMileage?: number;
  location?: string;
  category?: string; // ev-car | hybrid-car | ev-scooter | e-bike
  color?: string;
};

const KNOWN_BRANDS = [
  'tesla', 'toyota', 'ford', 'chevrolet', 'hyundai', 'kia', 'bmw', 'mercedes',
  'nissan', 'volkswagen', 'audi', 'honda', 'volvo', 'lucid', 'rivian', 'porsche'
];

// Very small model dictionary (can be expanded)
const KNOWN_MODELS = [
  'model 3', 'model y', 'model s', 'model x',
  'prius', 'ioniq 5', 'ioniq5', 'ioniq', 'ev6', 'leaf', 'bolt', 'mach-e'
];

const KNOWN_COLORS = [
  'black','white','red','blue','silver','gray','grey','green','yellow','orange',
  'siyah','beyaz','kirmizi','mavi','gri','yesil','sari','turuncu','gumus'
];

function normalizeNumber(token: string): number | undefined {
  // Handles forms like: 30k, 30 bin, 30,000, $30,000
  const lower = token.toLowerCase().replace(/[$,\.]/g, '');
  if (/^\d+k$/.test(lower)) return parseInt(lower) * 1000;
  if (/^\d+$/.test(lower)) return parseInt(lower);
  // "30bin" or "30 bin"
  const m = lower.match(/^(\d+)\s*bin$/);
  if (m) return parseInt(m[1]) * 1000;
  return undefined;
}

export function parseNaturalLanguageQuery(inputRaw: string): ParsedFilters {
  const input = inputRaw.trim();
  const lower = input.toLowerCase();
  const result: ParsedFilters = {};

  // Brand detection
  for (const b of KNOWN_BRANDS) {
    if (lower.includes(b)) {
      result.brand = b;
      break;
    }
  }

  // Model detection (prefer longest match)
  let foundModel = '';
  for (const m of KNOWN_MODELS) {
    if (lower.includes(m) && m.length > foundModel.length) {
      foundModel = m;
    }
  }
  if (foundModel) result.model = foundModel;

  // Color detection (basic)
  for (const c of KNOWN_COLORS) {
    if (lower.includes(c)) {
      const map: Record<string,string> = { siyah:'black', beyaz:'white', kirmizi:'red', mavi:'blue', gri:'gray', yesil:'green', sari:'yellow', turuncu:'orange', gumus:'silver' };
      result.color = map[c] || c;
      break;
    }
  }

  // Price max: look for phrases like "altı/alta/under/below/<="
  // Capture preceding number token
  const pricePhrases = [
    /(\d+[kK]?|\d+\s*bin)[^\d\w]{0,8}(dolar|\$)?\s*(alt[iı]|alta|altinda|under|below|<=)/,
    /(under|below|<=)\s*(\$?\s*\d+[kK]?|\d+\s*bin)/,
  ];
  for (const re of pricePhrases) {
    const m = lower.match(re);
    if (m) {
      const numToken = m[1] || m[2];
      const n = numToken ? normalizeNumber(numToken.replace(/\$/g, '').trim()) : undefined;
      if (n) {
        result.maxPrice = n;
        break;
      }
    }
  }

  // Mileage max: "mil altı", "miles under"
  const mileageRe = /(\d+[kK]?|\d+\s*bin)\s*(mil|mile|miles)\s*(alt[iı]|altinda|under|below|<=)/;
  const mileageAlt = /(under|below|<=)\s*(\d+[kK]?|\d+\s*bin)\s*(mil|mile|miles)/;
  let mm = lower.match(mileageRe);
  if (!mm) mm = lower.match(mileageAlt);
  if (mm) {
    const token = mm[1] || mm[2];
    const n = token ? normalizeNumber(token) : undefined;
    if (n) result.maxMileage = n;
  }

  // Location: naïve extraction using common cities
  const locRe = /(palo alto|san francisco|los angeles|new york|seattle|santa clara|san jose|oakland|berkeley)/;
  const lm = lower.match(locRe);
  if (lm) {
    const idx = lower.indexOf(lm[1]);
    result.location = input.substring(idx, idx + lm[1].length);
  }

  // Category heuristic -> cars by default
  result.category = 'ev-car';

  return result;
}

export function buildVehiclesSearchParams(parsed: ParsedFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (parsed.category) p.set('category', parsed.category);
  if (parsed.brand) p.set('brand', parsed.brand);
  if (parsed.model) { p.set('model', parsed.model); p.set('search', parsed.model); }
  if (parsed.color) p.set('color', parsed.color);
  if (parsed.maxPrice) p.set('maxPrice', String(parsed.maxPrice));
  if (parsed.minPrice) p.set('minPrice', String(parsed.minPrice));
  if (parsed.maxMileage) p.set('maxMileage', String(parsed.maxMileage));
  if (parsed.location) p.set('location', parsed.location);
  return p;
}


