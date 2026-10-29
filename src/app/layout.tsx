import type { Metadata } from "next";
import { Libre_Caslon_Text, Manrope, Playfair_Display, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/config/site";
import { images } from "@/config/images";
import { bellMt, poppins } from "@/fonts/cover-fonts";
import "./globals.css";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  icons: {
    icon: images.favicon,
    shortcut: images.favicon,
    apple: images.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light scroll-smooth ${manrope.variable} ${caslon.variable} ${bellMt.variable} ${poppins.variable} ${playfair.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface font-manrope text-foreground antialiased">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
        {/* Checkout / delivery modals portal here so they always sit above the catalog */}
        <div
          id="ceyloe-modal-root"
          suppressHydrationWarning
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            pointerEvents: "none",
            isolation: "isolate",
          }}
        />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
