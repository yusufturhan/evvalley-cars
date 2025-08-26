import { NextRequest, NextResponse } from 'next/server';

// Middleware to harden SEO by handling legacy/invalid URLs from old platform
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Force favicon.ico to our SVG to avoid Vercel's default icon cache
  if (pathname === '/favicon.ico') {
    const to = new URL('/favicon.svg?v=14', url.origin);
    return NextResponse.redirect(to, { status: 301 });
  }

  // 1) Legacy Unicorn Platform paths that should be removed from index
  //    Return 410 Gone so Google drops them quickly
  if (/^\/car\//.test(pathname)) {
    return new NextResponse('Gone', { status: 410 });
  }

  const legacyBlogSlugs = new Set<string>([
    'environmental-benefits-of-electric-cars',
    'the-advantages-of-using-electric-vehicles-on-uber-and-lyft',
    'a-major-leap-in-ev-charging-infrastructure-in-san-francisco-2024-2025',
  ]);
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
    if (legacyBlogSlugs.has(slug)) {
      return new NextResponse('Gone', { status: 410 });
    }
  }

  // 2) Known obsolete single paths → redirect to best replacement
  if (pathname === '/ebike') {
    const to = new URL('/vehicles/e-bikes', url.origin);
    return NextResponse.redirect(to, { status: 301 });
  }

  // 3) Redirect old query parameter URLs to canonical URLs
  if (pathname === '/vehicles' && url.search) {
    const searchParams = url.searchParams;
    const category = searchParams.get('category');
    
    if (category === 'ev-car') {
      const to = new URL('/vehicles/ev-cars', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'hybrid-car') {
      const to = new URL('/vehicles/hybrid-cars', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'ev-scooter') {
      const to = new URL('/vehicles/ev-scooters', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'e-bike') {
      const to = new URL('/vehicles/e-bikes', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
  }

  // 4) Redirect old blog query parameter URLs to canonical URLs
  if (pathname === '/blog' && url.search) {
    const searchParams = url.searchParams;
    const category = searchParams.get('category');
    
    if (category === 'EV Guide') {
      const to = new URL('/blog/category/ev-guide', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'Market Analysis') {
      const to = new URL('/blog/category/market-analysis', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'Technology Updates') {
      const to = new URL('/blog/category/technology-updates', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'Buying/Selling Tips') {
      const to = new URL('/blog/category/buying-selling-tips', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
    if (category === 'E-Mobility') {
      const to = new URL('/blog/category/e-mobility', url.origin);
      return NextResponse.redirect(to, { status: 301 });
    }
  }

  // 5) Prevent Soft 404s by redirecting invalid vehicle IDs
  if (pathname.match(/^\/vehicles\/(999999|000000|test|demo|null)$/)) {
    const to = new URL('/vehicles', url.origin);
    return NextResponse.redirect(to, { status: 301 });
  }

  // 6) Prevent Soft 404s by redirecting invalid blog slugs
  if (pathname.match(/^\/blog\/(test|demo)$/)) {
    const to = new URL('/blog', url.origin);
    return NextResponse.redirect(to, { status: 301 });
  }

  // 7) Add canonical headers for important pages
  const response = NextResponse.next();
  
  // Add canonical header for main pages
  if (pathname === '/vehicles/ev-cars') {
    response.headers.set('Link', '<https://www.evvalley.com/vehicles/ev-cars>; rel="canonical"');
  }
  if (pathname === '/vehicles/hybrid-cars') {
    response.headers.set('Link', '<https://www.evvalley.com/vehicles/hybrid-cars>; rel="canonical"');
  }
  if (pathname === '/vehicles/ev-scooters') {
    response.headers.set('Link', '<https://www.evvalley.com/vehicles/ev-scooters>; rel="canonical"');
  }
  if (pathname === '/vehicles/e-bikes') {
    response.headers.set('Link', '<https://www.evvalley.com/vehicles/e-bikes>; rel="canonical"');
  }

  return response;
}

// Exclude static assets and API from middleware for performance
export const config = {
  matcher: [
    // Include /favicon.ico to override Vercel default
    '/favicon.ico',
    '/((?!_next/|static/|favicon.svg|robots.txt|sitemap.xml|api/).*)',
  ],
};


