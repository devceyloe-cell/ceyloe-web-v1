"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Eye,
  FilePlus2,
  FileText,
  Gem,
  ImagePlay,
  Images,
  Pencil,
  Users,
} from "lucide-react";
import type { CmsPage } from "@/lib/cms/types";
import type { AdminSession } from "@/lib/admin/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

function formatRole(role: string) {
  return role === "admin" ? "Administrator" : role;
}

type DashboardStats = {
  products: number;
  appointments: number;
  newAppointments: number;
  users: number;
  pages: number;
  collectionItems: number;
};

const modules = [
  {
    href: "/admin/products",
    label: "Products",
    description: "Manage gemstones, images, prices, and catalog specs",
    icon: Gem,
    statKey: "products" as const,
    accent: "bg-sky-500/10 text-sky-700",
  },
  {
    href: "/admin/collection",
    label: "Collection",
    description: "Homepage circular gems — images, captions, and links",
    icon: Images,
    statKey: "collectionItems" as const,
    accent: "bg-rose-500/10 text-rose-700",
  },
  {
    href: "/admin/appointments",
    label: "Appointments",
    description: "Review booking requests from the appointment form",
    icon: Calendar,
    statKey: "appointments" as const,
    accent: "bg-violet-500/10 text-violet-700",
    badgeKey: "newAppointments" as const,
  },
  {
    href: "/admin/users",
    label: "Users",
    description: "View and remove shopper accounts and carts",
    icon: Users,
    statKey: "users" as const,
    accent: "bg-emerald-500/10 text-emerald-700",
  },
  {
    href: "/admin/pages/new",
    label: "Pages",
    description: "Create and edit custom CMS landing pages",
    icon: FileText,
    statKey: "pages" as const,
    accent: "bg-amber-500/10 text-amber-700",
  },
  {
    href: "/admin/hero-images",
    label: "Hero Images",
    description: "Upload and crop hero artwork for every page",
    icon: ImagePlay,
    statKey: null as unknown as keyof DashboardStats,
    accent: "bg-teal-500/10 text-teal-700",
  },
];

export function AdminDashboard({
  pages,
  session,
  stats,
}: {
  pages: CmsPage[];
  session: AdminSession | null;
  stats: DashboardStats;
}) {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Overview</p>
            <h1 className="mt-1 font-display text-3xl font-light tracking-tight">
              {session ? (
                <>
                  Welcome, <span className="text-gold">{session.username}</span>
                </>
              ) : (
                "Dashboard"
              )}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {session
                ? `Signed in as ${formatRole(session.role)}. Manage catalog, bookings, users, and pages.`
                : "Manage catalog, bookings, users, and pages."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/products/new">
              <Button size="sm" className="inline-flex items-center gap-1.5">
                <Gem className="h-3.5 w-3.5" />
                Add product
              </Button>
            </Link>
            <Link href="/admin/collection">
              <Button size="sm" variant="secondary" className="inline-flex items-center gap-1.5">
                <Images className="h-3.5 w-3.5" />
                Edit collection
              </Button>
            </Link>
            <Link href="/admin/pages/new">
              <Button size="sm" variant="secondary" className="inline-flex items-center gap-1.5">
                <FilePlus2 className="h-3.5 w-3.5" />
                New page
              </Button>
            </Link>
          </div>
        </div>

        <section className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const count = mod.statKey ? stats[mod.statKey] : null;
            const badge =
              "badgeKey" in mod && mod.badgeKey && stats[mod.badgeKey] > 0
                ? stats[mod.badgeKey]
                : null;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative flex flex-col border border-border bg-surface p-5 transition hover:border-gold/60 hover:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${mod.accent}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                      {badge} new
                    </span>
                  ) : null}
                </div>
                {count !== null && (
                  <p className="mt-4 text-3xl font-light tabular-nums text-foreground">{count}</p>
                )}
                <h2 className="mt-1 text-sm font-semibold text-foreground">{mod.label}</h2>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted">{mod.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gold opacity-80 transition group-hover:opacity-100">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-light">Custom pages</h2>
              <p className="mt-1 text-sm text-muted">
                Landing pages stored in the CMS
              </p>
            </div>
            <Link href="/admin/pages/new">
              <Button size="sm" variant="secondary" className="inline-flex items-center gap-1.5">
                <FilePlus2 className="h-3.5 w-3.5" />
                New page
              </Button>
            </Link>
          </div>

          {pages.length === 0 ? (
            <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 text-sm text-muted">No custom pages yet.</p>
              <Link
                href="/admin/pages/new"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
              >
                Create your first page
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden border border-border">
              <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-border bg-surface px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-muted sm:grid">
                <span>Page</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>
              <ul className="divide-y divide-border">
                {pages.map((page) => (
                  <li
                    key={page.id}
                    className="flex flex-col gap-3 bg-background px-4 py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{page.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">/p/{page.slug}</p>
                    </div>
                    <div>
                      {page.published ? (
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-surface-elevated px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                      {page.published ? (
                        <a
                          href={`/p/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-muted transition hover:bg-surface hover:text-gold"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </a>
                      ) : null}
                      <Link href={`/admin/pages/${page.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="inline-flex items-center gap-1.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-xs text-muted">
            Pages are stored in <code className="text-foreground">content/cms/pages.json</code>. On
            Vercel, use a persistent store or commit changes after editing locally.
          </p>
        </section>
      </div>
    </>
  );
}
