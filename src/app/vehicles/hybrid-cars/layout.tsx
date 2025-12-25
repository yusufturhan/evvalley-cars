import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hybrid Cars for Sale | Evvalley',
  description: 'Browse hybrid cars for sale on Evvalley. Find Toyota Prius, Honda Insight, and more fuel-efficient hybrid vehicles.',
  keywords: 'hybrid cars, hybrid vehicles, Toyota Prius, hybrid for sale',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/hybrid-cars',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Hybrid Cars for Sale | Evvalley',
    description: 'Browse hybrid cars for sale on Evvalley. Find Toyota Prius, Honda Insight, and more fuel-efficient hybrid vehicles.',
    url: 'https://www.evvalley.com/vehicles/hybrid-cars',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hybrid Cars for Sale | Evvalley',
    description: 'Browse hybrid cars for sale on Evvalley. Find Toyota Prius, Honda Insight, and more fuel-efficient hybrid vehicles.',
  },
};

export default function HybridCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

