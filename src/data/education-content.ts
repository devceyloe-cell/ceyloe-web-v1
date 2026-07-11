export type EducationIconName =
  | "gem"
  | "flame"
  | "badge"
  | "calendar"
  | "sparkles"
  | "help";

export interface EducationTopic {
  id: string;
  number: number;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: EducationIconName;
}

export const educationHero = {
  title: "Gemstone Education",
  description:
    "Learn about sapphire colours, gemstone treatments, certifications, and how to care for your jewellery.",
  searchPlaceholder: "Search topics, gemstones, treatments...",
  image: "/images/journal/education-hero.webp",
  imageAlt: "Tweezers holding a blue sapphire under a loupe with loose coloured sapphires",
};

export const educationTopics: EducationTopic[] = [
  {
    id: "sapphire-colours",
    number: 1,
    title: "Sapphire Colours",
    description: "Explore the full spectrum of sapphire colours beyond classic blue.",
    href: "/journal/sapphire-colours",
    image: "/images/journal/education-sapphire-colours.webp",
    imageAlt: "Multi-coloured polished sapphires on a dark surface",
    icon: "gem",
  },
  {
    id: "gemstone-treatments",
    number: 2,
    title: "Gemstone Treatments",
    description: "Understand heat treatment and other common gemstone enhancements.",
    href: "/journal/gemstone-treatments",
    image: "/images/journal/education-treatments.webp",
    imageAlt: "Blue sapphire heated by a jeweller torch flame",
    icon: "flame",
  },
  {
    id: "certification-guide",
    number: 3,
    title: "Certification Guide",
    description: "Learn how to read gemstone certificates and what to look for.",
    href: "/journal/certification-guide",
    image: "/images/journal/education-certification.webp",
    imageAlt: "Gemstone laboratory report beside a blue sapphire",
    icon: "badge",
  },
  {
    id: "birthstones",
    number: 4,
    title: "Birthstones",
    description: "Discover the meaning and beauty of traditional birthstones.",
    href: "/journal/birthstones",
    image: "/images/journal/education-birthstones.webp",
    imageAlt: "Row of colourful polished birthstone gemstones",
    icon: "calendar",
  },
  {
    id: "jewellery-care",
    number: 5,
    title: "Jewellery Care",
    description: "Tips to keep your gemstone jewellery beautiful for years.",
    href: "/journal/jewellery-care",
    image: "/images/journal/education-jewellery-care.webp",
    imageAlt: "Sapphire ring on a polishing cloth with a cleaning brush",
    icon: "sparkles",
  },
  {
    id: "faq",
    number: 6,
    title: "Frequently Asked Questions",
    description: "Answers to common questions about buying gemstones.",
    href: "/journal/faq",
    image: "/images/journal/education-faq.webp",
    imageAlt: "Sapphire and notebook suggesting gemstone advice",
    icon: "help",
  },
];

export const educationCta = {
  title: "Need Expert Advice?",
  description: "Speak with our team about gemstones, certifications, or custom jewellery.",
  image: "/images/journal/education-cta.webp",
  imageAlt: "Blue sapphire ring on a luxury jewellery presentation box",
  buttonLabel: "Contact Us",
  buttonHref: "/contact",
};
