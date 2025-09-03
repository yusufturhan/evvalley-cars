import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Handle legacy URLs that cause 404s - redirect to proper pages
    const legacyRedirects: { [key: string]: string } = {
      '/car': '/vehicles',
      '/ebike': '/vehicles/e-bikes',
      '/electric-cars': '/vehicles/ev-cars',
      '/hybrid-cars': '/vehicles/hybrid-cars',
      '/scooters': '/vehicles/ev-scooters',
      '/bikes': '/vehicles/e-bikes',
      '/old-blog': '/blog',
      '/legacy': '/',
      '/v1': '/',
      '/v2': '/',
    }

    // Check for legacy redirects
    for (const [legacyPath, newPath] of Object.entries(legacyRedirects)) {
      if (pathname.startsWith(legacyPath)) {
        const newUrl = new URL(newPath, request.url)
        return NextResponse.redirect(newUrl, 301) // Permanent redirect
      }
    }

    // Handle trailing slashes for consistency
    if (pathname !== '/' && pathname.endsWith('/')) {
      const newUrl = new URL(pathname.slice(0, -1), request.url)
      return NextResponse.redirect(newUrl, 301)
    }

    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // SEO headers
    response.headers.set('X-Robots-Tag', 'index, follow')
    
    // Performance headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    
    return response
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Return a safe response if middleware fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}


