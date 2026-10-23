export const returnsPolicyMeta = {
  title: "Returns & Refunds",
  lastUpdated: "October 2026",
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
  "At Ceyloe, we want you to feel confident when purchasing our natural gemstones and jewellery. Please review our Returns & Refunds Policy before making your purchase.",
];

export const returnsPolicySections: PolicySection[] = [
  {
    id: "change-of-mind",
    title: "Change of Mind",
    intro: [
      "Ceyloe may offer an exchange within 7 days of purchase or delivery for change-of-mind purchases.",
      "To be eligible for a change-of-mind exchange:",
    ],
    listItems: [
      "The item must be returned in its original, unworn, unused and undamaged condition.",
      "The original laboratory certificate, label card and any accompanying documentation must be returned with the item.",
      "Proof of purchase is required.",
      "The item must not have been altered, resized, set, engraved or customised.",
      "No cash refunds are offered for change of mind.",
      "Eligible items may be exchanged for another gemstone or jewellery item.",
      "If the replacement item is of greater value, the customer must pay the difference.",
      "If the replacement item is of lower value, the difference will not be refunded.",
    ],
    outro: [
      "This voluntary change-of-mind policy does not affect your rights under the Australian Consumer Law. WA Consumer Protection confirms that businesses are not generally required to provide a refund or replacement simply because a customer changes their mind, and businesses may set conditions on a voluntary change-of-mind policy.",
    ],
  },
  {
    id: "custom-bespoke",
    title: "Custom & Bespoke Jewellery",
    paragraphs: [
      "Custom-made, bespoke, personalised, engraved, resized or specially commissioned jewellery is not eligible for a change-of-mind exchange or refund once production has commenced.",
      "This does not exclude or limit any rights or remedies available under the Australian Consumer Law if the item fails to meet an applicable consumer guarantee.",
    ],
  },
  {
    id: "natural-gemstones",
    title: "Natural Gemstones",
    paragraphs: [
      "Ceyloe specialises in natural gemstones. Natural gemstones may contain inclusions, colour variations, growth features and other characteristics resulting from their natural formation.",
      "These natural characteristics are part of the individuality of natural gemstones and are not necessarily defects.",
      "Customers are encouraged to carefully review the gemstone description, photographs, videos, laboratory certificate, disclosed treatments and other relevant information before purchasing.",
    ],
  },
  {
    id: "faulty-damaged",
    title: "Faulty, Damaged or Incorrect Items",
    paragraphs: [
      "Our goods come with consumer guarantees that cannot be excluded under the Australian Consumer Law.",
      "If an item does not meet an applicable consumer guarantee, you may be entitled to a repair, replacement, refund or other remedy depending on the circumstances.",
      "Where there is a major problem, Australian Consumer Law may give you the right to choose between a refund and replacement. For a problem that is not major, Ceyloe may be entitled to provide an appropriate remedy, such as a repair, within a reasonable time.",
      "Please contact Ceyloe as soon as reasonably possible if you believe an item is faulty, damaged on arrival, materially different from its description or incorrectly supplied.",
      "The 7-day change-of-mind exchange conditions do not restrict or replace your rights under the Australian Consumer Law.",
    ],
  },
  {
    id: "damage-after-purchase",
    title: "Damage After Purchase",
    paragraphs: [
      "Ceyloe is not responsible for damage caused by misuse, accidental damage, improper handling, failure to follow appropriate care instructions or normal wear and tear where this is not a failure to meet a consumer guarantee.",
      "Gemstones and jewellery should be handled, worn and stored with appropriate care.",
    ],
  },
  {
    id: "how-to-request",
    title: "How to Request an Exchange or Return",
    paragraphs: [
      "Please contact Ceyloe before returning an item.",
      "Please provide your name and contact details, proof of purchase, details of the item, the reason for the return or exchange, and photographs where relevant.",
      "Once your request has been reviewed, we will provide return instructions.",
    ],
  },
  {
    id: "return-delivery",
    title: "Return Delivery",
    paragraphs: [
      "For an approved change-of-mind exchange, the customer is responsible for return delivery costs. The item should be securely packaged and appropriately insured during return delivery.",
      "Where an item has a problem covered by the Australian Consumer Law, Ceyloe will meet its obligations regarding reasonable return costs as required by law.",
      "For valuable gemstones and jewellery, we strongly recommend using tracked and appropriately insured delivery.",
    ],
  },
  {
    id: "proof-of-purchase",
    title: "Proof of Purchase",
    paragraphs: [
      "Please retain your receipt, order confirmation or other acceptable proof of purchase.",
      "For a voluntary change-of-mind exchange, the original laboratory certificate, label card and accompanying documentation must also be returned with the item.",
    ],
  },
  {
    id: "australian-consumer-law",
    title: "Australian Consumer Law",
    paragraphs: [
      "Nothing in this Returns & Refunds Policy is intended to exclude, restrict or modify any consumer guarantee, right or remedy that cannot lawfully be excluded under the Australian Consumer Law.",
    ],
  },
];

export const returnsPolicyContact = {
  title: "Contact Ceyloe",
  intro: "",
  businessName: "Ceyloe Gemstones",
  address: ["273 Hannan Street", "Kalgoorlie, Western Australia"],
  phone: "0449 938 172",
  website: "ceyloe.com",
  websiteUrl: "https://ceyloe.com",
};

export const returnsPolicyUrl = "/returns";
