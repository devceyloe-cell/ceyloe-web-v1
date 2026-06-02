import { siteConfig } from "@/config/site";

export const announcementMessage =
  "CERTIFIED CEYLON SAPPHIRES · COMPLIMENTARY INSURED WORLDWIDE SHIPPING FROM SRI LANKA & AUSTRALIA";

export const announcementBarConfig = {
  message: announcementMessage,
  href: siteConfig.links.shipping ?? "/transparency",
} as const;
