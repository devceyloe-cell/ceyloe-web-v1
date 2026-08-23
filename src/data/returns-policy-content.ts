export const returnsPolicyMeta = {
  title: "Returns & Refunds Policy",
  lastUpdated: "August 2026",
};

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  intro?: string[];
  listItems?: string[];
  outro?: string[];
}

export const returnsPolicyIntro = [
  "At Ceyloe Gemstones, we want customers to feel confident when choosing a natural gemstone or creating a custom piece of jewellery.",
  "Please read this policy before purchasing.",
];

export const returnsPolicySections: PolicySection[] = [
  {
    id: "change-of-mind",
    title: "Change of Mind",
    paragraphs: [
      "Please choose carefully.",
      "Ceyloe Gemstones is not required to provide a refund or replacement simply because you change your mind, choose the wrong item, find an item cheaper elsewhere or decide you no longer want your purchase.",
      "Any change-of-mind exchange or store credit offered by Ceyloe is at our discretion.",
      "This does not affect your rights under Australian Consumer Law.",
    ],
  },
  {
    id: "custom-bespoke",
    title: "Custom & Bespoke Jewellery",
    paragraphs: [
      "Our custom jewellery is individually created according to specifications approved by the customer.",
      "Once production has commenced, we generally cannot accept cancellations or change-of-mind returns for custom or personalised jewellery.",
      "If alterations are requested after an approved piece has entered production, additional charges may apply and some changes may not be possible.",
      "This does not affect your rights if the product or service fails to meet a consumer guarantee under Australian Consumer Law.",
    ],
  },
  {
    id: "natural-gemstones",
    title: "Natural Gemstones",
    paragraphs: [
      "Natural gemstones are created by nature and may contain inclusions, colour variations, zoning and other natural characteristics.",
      "These characteristics do not necessarily mean that a gemstone is faulty.",
      "We encourage customers to review the gemstone description, photographs, videos, available certificates and other information before purchasing. Additional photos or videos can also be requested where available.",
    ],
  },
  {
    id: "faulty-damaged",
    title: "Faulty, Damaged or Incorrect Items",
    paragraphs: [
      "Our products come with consumer guarantees that cannot be excluded under Australian Consumer Law.",
      "If your purchase has a problem, is significantly different from its description, is unsafe, or otherwise fails to meet an applicable consumer guarantee, you may be entitled to a repair, replacement, refund or other remedy depending on the circumstances.",
      "Please contact Ceyloe as soon as reasonably possible if you believe there is an issue with your purchase.",
    ],
  },
  {
    id: "damage-after-purchase",
    title: "Damage After Purchase",
    paragraphs: [
      "A remedy may not apply where damage results from misuse, accidental damage, inappropriate cleaning, impact, unauthorised modification or ordinary wear and tear rather than a failure to meet a consumer guarantee.",
      "Each situation will be assessed individually.",
    ],
  },
  {
    id: "how-to-request",
    title: "How to Request a Return or Remedy",
    intro: ["Please contact us before sending an item back.", "We may ask you to provide:"],
    listItems: [
      "Your name and contact details",
      "Proof of purchase",
      "Details of the gemstone or jewellery",
      "A description of the issue",
      "Photographs where appropriate",
    ],
    outro: [
      "We may need to inspect the item before determining the appropriate remedy.",
      "Original packaging is not required for you to exercise rights available under Australian Consumer Law.",
    ],
  },
  {
    id: "return-delivery",
    title: "Return Delivery",
    paragraphs: [
      "Where an item fails to meet an Australian Consumer Law consumer guarantee, responsibility for reasonable return costs will be handled in accordance with Australian Consumer Law.",
      "Where Ceyloe agrees to a discretionary change-of-mind return, the customer may be responsible for secure and appropriately insured return delivery.",
    ],
  },
  {
    id: "proof-of-purchase",
    title: "Proof of Purchase",
    paragraphs: [
      "We may request reasonable proof of purchase, such as a receipt, invoice, order confirmation or other acceptable evidence showing that the item was purchased from Ceyloe.",
    ],
  },
  {
    id: "consumer-rights",
    title: "Your Consumer Rights",
    paragraphs: [
      "Nothing in this policy excludes, restricts or modifies any consumer guarantee, right or remedy available under Australian Consumer Law that cannot legally be excluded.",
    ],
  },
];

export const returnsPolicyContact = {
  intro:
    "If you have any concerns about your purchase, please contact us so we can review the situation and assist.",
  businessName: "Ceyloe Gemstones",
  address: ["273 Hannan Street", "Kalgoorlie WA, Australia"],
  phone: "0449 938 172",
  website: "ceyloe.com",
  websiteUrl: "https://ceyloe.com",
};

export const returnsPolicyUrl = "/returns";
