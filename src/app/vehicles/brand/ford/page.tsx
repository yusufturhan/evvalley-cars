import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { VehiclesContent } from '@/app/vehicles/page';

export const metadata: Metadata = {
  title: 'Ford Hybrid & Electric Vehicles for Sale | Evvalley',
  description: 'Shop Ford electric and hybrid vehicles like Mustang Mach‑E and Fusion Hybrid on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/vehicles/brand/ford' },
  robots: { index: true, follow: true },
};

export default function FordEVsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>}>
        <VehiclesContent defaults={{ brand: 'Ford' }} />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Ford hangi EV modelleri var?', acceptedAnswer: { '@type': 'Answer', text: 'Mustang Mach‑E başta olmak üzere çeşitli Ford EV ve hibrit modelleri listelenir.' } },
              { '@type': 'Question', name: 'Nasıl filtrelerim?', acceptedAnswer: { '@type': 'Answer', text: 'Fiyat, yıl ve konum filtrelerini kullanarak sonuçları daraltabilirsiniz.' } }
            ]
          })
        }}
      />
    </div>
  );
}


