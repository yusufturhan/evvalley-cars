import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Evvalley - US EV & E-Mobility Marketplace',
  description: 'Learn about Evvalley, America\'s premier electric vehicle and e-mobility marketplace. Discover our mission to accelerate sustainable transportation adoption.',
  keywords: 'about Evvalley, EV marketplace, electric vehicle platform, e-mobility, sustainable transportation, EV community',
  alternates: {
    canonical: 'https://www.evvalley.com/about',
  },
  openGraph: {
    title: 'About Evvalley - US EV & E-Mobility Marketplace',
    description: 'Learn about Evvalley, America\'s premier electric vehicle and e-mobility marketplace.',
    url: 'https://www.evvalley.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Evvalley - US EV & E-Mobility Marketplace',
    description: 'Learn about Evvalley, America\'s premier electric vehicle and e-mobility marketplace.',
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
