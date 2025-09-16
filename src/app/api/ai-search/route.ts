import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeParsed } from '@/lib/aliases'
import { getNearbyCities } from '@/lib/geo'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Parsed = {
  brand?: string
  model?: string
  color?: string
  city?: string
  maxPrice?: number
  maxMileage?: number
}

// Deterministic fallback city detection for common cities when LLM misses it
const KNOWN_CITIES = [
  'san francisco','oakland','berkeley','daly city','south san francisco','san mateo',
  'san jose','santa clara','milpitas','campbell','cupertino','sunnyvale','mountain view',
  'palo alto','menlo park','redwood city','fremont','union city','newark','los altos',
  'los angeles','santa monica','culver city','glendale','pasadena','seattle','bellevue',
  'redmond','santa cruz','scotts valley','capitola','soquel','new york','brooklyn','queens'
]

const jsonSchema = {
  name: 'evvalley_search_filters',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      brand: { type: 'string', description: 'Vehicle brand, English lowercase (e.g., tesla)' },
      model: { type: 'string', description: 'Model normalized (e.g., model y, mach-e)' },
      color: { type: 'string', description: 'Exterior color (e.g., black, gray)' },
      city: { type: 'string', description: 'Exact city name only (e.g., san francisco)' },
      maxPrice: { type: 'number', description: 'Max price in USD (integers). 35 means 35k.' },
      maxMileage: { type: 'number', description: 'Max mileage (miles). 20 means 20k.' },
    },
    required: [],
  },
}

const toParams = (p: Parsed) => {
  const params = new URLSearchParams()
  // Don't set category to allow searching across all categories
  if (p.brand) params.set('brand', p.brand.toLowerCase())
  if (p.model) {
    params.set('model', p.model.toLowerCase())
    params.set('search', p.model.toLowerCase())
  }
  if (p.color) params.set('color', p.color.toLowerCase())
  if (p.city) params.set('location', p.city)
  // Normalize units: treat numbers < 1000 as thousands
  if (typeof p.maxPrice === 'number') {
    const usd = p.maxPrice < 1000 ? p.maxPrice * 1000 : p.maxPrice
    params.set('maxPrice', String(Math.round(usd)))
  }
  if (typeof p.maxMileage === 'number') {
    const miles = p.maxMileage < 1000 ? p.maxMileage * 1000 : p.maxMileage
    params.set('maxMileage', String(Math.round(miles)))
  }
  return params.toString()
}

