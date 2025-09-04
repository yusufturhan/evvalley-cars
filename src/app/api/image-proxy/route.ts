import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('url');
    if (!target) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const upstream = await fetch(target, {
      // Avoid sending credentials; we just stream the public asset
      method: 'GET',
      headers: {
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent': 'Evvalley-Image-Proxy'
      },
      cache: 'no-store'
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await upstream.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}


