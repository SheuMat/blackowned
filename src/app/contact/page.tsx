import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin, Store, UserPlus, Zap } from "lucide-react";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactForm, ContactFormFromParams } from "@/components/contact/ContactForm";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { businesses } from "@/content/businesses";
import { site, ogBase } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with Black Owned Sheffield: directory listings, membership, events and stalls, press, partnerships or a story to share. Based at Sadacca, 48 Wicker, Sheffield S3 8JB.",
  alternates: { canonical: "/contact" },
  // A page-level openGraph replaces the root one, so restate type/locale/image
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
    title: "Contact Black Owned Sheffield",
    description: "Questions, listings, press, partnerships or a story to share. We read every message.",
    url: "/contact",
  },
};

const quickLinks = [
  { href: "/join/business", label: "Join the directory", text: "Free listing, about 10 minutes", icon: Store, tone: "bg-sunflower" },
  { href: "/join/member", label: "Become a member", text: "Free while we launch", icon: UserPlus, tone: "bg-pink" },
  { href: "/events", label: "Events", text: "Markets, workshops and socials", icon: CalendarDays, tone: "bg-latte" },
];

export default function ContactPage() {
  // slug → name, so "Claim or update this listing" links can pre-fill the business field
  const businessNames = Object.fromEntries(businesses.map((b) => [b.slug, b.name]));
  const socials = [
    {
      href: site.socials.instagram,
      label: "Instagram",
      handle: site.instagramHandle,
      note: "DM us. Usually the fastest way to reach us.",
      Icon: InstagramIcon,
      fastest: true,
    },
    {
      href: site.socials.tiktok,
      label: "TikTok",
      handle: site.socials.tiktok.split("/").pop() ?? site.instagramHandle,
      note: "Follow along and say hi in the comments.",
      Icon: TikTokIcon,
      fastest: false,
    },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contact" }]}
        eyebrow="Contact"
        accent="teal"
        title="Say hello"
        description={
          <p>
            Got a question, a listing to update, a story to share or an idea for working together? Drop us a message.
            A real person on the team reads every one.
          </p>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {[
            { icon: Zap, label: "Fastest: Instagram DM" },
            { icon: Clock, label: `We reply within ${site.replyTime}` },
            { icon: MapPin, label: "Based on the Wicker, Sheffield" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-3.5 py-2 text-sm font-semibold text-espresso"
            >
              <Icon className="h-4 w-4 text-rose-ink" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section className="pt-10 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div id="message" className="min-w-0 scroll-mt-28 lg:col-span-7 xl:col-span-8">
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromParams businessNames={businessNames} />
            </Suspense>
          </div>

          <aside aria-label="Other ways to reach us" className="flex min-w-0 flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <OfficeMap />

            <section aria-labelledby="socials-title" className="rounded-[1.75rem] border-2 border-espresso bg-espresso p-6 text-cream shadow-pop-sm">
              <h2 id="socials-title" className="font-heading text-xl font-extrabold">
                Message us on social
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {socials.map(({ href, label, handle, note, Icon, fastest }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border-2 border-cream/15 bg-cream/5 p-3 pr-4 transition-colors hover:border-pink hover:bg-cream/10"
                    >
                      <span
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          fastest ? "bg-pink text-espresso" : "bg-cream text-espresso",
                        )}
                      >
                        <Icon size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 font-heading font-bold">
                          {label}
                          {fastest && (
                            <span className="rounded-full bg-sunflower px-2 py-0.5 text-[11px] font-bold text-espresso">
                              Fastest
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-sm text-cream/70">{handle}</span>
                        <span className="mt-0.5 block text-xs text-cream/60">{note}</span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-cream/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                      <span className="sr-only"> (opens {label} in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <nav aria-labelledby="quick-title" className="rounded-[1.75rem] border-2 border-espresso bg-white p-6 shadow-pop-sm">
              <h2 id="quick-title" className="font-heading text-xl font-extrabold text-espresso">
                Looking for one of these?
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {quickLinks.map(({ href, label, text, icon: Icon, tone }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-3 rounded-2xl border-2 border-espresso/10 p-3 transition-all hover:border-espresso hover:bg-cream"
                    >
                      <span
                        className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-espresso", tone)}
                      >
                        <Icon className="h-5 w-5 text-espresso" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading font-bold text-espresso">{label}</span>
                        <span className="block text-sm text-cocoa">{text}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-cocoa transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </Section>

      <Section id="faq" tone="deep" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              className="mb-0 sm:mb-0"
              eyebrow="FAQ"
              title="Quick answers"
              description="The things people ask us most. Can't see yours? Send us a message."
            />
          </div>
          <div className="lg:col-span-8">
            <ContactFaq />
          </div>
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${site.name}`,
          url: `${site.url}/contact`,
          about: {
            "@type": "Organization",
            name: site.legalName,
            address: {
              "@type": "PostalAddress",
              streetAddress: "48 Wicker",
              addressLocality: "Sheffield",
              postalCode: "S3 8JB",
              addressCountry: "GB",
            },
            sameAs: [site.socials.instagram],
          },
        }}
      />
    </>
  );
}
