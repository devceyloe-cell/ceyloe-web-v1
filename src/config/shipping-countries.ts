/** Shipping countries for checkout. Australia is the default. */
export const SHIPPING_COUNTRIES = [
  "Australia",
  "New Zealand",
  "United States",
  "United Kingdom",
  "Canada",
  "Singapore",
  "Hong Kong",
  "Japan",
  "China",
  "India",
  "Sri Lanka",
  "United Arab Emirates",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Ireland",
  "South Africa",
  "Malaysia",
  "Indonesia",
  "Thailand",
  "Philippines",
  "South Korea",
  "Taiwan",
  "Other",
] as const;

export const DEFAULT_SHIPPING_COUNTRY = "Australia";

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];
