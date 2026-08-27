"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import { CartProvider } from "@/contexts/cart-context";
import { SiteBackground } from "@/components/layout/site-background";
import { WhatsAppFab } from "@/components/widgets/whatsapp-fab";
import { LiveChatWidget } from "@/components/widgets/live-chat-widget";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const hideSketchBackground =
    pathname === "/gemstones" ||
    pathname === "/custom-jewelry" ||
    pathname === "/about";

  if (isAdmin) {
    return <CurrencyProvider>{children}</CurrencyProvider>;
  }

  return (
    <CompareProvider>
      <CurrencyProvider>
        <CartProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-[var(--site-header-height)]">{children}</main>
            <Footer />
          </div>
          {!hideSketchBackground && <SiteBackground />}
          <WhatsAppFab />
          <LiveChatWidget />
        </CartProvider>
      </CurrencyProvider>
    </CompareProvider>
  );
}
