import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/sign-in',
          '/sign-up',
          '/profile/',
          '/favorites/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/sign-in',
          '/sign-up',
          '/profile/',
          '/favorites/',
        ],
      },
    ],
    sitemap: 'https://www.evvalley.com/sitemap.xml',
    host: 'https://www.evvalley.com',
  }
}
