export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "catalog",
  "about",
  "contact",
  "faq",
  "instagram",
  "certifications",
  "certificates",
  "products",
  "portfolio",
  "journal",
  "reviews",
  "wholesale",
  "custom-jewelry",
  "book",
  "recommend",
  "compare",
  "heritage",
  "transparency",
  "p",
  "_next",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
