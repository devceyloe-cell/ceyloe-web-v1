"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Contact,
  ExternalLink,
  FileText,
  Gem,
  Images,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminUser = {
  username: string;
  role: string;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Gem },
  { href: "/admin/collection", label: "Collection", icon: Images },
  { href: "/admin/team", label: "Our Team", icon: Contact },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrator";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function AdminHeader({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin" className="shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Ceyloe
            </span>
            <span className="ml-1.5 text-[11px] uppercase tracking-[0.14em] text-muted">Admin</span>
          </Link>
          {title ? (
            <>
              <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
              <span className="hidden truncate text-sm text-muted sm:inline">{title}</span>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-muted transition hover:bg-background hover:text-gold"
            target="_blank"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View site</span>
          </Link>

          {user ? (
            <div className="hidden items-center gap-2.5 rounded-md border border-border bg-background px-2.5 py-1.5 md:flex">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-semibold uppercase tracking-wide text-gold"
                aria-hidden
              >
                {initials(user.username)}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  {formatRole(user.role)}
                </p>
              </div>
            </div>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={logout}
            className="inline-flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>

      <nav className="border-t border-border/70 bg-background/60">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5 sm:px-4">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-gold/15 font-medium text-gold"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/pages/new"
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition",
              pathname.startsWith("/admin/pages")
                ? "bg-gold/15 font-medium text-gold"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <FileText className="h-4 w-4" strokeWidth={1.75} />
            Pages
          </Link>
        </div>
      </nav>
    </header>
  );
}
