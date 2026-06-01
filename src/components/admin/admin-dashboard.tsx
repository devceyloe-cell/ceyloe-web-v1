"use client";

import Link from "next/link";
import type { CmsPage } from "@/lib/cms/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

export function AdminDashboard({ pages }: { pages: CmsPage[] }) {
  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-light">Pages</h1>
            <p className="mt-1 text-sm text-muted">Create and customize site pages with text and images</p>
          </div>
          <Link href="/admin/pages/new">
            <Button>New page</Button>
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center">
            <p className="text-muted">No pages yet.</p>
            <Link href="/admin/pages/new" className="mt-4 inline-block text-sm text-gold hover:underline">
              Create your first page
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {pages.map((page) => (
              <li key={page.id} className="flex flex-wrap items-center justify-between gap-4 bg-surface px-4 py-4">
                <div>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-xs text-muted">
                    /p/{page.slug}
                    {!page.published && (
                      <span className="ml-2 rounded bg-surface-elevated px-2 py-0.5 text-muted">Draft</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {page.published && (
                    <a
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs text-muted hover:text-gold"
                    >
                      View
                    </a>
                  )}
                  <Link href={`/admin/pages/${page.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-xs text-muted">
          Pages are stored locally in <code className="text-foreground">content/cms/pages.json</code>. On Vercel,
          use a persistent store or commit changes after editing locally.
        </p>
      </div>
    </>
  );
}
