import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  // Disable trailing slash redirects to prevent GSC issues
  trailingSlash: false,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
      // Legacy car detail slugs → redirect to vehicles with 404 fallback
      {
        source: '/car',
        destination: '/vehicles',
        permanent: true,
      },
      // Specific car URLs that cause Soft 404 - redirect to vehicles page
      {
        source: '/car/toyota-prius-2014-gray',
        destination: '/vehicles?search=toyota+prius',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-2014-gray/',
        destination: '/vehicles?search=toyota+prius',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-plug-in-hybrid-2014',
        destination: '/vehicles?search=toyota+prius+hybrid',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-plug-in-hybrid-2014/',
        destination: '/vehicles?search=toyota+prius+hybrid',
        permanent: true,
      },
      // Generic car slug redirect - but only if it doesn't match specific patterns
      {
        source: '/car/:slug((?!toyota-prius-2014-gray|toyota-prius-plug-in-hybrid-2014).*)',
        destination: '/vehicles?search=:slug',
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
      // Year pages → filter on vehicles list (fixes 404 errors)
      {
        source: '/vehicles/year/:year',
        destination: '/vehicles?year=:year',
        permanent: true,
      },
      {
        source: '/vehicles/year/:year/',
        destination: '/vehicles?year=:year',
        permanent: true,
      },
      // Old removed pages → redirect to vehicles
      {
        source: '/vehicles/new-arrivals',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/new-arrivals/',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/featured',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/featured/',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/trending',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/trending/',
        destination: '/vehicles',
        permanent: true,
      },
      // Old removed vehicle IDs → redirect to vehicles
      {
        source: '/vehicles/6ff881f2-0128-44d2-83de-49f05a466c21',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/c287f364-bd34-40d6-8644-125ae21cd2bc',
        destination: '/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/72cf4a6d-a6ef-4aa6-a83d-c680cb02c9f6',
        destination: '/vehicles',
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
        source: '/blog/battery-technology-advancements-and-the-ev-range-problem',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/battery-technology-advancements-and-the-ev-range-problem/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
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
      // Legacy URL redirects to fix GSC redirection errors
      {
        source: '/ebike',
        destination: '/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/ebike/',
        destination: '/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/bikes',
        destination: '/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/bikes/',
        destination: '/vehicles/e-bikes',
        permanent: true,
      },
      
      // Fix trailing slash redirects for GSC
      {
        source: '/about/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/sell/',
        destination: '/sell',
        permanent: true,
      },
      {
        source: '/profile/',
        destination: '/profile',
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
      // Missing blog posts redirects (from 404 errors) - redirect to existing relevant content
      {
        source: '/blog/electric-scooter-buying-guide-2024',
        destination: '/blog/e-bike-buying-guide-2024',
        permanent: true,
      },
      {
        source: '/blog/electric-scooter-buying-guide-2024/',
        destination: '/blog/e-bike-buying-guide-2024',
        permanent: true,
      },
      {
        source: '/blog/the-advantages-of-using-electric-vehicles-on-uber-and-lyft',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/the-advantages-of-using-electric-vehicles-on-uber-and-lyft/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/ev-charging-station-guide-2024',
        destination: '/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/ev-charging-station-guide-2024/',
        destination: '/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/the-future-of-electric-vehicles-where-are-we-headed',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/the-future-of-electric-vehicles-where-are-we-headed/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/advantages-of-electric-vehicles-over-internal-combustion-engine-cars',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/advantages-of-electric-vehicles-over-internal-combustion-engine-cars/',
        destination: '/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
