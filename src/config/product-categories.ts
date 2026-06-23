export const PRODUCT_CATEGORIES = [
  { value: "sapphires", label: "Sapphires" },
  { value: "ruby", label: "Ruby" },
  { value: "spinel", label: "Spinel" },
  { value: "garnet", label: "Garnet" },
  { value: "zircon", label: "Zircon" },
  { value: "jewellery", label: "Jewellery" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];
