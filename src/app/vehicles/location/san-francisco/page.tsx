import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in San Francisco | Evvalley',
  description: 'Browse electric and hybrid vehicles available in San Francisco, CA. Find EVs by price, brand, and year on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/san-francisco' },
  robots: { index: true, follow: true },
};

export default function SanFranciscoEVsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
      <VehiclesClient />
    </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'San Francisco\'da hangi elektrikli araçlar var?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Evvalley üzerinde San Francisco bölgesindeki tüm EV ilanlarını marka, yıl ve fiyata göre listeleyebilirsiniz.'
                }
              },
              {
                '@type': 'Question',
                name: 'San Francisco EV ilanları nasıl filtrelenir?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Fiyat, yıl ve marka filtrelerini kullanın; konum filtresi San Francisco olarak ayarlanmıştır.'
                }
              }
            ]
          })
        }}
      />
  );
}


