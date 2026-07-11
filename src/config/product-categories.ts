export const PRODUCT_CATEGORIES = [
  { value: "sapphires", label: "Sapphires" },
  { value: "ruby", label: "Ruby" },
  { value: "spinel", label: "Spinel" },
  { value: "garnet", label: "Garnet" },
  { value: "topaz", label: "Topaz" },
  { value: "citrine", label: "Citrine" },
  { value: "tourmaline", label: "Tourmaline" },
  { value: "zircon", label: "Zircon" },
  { value: "other", label: "Other Gemstones" },
  { value: "jewellery", label: "Jewellery" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];
