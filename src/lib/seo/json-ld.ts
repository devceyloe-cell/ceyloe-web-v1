import { siteConfig } from "@/config/site";

const siteUrl = siteConfig.url.replace(/\/$/, "");

/** Organization + LocalBusiness for Perth/WA local SEO (HQ Kalgoorlie, areaServed Perth). */
export function buildOrganizationJsonLd() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "JewelryStore", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    legalName: "Ceyloe",
    url: siteUrl,
    description: siteConfig.description,
    email: contact.email,
    telephone: contact.phoneInternational,
    image: `${siteUrl}/favicon.png`,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/favicon.png`,
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.headOffice.streetAddress,
      addressLocality: contact.headOffice.addressLocality,
      addressRegion: contact.headOffice.addressRegion,
      postalCode: contact.headOffice.postalCode,
      addressCountry: contact.headOffice.addressCountry,
    },
    areaServed: contact.serviceAreas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    priceRange: "$$",
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-AU",
  };
}
