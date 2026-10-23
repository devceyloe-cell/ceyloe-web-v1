import { HomepageBannerEditor } from "@/components/admin/homepage-banner-editor";
import { isMongoConfigured } from "@/config/env";
import { getHomepageBannerSlides } from "@/lib/mongodb/homepage-banner-slides";

export const dynamic = "force-dynamic";

export default async function AdminHomepageBannerPage() {
  const slides = await getHomepageBannerSlides();

  return (
    <HomepageBannerEditor initial={slides} mongoConfigured={isMongoConfigured()} />
  );
}
