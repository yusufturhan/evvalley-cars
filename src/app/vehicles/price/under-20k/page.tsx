import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { VehiclesContent } from '@/app/vehicles/page';

export const metadata: Metadata = {
  title: 'EVs Under $20,000 | Affordable Electric Vehicles | Evvalley',
  description: 'Browse affordable electric and hybrid vehicles under $20k. Find budget EV deals on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/price/under-20k' },
  robots: { index: true, follow: true },
};

export default function Under20kEVsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
        <VehiclesContent defaults={{ maxPrice: '20000' }} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: '$20k altı EV bulunur mu?', acceptedAnswer: { '@type': 'Answer', text: 'Evet, Evvalley\'de $20,000 altı birçok elektrikli ve hibrit araç bulabilirsiniz.' } },
              { '@type': 'Question', name: 'Fiyat nasıl hesaplanır?', acceptedAnswer: { '@type': 'Answer', text: 'Satıcı tarafından belirlenen toplam satış fiyatıdır; filtre $20k üstünü göstermeyi engeller.' } }
            ]
          })
        }}
      />
    </div>
  );
}


