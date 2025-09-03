import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure EV Escrow Service - Safe Electric Vehicle Transactions | Evvalley',
  description: 'Secure your electric vehicle transactions with Evvalley\'s escrow service. Safe, protected payments for buying and selling EVs, e-scooters, and e-bikes.',
  keywords: 'EV escrow service, secure EV transactions, safe electric vehicle payments, EV escrow protection, secure EV marketplace',
  alternates: {
    canonical: 'https://www.evvalley.com/escrow',
  },
  openGraph: {
    title: 'Secure EV Escrow Service - Safe Electric Vehicle Transactions | Evvalley',
    description: 'Secure your electric vehicle transactions with Evvalley\'s escrow service. Safe, protected payments for buying and selling EVs.',
    url: 'https://www.evvalley.com/escrow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure EV Escrow Service - Safe Electric Vehicle Transactions | Evvalley',
    description: 'Secure your electric vehicle transactions with Evvalley\'s escrow service. Safe, protected payments for buying and selling EVs.',
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

export default function EscrowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
