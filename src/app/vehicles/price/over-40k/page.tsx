import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VehiclesClient } from '@/app/vehicles/VehiclesClient';

export const metadata: Metadata = {
  title: 'Premium EVs Over $40,000 | Luxury Electric Cars | Evvalley',
  description: 'Explore premium and luxury electric vehicles above $40k. Find your next high-end EV on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/price/over-40k' },
  robots: { index: true, follow: true },
};

export default function Over40kEVsPage() {
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
              { '@type': 'Question', name: 'Hangi premium EV modelleri mevcut?', acceptedAnswer: { '@type': 'Answer', text: 'Evvalley\'de Tesla, Lucid, Rivian gibi markaların premium EV modellerini bulabilirsiniz.' } },
              { '@type': 'Question', name: '$40k üstü sayfası nasıl çalışır?', acceptedAnswer: { '@type': 'Answer', text: 'Sayfa varsayılan olarak minimum fiyatı $40,000 olarak ayarlar ve diğer filtrelerle birleştirilebilir.' } }
            ]
          })
        }}
      />
  );
}


