"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { AccountLink } from "@/components/layout/account-link";

const navLinkClass =
  "text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-gold";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface-header/98 backdrop-blur-sm">
      <AnnouncementBar />
      <div className="border-b border-border">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
          <Logo size="md" />

          <nav className="hidden items-center gap-8 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <CurrencySelector compact className="hidden md:block" />

            <AccountLink className="hidden sm:inline-flex" />

            <Link href="/catalog" className={cn(navLinkClass, "hidden sm:flex")} aria-label="Search catalog">
              <Search className="h-4 w-4" />
            </Link>

            <Link href="/catalog" className={navLinkClass} aria-label="View catalog">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Shop</span>
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-heading lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>
      </div>

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
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm uppercase tracking-widest text-muted transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm uppercase tracking-widest text-muted transition-colors hover:text-gold"
            >
              Account
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
