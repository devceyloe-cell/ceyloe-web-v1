import { AdminHeader } from "@/components/admin/admin-header";
import { HeroImagesEditor } from "@/components/admin/hero-images-editor";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const dynamic = "force-dynamic";

export default async function HeroImagesPage() {
  const overrides = await getHeroImages();

  return (
    <>
      <AdminHeader title="Hero Images" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Site Management</p>
          <h1 className="font-display mt-1 text-3xl font-light tracking-tight">Hero Images</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Upload hero artwork and edit the title / supporting text for marketing pages, gemstone
            landings, and catalog colour filters (including multi-colour URLs like green + teal).
            Use <strong>Save text</strong> after editing copy. Image uploads save immediately.
          </p>

          <div className="mt-4 rounded-none border border-border bg-surface-elevated px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              Dimension Guide
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              <li>
                <span className="font-semibold text-foreground">Wide heroes</span> (Home,
                Gemstones) — <code className="text-foreground">1920 × 600 px</code>, aspect 16:5
              </li>
              <li>
                <span className="font-semibold text-foreground">Standard heroes</span> (all other
                pages) — <code className="text-foreground">1920 × 560 px</code>, aspect ≈ 3.4:1
              </li>
              <li className="pt-1 text-[11px]">
                Uploading a larger image is fine — the cropper will let you frame the exact region
                to use. File size limit: 4.5 MB.
              </li>
            </ul>
          </div>
        </div>

        <HeroImagesEditor initialOverrides={overrides} />
      </div>
    </>
  );
}
