import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in Los Angeles | Evvalley',
  description: 'Find electric cars for sale in Los Angeles. Browse Tesla, Toyota, Ford EV listings with price, year and location filters on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/los-angeles' },
  robots: { index: true, follow: true },
};

export default function LosAngelesEVsPage() {
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
              { '@type': 'Question', name: 'Los Angeles’ta hangi EV’ler popüler?', acceptedAnswer: { '@type': 'Answer', text: 'Tesla Model 3/Model Y başta olmak üzere farklı marka ve modelleri bulabilirsiniz.' } },
              { '@type': 'Question', name: 'Fiyatı nasıl filtrelerim?', acceptedAnswer: { '@type': 'Answer', text: 'Sayfada bulunan fiyat ve yıl filtrelerini kullanabilirsiniz.' } }
            ]
          })
        }}
      />
    </>
  );
}
