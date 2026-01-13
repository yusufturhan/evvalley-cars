import { Metadata } from 'next';
import { Suspense } from 'react';
import { VehiclesClient } from './VehiclesClient';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const brand = params.brand as string | undefined;
  
  // Base values
  let title = "Electric Vehicles for Sale | EvValley";
  let description = "Browse electric cars, e-bikes, and scooters for sale. Filter by brand, price, and location. No commissions.";
  
  // Custom titles for categories and brands
  if (category || brand) {
    const categoryName = category ? category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Electric Vehicles";
    const brandName = brand && brand !== 'all' ? brand : "";
    
    if (brandName && categoryName) {
      title = `${brandName} ${categoryName} for Sale | EvValley`;
      description = `Find the best deals on ${brandName} ${categoryName.toLowerCase()} for sale. Browse private and dealer listings on EvValley.`;
    } else if (categoryName) {
      title = `${categoryName} for Sale | EvValley`;
      description = `Browse the latest ${categoryName.toLowerCase()} for sale. Find electric mobility options that fit your budget and needs.`;
    }
  }

  // Check if any filter is active to set noindex
  const hasFilters = Object.keys(params).some(key => 
    ['brand', 'year', 'minPrice', 'maxPrice', 'color', 'maxMileage', 'search', 'location', 'sortBy'].includes(key) && 
    params[key] !== 'all' && 
    params[key] !== undefined
  );

  return {
    title,
    description,
    metadataBase: new URL('https://www.evvalley.com'),
    alternates: {
      canonical: category === 'ev-car' ? 'https://www.evvalley.com/vehicles/ev-cars' :
                 category === 'hybrid-car' ? 'https://www.evvalley.com/vehicles/hybrid-cars' :
                 category === 'ev-scooter' ? 'https://www.evvalley.com/vehicles/ev-scooters' :
                 category === 'e-bike' ? 'https://www.evvalley.com/vehicles/e-bikes' :
                 'https://www.evvalley.com/vehicles',
    },
    robots: {
      index: !hasFilters,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: "https://www.evvalley.com/vehicles",
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

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const brand = params.brand as string | undefined;
  const location = params.location as string | undefined;
  const year = params.year as string | undefined;

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F5F9FF]">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading vehicles...</p>
            </div>
          </div>
        </div>
      }>
        <VehiclesClient 
          initialCategory={category}
          initialBrand={brand}
          initialLocation={location}
          initialYear={year}
        />
      </Suspense>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <details className="mt-12 border border-gray-200 rounded-lg bg-white shadow-sm">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800">
            More about buying and selling EVs on EvValley
          </summary>
          <div className="px-4 py-4 text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              EvValley brings together verified listings for electric cars, e-bikes, and scooters so you can browse with confidence. Use filters by brand, budget, and location to quickly shortlist options, then message sellers directly to ask about battery health, service history, and charging habits. Listings stay transparent with photos, mileage, and pricing so you spend less time guessing and more time test-driving the right fit.
            </p>
            <p>
              Thinking about selling? You can{' '}
              <a href="/sell-your-ev" className="text-blue-600 hover:text-blue-800 underline">
                sell your EV on EvValley
              </a>{' '}
              without commissions, keeping more of your sale price while reaching buyers who already want electric mobility. If you are new to EV ownership, explore our{' '}
              <a href="/blog" className="text-blue-600 hover:text-blue-800 underline">
                EV buying guides
              </a>{' '}
              for charging tips, incentives, and maintenance checklists. Whether you are upgrading to a longer-range model or picking your first e-bike, EvValley makes the transition to electric simple and rewarding.
            </p>
          </div>
        </details>
      </div>
    </>
  );
}
