import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Evvalley - US EV & E-Mobility Marketplace | Buy & Sell Electric Vehicles",
    description: "America's premier electric vehicle marketplace. Buy and sell EVs, hybrid cars, e-bikes, and e-scooters across the United States. Free listings, no commission fees.",
    keywords: "electric vehicles, EV marketplace, Tesla, hybrid cars, e-bikes, e-scooters, buy EV, sell EV, electric car marketplace, USA",
    alternates: {
      canonical: 'https://www.evvalley.com/',
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "Evvalley - US EV & E-Mobility Marketplace",
      description: "America's premier electric vehicle marketplace. Buy and sell EVs, hybrid cars, e-bikes, and e-scooters across the United States.",
      url: "https://www.evvalley.com/",
      siteName: "Evvalley",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Evvalley - US EV & E-Mobility Marketplace",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Evvalley - US EV & E-Mobility Marketplace",
      description: "America's premier electric vehicle marketplace. Buy and sell EVs, hybrid cars, e-bikes, and e-scooters across the United States.",
      images: ["/twitter-image"],
      creator: "@evvalley",
    },
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Evvalley",
            "url": "https://www.evvalley.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.evvalley.com/vehicles?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <HomeClient />
    </>
  );
}
