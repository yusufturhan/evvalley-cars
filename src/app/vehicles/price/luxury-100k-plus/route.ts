import { NextResponse } from 'next/server'

export function GET() {
  return new NextResponse('Gone', { status: 410, headers: { 'Cache-Control': 'public, max-age=3600' } })
}

export function HEAD() {
  return new NextResponse(null, { status: 410, headers: { 'Cache-Control': 'public, max-age=3600' } })
}

export function OPTIONS() {
  return new NextResponse(null, { status: 410 })
}

