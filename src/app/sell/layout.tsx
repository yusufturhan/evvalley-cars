import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Electric Vehicle - Evvalley EV Marketplace',
  description: 'List your electric vehicle, e-scooter, or e-bike for sale on Evvalley. Free listing, direct buyer communication, and trusted marketplace for EV sales.',
  keywords: 'sell electric vehicle, list EV for sale, sell e-scooter, sell e-bike, EV marketplace, electric car sales',
  alternates: {
    canonical: 'https://www.evvalley.com/sell',
  },
  openGraph: {
    title: 'Sell Your Electric Vehicle - Evvalley EV Marketplace',
    description: 'List your electric vehicle, e-scooter, or e-bike for sale on Evvalley. Free listing and direct buyer communication.',
    url: 'https://www.evvalley.com/sell',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Electric Vehicle - Evvalley EV Marketplace',
    description: 'List your electric vehicle, e-scooter, or e-bike for sale on Evvalley. Free listing and direct buyer communication.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
