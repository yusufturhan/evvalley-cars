import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function createSearchDocument(vehicle: any) {
  const parts = []
  
  // Basic info
  if (vehicle.title) parts.push(vehicle.title)
  if (vehicle.brand) parts.push(vehicle.brand)
  if (vehicle.model) parts.push(vehicle.model)
  if (vehicle.year) parts.push(vehicle.year.toString())
  
  // Colors
  if (vehicle.color) parts.push(vehicle.color)
  if (vehicle.exterior_color) parts.push(vehicle.exterior_color)
  
  // Location
  if (vehicle.location) parts.push(vehicle.location)
  
  // Price and mileage
  if (vehicle.price) parts.push(`$${vehicle.price.toLocaleString()}`)
  if (vehicle.mileage) parts.push(`${vehicle.mileage.toLocaleString()} miles`)
  
  // Category
  if (vehicle.category) {
    const categoryMap = {
      'ev-car': 'electric car',
      'hybrid-car': 'hybrid car',
      'e-bike': 'electric bike',
      'ev-scooter': 'electric scooter'
    }
    parts.push(categoryMap[vehicle.category] || vehicle.category)
  }
  
  return parts.join(' ').toLowerCase()
}

async function generateEmbedding(text: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const vehicleId = body.vehicleId

    if (!vehicleId) {
      return NextResponse.json({ error: 'vehicleId is required' }, { status: 400 })
    }

    // Get vehicle data
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single()

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Skip if vehicle is sold
    if (vehicle.sold) {
      return NextResponse.json({ message: 'Vehicle is sold, skipping indexing' })
    }

    // Create search document
    const searchDocument = createSearchDocument(vehicle)
    
    // Generate embedding
    const embedding = await generateEmbedding(searchDocument)

    // Insert or update in search index
    const { error: indexError } = await supabase
      .from('vehicles_search_index')
      .upsert({
        vehicle_id: vehicleId,
        embedding: embedding,
        search_document: searchDocument,
        updated_at: new Date().toISOString()
      })

    if (indexError) {
      console.error('Error indexing vehicle:', indexError)
      return NextResponse.json({ error: 'Failed to index vehicle' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vehicle indexed successfully',
      searchDocument: searchDocument
    })

  } catch (error) {
    console.error('Error in index-vehicle:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
