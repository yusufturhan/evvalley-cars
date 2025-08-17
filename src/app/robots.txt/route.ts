import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# Evvalley Robots.txt
# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /vehicles/
Allow: /blog/
Allow: /about/
Allow: /contact/
Allow: /privacy/
Allow: /terms/
Allow: /safety/

# Sitemap
Sitemap: https://www.evvalley.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Additional directives for better SEO
# Prevent duplicate content issues
Disallow: /*?*
Disallow: /*&*
Disallow: /search?
Disallow: /filter?

# Allow specific query parameters that are important
Allow: /vehicles?category=
Allow: /vehicles?brand=
Allow: /vehicles?year=
Allow: /blog?category=

# Prevent Soft 404 issues
# Block access to non-existent vehicle IDs
Disallow: /vehicles/999999
Disallow: /vehicles/000000
Disallow: /vehicles/test
Disallow: /vehicles/demo

# Host directive
Host: https://www.evvalley.com
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
