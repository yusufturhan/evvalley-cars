import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.evvalley.com';
  const currentDate = new Date();

  // Static pages with enhanced priorities and frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/escrow`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/safety`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    // Category pages with canonical URLs - prevent duplicate content
    {
      url: `${baseUrl}/vehicles/ev-cars`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/hybrid-cars`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/ev-scooters`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles/e-bikes`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Fetch vehicles with enhanced error handling and validation
  let vehiclePages: MetadataRoute.Sitemap = [];
  try {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, updated_at, vin, title, sold_at, category')
      .is('sold_at', null) // Only unsold vehicles
      .not('id', 'is', null) // Must have ID
      .not('title', 'is', null) // Must have title
      .order('updated_at', { ascending: false })
      .limit(5000); // Increased limit for better coverage
    
    if (error) {
      console.error('Sitemap: Error fetching vehicles:', error);
    } else if (vehicles && vehicles.length > 0) {
      console.log(`Sitemap: Found ${vehicles.length} vehicles from database`);
      
      vehiclePages = vehicles
        .filter((vehicle: any) => {
          const hasId = vehicle.id;
          const hasTitle = vehicle.title;
          const isUnsold = vehicle.sold_at === null;
          
          if (!hasId) console.log(`Sitemap: Filtered out vehicle - missing ID`);
          if (!hasTitle) console.log(`Sitemap: Filtered out vehicle - missing title`);
          if (!isUnsold) console.log(`Sitemap: Filtered out vehicle - sold: ${vehicle.sold_at}`);
          
          return hasId && hasTitle && isUnsold;
        })
        .map((vehicle: any) => ({
          url: `${baseUrl}/vehicles/${vehicle.id}`,
          lastModified: vehicle.updated_at ? new Date(vehicle.updated_at) : currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      
      console.log(`Sitemap: After filtering, ${vehiclePages.length} vehicles included in sitemap`);
    } else {
      console.log('Sitemap: No vehicles found in database');
    }
  } catch (error) {
    console.error('Sitemap: Unexpected error fetching vehicles:', error);
    vehiclePages = [];
  }

  // Blog posts with enhanced error handling
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { blogPosts } = await import('@/lib/blog-content');
    if (blogPosts && Array.isArray(blogPosts)) {
      blogPages = blogPosts
        .filter((post: any) => post && post.slug && post.title)
        .map((post: any) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error('Sitemap: Error importing blog content:', error);
    blogPages = [];
  }

  // Blog category pages with canonical URLs
  const blogCategories = [
    'ev-guide',
    'market-analysis', 
    'technology-updates',
    'buying-selling-tips',
    'e-mobility'
  ];

  const blogCategoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Brand and model specific pages to prevent duplicate content
  const brandPages = [
    'tesla', 'bmw', 'audi', 'mercedes', 'volkswagen', 'ford', 'toyota', 'honda', 'nissan'
  ].map(brand => ({
    url: `${baseUrl}/vehicles/brand/${brand}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Combine all pages and ensure we always return something
  const allPages = [
    ...staticPages, 
    ...vehiclePages, 
    ...blogPages, 
    ...blogCategoryPages,
    ...brandPages
  ];
  
  // Remove any duplicate URLs to prevent duplicate content issues
  const uniquePages = allPages.filter((page, index, self) => 
    index === self.findIndex(p => p.url === page.url)
  );
  
  // Log sitemap generation for debugging
  console.log(`Sitemap generated with ${uniquePages.length} unique URLs:`, {
    static: staticPages.length,
    vehicles: vehiclePages.length,
    blogs: blogPages.length,
    categories: blogCategoryPages.length,
    brands: brandPages.length,
    duplicatesRemoved: allPages.length - uniquePages.length
  });

  return uniquePages;
}
