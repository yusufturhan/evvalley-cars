import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Toyota Hybrid & Electric Vehicles for Sale | Evvalley',
  description: 'Discover Toyota hybrid and electric vehicles for sale including Prius, Camry Hybrid and more on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/brand/toyota' },
  robots: { index: true, follow: true },
};

export default function ToyotaEVsPage() {
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
              { '@type': 'Question', name: 'Hangi Toyota hibritler mevcut?', acceptedAnswer: { '@type': 'Answer', text: 'Prius, Camry Hybrid, Corolla Hybrid gibi modelleri bulabilirsiniz.' } },
              { '@type': 'Question', name: 'Toyota ilanlarını nasıl filtrelerim?', acceptedAnswer: { '@type': 'Answer', text: 'Fiyat, yıl ve konum filtrelerini kullanabilirsiniz.' } }
            ]
          })
        }}
      />
  );
}


