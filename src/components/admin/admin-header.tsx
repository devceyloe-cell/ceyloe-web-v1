"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Contact,
  ExternalLink,
  FileText,
  GalleryHorizontal,
  Gem,
  ImagePlay,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  MessageSquareQuote,
  Percent,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminUser = {
  username: string;
  role: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exact?: boolean;
};

const primaryNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Gem },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/discounts", label: "Discounts", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/appointments", label: "Bookings", icon: Calendar },
];

const moreNav: NavItem[] = [
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/collection", label: "Collection", icon: Images },
  { href: "/admin/homepage-banner", label: "Homepage banner", icon: GalleryHorizontal },
  { href: "/admin/hero-images", label: "Hero images", icon: ImagePlay },
  { href: "/admin/team", label: "Our team", icon: Contact },
  { href: "/admin/pages/new", label: "Pages", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const mobileGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Store",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/products", label: "Products", icon: Gem },
      { href: "/admin/orders", label: "Orders", icon: Package },
      { href: "/admin/discounts", label: "Discounts", icon: Percent },
      { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
      { href: "/admin/appointments", label: "Bookings", icon: Calendar },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/videos", label: "Videos", icon: Video },
      { href: "/admin/collection", label: "Collection", icon: Images },
      { href: "/admin/homepage-banner", label: "Homepage banner", icon: GalleryHorizontal },
      { href: "/admin/hero-images", label: "Hero images", icon: ImagePlay },
      { href: "/admin/team", label: "Our team", icon: Contact },
      { href: "/admin/pages/new", label: "Pages", icon: FileText },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
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

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/admin/pages/new") return pathname.startsWith("/admin/pages");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
  className,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const active = isActive(pathname, item);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-gold/15 font-medium text-gold"
          : "text-muted hover:bg-surface hover:text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {item.label}
    </Link>
  );
}

export function AdminHeader({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const moreActive = moreNav.some((item) => isActive(pathname, item));

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/admin" className="shrink-0">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-gold uppercase">
              Ceyloe
            </span>
            <span className="ml-1.5 text-[11px] tracking-[0.14em] text-muted uppercase">Admin</span>
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
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[10px] font-semibold tracking-wide text-gold uppercase"
                aria-hidden
              >
                {initials(user.username)}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
                <p className="text-[10px] tracking-[0.14em] text-muted uppercase">
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

      {/* Desktop nav */}
      <nav className="hidden border-t border-border/70 bg-background/60 lg:block">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-1.5">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition",
                moreActive || moreOpen
                  ? "bg-gold/15 font-medium text-gold"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              More
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", moreOpen && "rotate-180")}
              />
            </button>
            {moreOpen ? (
              <div className="absolute top-full left-0 z-50 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                {moreNav.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={() => setMoreOpen(false)}
                    className="w-full justify-start rounded-none"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/35"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[57px] right-0 bottom-0 left-0 z-50 overflow-y-auto border-t border-border bg-surface px-4 py-4 shadow-xl sm:left-auto sm:w-80 sm:border-l">
            <div className="space-y-5">
              {mobileGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setMobileOpen(false)}
                        className="w-full justify-start"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                View live site
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
