import { Metadata } from 'next';
import { Suspense } from 'react';
import { VehiclesClient } from './VehiclesClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Electric Vehicles for Sale | EvValley",
    description: "Browse used electric cars, hybrids, e-bikes and scooters. List for free, no commissions.",
    keywords: "electric vehicles, EVs, e-scooters, e-bikes, marketplace, buy, sell, used electric cars, hybrid cars, electric mobility",
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
      description: "Browse used electric cars, hybrids, e-bikes and scooters. List for free, no commissions.",
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
      description: "Browse used electric cars, hybrids, e-bikes and scooters. List for free, no commissions.",
      images: ["/twitter-image"],
      creator: "@evvalley",
    },
  };
}

export default function VehiclesPage() {
  return (
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
    </>
  );
}
