import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Safety Guide - Safe Electric Vehicle Transactions | Evvalley',
  description: 'Learn essential safety tips for buying and selling electric vehicles on Evvalley. Protect yourself from scams and ensure secure EV transactions.',
  keywords: 'EV safety, electric vehicle safety, safe EV transactions, EV scam prevention, secure EV marketplace, EV buying safety',
  alternates: {
    canonical: 'https://www.evvalley.com/safety',
  },
  openGraph: {
    title: 'EV Safety Guide - Safe Electric Vehicle Transactions | Evvalley',
    description: 'Learn essential safety tips for buying and selling electric vehicles on Evvalley.',
    url: 'https://www.evvalley.com/safety',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV Safety Guide - Safe Electric Vehicle Transactions | Evvalley',
    description: 'Learn essential safety tips for buying and selling electric vehicles on Evvalley.',
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

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
