import { Metadata } from 'next';
import { Suspense } from 'react';
import { EVCarsClient } from './EVCarsClient';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const brand = params.brand as string | undefined;
  const location = params.location as string | undefined;
  
  const brandName = brand && brand !== 'all' ? brand : '';
  const locName = location ? (Array.isArray(location) ? location[0] : location) : '';
  
  const title = `${brandName ? brandName + ' ' : ''}Electric Cars for Sale${locName ? ' in ' + locName : ''} | EvValley`;
  const description = `Browse ${brandName ? brandName + ' ' : ''}electric cars${locName ? ' in ' + locName : ''}. Filter by price, year, and range. Verified EV listings on EvValley.`;

  // Check if any filter is active (except category which is fixed for this page)
  const hasFilters = Object.keys(params).some(key => 
    ['brand', 'year', 'minPrice', 'maxPrice', 'search', 'location', 'sortBy'].includes(key) && 
    params[key] !== 'all' && 
    params[key] !== undefined &&
    params[key] !== ''
  );

  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.evvalley.com/vehicles/ev-cars',
    },
    robots: {
      index: !hasFilters,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: "https://www.evvalley.com/vehicles/ev-cars",
      siteName: "Evvalley",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
      creator: "@evvalley",
    },
  };
}

export default function EVCarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading electric cars...</p>
          </div>
        </div>
      </div>
    }>
      <EVCarsClient />
    </Suspense>
  );
}
