"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { AccountLink } from "@/components/layout/account-link";

const navLinkClass =
  "whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.12em] text-heading transition-opacity hover:opacity-60";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface-header">
      <Container>
        {/* Mobile + desktop top row: logo and utilities */}
        <div className="grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center md:h-[4.75rem] lg:h-20">
          <div aria-hidden className="min-w-0" />

          <Logo size="md" className="shrink-0 justify-self-center" />

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <CurrencySelector compact className="hidden md:block" />
            <AccountLink className="hidden sm:inline-flex" />

            <Link href="/catalog" className={cn(navLinkClass, "hidden sm:flex")} aria-label="Search catalog">
              <Search className="h-4 w-4" />
            </Link>

            <Link href="/catalog" className={navLinkClass} aria-label="View catalog">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-heading lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav row — separate from logo so nothing overlaps */}
        <nav
          className="hidden items-center justify-center gap-6 border-t border-border py-3 lg:flex xl:gap-10"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => (
            <Link key={item.label} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-surface-header transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="py-4">
          <div className="mb-4 border-b border-border pb-4">
            <CurrencySelector />
          </div>
          <div className="mb-4 border-b border-border pb-4">
            <AccountLink />
          </div>
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-widest text-heading transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm font-medium uppercase tracking-widest text-heading transition-opacity hover:opacity-60"
            >
              Account
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
