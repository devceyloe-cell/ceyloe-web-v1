"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          <Logo size="md" />

          <nav className="hidden items-center gap-8 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-widest text-muted transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            <Link
              href="/catalog"
              className="hidden items-center gap-2 text-sm uppercase tracking-widest text-gold transition-colors hover:text-gold-light md:flex"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border/50 bg-background transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="py-4">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs uppercase tracking-widest text-muted">Theme</span>
            <ThemeToggle />
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
          </nav>
        </Container>
      </div>
    </header>
  );
}
