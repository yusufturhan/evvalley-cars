import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import { formatLocationName, US_STATES } from '@/lib/us-locations';

interface LocationPageProps {
  params: Promise<{ location?: string[] }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locationPath = resolvedParams.location || [];
  
  let title = 'Electric Vehicles for Sale | EvValley';
  let description = 'Browse electric cars, e-bikes, and scooters for sale on EvValley.';
  let canonicalPath = '/vehicles/location';

  if (locationPath.length > 0) {
    const stateSlug = locationPath[0];
    const stateName = formatLocationName(stateSlug);
    canonicalPath += `/${stateSlug}`;

    if (locationPath.length > 1) {
      const citySlug = locationPath[1];
      const cityName = formatLocationName(citySlug);
      canonicalPath += `/${citySlug}`;
      title = `Electric Vehicles for Sale in ${cityName}, ${stateName} | EvValley`;
      description = `Find the best deals on electric cars, e-bikes, and scooters in ${cityName}, ${stateName}. Browse Tesla, Rivian, and more in your local area.`;
    } else {
      title = `Electric Vehicles for Sale in ${stateName} | EvValley`;
      description = `Browse the latest electric cars, e-bikes, and scooters for sale across ${stateName}. Find local EV deals on EvValley.`;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.evvalley.com${canonicalPath}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `https://www.evvalley.com${canonicalPath}`,
      type: 'website',
    }
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = await params;
  const locationPath = resolvedParams.location || [];
  
  let locationName = '';
  let h1Title = 'Electric Vehicles for Sale';
  const breadcrumbItems = [{ label: 'Vehicles', href: '/vehicles' }];

  if (locationPath.length > 0) {
    const stateSlug = locationPath[0];
    const stateName = formatLocationName(stateSlug);
    breadcrumbItems.push({ label: stateName, href: `/vehicles/location/${stateSlug}` });
    locationName = stateName;
    h1Title = `Electric Vehicles for Sale in ${stateName}`;

    if (locationPath.length > 1) {
      const citySlug = locationPath[1];
      const cityName = formatLocationName(citySlug);
      breadcrumbItems.push({ label: cityName });
      locationName = `${cityName}, ${stateName}`;
      h1Title = `Electric Vehicles for Sale in ${cityName}, ${stateName}`;
    }
  }

  return (
    <div className="bg-[#F5F9FF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {h1Title}
          </h1>
          <p className="text-gray-600 mt-2">
            Find the best electric mobility options near {locationName || 'you'}.
          </p>
        </div>

        <Suspense fallback={<div className="py-16 text-center">Loading vehicles...</div>}>
          <VehiclesClient initialLocation={locationName} />
        </Suspense>
      </div>

      {locationName && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Buying an EV in {locationName}</h2>
            <div className="prose prose-blue text-gray-700 max-w-none">
              <p>
                Looking for an electric vehicle in {locationName}? EvValley connects you with local sellers
                offering a wide range of electric cars, e-bikes, and scooters. Whether you're commuting 
                within {locationName} or planning longer trips, we help you find the perfect EV.
              </p>
              <p className="mt-4">
                Our marketplace features popular brands like Tesla, Ford, and Chevrolet, along with 
                emerging electric mobility solutions. By buying locally in {locationName}, you can easily
                arrange test drives and inspections before making your purchase.
              </p>
            </div>
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Are there electric cars for sale in ${locationName || 'my area'}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes, you can find various electric vehicles including cars, e-bikes, and scooters for sale in ${locationName || 'your local area'} on EvValley.`
                }
              },
              {
                '@type': 'Question',
                name: `How can I contact sellers in ${locationName || 'my area'}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `You can message sellers directly through our platform to ask questions or arrange a meeting in ${locationName || 'your area'}.`
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
