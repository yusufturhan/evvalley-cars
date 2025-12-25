import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Scooters for Sale | Evvalley',
  description: 'Browse electric scooters for sale on Evvalley. Find eco-friendly e-scooters for urban mobility and commuting.',
  keywords: 'electric scooters, e-scooters, EV scooters, electric mobility',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/ev-scooters',
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
    title: 'Electric Scooters for Sale | Evvalley',
    description: 'Browse electric scooters for sale on Evvalley. Find eco-friendly e-scooters for urban mobility and commuting.',
    url: 'https://www.evvalley.com/vehicles/ev-scooters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Scooters for Sale | Evvalley',
    description: 'Browse electric scooters for sale on Evvalley. Find eco-friendly e-scooters for urban mobility and commuting.',
  },
};

export default function EVScootersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

