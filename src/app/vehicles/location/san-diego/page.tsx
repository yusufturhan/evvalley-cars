import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { VehiclesContent } from '@/app/vehicles/page';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in San Diego | Evvalley',
  description: 'Shop electric cars for sale in San Diego. Compare Tesla, Toyota, Ford EV listings by price and year on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/san-diego' },
  robots: { index: true, follow: true },
};

export default function SanDiegoEVsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
        <VehiclesContent defaults={{ location: 'San Diego', category: 'ev-car' }} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'San Diego’da EV bulmak kolay mı?', acceptedAnswer: { '@type': 'Answer', text: 'Evet, çeşitli marka ve modelleri filtrelerle kolayca bulabilirsiniz.' } },
              { '@type': 'Question', name: 'Liste eklemek ücretli mi?', acceptedAnswer: { '@type': 'Answer', text: 'Evvalley’de komisyonsuz ilan verebilirsiniz.' } }
            ]
          })
        }}
      />
    </div>
  );
}


