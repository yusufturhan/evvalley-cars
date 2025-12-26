import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Tesla Electric Vehicles for Sale | Evvalley',
  description: 'Browse Tesla electric cars for sale including Model 3, Model Y, Model S and more. Compare prices and specs on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/brand/tesla' },
  robots: { index: true, follow: true },
};

export default function TeslaEVsPage() {
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
              { '@type': 'Question', name: 'Hangi Tesla modelleri mevcut?', acceptedAnswer: { '@type': 'Answer', text: 'Model 3, Model Y, Model S ve Model X ilanlarını bulabilirsiniz.' } },
              { '@type': 'Question', name: 'Tesla fiyatlarını nasıl filtrelerim?', acceptedAnswer: { '@type': 'Answer', text: 'Sayfadaki fiyat, yıl ve konum filtrelerini kullanabilirsiniz.' } }
            ]
          })
        }}
      />
  );
}
