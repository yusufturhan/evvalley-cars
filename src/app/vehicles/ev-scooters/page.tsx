import { Metadata } from 'next';
import { Suspense } from 'react';
import { EVScootersClient } from './EVScootersClient';
import { headers } from 'next/headers';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
// ... existing generateMetadata ...
  const headersList = headers();
  const url = new URL(headersList.get('x-url') || 'https://www.evvalley.com/vehicles/ev-scooters');
  const searchParams = url.searchParams;
  
  const brand = searchParams.get('brand') || '';
  const location = searchParams.get('location') || '';
  
  let title = "Electric Scooters for Sale | Evvalley";
  let description = "Browse electric scooters for sale. Filter by brand, price, and location. Verified EV scooter listings on Evvalley.";
  
  if (brand && brand !== 'all') {
    title = `${brand} Electric Scooters for Sale | Evvalley`;
    description = `Browse ${brand} electric scooters for sale. Filter by price and location. Verified EV scooter listings on Evvalley.`;
  }
  
  if (location) {
    title = `${brand ? brand + ' ' : ''}Electric Scooters for Sale in ${location} | Evvalley`;
    description = `Browse ${brand ? brand + ' ' : ''}electric scooters in ${location}. Filter by price and location. Verified EV scooter listings on Evvalley.`;
  }

  const hasFilters = Array.from(searchParams.keys()).some(key => key !== 'category');

  return {
    title: title,
    description: description,
    metadataBase: new URL('https://www.evvalley.com'),
    alternates: {
      canonical: 'https://www.evvalley.com/vehicles/ev-scooters',
    },
    robots: {
      index: !hasFilters,
      follow: true,
      googleBot: {
        index: !hasFilters,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://www.evvalley.com/vehicles/ev-scooters",
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
      title: title,
      description: description,
      images: ["/twitter-image"],
      creator: "@evvalley",
    },
  };
}

export default function EVScootersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading electric scooters...</p>
        </div>
      </div>
    }>
      <div className="bg-[#F5F9FF] pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Vehicles', href: '/vehicles' }, { label: 'Electric Scooters' }]} />
        </div>
      </div>
      <EVScootersClient />
    </Suspense>
  );
}
