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

    if (!query) {
      return NextResponse.json({ vehicles: [], params: '' })
    }

    // First, try to get embeddings for the query using OpenAI
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      // Fallback to regular search if no OpenAI key
      return NextResponse.json({ vehicles: [], params: '' })
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
      return NextResponse.json({ vehicles: [], params: '' })
    }

    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // Try semantic search with pgvector first
    try {
      const { data: searchResults, error } = await supabase.rpc('search_vehicles_semantic', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 20
      })

      if (!error && searchResults && searchResults.length > 0) {
        // Extract vehicle IDs and build params
        const vehicleIds = searchResults.map((r: any) => r.vehicle_id)
        
        // Get full vehicle data with optional category filter
        let vehicleQuery = supabase
          .from('vehicles')
          .select('*')
          .in('id', vehicleIds)
          .eq('sold', false)
        
        if (category) {
          vehicleQuery = vehicleQuery.eq('category', category)
        }
        
        const { data: vehicles, error: vehiclesError } = await vehicleQuery

        if (!vehiclesError && vehicles && vehicles.length > 0) {
          return NextResponse.json({ 
            vehicles: vehicles, 
            params: params.toString(),
            semantic: true 
          })
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
      params.set('limit', '20')
      
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
      params.set('limit', '20')
      
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
      params.set('limit', '20')
      
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
      semantic: true 
    })

  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json({ vehicles: [], params: '' })
  }
}
