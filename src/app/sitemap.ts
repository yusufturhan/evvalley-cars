// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.evvalley.com";

// Service role yerine anonim key kullanmak daha güvenli
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Force dynamic generation to ensure fresh sitemap
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/vehicles`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sell`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/escrow`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/safety`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Kategori sayfaları
    {
      url: `${BASE_URL}/vehicles/ev-cars`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vehicles/hybrid-cars`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vehicles/ev-scooters`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vehicles/e-bikes`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 2) Araç ilanları
  let vehiclePages: MetadataRoute.Sitemap = [];
  try {
    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select("id, updated_at, sold_at, title")
      .is("sold_at", null)
      .not("id", "is", null)
      .not("title", "is", null)
      .not("title", "eq", "")
      .order("updated_at", { ascending: false })
      .limit(1000);

    if (!error && vehicles) {
      vehiclePages = vehicles
        .filter((v) => v.id && v.title && v.sold_at === null)
        .map((v) => ({
          url: `${BASE_URL}/vehicles/${v.id}`,
          lastModified: v.updated_at ? new Date(v.updated_at) : now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch {
    // hata olursa sitemap yine de döner, sadece araçlar eklenmez
    vehiclePages = [];
  }

  // 3) Blog yazıları
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { blogPosts } = await import("@/lib/blog-content");

    if (Array.isArray(blogPosts)) {
      blogPages = blogPosts
        .filter((post: any) => post && post.slug && post.title)
        .map((post: any) => ({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
    }
  } catch {
    blogPages = [];
  }

  // 4) Blog kategori sayfaları (sadece gerçekten var olan route'lar)
  const blogCategories = [
    "ev-guide", // ✅ Var: src/app/blog/category/ev-guide/page.tsx
    // "market-analysis", // ❌ Route yok
    // "technology-updates", // ❌ Route yok
    // "buying-selling-tips", // ❌ Route yok
    // "e-mobility", // ❌ Route yok
  ];

  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map(
    (category) => ({
      url: `${BASE_URL}/blog/category/${category}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  // 5) Hepsini birleştir + duplicate URL temizle
  const allPages = [
    ...staticPages,
    ...vehiclePages,
    ...blogPages,
    ...blogCategoryPages,
  ];

  const uniquePages = allPages.filter(
    (page, index, self) => index === self.findIndex((p) => p.url === page.url)
  );

  return uniquePages;
}
