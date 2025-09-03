import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Evvalley EV Marketplace',
  description: 'Read Evvalley\'s terms of service to understand the rules and guidelines for using our electric vehicle marketplace platform.',
  keywords: 'Evvalley terms of service, user agreement, marketplace terms, EV platform rules, terms and conditions',
  alternates: {
    canonical: 'https://www.evvalley.com/terms',
  },
  openGraph: {
    title: 'Terms of Service - Evvalley EV Marketplace',
    description: 'Read Evvalley\'s terms of service to understand the rules for using our platform.',
    url: 'https://www.evvalley.com/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - Evvalley EV Marketplace',
    description: 'Read Evvalley\'s terms of service to understand the rules for using our platform.',
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

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
