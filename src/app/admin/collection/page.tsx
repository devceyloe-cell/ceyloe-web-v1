import { CollectionAdmin } from "@/components/admin/collection-admin";
import { isMongoConfigured } from "@/config/env";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";
import { getNaturalGemstones } from "@/lib/mongodb/natural-gemstones";

export default async function AdminCollectionPage() {
  const [homepage, natural] = await Promise.all([
    getHomepageCollection(),
    getNaturalGemstones(),
  ]);

  return (
    <CollectionAdmin
      homepage={homepage}
      natural={natural}
      mongoConfigured={isMongoConfigured()}
    />
  );
}
