import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'www.evvalley.com';
const CANONICAL_PROTOCOL = 'https:';

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
    const { pathname, searchParams } = request.nextUrl as unknown as { pathname: string; searchParams: URLSearchParams }
    const hostnameHeader = request.headers.get('host') || '';
    const hostname = hostnameHeader.toLowerCase();
    const protocol = request.nextUrl.protocol;
    
    // Hard-block Clerk subdomain from indexing: return 410 Gone for any path
    // This ensures Google drops https://clerk.evvalley.com/* permanently.
    if (hostname === 'clerk.evvalley.com' || hostname.startsWith('clerk.evvalley.com:')) {
      return new NextResponse('Gone', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
    
    // Single-hop canonical redirect to HTTPS + www (prevents http→https→www chains)
    const hostWithoutPort = hostname.split(':')[0];
    const isNonCanonicalHost = hostWithoutPort !== CANONICAL_HOST;
    const isNotHttps = protocol !== CANONICAL_PROTOCOL;
    if (isNonCanonicalHost || isNotHttps) {
      const url = request.nextUrl.clone();
      url.protocol = CANONICAL_PROTOCOL;
      url.host = CANONICAL_HOST;
      const response = NextResponse.redirect(url, 308);
      response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }
    
    // Fix duplicate canonical issue: Redirect category pages with redundant category query param
    // /vehicles/e-bikes?category=e-bike → /vehicles/e-bikes
    // /vehicles/ev-cars?category=ev-car → /vehicles/ev-cars
    // /vehicles/hybrid-cars?category=hybrid-car → /vehicles/hybrid-cars
    // /vehicles/ev-scooters?category=ev-scooter → /vehicles/ev-scooters
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMap: { [key: string]: string } = {
        'e-bike': '/vehicles/e-bikes',
        'ev-car': '/vehicles/ev-cars',
        'hybrid-car': '/vehicles/hybrid-cars',
        'ev-scooter': '/vehicles/ev-scooters',
      };
      
      if (categoryMap[categoryParam]) {
        // Check if we're already on the correct category page
        if (pathname === categoryMap[categoryParam]) {
          // Remove category param and redirect to clean URL
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete('category');
          const newUrl = new URL(pathname, request.url);
          newUrl.protocol = 'https:';
          newUrl.host = 'www.evvalley.com';
          if (newParams.toString()) {
            newUrl.search = newParams.toString();
          } else {
            newUrl.search = '';
          }
          const response = NextResponse.redirect(newUrl, 301);
          response.headers.set('X-Robots-Tag', 'index, follow');
          response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return response;
        }
      }
    }
    
    // Old year-based URLs → redirect to vehicles with year filter (BEFORE skipping static assets)
    // This fixes 404 errors for /vehicles/year/2021, etc.
    if (pathname.startsWith('/vehicles/year/')) {
      const yearMatch = pathname.match(/^\/vehicles\/year\/(\d{4})\/?$/);
      if (yearMatch) {
        const year = yearMatch[1];
        const newUrl = new URL(`/vehicles?year=${year}`, request.url);
        newUrl.protocol = 'https:';
        newUrl.host = 'www.evvalley.com';
        const response = NextResponse.redirect(newUrl, 301);
        response.headers.set('X-Robots-Tag', 'index, follow');
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return response;
      }
    }
    
    // Redirect old removed pages BEFORE other checks
    if (pathname === '/vehicles/new-arrivals' || pathname === '/vehicles/new-arrivals/') {
      const newUrl = new URL('/vehicles', request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'index, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }
    
    if (pathname === '/vehicles/6ff881f2-0128-44d2-83de-49f05a466c21') {
      const newUrl = new URL('/vehicles', request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'index, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }

    // Aggressively block CSS and static files from indexing (fixes "Crawled - currently not indexed")
    // CSS files should never be indexed by Google, but they must be accessible for page rendering
    if (pathname.startsWith('/_next/static/') && (
      pathname.endsWith('.css') || 
      pathname.includes('.css?') ||
      pathname.endsWith('.js') ||
      pathname.includes('.js?') ||
      pathname.endsWith('.map')
    )) {
      const response = NextResponse.next();
      // Aggressive noindex headers to prevent indexing
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }
    
    // Skip middleware for other static assets and API routes to improve performance
    if (pathname.startsWith('/_next/') || 
        pathname.startsWith('/api/') || 
        pathname.includes('.')) {
      const response = NextResponse.next();
      // Add noindex for all _next files
      if (pathname.startsWith('/_next/')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      }
      return response;
    }

    // Block traffic from China (except for legitimate users)
    const country = (request as any).geo?.country || request.headers.get('cf-ipcountry') || 'US'
    const userAgent = request.headers.get('user-agent') || ''
    
    // Block Chinese traffic that's likely from the EvValley town
    if (country === 'CN' && (
      userAgent.includes('bot') || 
      userAgent.includes('crawler') || 
      userAgent.includes('spider') ||
      pathname === '/' // Block homepage visits from China
    )) {
      return new NextResponse('Access denied for your region', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      })
    }

    // Remove CSS file blocking - let Google access CSS files for proper rendering

    const ip =
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      (request as any).ip ??
      'unknown'

    // Rate limiting (only for non-static requests)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Redirect all /car/ URLs to /vehicles (fixes "Blocked by robots.txt" errors)
    // This must be BEFORE other legacy redirects to catch all /car/ URLs
    if (pathname.startsWith('/car/') && pathname !== '/car') {
      // Extract the car model/slug from the URL
      const carSlug = pathname.replace('/car/', '').replace(/\/$/, '');
      // Redirect to vehicles page with search query
      const newUrl = new URL(`/vehicles?search=${encodeURIComponent(carSlug.replace(/-/g, ' '))}`, request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }

    // Handle legacy URLs that cause 404s - redirect to proper pages
    const legacyRedirects: { [key: string]: string } = {
      '/car': '/vehicles',
      '/car/tesla-model-3-2020': '/vehicles?brand=tesla&year=2020',
      '/ebike': '/vehicles/e-bikes',
      '/ebike/': '/vehicles/e-bikes',
      '/electric-cars': '/vehicles/ev-cars',
      '/hybrid-cars': '/vehicles/hybrid-cars',
      '/scooters': '/vehicles/ev-scooters',
      '/bikes': '/vehicles/e-bikes',
      '/bikes/': '/vehicles/e-bikes',
      '/escooter': '/vehicles/ev-scooters',
      '/escooter/': '/vehicles/ev-scooters',
      '/terms-of-service': '/terms',
      '/blog/the-vehicle-of-the-future-electric-cars': '/blog/the-future-of-electric-vehicles-where-are-we-headed',
      '/old-blog': '/blog',
      '/legacy': '/',
      '/v1': '/',
      '/v2': '/',
      '/bookmarks': '/favorites',
      '/bookmarks/': '/favorites',
    }

    // Check for legacy redirects
    for (const [legacyPath, newPath] of Object.entries(legacyRedirects)) {
      if (pathname.startsWith(legacyPath)) {
        const newUrl = new URL(newPath, request.url)
        newUrl.protocol = 'https:';
        newUrl.host = 'www.evvalley.com';
        const response = NextResponse.redirect(newUrl, 301) // Permanent redirect
        
        // For /bookmarks and /favorites redirects, use noindex since favorites page is private
        // For other redirects, use index, follow
        const isPrivatePage = newPath === '/favorites' || legacyPath === '/bookmarks' || legacyPath === '/bookmarks/';
        response.headers.set('X-Robots-Tag', isPrivatePage ? 'noindex, follow' : 'index, follow')
        response.headers.set('Cache-Control', 'public, max-age=31536000')
        response.headers.set('Link', `<${newUrl.toString()}>; rel="canonical"`)
        
        // Add additional headers for better SEO
        response.headers.set('X-Redirect-From', legacyPath)
        response.headers.set('X-Redirect-To', newPath)
        
        return response
      }
    }

    // Remove query param based redirects - let the pages handle their own routing
    // This was causing unnecessary redirects for valid URLs like /vehicles?category=ev-scooter

    // Redirect specific /car/ URLs that are still being crawled (fixes "Crawled - currently not indexed")
    // These should redirect BEFORE the generic gonePaths check
    if (pathname === '/car/toyota-prius-2014-gray' || pathname === '/car/toyota-prius-2014-gray/') {
      const newUrl = new URL('/vehicles?search=toyota+prius', request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }
    
    if (pathname === '/car/toyota-prius-plug-in-hybrid-2014' || pathname === '/car/toyota-prius-plug-in-hybrid-2014/') {
      const newUrl = new URL('/vehicles?search=toyota+prius+hybrid', request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }
    
    // Redirect specific /blog/ URLs that were removed to relevant content
    if (pathname === '/blog/a-major-leap-in-ev-charging-infrastructure-in-san-francisco-2024-2025' || pathname === '/blog/a-major-leap-in-ev-charging-infrastructure-in-san-francisco-2024-2025/') {
      const newUrl = new URL('/blog/ev-charging-station-guide', request.url);
      newUrl.protocol = 'https:';
      newUrl.host = 'www.evvalley.com';
      const response = NextResponse.redirect(newUrl, 301);
      response.headers.set('X-Robots-Tag', 'index, follow');
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return response;
    }

    // Return 410 Gone for known removed/invalid URLs (only for truly deleted content)
    const gonePaths = new Set([
      '/vehicles/88fb4f6a-28a9-4b7c-8ed7-8c7a0c5ae760',
      '/blog/environmental-benefits-of-electric-cars',
      '/blog/the-importance-of-charging-station-availability-for-the-future-of-electric-vehicles',
      '/blog/battery-technology-advancements-and-the-ev-range-problem',
      '/blog/battery-technology-advancements-and-the-ev-range-problem/',
      '/blog/a-brief-history-of-electric-vehicles-from-the-past-to-today',
      '/blog/what-are-electric-vehicles-and-how-do-they-work',
      '/car/toyota-prius-hybrid-2004',
      '/car/nissan-leaf-2013',
      '/car/toyota-prius-2012-white',
      '/car/toyota-prius-hybrid-dark-gray',
      '/car/toyota-camry-hybrid',
      '/car/toyota-corolla-hybrid',
      '/car/toyota-corolla-hybrid-2023',
      '/car/toyota-corolla-hybrid-black',
      '/car/toyota-prius-blue-2014',
      '/$',
      '/&',
      '/community/clerk.evvalley.com',
    ])

    if (gonePaths.has(pathname)) {
      return new NextResponse('Gone', { 
        status: 410,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow',
          'X-Gone-Reason': 'Permanently removed',
          'X-Gone-Date': new Date().toISOString(),
        }
      })
    }

    // Remove trailing slash redirects - let Next.js handle this automatically
    // This was causing unnecessary redirects for valid URLs with trailing slashes

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


