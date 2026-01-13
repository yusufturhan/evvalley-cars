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
        destination: 'https://www.evvalley.com/favicon.svg?v=14',
        permanent: true,
      },
      // Legacy car detail slugs → redirect to vehicles with 404 fallback
      {
        source: '/car',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      // Specific car URLs that cause Soft 404 - redirect to vehicles page
      {
        source: '/car/toyota-prius-2014-gray',
        destination: 'https://www.evvalley.com/vehicles?search=toyota+prius',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-2014-gray/',
        destination: 'https://www.evvalley.com/vehicles?search=toyota+prius',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-plug-in-hybrid-2014',
        destination: 'https://www.evvalley.com/vehicles?search=toyota+prius+hybrid',
        permanent: true,
      },
      {
        source: '/car/toyota-prius-plug-in-hybrid-2014/',
        destination: 'https://www.evvalley.com/vehicles?search=toyota+prius+hybrid',
        permanent: true,
      },
      // Generic car slug redirect - handle both slash and no-slash in one hop to avoid redirect chains
      {
        source: '/car/:slug((?!toyota-prius-2014-gray|toyota-prius-plug-in-hybrid-2014).*)',
        destination: 'https://www.evvalley.com/vehicles?search=:slug',
        permanent: true,
      },
      {
        source: '/car/:slug((?!toyota-prius-2014-gray|toyota-prius-plug-in-hybrid-2014).*)/',
        destination: 'https://www.evvalley.com/vehicles?search=:slug',
        permanent: true,
      },
      // Brand pages → filter on vehicles list
      {
        source: '/vehicles/brand/:brand',
        destination: 'https://www.evvalley.com/vehicles?brand=:brand',
        permanent: true,
      },
      {
        source: '/vehicles/brand/:brand/',
        destination: 'https://www.evvalley.com/vehicles?brand=:brand',
        permanent: true,
      },
      // Year pages → filter on vehicles list (fixes 404 errors)
      {
        source: '/vehicles/year/:year',
        destination: 'https://www.evvalley.com/vehicles?year=:year',
        permanent: true,
      },
      {
        source: '/vehicles/year/:year/',
        destination: 'https://www.evvalley.com/vehicles?year=:year',
        permanent: true,
      },
      // Old removed pages → redirect to vehicles
      {
        source: '/vehicles/new-arrivals',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/new-arrivals/',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/featured',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/featured/',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/trending',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/trending/',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      // Old removed vehicle IDs → redirect to vehicles
      {
        source: '/vehicles/6ff881f2-0128-44d2-83de-49f05a466c21',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/c287f364-bd34-40d6-8644-125ae21cd2bc',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      {
        source: '/vehicles/72cf4a6d-a6ef-4aa6-a83d-c680cb02c9f6',
        destination: 'https://www.evvalley.com/vehicles',
        permanent: true,
      },
      // Old blog slugs → new slugs
      {
        source: '/blog/ev-buying-guide-2024',
        destination: 'https://www.evvalley.com/blog/complete-guide-to-buying-electric-vehicles',
        permanent: true,
      },
      {
        source: '/blog/ev-buying-guide-2024/',
        destination: 'https://www.evvalley.com/blog/complete-guide-to-buying-electric-vehicles',
        permanent: true,
      },
      {
        source: '/blog/tesla-home-charging-setup',
        destination: 'https://www.evvalley.com/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/tesla-home-charging-setup/',
        destination: 'https://www.evvalley.com/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      // Maintenance guide slug no longer exists → best matching evergreen article
      {
        source: '/blog/battery-technology-advancements-and-the-ev-range-problem',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/battery-technology-advancements-and-the-ev-range-problem/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/ev-maintenance-guide',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/ev-maintenance-guide/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      // Old informational article → relevant evergreen guide
      {
        source: '/blog/what-are-electric-vehicles-and-how-do-they-work',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/what-are-electric-vehicles-and-how-do-they-work/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      // Legacy URL redirects to fix GSC redirection errors
      {
        source: '/ebike',
        destination: 'https://www.evvalley.com/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/ebike/',
        destination: 'https://www.evvalley.com/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/bikes',
        destination: 'https://www.evvalley.com/vehicles/e-bikes',
        permanent: true,
      },
      {
        source: '/bikes/',
        destination: 'https://www.evvalley.com/vehicles/e-bikes',
        permanent: true,
      },
      
      // Fix trailing slash redirects for GSC
      {
        source: '/about/',
        destination: 'https://www.evvalley.com/about',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: 'https://www.evvalley.com/contact',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: 'https://www.evvalley.com/blog',
        permanent: true,
      },
      {
        source: '/community/',
        destination: 'https://www.evvalley.com/community',
        permanent: true,
      },
      {
        source: '/sell/',
        destination: 'https://www.evvalley.com/sell',
        permanent: true,
      },
      {
        source: '/profile/',
        destination: 'https://www.evvalley.com/profile',
        permanent: true,
      },
      
      // Redirect old bookmarks page
      {
        source: '/bookmarks',
        destination: 'https://www.evvalley.com/favorites',
        permanent: true,
      },
      {
        source: '/bookmarks/',
        destination: 'https://www.evvalley.com/favorites',
        permanent: true,
      },
      // Missing blog posts redirects (from 404 errors) - redirect to existing relevant content
      {
        source: '/blog/electric-scooter-buying-guide-2024',
        destination: 'https://www.evvalley.com/blog/e-bike-buying-guide-2024',
        permanent: true,
      },
      {
        source: '/blog/electric-scooter-buying-guide-2024/',
        destination: 'https://www.evvalley.com/blog/e-bike-buying-guide-2024',
        permanent: true,
      },
      {
        source: '/blog/the-advantages-of-using-electric-vehicles-on-uber-and-lyft',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/the-advantages-of-using-electric-vehicles-on-uber-and-lyft/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/ev-charging-station-guide-2024',
        destination: 'https://www.evvalley.com/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/ev-charging-station-guide-2024/',
        destination: 'https://www.evvalley.com/blog/how-to-charge-tesla-at-home',
        permanent: true,
      },
      {
        source: '/blog/the-future-of-electric-vehicles-where-are-we-headed',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/the-future-of-electric-vehicles-where-are-we-headed/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/advantages-of-electric-vehicles-over-internal-combustion-engine-cars',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
      {
        source: '/blog/advantages-of-electric-vehicles-over-internal-combustion-engine-cars/',
        destination: 'https://www.evvalley.com/blog/electric-vehicle-cost-analysis',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
