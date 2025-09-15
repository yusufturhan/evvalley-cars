import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

const jsonSchema = {
  name: 'evvalley_search_filters',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      brand: { type: 'string' },
      model: { type: 'string' },
      color: { type: 'string' },
      city: { type: 'string' },
      maxPrice: { type: 'number' },
      maxMileage: { type: 'number' },
    },
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

    // Try semantic search with parsed filters
    try {
      const semanticRes = await fetch(new URL('/api/semantic-search', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      })
      
      if (semanticRes.ok) {
        const semanticData = await semanticRes.json()
        if (semanticData.vehicles && semanticData.vehicles.length > 0) {
          // Apply additional filtering to semantic results
          const filteredVehicles = applyFiltersToVehicles(semanticData.vehicles, parsed)
          
          if (filteredVehicles.length > 0) {
            // Build params with actual filters found
            const params = new URLSearchParams()
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
              vehicleCount: filteredVehicles.length,
              vehicles: filteredVehicles
            })
          }
        }
      }
    } catch (semanticError) {
      console.log('Semantic search failed, falling back to structured parsing:', semanticError)
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


