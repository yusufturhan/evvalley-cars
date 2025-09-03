import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Evvalley EV Marketplace',
  description: 'Read Evvalley\'s privacy policy to understand how we collect, use, and protect your personal information on our electric vehicle marketplace.',
  keywords: 'Evvalley privacy policy, data protection, personal information, EV marketplace privacy, user data privacy',
  alternates: {
    canonical: 'https://www.evvalley.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - Evvalley EV Marketplace',
    description: 'Read Evvalley\'s privacy policy to understand how we protect your personal information.',
    url: 'https://www.evvalley.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Evvalley EV Marketplace',
    description: 'Read Evvalley\'s privacy policy to understand how we protect your personal information.',
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

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
