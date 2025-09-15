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

    // Search using pgvector cosine similarity
    const { data: searchResults, error } = await supabase.rpc('search_vehicles_semantic', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 20
    })

    if (error) {
      console.error('Semantic search error:', error)
      return NextResponse.json({ vehicles: [], params: '' })
    }

    // Extract vehicle IDs and build params
    const vehicleIds = searchResults?.map((r: any) => r.vehicle_id) || []
    
    if (vehicleIds.length === 0) {
      return NextResponse.json({ vehicles: [], params: '' })
    }

    // Get full vehicle data
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .in('id', vehicleIds)
      .eq('sold', false)

    if (vehiclesError) {
      console.error('Vehicles fetch error:', vehiclesError)
      return NextResponse.json({ vehicles: [], params: '' })
    }

    // Build search params for the frontend
    const params = new URLSearchParams()
    params.set('category', 'ev-car')
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
