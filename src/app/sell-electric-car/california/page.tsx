import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/seo/site";
import { LISTING_CREATE_PATH } from "@/lib/seo/links";
import { buildFaqJsonLd } from "@/lib/seo/faqJsonLd";
import { SELL_CA_FAQ_EN } from "@/lib/seo/sellerFaq";

const PAGE_PATH = "/sell-electric-car/california";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export function generateMetadata(): Metadata {
  const title = "Sell Your Electric Car in California | EvValley";
  const description =
    "List your EV in California for free. Connect with local buyers and message directly.";

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: PAGE_URL,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function SellElectricCarCaliforniaPage() {
  const faqJsonLd = buildFaqJsonLd(SELL_CA_FAQ_EN, PAGE_URL);

  return (
    <div className="bg-white text-gray-900">
      <section className="bg-gradient-to-br from-[#1C1F4A] via-[#1F2D5C] to-[#3AB0FF] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-blue-100">
              California sellers
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Sell Your Electric Car in California
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl text-blue-50">
              List for free, reach local EV buyers, and message them directly. No
              commissions, no hidden fees.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={LISTING_CREATE_PATH}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#1C1F4A] font-semibold shadow-lg hover:shadow-xl transition"
            >
              List your EV for free
            </Link>
            <Link
              href="/vehicles"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Browse EV listings
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How it works in California</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "1) Create listing", desc: "Upload photos/video, set price, add VIN (optional)." },
                { title: "2) Talk to local buyers", desc: "California buyers message you directly through the platform." },
                { title: "3) Close the deal", desc: "Handle delivery and payment with the buyer; no commission." },
              ].map((item) => (
                <div key={item.title} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold">Why California sellers choose EvValley</h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800">
              <li className="p-3 bg-gray-50 rounded-lg border">Free listing, no commission</li>
              <li className="p-3 bg-gray-50 rounded-lg border">Local buyer visibility</li>
              <li className="p-3 bg-gray-50 rounded-lg border">Direct messaging</li>
              <li className="p-3 bg-gray-50 rounded-lg border">Anti-scam checks & reporting</li>
              <li className="p-3 bg-gray-50 rounded-lg border">Photo + video uploads</li>
              <li className="p-3 bg-gray-50 rounded-lg border">Mark as sold anytime</li>
            </ul>
          </div>

          <div className="space-y-4" id="faq">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">FAQs</h3>
              <Link href={LISTING_CREATE_PATH} className="text-[#1C1F4A] font-semibold hover:text-[#3AB0FF]">
                Start listing →
              </Link>
            </div>
            <div className="space-y-3">
              {SELL_CA_FAQ_EN.map((faq) => (
                <details key={faq.question} className="rounded-lg border bg-gray-50 px-4 py-3">
                  <summary className="font-semibold cursor-pointer">{faq.question}</summary>
                  <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-lg border bg-gray-50 space-y-3">
            <h4 className="text-lg font-bold">Ready to list?</h4>
            <p className="text-sm text-gray-700">
              List your EV for free and reach California buyers now.
            </p>
            <Link
              href={LISTING_CREATE_PATH}
              className="inline-flex w-full items-center justify-center px-4 py-3 rounded-lg bg-[#1C1F4A] text-white font-semibold hover:bg-[#2A2F6B] transition"
            >
              List your EV now
            </Link>
          </div>
          <div className="p-6 rounded-lg border bg-white space-y-2">
            <p className="text-sm font-semibold text-gray-900">Explore the marketplace</p>
            <Link href="/vehicles" className="text-[#1C1F4A] hover:text-[#3AB0FF] text-sm font-semibold">
              Browse all vehicles →
            </Link>
            <Link href="/blog" className="text-[#1C1F4A] hover:text-[#3AB0FF] text-sm font-semibold block">
              EV selling tips on our blog →
            </Link>
          </div>
        </aside>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase text-gray-600">List now</p>
            <h3 className="text-2xl font-bold text-gray-900">List your EV for free today</h3>
            <p className="text-sm text-gray-700">Connect with California EV buyers in minutes.</p>
          </div>
          <Link
            href={LISTING_CREATE_PATH}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1C1F4A] text-white font-semibold hover:bg-[#2A2F6B] transition"
          >
            Start free listing
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}

