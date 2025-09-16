// Minimal nearby-city graph for optional proximity relaxation

const NEARBY_MAP: Record<string, string[]> = {
  'san francisco': ['oakland', 'berkeley', 'daly city', 'south san francisco', 'san mateo'],
  'oakland': ['berkeley', 'san francisco', 'emeryville', 'alameda'],
  'berkeley': ['oakland', 'emeryville', 'richmond'],
  'san jose': ['santa clara', 'milpitas', 'campbell', 'cupertino'],
  'santa clara': ['san jose', 'sunnyvale', 'cupertino'],
  'sunnyvale': ['mountain view', 'santa clara', 'cupertino'],
  'mountain view': ['palo alto', 'los altos', 'sunnyvale'],
  'palo alto': ['mountain view', 'menlo park', 'los altos'],
  'menlo park': ['palo alto', 'redwood city'],
  'redwood city': ['san carlos', 'menlo park'],
  'fremont': ['union city', 'newark', 'milpitas'],
  'santa cruz': ['scotts valley', 'capitola', 'soquel'],
  'los angeles': ['santa monica', 'culver city', 'glendale', 'pasadena'],
  'new york': ['brooklyn', 'queens', 'jersey city', 'hoboken'],
  'seattle': ['bellevue', 'redmond'],
};

export function getNearbyCities(city?: string): Set<string> {
  if (!city) return new Set();
  const key = city.toLowerCase().trim();
  const neighbors = new Set<string>([key]);
  const list = NEARBY_MAP[key] || [];
  for (const n of list) neighbors.add(n);
  return neighbors;
}


