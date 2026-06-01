export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "catalog",
  "about",
  "contact",
  "faq",
  "instagram",
  "certifications",
  "products",
  "p",
  "_next",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
