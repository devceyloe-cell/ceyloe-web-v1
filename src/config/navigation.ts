export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  children: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavGroup[];
}

export const mainNavigation: NavItem[] = [
  {
    label: "Gemstones",
    href: "/gemstones",
    children: [
      {
        label: "Natural Gemstones",
        href: "/gemstones",
        children: [
          { label: "Natural Gemstones", href: "/gemstones" },
          { label: "View All Gemstones", href: "/catalog" },
        ],
      },
      {
        label: "Gemstones by Type",
        href: "/gemstones",
        children: [
          { label: "Sapphire", href: "/gemstones/sapphires" },
          { label: "Spinel", href: "/catalog?category=spinel" },
          { label: "Garnet", href: "/catalog?category=garnet" },
          { label: "Topaz", href: "/catalog?category=topaz" },
          { label: "Citrine", href: "/catalog?category=citrine" },
          { label: "Tourmaline", href: "/catalog?category=tourmaline" },
          { label: "Zircon", href: "/catalog?category=zircon" },
          { label: "Other Gemstones", href: "/catalog?category=other" },
        ],
      },
      {
        label: "Gemstones by Colour",
        href: "/catalog",
        children: [
          { label: "Blue Gemstones", href: "/catalog?color=blue" },
          { label: "Green Gemstones", href: "/catalog?color=green" },
          { label: "Pink Gemstones", href: "/catalog?color=pink" },
          { label: "Red Gemstones", href: "/catalog?color=red" },
          { label: "Yellow Gemstones", href: "/catalog?color=yellow" },
          { label: "Purple Gemstones", href: "/catalog?color=purple" },
        ],
      },
    ],
  },
  {
    label: "Jewellery",
    href: "/catalog?category=jewellery",
    children: [
      {
        label: "Fine Jewellery",
        children: [
          { label: "Fine Jewellery", href: "/catalog?category=jewellery" },
          { label: "Design Library", href: "/portfolio" },
        ],
      },
    ],
  },
  {
    label: "Our Process",
    href: "/heritage",
    children: [
      {
        label: "Our Process",
        children: [
          { label: "Our Process", href: "/heritage" },
          { label: "Our Story", href: "/about" },
          { label: "FAQs", href: "/faq" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Education", href: "/journal" },
];

/** Flat nav used on the main marketing layout (matches homepage mockup). */
export const landingNavigation: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Gemstones", href: "/gemstones" },
  { label: "Bespoke Jewellery", href: "/custom-jewelry" },
  { label: "Our Story", href: "/about" },
  { label: "Education", href: "/journal" },
  { label: "Contact", href: "/contact" },
];
