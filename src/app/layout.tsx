import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCategories } from "@/lib/catalog";
import { SITE, SITE_URL } from "@/config/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Woodzy crafts warm, handmade wooden furniture — sofas, beds, dining, tables and more. Delivery & installation across Bihar, Jharkhand & West Bengal. Showroom in Deoghar.",
  icons: {
    icon: "/brand/woodzy-logo.jpeg",
    shortcut: "/brand/woodzy-logo.jpeg",
    apple: "/brand/woodzy-logo.jpeg",
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Handcrafted wooden furniture for warm, cozy living.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/brand/woodzy-logo.jpeg", alt: "Woodzy — Warm Woods, Cozy Living." }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "Handcrafted wooden furniture for warm, cozy living.",
    images: ["/brand/woodzy-logo.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#4B2E14",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-cream text-wood-darkest">
        {/* Pre-paint: blur the page for first-time visitors so the intro isn't
            spoiled by a flash of the live site (removed after the unboxing). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=sessionStorage.getItem('woodzy_intro_seen')==='1';var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!s&&!r){document.documentElement.classList.add('intro-active');}}catch(e){}})();",
          }}
        />
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
        <MobileNav categories={categories} />
        <CartDrawer />
      </body>
    </html>
  );
}
