import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in New York | Evvalley',
  description: 'Electric and hybrid vehicles available in New York, NY. Browse EV listings by price, brand, and year.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/new-york' },
  robots: { index: true, follow: true },
};

export default function NewYorkEVsPage() {
  return (
    <>
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
                name: 'New York\'ta elektrikli araç nereden bulurum?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Evvalley New York bölgesindeki tüm EV ilanlarını tek sayfada listeler.'
                }
              },
              {
                '@type': 'Question',
                name: 'New York EV ilanlarında hangi filtreler var?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Fiyat, yıl, marka ve konuma göre filtreleyebilirsiniz.'
                }
              }
            ]
          })
        }}
      />
    </>
  );
}