const applyFiltersToVehicles = (vehicles: any[], filters: Parsed) => {
  return vehicles.filter(vehicle => {
    // Brand filter
    if (filters.brand && vehicle.brand) {
      if (!vehicle.brand.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false
      }
    }
    
    // Model filter
    if (filters.model && vehicle.model) {
      if (!vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false
      }
    }
    
    // Color filter
    if (filters.color) {
      const vehicleColor = (vehicle.color || vehicle.exterior_color || '').toLowerCase()
      if (!vehicleColor.includes(filters.color.toLowerCase())) {
        return false
      }
    }
    
    // Location filter (exact city match)
    if (filters.city && vehicle.location) {
      const vehicleCity = vehicle.location.split(',')[0].trim().toLowerCase()
      const filterCity = filters.city.toLowerCase()
      if (vehicleCity !== filterCity) {
        return false
      }
    }
    
    // Price filter
    if (typeof filters.maxPrice === 'number' && vehicle.price) {
      const maxPrice = filters.maxPrice < 1000 ? filters.maxPrice * 1000 : filters.maxPrice
      if (vehicle.price > maxPrice) {
        return false
      }
    }
    
    // Mileage filter
    if (typeof filters.maxMileage === 'number' && vehicle.mileage) {
      const maxMileage = filters.maxMileage < 1000 ? filters.maxMileage * 1000 : filters.maxMileage
      if (vehicle.mileage > maxMileage) {
        return false
      }
    }
    
    return true
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const q: string = (body?.q || '').toString().trim()

    if (!q) {
      return NextResponse.json({ params: '' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // If no key, fall back by delegating to deterministic endpoint
      const res = await fetch(new URL('/api/search', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      })
      const data = await res.json().catch(() => ({ params: '' }))
      return NextResponse.json({ params: data?.params || '' })
    }

    // First parse the query to extract filters
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_schema', json_schema: jsonSchema },
        messages: [
          {
            role: 'system',
            content:
              'Extract EV marketplace filters from the user query. Return JSON with keys: brand, model, color, city, maxPrice, maxMileage. Use English tokens. City should be the city name only (no state). Do not invent values.',
          },
          { role: 'user', content: q.substring(0, 500) },
        ],
      }),
    })

    let parsed: Parsed = {}
    if (completion.ok) {
      const json: any = await completion.json()
      const content = json?.choices?.[0]?.message?.content
      try {
        parsed = JSON.parse(content)
      } catch {
        parsed = {}
      }
    }

    // Normalize aliases and coerce small magnitudes
    parsed = normalizeParsed(parsed)
    if (typeof parsed.maxPrice === 'number' && parsed.maxPrice < 1000) {
      parsed.maxPrice = Math.round(parsed.maxPrice * 1000)
    }
    if (typeof parsed.maxMileage === 'number' && parsed.maxMileage < 1000) {
      parsed.maxMileage = Math.round(parsed.maxMileage * 1000)
    }

    // Fallback city detection if missing
    if (!parsed.city) {
      const lowerQ = q.toLowerCase()
      for (const city of KNOWN_CITIES) {
        if (lowerQ.includes(city)) {
          parsed.city = city
          break
        }
      }
    }

    // Low mileage heuristic: if user says low mileage and no numeric, set 40k
    if (!parsed.maxMileage && /low\s*mileage|düşük\s*km|düşük\s*mil/i.test(q)) {
      parsed.maxMileage = 40000
    }

    // Try semantic search with parsed filters
    try {
      const semanticRes = await fetch(new URL('/api/semantic-search', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          q,
          filters: {
            brand: parsed.brand || undefined,
            model: parsed.model || undefined,
            color: parsed.color || undefined,
            city: parsed.city || undefined,
            maxPrice: typeof parsed.maxPrice === 'number' ? parsed.maxPrice : undefined,
            maxMileage: typeof parsed.maxMileage === 'number' ? parsed.maxMileage : undefined,
          }
        }),
      })
      
      if (semanticRes.ok) {
        const semanticData = await semanticRes.json()
        if (semanticData.vehicles && semanticData.vehicles.length > 0) {
          // Apply additional filtering to semantic results (+ optional nearby relaxation)
          let filteredVehicles = applyFiltersToVehicles(semanticData.vehicles, parsed)

          // proximity hints
          const proximityHint = /near|nearby|around|close to|çevresinde|yakın/i.test(q)
          if (proximityHint && parsed.city) {
            const nearby = getNearbyCities(parsed.city)
            filteredVehicles = semanticData.vehicles.filter((v: any) => {
              if (!v.location) return false
              const city = v.location.split(',')[0].trim().toLowerCase()
              return nearby.has(city)
            })
          }
          
          if (filteredVehicles.length > 0) {
            // Optional RERANK via Cohere if available
            try {
              const cohereKey = process.env.COHERE_API_KEY
              if (cohereKey && filteredVehicles.length > 1) {
                const docs = filteredVehicles.map((v: any) => ({
                  text: [v.title, v.brand, v.model, v.color || v.exterior_color, v.location]
                    .filter(Boolean)
                    .join(' | ')
                }))
                const rr = await fetch('https://api.cohere.ai/v1/rerank', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cohereKey}`
                  },
                  body: JSON.stringify({
                    model: 'rerank-english-v3.0',
                    query: q,
                    top_n: Math.min(30, docs.length),
                    documents: docs
                  })
                })
                if (rr.ok) {
                  const rrJson: any = await rr.json()
                  const order = rrJson.results?.map((r: any) => r.index) || []
                  filteredVehicles = order.map((idx: number) => filteredVehicles[idx]).filter(Boolean)
                }
              }
            } catch {}

            // Re-rank with tuned weights: 50% semantic, 35% price proximity, 10% mileage proximity, 5% recency
            const now = Date.now()
            const targetPrice = typeof parsed.maxPrice === 'number' ? parsed.maxPrice : undefined
            const targetMileage = typeof parsed.maxMileage === 'number' ? parsed.maxMileage : undefined
            const scored = filteredVehicles.map((v: any) => {
              const sim = typeof v._similarity === 'number' ? v._similarity : 0
              const price = typeof v.price === 'number' ? v.price : undefined
              const mileage = typeof v.mileage === 'number' ? v.mileage : undefined
              const createdAt = v.created_at ? new Date(v.created_at).getTime() : now
              const ageDays = Math.max(0, (now - createdAt) / (1000 * 60 * 60 * 24))
              // price proximity: closer to target and under target is better
              let priceScore = 0
              if (targetPrice && price) {
                if (price <= targetPrice) {
                  const diff = Math.max(0, targetPrice - price)
                  priceScore = Math.min(1, diff / Math.max(1000, targetPrice))
                } else {
                  priceScore = 0
                }
              }
              // mileage proximity: lower mileage and under target is better
              let mileageScore = 0
              if (targetMileage && mileage) {
                if (mileage <= targetMileage) {
                  const diff = Math.max(0, targetMileage - mileage)
                  mileageScore = Math.min(1, diff / Math.max(1000, targetMileage))
                } else {
                  mileageScore = 0
                }
              }
              // recency: newer is better; decay after 60 days
              const recencyScore = Math.max(0, 1 - ageDays / 60)
              const score = 0.5 * sim + 0.35 * priceScore + 0.1 * mileageScore + 0.05 * recencyScore
              return { ...v, _score: score }
            }).sort((a: any, b: any) => (b._score || 0) - (a._score || 0))

            // Build params with actual filters found
            const params = new URLSearchParams()
            params.set('semantic', 'true')
            params.set('query', q)
            if (parsed.brand) params.set('brand', parsed.brand.toLowerCase())
            if (parsed.model) {
              params.set('model', parsed.model.toLowerCase())
              params.set('search', parsed.model.toLowerCase())
            }
            if (parsed.color) params.set('color', parsed.color.toLowerCase())
            if (parsed.city) params.set('location', parsed.city)
            if (typeof parsed.maxPrice === 'number') {
              const usd = parsed.maxPrice < 1000 ? parsed.maxPrice * 1000 : parsed.maxPrice
              params.set('maxPrice', String(Math.round(usd)))
            }
            if (typeof parsed.maxMileage === 'number') {
              const miles = parsed.maxMileage < 1000 ? parsed.maxMileage * 1000 : parsed.maxMileage
              params.set('maxMileage', String(Math.round(miles)))
            }
            
            return NextResponse.json({ 
              params: params.toString(),
              semantic: true,
              vehicleCount: scored.length,
              vehicles: scored
            })
          }
        }
      }
    } catch (semanticError) {
      console.log('Semantic search failed, falling back to structured parsing:', semanticError)
    }

    // If semantic search didn't work or returned no results, use parsed filters directly
    if (Object.keys(parsed).length > 0) {
      const params = toParams(parsed)
      return NextResponse.json({ 
        params: params,
        semantic: false,
        vehicleCount: 0
      })
    }

    // Fallback to deterministic parsing if semantic search failed
    const res = await fetch(new URL('/api/search', req.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q }),
    })
    const data = await res.json().catch(() => ({ params: '' }))
    return NextResponse.json({ params: data?.params || '' })
  } catch (e) {
    return NextResponse.json({ params: '' })
  }
}


