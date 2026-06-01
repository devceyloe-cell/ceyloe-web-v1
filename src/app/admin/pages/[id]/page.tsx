import { notFound } from "next/navigation";
import { getPageById } from "@/lib/cms/local-store";
import { PageEditor } from "@/components/admin/page-editor";

export default async function EditPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();
  return <PageEditor initial={page} />;
}
