import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Evvalley EV Marketplace',
  description: 'Manage your Evvalley profile, view your listings, and update your account settings for the electric vehicle marketplace.',
  keywords: 'Evvalley profile, account settings, my listings, EV marketplace profile, user account',
  alternates: {
    canonical: 'https://www.evvalley.com/profile',
  },
  openGraph: {
    title: 'My Profile - Evvalley EV Marketplace',
    description: 'Manage your Evvalley profile, view your listings, and update your account settings.',
    url: 'https://www.evvalley.com/profile',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Profile - Evvalley EV Marketplace',
    description: 'Manage your Evvalley profile, view your listings, and update your account settings.',
  },
  robots: {
    index: false, // Private page, don't index
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
