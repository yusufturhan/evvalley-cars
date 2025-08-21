import { NextRequest, NextResponse } from 'next/server';

// Middleware to harden SEO by handling legacy/invalid URLs from old platform
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Force favicon.ico to our SVG to avoid Vercel's default icon cache
  if (pathname === '/favicon.ico') {
    const to = new URL('/favicon.svg?v=11', url.origin);
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
    const to = new URL('/vehicles?category=e-bike', url.origin);
    return NextResponse.redirect(to, { status: 301 });
  }

  // 3) favicon.ico already redirected in next.config.js; let it pass
  return NextResponse.next();
}

// Exclude static assets and API from middleware for performance
export const config = {
  matcher: [
    // Include /favicon.ico to override Vercel default
    '/favicon.ico',
    '/((?!_next/|static/|favicon.svg|robots.txt|sitemap.xml|api/).*)',
  ],
};


