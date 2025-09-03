import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorite EVs - Saved Electric Vehicles | Evvalley',
  description: 'View and manage your favorite electric vehicles, e-scooters, and e-bikes on Evvalley. Keep track of vehicles you\'re interested in.',
  keywords: 'favorite EVs, saved electric vehicles, EV wishlist, saved vehicles, favorite electric cars, EV favorites',
  alternates: {
    canonical: 'https://www.evvalley.com/favorites',
  },
  openGraph: {
    title: 'My Favorite EVs - Saved Electric Vehicles | Evvalley',
    description: 'View and manage your favorite electric vehicles, e-scooters, and e-bikes on Evvalley.',
    url: 'https://www.evvalley.com/favorites',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Favorite EVs - Saved Electric Vehicles | Evvalley',
    description: 'View and manage your favorite electric vehicles, e-scooters, and e-bikes on Evvalley.',
  },
  robots: {
    index: false, // Private page, don't index
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
