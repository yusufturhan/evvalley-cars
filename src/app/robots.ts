import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '/temp/',
        '*.json',
        '*.xml',
        // Block dynamic search URLs
        '/*?search=*',
        '/*?category=*',
        '/*?*',
        // Block legacy paths that cause 404s
        '/car/',
        '/ebike',
        '/electric-cars',
        '/hybrid-cars',
        '/scooters',
        '/bikes',
        '/old-blog/',
        '/legacy/',
        '/v1/',
        '/v2/',
        '/api/v1/',
        '/api/v2/',
        // Block problematic blog posts
        '/blog/environmental-benefits-of-electric-cars',
        '/blog/the-advantages-of-using-electric-vehicles-on-uber-and-lyft',
        '/blog/a-major-leap-in-ev-charging-infrastructure-in-san-francisco-2024-2025',
        '/blog/battery-technology-advancements-and-the-ev-range-problem',
      ],
    },
    sitemap: 'https://www.evvalley.com/sitemap.xml',
    host: 'https://www.evvalley.com',
  }
}
