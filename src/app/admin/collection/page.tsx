import { CollectionEditor } from "@/components/admin/collection-editor";
import { isMongoConfigured } from "@/config/env";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";

export default async function AdminCollectionPage() {
  const collection = await getHomepageCollection();

  return (
    <CollectionEditor initial={collection} mongoConfigured={isMongoConfigured()} />
  );
}
