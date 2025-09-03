import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Community - Connect with Electric Vehicle Enthusiasts | Evvalley',
  description: 'Join the Evvalley EV community. Connect with electric vehicle enthusiasts, share experiences, and stay updated on the latest EV news and trends.',
  keywords: 'EV community, electric vehicle enthusiasts, EV forum, electric car community, e-mobility community, EV discussions',
  alternates: {
    canonical: 'https://www.evvalley.com/community',
  },
  openGraph: {
    title: 'EV Community - Connect with Electric Vehicle Enthusiasts | Evvalley',
    description: 'Join the Evvalley EV community. Connect with electric vehicle enthusiasts and share experiences.',
    url: 'https://www.evvalley.com/community',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV Community - Connect with Electric Vehicle Enthusiasts | Evvalley',
    description: 'Join the Evvalley EV community. Connect with electric vehicle enthusiasts and share experiences.',
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

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
