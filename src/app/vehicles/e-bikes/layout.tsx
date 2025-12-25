import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Bikes for Sale | Evvalley',
  description: 'Browse electric bikes for sale on Evvalley. Find e-bikes for commuting, recreation, and eco-friendly transportation.',
  keywords: 'electric bikes, e-bikes, electric bicycles, e-mobility',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/e-bikes',
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
    title: 'Electric Bikes for Sale | Evvalley',
    description: 'Browse electric bikes for sale on Evvalley. Find e-bikes for commuting, recreation, and eco-friendly transportation.',
    url: 'https://www.evvalley.com/vehicles/e-bikes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Bikes for Sale | Evvalley',
    description: 'Browse electric bikes for sale on Evvalley. Find e-bikes for commuting, recreation, and eco-friendly transportation.',
  },
};

export default function EBikesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

