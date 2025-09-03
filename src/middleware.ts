import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
  
  return response
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


