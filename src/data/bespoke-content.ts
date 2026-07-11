import { stitchImages } from "@/config/stitch-images";
import { images } from "@/config/images";
import type { GemstoneCategoryCard } from "@/data/gemstone-categories";

export const bespokeLandingCards: GemstoneCategoryCard[] = [
  {
    id: "how-it-works",
    title: "How It Works",
    description:
      "Learn how we create your custom jewellery from gemstone selection to the finished piece.",
    href: "/how-it-works",
    image: stitchImages.bespokeRing,
  },
  {
    id: "choose-gemstone",
    title: "Choose Your Gemstone",
    description:
      "Browse our natural gemstone collection and choose the perfect centrepiece for your custom jewellery.",
    href: "/gemstones",
    image: images.categories.sapphires,
  },
  {
    id: "book-consultation",
    title: "Book a Consultation",
    description:
      "Book a private appointment to discuss your ideas and custom jewellery requirements.",
    href: "/book",
    image: stitchImages.founder,
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Choose Your Gemstone",
    description:
      "Browse our curated collection of natural gemstones and select the stone that will become the heart of your piece — or bring your own ideas and we’ll help you find the perfect match.",
  },
  {
    step: "02",
    title: "Share Your Vision",
    description:
      "Book a private consultation to discuss style, setting, metal, and any personal details. We’ll refine your ideas into a clear design direction.",
  },
  {
    step: "03",
    title: "Design & Craft",
    description:
      "Our jewellers create your bespoke design with care — from sketches and settings through to the finished craftsmanship of your one-of-a-kind piece.",
  },
  {
    step: "04",
    title: "Your Finished Piece",
    description:
      "Receive your custom jewellery, ready to wear and treasure. Every piece is made to celebrate your gemstone and your story.",
  },
];
