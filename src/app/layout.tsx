import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClerkProvider from "@/components/ClerkProvider";
import AuthSync from "@/components/AuthSync";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evvalley - US EV & E-Mobility Marketplace | Buy & Sell Electric Vehicles",
  description: "Buy and sell electric vehicles, e-scooters, and e-bikes in the US. Find your next EV or list your vehicle for sale. Trusted marketplace for electric mobility with expert guidance.",
  keywords: "electric vehicles, EVs, e-scooters, e-bikes, marketplace, buy, sell, US, electric mobility, green transportation, electric car marketplace, EV dealer, electric vehicle sales",
  authors: [{ name: "Evvalley" }],
  creator: "Evvalley",
  publisher: "Evvalley",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.evvalley.com'),
  alternates: {
    canonical: 'https://www.evvalley.com',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: "Evvalley - US EV & E-Mobility Marketplace",
    description: "Buy and sell electric vehicles, e-scooters, and e-bikes in the US. Trusted marketplace for electric mobility.",
    url: "https://www.evvalley.com",
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
    description: "Buy and sell electric vehicles, e-scooters, and e-bikes in the US.",
    images: ["/twitter-image"],
    creator: "@evvalley",
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
  },
  other: {
    "msvalidate.01": process.env.BING_VERIFICATION_CODE || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Canonical URL for root */}
        <link rel="canonical" href="https://www.evvalley.com" />
        
        {/* Favicon definitions with cache busting */}
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg?v=2" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#1C1F4A" />
        
        {/* Safari-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Evvalley" />
        
        {/* Force favicon refresh in Safari */}
        <meta name="msapplication-TileColor" content="#1C1F4A" />
        <meta name="theme-color" content="#1C1F4A" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Evvalley",
              "url": "https://www.evvalley.com",
              "logo": "https://www.evvalley.com/logo.svg",
              "description": "US EV & E-Mobility Marketplace for buying and selling electric vehicles",
              "sameAs": [
                "https://twitter.com/evvalley",
                "https://facebook.com/evvalley"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@evvalley.com"
              }
            })
          }}
        />
        
        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Evvalley",
              "url": "https://www.evvalley.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.evvalley.com/vehicles?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <AuthSync />
          {children}
          
          {/* Google Analytics */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
          
          {/* Google Ads */}
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ADS_ID}');
            `}
          </Script>
        </ClerkProvider>
      </body>
    </html>
  );
}
