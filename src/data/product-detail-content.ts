export type ProductSpecification = {
  label: string;
  value: string;
};

export const productTrustBenefits = [
  {
    id: "natural",
    title: "100% Natural",
    description: "Ethically Sourced",
    icon: "gem" as const,
  },
  {
    id: "delivery",
    title: "Australia-Wide Delivery",
    description: "Secure & Fully Insured",
    icon: "truck" as const,
  },
  {
    id: "payments",
    title: "Secure Payments",
    description: "Safe & Encrypted",
    icon: "shield" as const,
  },
  {
    id: "family",
    title: "Family Business",
    description: "Trusted & Passionate",
    icon: "heart" as const,
  },
];

export const productShippingPoints = [
  "Australia-wide secure delivery",
  "Fully insured shipping",
  "Discreet packaging",
  "Tracking number provided",
];

export const productConsultation = {
  title: "Need Help Choosing the Perfect Gemstone?",
  description:
    "Our gemstone experts are here to help you find the perfect natural gemstone or create a bespoke jewellery piece.",
};

export function buildWhyThisGemstone(input: {
  color?: string;
  clarity?: string;
  shape?: string;
  category: string;
}) {
  const colorLabel = input.color ?? "fine";
  const clarityLabel = input.clarity ?? "excellent";
  const isSapphire = input.category.toLowerCase().includes("sapphire");

  return [
    {
      id: "colour",
      title: `Stunning ${colorLabel} Colour`,
      description: `Deep, vivid ${colorLabel.toLowerCase()} with exceptional saturation and brilliance.`,
      icon: "gem" as const,
    },
    {
      id: "clarity",
      title: "Excellent Clarity",
      description: `${clarityLabel} clarity — eye clean with exceptional transparency.`,
      icon: "eye" as const,
    },
    {
      id: "cut",
      title: "Great Cut and Brilliance",
      description: `Expertly cut${input.shape ? ` in a ${input.shape.toLowerCase()} shape` : ""} to maximise sparkle and light return.`,
      icon: "sparkles" as const,
    },
    {
      id: "value",
      title: "Timeless and Valuable",
      description: isSapphire
        ? "Sapphires are timeless gemstones that hold their value."
        : "Natural gemstones are timeless pieces that hold their beauty and value.",
      icon: "clock" as const,
    },
  ];
}
