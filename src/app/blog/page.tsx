import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'EV & E-Mobility Blog - Evvalley',
  description: 'Latest news, guides, and insights about electric vehicles, e-scooters, and e-bikes. Expert advice for EV enthusiasts and buyers.',
  keywords: 'electric vehicle blog, EV news, e-mobility guides, electric car tips, EV technology, green transportation',
  alternates: {
    canonical: 'https://www.evvalley.com/blog',
  },
  openGraph: {
    title: 'EV & E-Mobility Blog - Evvalley',
    description: 'Latest news, guides, and insights about electric vehicles and e-mobility.',
    url: 'https://www.evvalley.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV & E-Mobility Blog - Evvalley',
    description: 'Latest news, guides, and insights about electric vehicles and e-mobility.',
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

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // ItemList of latest blog posts (client renders list; this is static hint)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "EV & E‑Mobility Blog",
            itemListOrder: "Descending"
          })
        }}
      />
      <BlogPageClient />
    </>
  );
}
