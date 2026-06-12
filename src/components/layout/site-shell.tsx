"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import { SiteBackground } from "@/components/layout/site-background";
import { WhatsAppFab } from "@/components/widgets/whatsapp-fab";
import { LiveChatWidget } from "@/components/widgets/live-chat-widget";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CompareProvider>
      <CurrencyProvider>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main className={isHome ? "flex-1" : "flex-1 pt-[var(--site-header-height)]"}>
            {children}
          </main>
          <Footer />
        </div>
        <SiteBackground />
        <WhatsAppFab />
        <LiveChatWidget />
      </CurrencyProvider>
    </CompareProvider>
  );
}
