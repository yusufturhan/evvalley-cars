import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
        ],
      },
      // Block Chinese search engines and bots
      {
        userAgent: 'Baiduspider',
        disallow: '/',
      },
      {
        userAgent: 'Sogou',
        disallow: '/',
      },
      {
        userAgent: '360Spider',
        disallow: '/',
      },
      {
        userAgent: 'YisouSpider',
        disallow: '/',
      },
    ],
    sitemap: 'https://www.evvalley.com/sitemap.xml',
    // Always use www.evvalley.com as the preferred domain
    // evvalley.com (without www) will redirect to www.evvalley.com via middleware
    host: 'https://www.evvalley.com',
  }
}
