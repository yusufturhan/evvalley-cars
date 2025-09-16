import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const query: string = (body?.q || '').toString().trim()
    const category: string = (body?.category || '').toString().trim()
    const filters = (body?.filters || {}) as {
      brand?: string
      model?: string
      color?: string
      city?: string
      maxPrice?: number
      maxMileage?: number
    }

    if (!query) {
      return NextResponse.json({ vehicles: [], params: '' })
    }

    // First, try to get embeddings for the query using OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Fallback to regular search if no OpenAI key
      return NextResponse.json({ vehicles: [], params: '', error: 'missing_openai_key' })
    }

    // Get embedding for the query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    })

    if (!embeddingResponse.ok) {
      const errText = await embeddingResponse.text().catch(() => '')
      return NextResponse.json({ vehicles: [], params: '', error: 'embedding_failed', details: errText })
    }

    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // Try semantic search with pgvector first
    try {
      const { data: searchResults, error } = await supabase.rpc('search_vehicles_semantic', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: 30
      })

      if (!error && searchResults && searchResults.length > 0) {
        // Extract vehicle IDs and similarity map
        const vehicleIds = searchResults.map((r: any) => r.vehicle_id)
        const similarityById: Record<string, number> = {}
        for (const r of searchResults as any[]) {
          similarityById[r.vehicle_id] = typeof r.similarity === 'number' ? r.similarity : 0
        }
        
        // Get full vehicle data with optional category filter
        let vehicleQuery = supabase
          .from('vehicles')
          .select('*')
          .in('id', vehicleIds)
          .eq('sold', false)
        
        if (category) {
          vehicleQuery = vehicleQuery.eq('category', category)
        }
        // Apply strict filters server-side if provided
        if (filters.brand) {
          vehicleQuery = vehicleQuery.ilike('brand', `%${filters.brand}%`)
        }
        if (filters.model) {
          vehicleQuery = vehicleQuery.ilike('model', `%${filters.model}%`)
        }
        if (filters.color) {
          vehicleQuery = vehicleQuery.or(
            `color.ilike.%${filters.color}%,exterior_color.ilike.%${filters.color}%`
          )
        }
        if (filters.city) {
          const city = filters.city.toLowerCase()
          vehicleQuery = vehicleQuery.ilike('location', `${city}%`)
        }
        if (typeof filters.maxPrice === 'number') {
          vehicleQuery = vehicleQuery.lte('price', filters.maxPrice)
        }
        if (typeof filters.maxMileage === 'number') {
          vehicleQuery = vehicleQuery.lte('mileage', filters.maxMileage)
        }
        
        const { data: vehicles, error: vehiclesError } = await vehicleQuery

        if (!vehiclesError && vehicles && vehicles.length > 0) {
          // Attach similarity and sort by it
          const vehiclesWithSim = vehicles.map((v: any) => ({ ...v, _similarity: similarityById[v.id] || 0 }))
            .sort((a: any, b: any) => (b._similarity || 0) - (a._similarity || 0))

          return NextResponse.json({ vehicles: vehiclesWithSim, semantic: true })
        }
      }
    } catch (semanticError) {
      console.log('Semantic search failed, falling back to regular search:', semanticError)
    }

    // Fallback to regular search using appropriate endpoints
    const allVehicles: any[] = []
    
    if (!category || category === 'ev-car' || category === 'hybrid-car') {
      // Search EV cars and hybrid cars
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      params.set('search', query)
      params.set('limit', '30')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vehicles?${params.toString()}`)
      const data = await response.json()
      if (data.vehicles) {
        allVehicles.push(...data.vehicles)
      }
    }
    
    if (!category || category === 'ev-scooter') {
      // Search E-scooters
      const params = new URLSearchParams()
      params.set('search', query)
      params.set('limit', '30')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ev-scooters?${params.toString()}`)
      const data = await response.json()
      if (data.scooters) {
        allVehicles.push(...data.scooters)
      }
    }
    
    if (!category || category === 'e-bike') {
      // Search E-bikes
      const params = new URLSearchParams()
      params.set('search', query)
      params.set('limit', '30')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/e-bikes?${params.toString()}`)
      const data = await response.json()
      if (data.bikes) {
        allVehicles.push(...data.bikes)
      }
    }

    const vehicles = allVehicles

    // Build search params for the frontend
    const params = new URLSearchParams()
    // Don't set category to allow searching across all categories
    params.set('semantic', 'true')
    params.set('query', query)

    return NextResponse.json({ 
      vehicles: vehicles || [], 
      params: params.toString(),
      semantic: true,
      debug: { threshold: 0.3 }
    })

  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json({ vehicles: [], params: '' })
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'method_not_allowed',
    message: 'Use POST with JSON body { "q": "your query" } to call this endpoint.'
  }, { status: 405 })
}
