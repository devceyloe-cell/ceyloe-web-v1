/** Legacy sections still used by /heritage */
export interface AboutSection {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
}

export const aboutSections: AboutSection[] = [
  {
    id: "history",
    eyebrow: "History",
    title: "Our Story",
    paragraphs: [
      "Ever wondered where gemstones come from or how they are sourced. Scared of the unknown and wanting to know more about these beautiful and unique gems. Lucky for you we have a story to tell.",
    ],
    image: "/images/about/2.jpg",
    imageAlt: "Ceyloe heritage and gemstone journey",
  },
  {
    id: "vision",
    eyebrow: "Vision",
    title: "Ceyloe",
    paragraphs: [
      "Here at 'Ceyloe' we take pride and joy knowing that the products we sell you are ethically sourced from people whom I have had the pleasure of knowing personally. Growing up in Sri-Lanka and seeing first-hand how these treasures are sourced and treated before sent to valuable customers makes it not only a personal but emotional journey for me and my family.",
    ],
    image: "/images/about/3.jpg",
    imageAlt: "Ethical sourcing in Sri Lanka",
  },
  {
    id: "mining",
    eyebrow: "Process",
    title: "Mining Process",
    paragraphs: [
      "I want to take you on a journey through a short clip I have made of parts of Sri Lanka and show you exactly the hard work that goes into mining these beautiful gemstones.",
    ],
    image: "/images/about/pexels-shkrabaanthony-7167020-1320x880.jpg",
    imageAlt: "Gemstone mining in Sri Lanka",
  },
  {
    id: "sapphires",
    eyebrow: "Gemstones",
    title: "Sapphires",
    paragraphs: [
      "Sapphires are the main gemstone that are sourced from Sri Lanka and can I say how beautiful and natural these gems are. They are ethically sourced from an open pit mine that requires revegetation after use and before moving to the next pit. By doing this it is environmentally efficient for future use and our mining businesses take pride in the impact we have on the environment. Other types of mining are mining and underground mining which are both also common in Sri Lanka.",
    ],
    image: "/images/Sapphires/14-2_web-1.jpg",
    imageAlt: "Natural Ceylon sapphires",
  },
  {
    id: "cutting",
    eyebrow: "Process",
    title: "Gem Cutting",
    paragraphs: [
      "Once sourced our gemstones are then hand cut by cutters in Sri Lanka. By hand cutting them it is still giving the gem a natural and ethical way of processing instead of having a man made machine doing the job for us, also by cutting these by hand allows each gem to have a unique and magical touch knowing someone has cared for and taken the time needed to make these products what they are.",
    ],
    image: "/images/about/pexels-shkrabaanthony-7167020-2048x1365.jpg",
    imageAlt: "Hand cutting gemstones in Sri Lanka",
  },
];

export const aboutHero = {
  title: "Our Story",
  introduction:
    "Ceyloe was founded with a passion for sharing the beauty of natural Sri Lankan gemstones with Australia. As a family business, we are committed to quality, honesty, transparency and personalised service. Every gemstone is carefully selected to help create jewellery that will be treasured for generations.",
  image: "/images/about/our-story-hero.webp",
  imageAlt:
    "Luxury jewellery design desk with sapphire ring, loose gemstones, tweezers and a ring sketch",
};

export const aboutJourney = {
  title: "Our Journey",
  description:
    "Our journey began with a love for natural gemstones and a vision to bring genuine Ceylon gemstones directly to customers in Australia. Today, Ceyloe proudly offers hand-selected gemstones and custom jewellery services with a personal touch.",
  image: "/images/about/our-journey.webp",
  imageAlt: "Sri Lankan mountains with gemstones and a jewellery loupe in the foreground",
};

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  /** CSS object-position for fine-tuning crop (default: center center) */
  objectPosition?: string;
}

export const aboutTeamIntro =
  "We are a family of four, working together to bring you the best in natural gemstones and custom jewellery.";

export const aboutTeam: AboutTeamMember[] = [
  {
    id: "ireka",
    name: "Ireka",
    role: "Founder & Gemstone Specialist",
    bio: "The heart behind Ceyloe. Ireka hand-selects each gemstone with a focus on quality, beauty and authenticity.",
    image: "/images/team/ireka-v2.webp",
    objectPosition: "center center",
  },
  {
    id: "nalendra",
    name: "Nalendra",
    role: "Co-Founder & Jewellery Designer",
    bio: "Brings designs to life with creativity and precision, ensuring every piece is crafted to perfection.",
    image: "/images/team/nalendra-v2.webp",
    objectPosition: "center center",
  },
  {
    id: "binal",
    name: "Binal",
    role: "Gemstone Enthusiast",
    bio: "Our young gem collector with a curious eye and passion for learning about gemstones.",
    image: "/images/team/binal-v2.webp",
    objectPosition: "center center",
  },
  {
    id: "keimi",
    name: "Keimi",
    role: "Creative & Customer Cheerleader",
    bio: "The creative spark of our team who loves connecting with customers and spreading joy.",
    image: "/images/team/keimi-v2.webp",
    objectPosition: "center center",
  },
];

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: "quality" | "trust" | "ethical" | "craftsmanship";
}

export const aboutValues: AboutValue[] = [
  {
    id: "quality",
    title: "Quality",
    description: "We carefully select only the finest natural gemstones.",
    icon: "quality",
  },
  {
    id: "trust",
    title: "Trust",
    description: "Honesty and transparency in everything we do.",
    icon: "trust",
  },
  {
    id: "ethical",
    title: "Ethical Sourcing",
    description: "Responsibly sourced gemstones from Sri Lanka.",
    icon: "ethical",
  },
  {
    id: "craftsmanship",
    title: "Craftsmanship",
    description: "Beautiful jewellery, crafted with care and precision.",
    icon: "craftsmanship",
  },
];

export const aboutValuesImage = {
  src: "/images/about/our-values-ring.webp",
  alt: "Luxury sapphire diamond halo ring resting on natural stone",
};

export const aboutCta = {
  title: "Ready to Find Your Perfect Gemstone?",
  description: "Browse our gemstone collection or book a private appointment with our team.",
};
