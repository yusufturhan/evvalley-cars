import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AuthSync from "@/components/AuthSync";

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
      { url: '/favicon.svg?v=7', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=7', type: 'image/x-icon' },
      { url: '/favicon-32x32.svg?v=7', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=7', sizes: '16x16', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=7',
    apple: [
      { url: '/apple-touch-icon.svg?v=7', sizes: '180x180', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.svg?v=7', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.svg?v=7', sizes: '144x144', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.svg?v=7', sizes: '120x120', type: 'image/svg+xml' },
      { url: '/apple-touch-icon.svg?v=7', sizes: '114x114', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=7', sizes: '32x32', type: 'image/svg+xml' },
    ],
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
        {/* Safari-specific favicon tags - Multiple formats for maximum compatibility */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon.svg?v=7" />
        <link rel="apple-touch-icon" sizes="32x32" href="/favicon.svg?v=7" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg?v=7" />
        
        {/* Standard favicon tags */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=7" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=7" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg?v=7" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.svg?v=7" />
        <link rel="shortcut icon" href="/favicon.ico?v=7" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#1C1F4A" />
        <meta name="msapplication-TileColor" content="#1C1F4A" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Force cache refresh */}
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
