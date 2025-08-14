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
      ],
    },
    sitemap: 'https://www.evvalley.com/sitemap.xml',
    host: 'https://www.evvalley.com',
  }
}
