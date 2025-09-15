/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'njsfbchypeysfqfsjesa.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'njsfbchypeysfqfsjesa.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/vehicle-images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ];
  },
  
  // Redirect legacy favicon.ico to our SVG favicon
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg?v=14',
        permanent: true,
      },
      // Legacy car detail slugs → vehicles listing with search term
      {
        source: '/car',
        destination: '/vehicles/ev-cars',
        permanent: true,
      },
      {
        source: '/car/:slug*',
        destination: '/vehicles?search=:slug*',
        permanent: true,
      },
      // Brand pages → filter on vehicles list
      {
        source: '/vehicles/brand/:brand',
        destination: '/vehicles?brand=:brand',
        permanent: true,
      },
      {
        source: '/vehicles/brand/:brand/',
        destination: '/vehicles?brand=:brand',
        permanent: true,
      },
      // Old blog slugs → new slugs
      {
        source: '/blog/ev-buying-guide-2024',
        destination: '/blog/complete-guide-to-buying-electric-vehicles',
        permanent: true,
      },
      {
        source: '/blog/ev-buying-guide-2024/',
        destination: '/blog/complete-guide-to-buying-electric-vehicles',
        permanent: true,
      },
      {
        source: '/blog/tesla-home-charging-setup',
        destination: '/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/tesla-home-charging-setup/',
        destination: '/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      // Maintenance guide slug no longer exists → best matching evergreen article
      {
        source: '/blog/ev-maintenance-guide',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/ev-maintenance-guide/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      // Old informational article → relevant evergreen guide
      {
        source: '/blog/what-are-electric-vehicles-and-how-do-they-work',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/what-are-electric-vehicles-and-how-do-they-work/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      // Old category paths → blog hub (we can add query later)
      {
        source: '/blog/category/:category',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/category/:category/',
        destination: '/blog',
        permanent: true,
      },
      // Canonicalize vehicles category query params to clean category paths
      {
        source: '/vehicles',
        has: [
          { type: 'query', key: 'category', value: 'ev-car' },
        ],
        destination: '/vehicles/ev-cars',
        permanent: true,
      },
      {
        source: '/vehicles',
        has: [
          { type: 'query', key: 'category', value: 'hybrid-car' },
        ],
        destination: '/vehicles/hybrid-cars',
        permanent: true,
      },
      {
        source: '/vehicles',
        has: [
          { type: 'query', key: 'category', value: 'ev-scooter' },
        ],
        destination: '/vehicles/ev-scooters',
        permanent: true,
      },
      {
        source: '/vehicles',
        has: [
          { type: 'query', key: 'category', value: 'e-bike' },
        ],
        destination: '/vehicles/e-bikes',
        permanent: true,
      },
      // Redirect old bookmarks page
      {
        source: '/bookmarks',
        destination: '/favorites',
        permanent: true,
      },
      {
        source: '/bookmarks/',
        destination: '/favorites',
        permanent: true,
      },
      // Normalize trailing slashes on blog posts and categories
      {
        source: '/blog/:slug*/',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/blog/category/:category*/',
        destination: '/blog/category/:category*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig 