export interface AboutSection {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
}

export const aboutPageIntro = {
  tagline: "We take Pride & Joy Knowing Gem",
  breadcrumb: "About",
};

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

export const aboutClosing =
  "Here at Ceyloe our products are ethically mined. They are cleaned and cut before being shipped to us and the gems we purchase are directly from local miners hence the low price.";
