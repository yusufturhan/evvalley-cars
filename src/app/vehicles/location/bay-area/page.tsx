import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { VehiclesContent } from '@/app/vehicles/page';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale in Bay Area | Evvalley',
  description: 'Explore EV listings in the Bay Area. Tesla, Toyota, Ford and more electric cars with filters for price and year.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/location/bay-area' },
  robots: { index: true, follow: true },
};

export default function BayAreaEVsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
        <VehiclesContent defaults={{ location: 'Bay Area', category: 'ev-car' }} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Bay Area’da hangi marka EV’ler popüler?', acceptedAnswer: { '@type': 'Answer', text: 'Tesla ağırlıkta olsa da Toyota ve Ford gibi markalar da mevcut.' } },
              { '@type': 'Question', name: 'İkinci el EV alırken nelere bakmalıyım?', acceptedAnswer: { '@type': 'Answer', text: 'Fiyat, yıl, konum ve batarya durumu gibi filtreleri kullanın; detay sayfasından geçmişi kontrol edin.' } }
            ]
          })
        }}
      />
    </div>
  );
}


