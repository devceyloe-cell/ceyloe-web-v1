import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllProductsFromDb } from "@/lib/mongodb/products";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/perth", changeFrequency: "weekly", priority: 0.95 },
  { path: "/gemstones", changeFrequency: "weekly", priority: 0.9 },
  { path: "/catalog", changeFrequency: "daily", priority: 0.9 },
  { path: "/custom-jewelry", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/book", changeFrequency: "monthly", priority: 0.8 },
  { path: "/heritage", changeFrequency: "monthly", priority: 0.6 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/transparency", changeFrequency: "yearly", priority: 0.4 },
  { path: "/returns", changeFrequency: "yearly", priority: 0.4 },
  { path: "/certifications", changeFrequency: "monthly", priority: 0.5 },
  { path: "/reviews", changeFrequency: "monthly", priority: 0.5 },
  { path: "/wholesale", changeFrequency: "monthly", priority: 0.5 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.5 },
];

const GEMSTONE_TYPES = [
  "sapphires",
  "blue-sapphires",
  "spinel",
  "garnet",
  "zircon",
  "jewellery",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((item) => ({
    url: `${base}${item.path === "/" ? "" : item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const typeEntries: MetadataRoute.Sitemap = GEMSTONE_TYPES.map((type) => ({
    url: `${base}/gemstones/${type}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProductsFromDb();
    productEntries = products
      .filter((p) => p.handle)
      .map((p) => ({
        url: `${base}/products/${p.handle}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...typeEntries, ...productEntries];
}
