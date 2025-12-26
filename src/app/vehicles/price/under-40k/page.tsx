import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'EVs Under $40,000 | Best Value Electric Cars | Evvalley',
  description: 'Find the best value EVs and hybrids under $40k. Compare models and prices on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/price/under-40k' },
  robots: { index: true, follow: true },
};

export default function Under40kEVsPage() {
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
              { '@type': 'Question', name: '$40k altı EV var mı?', acceptedAnswer: { '@type': 'Answer', text: 'Evet, Evvalley\'de $40,000 altındaki uygun fiyatlı EV modelleri listelenir.' } },
              { '@type': 'Question', name: 'Listeler nasıl filtrelenir?', acceptedAnswer: { '@type': 'Answer', text: 'Sayfadaki filtreler ile marka, yıl ve konuma göre arama yapabilirsiniz.' } }
            ]
          })
        }}
      />
  );
}


