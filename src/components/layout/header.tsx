"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { mainNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { CurrencySelector } from "@/components/layout/currency-selector";
import { NavDropdown, MobileNavItem } from "@/components/layout/nav-dropdown";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;
  const light = isHome && !scrolled;

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    const onScroll = () => setScrolled(window.scrollY > 50);

    syncHeaderHeight();
    onScroll();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mobileOpen]);

  const iconClass = cn(
    "transition-colors",
    light ? "text-white hover:text-pale-gold" : "text-primary hover:text-rich-gold",
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "border-b border-border bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container>
        <nav className="grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-4 lg:gap-4 xl:gap-6">
          {/* Left navigation */}
          <div className="hidden min-w-0 items-center justify-start gap-3 lg:flex xl:gap-5">
            {mainNavigation.map((item) => (
              <NavDropdown key={item.label} item={item} light={light} />
            ))}
          </div>

          {/* Centered logo — in flow, not absolute */}
          <div className="flex shrink-0 justify-center px-3 sm:px-5 lg:px-8 xl:px-10">
            <Logo size="md" className={cn(light && "brightness-0 invert")} />
          </div>

          {/* Right utilities */}
          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4">
            <CurrencySelector compact light={light} className="hidden md:block" />

            <Link href="/catalog" aria-label="Search" className={iconClass}>
              <Search className="h-5 w-5 shrink-0" />
            </Link>
            <Link href="/catalog" aria-label="Cart" className={iconClass}>
              <ShoppingBag className="h-5 w-5 shrink-0" />
            </Link>

            <button
              type="button"
              className={cn("lg:hidden", iconClass)}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-white transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="py-4">
          <div className="mb-4 border-b border-border pb-4">
            <CurrencySelector />
          </div>
          <nav>
            {mainNavigation.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}
