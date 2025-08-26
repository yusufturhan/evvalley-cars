import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
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
    icon: [
      { url: '/favicon.svg?v=14', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg?v=14',
    apple: '/apple-touch-icon.svg?v=14',
  },
  openGraph: {
    title: "Evvalley - US EV & E-Mobility Marketplace",
    description: "Buy and sell electric vehicles, e-scooters, and e-bikes in the US. Trusted marketplace for electric mobility.",
    url: "https://www.evvalley.com",
    siteName: "Evvalley",
    images: [
      {
        url: "https://www.evvalley.com/og-image.jpg",
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
    images: ["https://www.evvalley.com/og-image.jpg"],
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
    "google-site-verification": process.env.GOOGLE_VERIFICATION_CODE || "",
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
        {/* Safari-specific favicon approach with SVG priority */}
        {/* Safari-specific favicon links */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=14" />
        <link rel="shortcut icon" href="/favicon.svg?v=14" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg?v=14" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1C1F4A" />
        {/* Additional Safari compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg?v=14" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.svg?v=14" />
        
        {/* Safari-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Evvalley" />
        
        {/* Force favicon refresh in Safari */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
              const link = document.createElement('link');
              link.rel = 'icon';
              link.type = 'image/svg+xml';
              link.href = '/favicon.svg?v=14&t=' + Date.now();
              document.head.appendChild(link);
            }
          `
        }} />
        {/* Force cache refresh */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
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
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
