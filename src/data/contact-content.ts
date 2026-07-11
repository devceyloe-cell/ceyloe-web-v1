import { siteConfig } from "@/config/site";

export const contactHero = {
  title: "Let's Connect",
  introduction:
    "Whether you're searching for the perfect natural gemstone, planning a bespoke jewellery piece, or simply have a question, our team is here to help. We look forward to assisting you.",
};

export const contactSubjects = [
  "Gemstone Enquiry",
  "Bespoke Jewellery",
  "Appointment",
  "Existing Order",
  "General Enquiry",
] as const;

export type ContactSubject = (typeof contactSubjects)[number];

export type ContactOptionId = "whatsapp" | "email" | "appointment" | "visit";

export interface ContactOption {
  id: ContactOptionId;
  title: string;
  heading: string;
  description: string;
  buttonLabel: string;
  href: string;
  external?: boolean;
}

export const contactOptions: ContactOption[] = [
  {
    id: "whatsapp",
    title: "WhatsApp",
    heading: "Chat with Us",
    description: "Have a quick question? Chat directly with our team.",
    buttonLabel: "Start WhatsApp Chat",
    href: `https://wa.me/${siteConfig.contact.whatsapp}`,
    external: true,
  },
  {
    id: "email",
    title: "Email",
    heading: "Email Us",
    description: "Send us your enquiry and we'll respond as soon as possible.",
    buttonLabel: "Send an Email",
    href: "mailto:info@ceyloe.com",
    external: true,
  },
  {
    id: "appointment",
    title: "Book Appointment",
    heading: "Private Appointment",
    description:
      "Book a private consultation to view gemstones or discuss your custom jewellery ideas.",
    buttonLabel: "Book Appointment",
    href: "/book",
  },
  {
    id: "visit",
    title: "Visit Ceyloe",
    heading: "Visit by Appointment",
    description:
      "Private gemstone viewings are available in Kalgoorlie, Western Australia.",
    buttonLabel: "Book Your Visit",
    href: "/book",
  },
];

export const contactEnquiry = {
  title: "Send Us a Message",
  sectionLabel: "Send an Enquiry",
};

export const contactLocation = {
  title: "Based in Kalgoorlie, Western Australia",
  description:
    "Private appointments are available by booking. We also offer secure Australia-wide shipping for our natural gemstones and bespoke jewellery.",
};

export const contactCta = {
  title: "Discover the Beauty of Natural Gemstones",
  description:
    "Explore our collection of hand-selected natural gemstones or book a private appointment to experience Ceyloe personally.",
};
