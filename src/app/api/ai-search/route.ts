import { NextResponse } from 'next/server'

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
  params.set('category', 'ev-car')
  if (p.brand) params.set('brand', p.brand.toLowerCase())
  if (p.model) {
    params.set('model', p.model.toLowerCase())
    params.set('search', p.model.toLowerCase())
  }
  if (p.color) params.set('color', p.color.toLowerCase())
  if (p.city) params.set('location', p.city)
  if (p.maxPrice) params.set('maxPrice', String(Math.round(p.maxPrice)))
  if (p.maxMileage) params.set('maxMileage', String(Math.round(p.maxMileage)))
  return params.toString()
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const q: string = (body?.q || '').toString()

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

    // Call OpenAI chat completions with JSON schema output
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

    if (!completion.ok) {
      // Fallback to deterministic
      const res = await fetch(new URL('/api/search', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      })
      const data = await res.json().catch(() => ({ params: '' }))
      return NextResponse.json({ params: data?.params || '' })
    }

    const json: any = await completion.json()
    const content = json?.choices?.[0]?.message?.content
    let parsed: Parsed = {}
    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = {}
    }

    return NextResponse.json({ params: toParams(parsed) })
  } catch (e) {
    return NextResponse.json({ params: '' })
  }
}


