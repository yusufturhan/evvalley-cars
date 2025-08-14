import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=2', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=2', sizes: '16x16', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg?v=2',
    apple: '/favicon.svg?v=2',
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
