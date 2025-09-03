import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Incentives & Tax Credits - Electric Vehicle Rebates | Evvalley',
  description: 'Discover electric vehicle incentives, tax credits, and rebates available in your area. Find federal, state, and local EV incentives to save money on your purchase.',
  keywords: 'EV incentives, electric vehicle tax credits, EV rebates, federal EV incentives, state EV rebates, electric car tax credit',
  alternates: {
    canonical: 'https://www.evvalley.com/incentives',
  },
  openGraph: {
    title: 'EV Incentives & Tax Credits - Electric Vehicle Rebates | Evvalley',
    description: 'Discover electric vehicle incentives, tax credits, and rebates available in your area.',
    url: 'https://www.evvalley.com/incentives',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV Incentives & Tax Credits - Electric Vehicle Rebates | Evvalley',
    description: 'Discover electric vehicle incentives, tax credits, and rebates available in your area.',
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

export default function IncentivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
