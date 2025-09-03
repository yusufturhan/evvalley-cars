import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Evvalley EV Marketplace',
  description: 'Sign in to your Evvalley account to access your favorite electric vehicles, manage listings, and connect with the EV community.',
  keywords: 'Evvalley sign in, login, EV marketplace account, electric vehicle platform login',
  alternates: {
    canonical: 'https://www.evvalley.com/sign-in',
  },
  openGraph: {
    title: 'Sign In - Evvalley EV Marketplace',
    description: 'Sign in to your Evvalley account to access your favorite electric vehicles and manage listings.',
    url: 'https://www.evvalley.com/sign-in',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In - Evvalley EV Marketplace',
    description: 'Sign in to your Evvalley account to access your favorite electric vehicles and manage listings.',
  },
  robots: {
    index: false, // Login page, don't index
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
