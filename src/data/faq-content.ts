export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "nz-business",
    question: "Is Ceyloe a New Zealand based business?",
    answer:
      "Yes, Ceyloe is a New Zealand owned company based in sunny Hawkes Bay.",
  },
  {
    id: "custom-jewellery",
    question: "Can I design my own jewellery with selected gemstone?",
    answer:
      "We have our very own jeweller who can help create your next piece. Once you submit your design, the minimum time we could have this completed is 3 weeks.",
  },
  {
    id: "sourcing",
    question: "Can Ceyloe source specific requirements?",
    answer:
      "We offer free brokering and sourcing options. With our generations worth of contacts we are confident that we can source your requirement within days at no extra cost.",
  },
  {
    id: "shipping",
    question: "Do you ship orders?",
    answer:
      "Yes, we can ship orders around New Zealand and internationally. We like to make sure our products are in the best hands when shipping. By choosing this option, Ceyloe has no responsibility for the product after it has been collected from the shipping company. Please refer to our terms and conditions.",
  },
  {
    id: "not-happy",
    question: "What if I am not happy with my order?",
    answer:
      "If you are not satisfied with your order, we will do our best to work with you in trying to resolve any issues. Each issue will be dealt with accordingly and tailored to each situation.",
  },
  {
    id: "returns",
    question: "If we don't like the product, can it be returned?",
    answer:
      "Please choose carefully before purchasing. We do not accept change-of-mind returns, though store credit may be offered at our discretion. See our Returns & Refunds Policy for full details.",
  },
  {
    id: "loose-gems",
    question: "Can I purchase just a gemstone from Ceyloe?",
    answer:
      "Yes! We sell loose gemstones. If you are looking for a specific shape or size, we can work with you and do our best to accommodate this.",
  },
  {
    id: "prices",
    question: "Why are the prices low at Ceyloe?",
    answer:
      "We are a family run business and have our own miners who we source directly from. There is no commission made from typical middle gemstone buyers as that would add to the cost. Regarding the jewellery, we make our jewellery in Sri Lanka and the cost of labour is much cheaper compared to New Zealand.",
  },
  {
    id: "ethical",
    question: "Are Ceyloe gemstones ethically sourced?",
    answer:
      "Most of Ceyloe gemstones are imported from Sri Lanka and Sri Lankan gems are among the most ethically sourced gemstones in the world. There is no slavery or child labour — this practice is illegal in Sri Lanka.",
  },
  {
    id: "pay-later",
    question: "Can we make an order for the jewellers and pay later?",
    answer:
      "Unfortunately, this option is not available due to the cost of our gems and the cost to make jewellery. We take pride in what we do and there is a lot of time and effort put into making your special item.",
  },
  {
    id: "refund",
    question: "What is the refund policy?",
    answer:
      "Please see our Returns & Refunds Policy for full details on refunds, remedies, and your rights under Australian Consumer Law.",
  },
];

export const termsUrl = "https://ceyloe.co.nz/terms-conditions/";
export const returnsPolicyUrl = "/returns";
