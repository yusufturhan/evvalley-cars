import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Evvalley - Get in Touch | EV & E-Mobility Marketplace',
  description: 'Contact Evvalley for support, questions, or feedback about our electric vehicle marketplace. We\'re here to help with your EV buying and selling needs.',
  keywords: 'contact Evvalley, EV marketplace support, electric vehicle help, customer service, EV platform contact',
  alternates: {
    canonical: 'https://www.evvalley.com/contact',
  },
  openGraph: {
    title: 'Contact Evvalley - Get in Touch | EV & E-Mobility Marketplace',
    description: 'Contact Evvalley for support, questions, or feedback about our electric vehicle marketplace.',
    url: 'https://www.evvalley.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Evvalley - Get in Touch | EV & E-Mobility Marketplace',
    description: 'Contact Evvalley for support, questions, or feedback about our electric vehicle marketplace.',
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
