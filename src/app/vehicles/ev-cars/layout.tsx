import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Cars for Sale | Evvalley',
  description: 'Browse electric cars for sale on Evvalley. Find Tesla, Rivian, Lucid, and more electric vehicles with zero emissions.',
  keywords: 'electric cars, EV cars, Tesla, Rivian, electric vehicles for sale',
  alternates: {
    canonical: 'https://www.evvalley.com/vehicles/ev-cars',
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
    title: 'Electric Cars for Sale | Evvalley',
    description: 'Browse electric cars for sale on Evvalley. Find Tesla, Rivian, Lucid, and more electric vehicles.',
    url: 'https://www.evvalley.com/vehicles/ev-cars',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Cars for Sale | Evvalley',
    description: 'Browse electric cars for sale on Evvalley. Find Tesla, Rivian, Lucid, and more electric vehicles.',
  },
};

export default function EVCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

