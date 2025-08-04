import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClerkProvider from "@/components/ClerkProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evvalley - US EV & E-Mobility Marketplace",
  description: "America's #1 Electric Vehicle & E-Mobility Marketplace. Find, buy, and sell EVs, hybrids, scooters, and e-bikes.",
  keywords: "electric vehicles, EVs, hybrid cars, e-scooters, e-bikes, EV marketplace, green transportation",
  authors: [{ name: "Evvalley" }],
  creator: "Evvalley",
  publisher: "Evvalley",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://evvalley.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Evvalley - US EV & E-Mobility Marketplace",
    description: "America's #1 Electric Vehicle & E-Mobility Marketplace. Find, buy, and sell EVs, hybrids, scooters, and e-bikes.",
    url: 'https://evvalley.com',
    siteName: 'Evvalley',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Evvalley - US EV & E-Mobility Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Evvalley - US EV & E-Mobility Marketplace",
    description: "America's #1 Electric Vehicle & E-Mobility Marketplace",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `}
          </Script>
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Evvalley",
                "description": "America's #1 Electric Vehicle & E-Mobility Marketplace",
                "url": "https://evvalley.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://evvalley.com/vehicles?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
