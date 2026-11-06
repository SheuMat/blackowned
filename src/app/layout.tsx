import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PreviewBanner } from "@/components/layout/PreviewBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { defaultOgImage, site } from "@/lib/site";
import "./globals.css";

const bagel = Bagel_Fat_One({ variable: "--font-bagel", subsets: ["latin"], weight: "400", display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Black owned business Sheffield",
    "Black-owned Sheffield",
    "Black business directory",
    "Sheffield",
    "Rotherham",
    "Doncaster",
    "Chesterfield",
    "CIC",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [defaultOgImage],
  },
  // No title/description here so cards fall back to each page's og: tags
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#2a1910",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${bagel.variable} ${bricolage.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-espresso font-semibold text-cream shadow-pop-pink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-5 focus:py-3"
        >
          Skip to content
        </a>
        <PreviewBanner />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            // The organisation dates from 2020; the CIC (legalName) was incorporated in 2024
            name: site.name,
            legalName: site.legalName,
            url: site.url,
            logo: `${site.url}/brand/bos-logo.jpg`,
            foundingDate: String(site.founded),
            description: site.description,
            address: {
              "@type": "PostalAddress",
              streetAddress: "48 Wicker",
              addressLocality: "Sheffield",
              postalCode: "S3 8JB",
              addressCountry: "GB",
            },
            sameAs: [site.socials.instagram],
          }}
        />
      </body>
    </html>
  );
}
