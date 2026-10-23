import { CollectionAdmin } from "@/components/admin/collection-admin";
import { isMongoConfigured } from "@/config/env";
import { getDefaultSubcategories } from "@/lib/gemstones/type-subcategories";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";
import { getNaturalGemstones } from "@/lib/mongodb/natural-gemstones";
import { getTypeSubcategories } from "@/lib/mongodb/gemstone-type-subcategories";

export default async function AdminCollectionPage() {
  const [homepage, natural, sapphires] = await Promise.all([
    getHomepageCollection(),
    getNaturalGemstones(),
    getTypeSubcategories("sapphires"),
  ]);

  return (
    <CollectionAdmin
      homepage={homepage}
      natural={natural}
      sapphires={sapphires ?? getDefaultSubcategories("sapphires")!}
      mongoConfigured={isMongoConfigured()}
    />
  );
}
