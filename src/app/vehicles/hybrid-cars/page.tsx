import { Metadata } from 'next';
import { Suspense } from 'react';
import { HybridCarsClient } from './HybridCarsClient';
import Header from "@/components/Header";
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
// ... existing generateMetadata ...
  const params = await searchParams;
  const brand = params.brand as string | undefined;
  const location = params.location as string | undefined;
  
  const brandName = brand && brand !== 'all' ? brand : '';
  const locName = location ? (Array.isArray(location) ? location[0] : location) : '';
  
  const title = `${brandName ? brandName + ' ' : ''}Hybrid Cars for Sale${locName ? ' in ' + locName : ''} | EvValley`;
  const description = `Browse ${brandName ? brandName + ' ' : ''}hybrid cars${locName ? ' in ' + locName : ''}. Filter by price, year, and fuel efficiency. Verified hybrid listings on EvValley.`;

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
      canonical: 'https://www.evvalley.com/vehicles/hybrid-cars',
    },
    robots: {
      index: !hasFilters,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: "https://www.evvalley.com/vehicles/hybrid-cars",
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

export default function HybridCarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hybrid cars...</p>
          </div>
        </div>
      </div>
    }>
      <div className="bg-[#F5F9FF] pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Vehicles', href: '/vehicles' }, { label: 'Hybrid Cars' }]} />
        </div>
      </div>
      <HybridCarsClient />
    </Suspense>
  );
}
