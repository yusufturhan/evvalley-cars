import { NextResponse } from 'next/server';

export async function GET() {
  // This vehicle has been deleted, redirect to vehicles page with 301 status
  // Force no cache to bypass Vercel edge cache
  return NextResponse.redirect('https://www.evvalley.com/vehicles', { 
    status: 301,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
