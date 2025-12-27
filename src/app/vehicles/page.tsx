import { Metadata } from 'next';
import { Suspense } from 'react';
import { VehiclesClient } from './VehiclesClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Electric Vehicles for Sale | EvValley",
    description: "Browse electric cars, e-bikes, and scooters for sale. Filter by brand, price, and location. No commissions.",
    metadataBase: new URL('https://www.evvalley.com'),
    alternates: {
      canonical: 'https://www.evvalley.com/vehicles',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: "Electric Vehicles for Sale | EvValley",
      description: "Browse electric cars, e-bikes, and scooters for sale. Filter by brand, price, and location. No commissions.",
      url: "https://www.evvalley.com/vehicles",
      siteName: "Evvalley",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Electric Vehicles for Sale - EvValley",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Electric Vehicles for Sale | EvValley",
      description: "Browse electric cars, e-bikes, and scooters for sale. Filter by brand, price, and location. No commissions.",
      images: ["/twitter-image"],
      creator: "@evvalley",
    },
  };
}

export default function VehiclesPage() {
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
        <VehiclesClient />
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
