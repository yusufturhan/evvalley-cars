import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Join Evvalley EV Marketplace',
  description: 'Create your Evvalley account to start buying and selling electric vehicles, e-scooters, and e-bikes. Join the premier EV marketplace today.',
  keywords: 'Evvalley sign up, create account, join EV marketplace, electric vehicle platform registration',
  alternates: {
    canonical: 'https://www.evvalley.com/sign-up',
  },
  openGraph: {
    title: 'Sign Up - Join Evvalley EV Marketplace',
    description: 'Create your Evvalley account to start buying and selling electric vehicles. Join the premier EV marketplace today.',
    url: 'https://www.evvalley.com/sign-up',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up - Join Evvalley EV Marketplace',
    description: 'Create your Evvalley account to start buying and selling electric vehicles. Join the premier EV marketplace today.',
  },
  robots: {
    index: false, // Registration page, don't index
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
