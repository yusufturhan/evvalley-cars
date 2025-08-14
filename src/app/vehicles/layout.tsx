import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Vehicles for Sale - Evvalley',
  description: 'Browse and buy electric vehicles, e-scooters, and e-bikes on Evvalley. Find your perfect EV with advanced filtering and search options.',
  keywords: 'electric vehicles for sale, EVs, e-scooters, e-bikes, marketplace, buy electric car, EV listings',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles',
  },
  openGraph: {
    title: 'Electric Vehicles for Sale - Evvalley',
    description: 'Browse and buy electric vehicles, e-scooters, and e-bikes on Evvalley.',
    url: 'https://www.evvalley.com/vehicles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Vehicles for Sale - Evvalley',
    description: 'Browse and buy electric vehicles, e-scooters, and e-bikes on Evvalley.',
  },
};

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
