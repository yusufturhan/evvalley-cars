import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { VehiclesContent } from '@/app/vehicles/page';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in California | Evvalley',
  description: 'Browse electric cars for sale in California. See Tesla, Toyota, Ford and more EV listings with price, year and location filters on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/california' },
  robots: { index: true, follow: true },
};

export default function CaliforniaEVsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
        <VehiclesContent defaults={{ location: 'California', category: 'ev-car' }} />
      </Suspense>
      <script
        type="application/ld+json"
        // California EVs – FAQ
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'California’da hangi EV markaları daha yaygın?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Tesla, Toyota ve Ford başta olmak üzere birçok marka için ilanları bulabilirsiniz.'
                }
              },
              {
                '@type': 'Question',
                name: 'Fiyat aralığına göre nasıl filtrelerim?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sayfadaki filtrelerden 20k, 40k gibi fiyat seçeneklerini kullanabilirsiniz.'
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}


