import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

function formatBrandName(slug: string): string {
  // Handle special cases
  if (slug.toLowerCase() === 'bmw') return 'BMW';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: slug } = await params;
  const brandName = formatBrandName(slug);
  
  const title = `${brandName} Electric Vehicles for Sale | EvValley`;
  const description = `Browse the latest ${brandName} electric cars for sale. Compare models, prices, and specs for ${brandName} EVs on EvValley.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.evvalley.com/vehicles/brand/${slug.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `https://www.evvalley.com/vehicles/brand/${slug.toLowerCase()}`,
      type: 'website',
    }
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: slug } = await params;
  const brandName = formatBrandName(slug);

  return (
    <div className="bg-[#F5F9FF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: 'Vehicles', href: '/vehicles' },
            { label: brandName }
          ]} 
        />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {brandName} Electric Vehicles for Sale
          </h1>
          <p className="text-gray-600 mt-2">
            Find the best deals on {brandName} electric mobility solutions.
          </p>
        </div>

        <Suspense fallback={<div className="py-16 text-center">Loading {brandName} vehicles...</div>}>
          <VehiclesClient initialBrand={brandName} />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buying a {brandName} EV</h2>
          <div className="prose prose-blue text-gray-700 max-w-none">
            <p>
              Are you looking for a {brandName} electric vehicle? EvValley offers a specialized marketplace 
              to find new and used {brandName} EVs. Whether you're looking for performance, range, or 
              cutting-edge technology, {brandName} has excellent options in the electric market.
            </p>
            <p className="mt-4">
              Our listings are updated regularly to provide you with the latest {brandName} availability. 
              You can filter by model, year, and location to find the perfect {brandName} that fits your needs 
              and budget.
            </p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What ${brandName} electric models are available?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `You can find various ${brandName} electric and hybrid models listed on EvValley, depending on current seller inventory.`
                }
              },
              {
                '@type': 'Question',
                name: `How do I filter ${brandName} vehicles by price?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Use our search and filter tools on the ${brandName} listings page to set your desired price range, year, and location.`
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
