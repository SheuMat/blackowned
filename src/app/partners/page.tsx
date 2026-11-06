import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarHeart,
  GraduationCap,
  HandCoins,
  Handshake,
  Landmark,
  Megaphone,
  Newspaper,
  Star,
  Store,
  UsersRound,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { PartnerWall } from "@/components/partners/PartnerWall";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Dots, Squiggle } from "@/components/ui/Shapes";
import { regions } from "@/content/areas";
import { partnerKinds, partners } from "@/content/partners";
import { site, ogBase } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Partners & friends",
  description:
    "The venues, media, public bodies and community organisations Black Owned Sheffield has worked with, and how funders, councils and companies can partner with us.",
  alternates: { canonical: "/partners" },
  // A page-level openGraph replaces the root one, so restate type/locale/image
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    title: "Partners & friends of Black Owned Sheffield",
    description: "The organisations who've hosted, filmed, featured and backed Black-owned business in Sheffield with us.",
    url: "/partners",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
};

/** "Sheffield, Rotherham, Doncaster and Chesterfield" */
const regionList = regions
  .map((r) => r.label)
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");

const proof = [
  {
    icon: UsersRound,
    stat: site.instagramFollowers,
    title: "Reach into the community",
    text: `People follow ${site.instagramHandle} to find Black-owned businesses, and the directory covers ${regionList}.`,
    tone: "bg-pink text-espresso",
  },
  {
    icon: Handshake,
    stat: String(site.founded),
    title: "Trusted, grassroots relationships",
    text: `Founder-led since ${site.founded} and based at ${site.office.name}, the African Caribbean community association on the Wicker. People know us, and they talk to us.`,
    tone: "bg-sunflower text-espresso",
  },
  {
    icon: CalendarHeart,
    stat: "2022",
    title: "A track record of events",
    text: "Markets and events since 2022, from Events Central on Fargate to Cutlery Works and Sadacca. Busy, joyful and full of brilliant businesses.",
    tone: "bg-teal text-cream",
  },
];

const audiences = [
  {
    icon: HandCoins,
    title: "Funders",
    text: "Back work that reaches Black-owned businesses directly: free listings, markets, workshops and support for people just starting out. We'll agree with you how we report on what your funding made possible.",
  },
  {
    icon: Landmark,
    title: "Councils & public sector",
    text: "Reach Black-owned businesses and residents through people they already trust. Engagement, consultation, events and introductions to local suppliers.",
  },
  {
    icon: Building2,
    title: "Corporates & brands",
    text: "Sponsorship, supplier diversity, employee volunteering and event partnerships that show up in the community, not just in a report.",
  },
];

const ways = [
  { label: "Sponsorship", icon: Megaphone, tone: "bg-pink" },
  { label: "Event partnerships", icon: CalendarHeart, tone: "bg-sunflower" },
  { label: "Supplier diversity", icon: Store, tone: "bg-white" },
  { label: "Community research & consultation", icon: UsersRound, tone: "bg-latte" },
  { label: "Training & workshops", icon: GraduationCap, tone: "bg-blush" },
  { label: "Featured listings", icon: Star, tone: "bg-white" },
  { label: "Advertising", icon: Newspaper, tone: "bg-sunflower" },
];

export default function PartnersPage() {
  const kindsUsed = new Set(partners.map((p) => p.kind)).size;

  return (
    <>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <PageHero
        crumbs={[{ label: "About us", href: "/about" }, { label: "Partners & friends" }]}
        eyebrow="Who we work with"
        accent="navy"
        title="Partners & friends"
        description={
          <p>
            The venues, media, public bodies and community organisations who&apos;ve hosted us, filmed us, featured us
            and backed Black-owned business in Sheffield alongside us. We couldn&apos;t do it without them.
          </p>
        }
      >
        <div className="flex flex-col gap-6">
          <ul className="flex flex-wrap gap-2">
            <li className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-3.5 py-2 text-sm font-semibold text-espresso">
              <span className="font-display text-base leading-none">{partners.length}</span> organisations
            </li>
            <li className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-3.5 py-2 text-sm font-semibold text-espresso">
              <span className="font-display text-base leading-none">{kindsUsed}</span> sectors
            </li>
            <li className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-3.5 py-2 text-sm font-semibold text-espresso">
              Events together since <span className="font-display text-base leading-none">2022</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/join/partner" variant="pink" size="lg" icon={<Handshake className="h-5 w-5" aria-hidden />}>
              Become a partner
            </ButtonLink>
            <ButtonLink href="/work-with-us" variant="outline" size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
              Ways to work with us
            </ButtonLink>
          </div>
        </div>
      </PageHero>

      {/* ───────────── Logo wall ───────────── */}
      <Section>
        <nav aria-label="Partner groups" className="mb-12 -mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:flex-wrap">
            {(["community", "venue", "public-sector", "media", "funder", "business"] as const)
              .filter((k) => partners.some((p) => p.kind === k))
              .map((k) => (
                <li key={k} className="shrink-0">
                  <a
                    href={`#kind-${k}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-espresso/5 px-4 text-sm font-semibold text-espresso transition-colors hover:bg-espresso hover:text-cream"
                  >
                    {partnerKinds[k]}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        <PartnerWall />
      </Section>

      {/* ───────────── Why partner with us ───────────── */}
      <Section tone="espresso" className="grain overflow-clip">
        <Dots color="#f2a0bd" className="absolute top-14 right-8 hidden h-14 w-14 opacity-60 lg:block" />
        <Squiggle color="#f6bd3c" className="absolute bottom-12 left-8 hidden h-10 w-32 opacity-80 lg:block" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Why partner with us"
            title="Grassroots reach you can't buy"
            description="For funders, councils and companies who want to support Black-owned business in South Yorkshire and see it land."
          />
          <ul className="grid gap-5 lg:grid-cols-3">
            {proof.map(({ icon: Icon, stat, title, text, tone }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <article className="flex h-full flex-col rounded-[1.75rem] border-2 border-cream/15 bg-cream/5 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full", tone)}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-display text-4xl leading-none text-pink">
                      {stat}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-extrabold text-cream">{title}</h3>
                  <p className="mt-2 leading-relaxed text-cream/80">{text}</p>
                </article>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {audiences.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <article className="h-full rounded-[1.75rem] border-2 border-espresso bg-cream p-6 text-espresso shadow-pop-pink sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-espresso bg-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-5 font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase">For</p>
                  <h3 className="font-heading text-2xl font-extrabold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-cocoa">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────────── Ways to partner ───────────── */}
      <Section tone="deep">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>Ways to partner</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl lg:text-5xl">
              Lots of ways in. One conversation to start.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cocoa">
              Sponsor a market, bring us in to run a session, meet local Black-owned suppliers, or help us reach people
              you&apos;re struggling to hear from. Some of these are ready now; others are coming in 2027.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/work-with-us" size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
                See all the ways
              </ButtonLink>
              <ButtonLink href="/work-with-us#enquire" variant="outline" size="lg">
                Make an enquiry
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-6">
            <ul className="flex flex-wrap gap-3">
              {ways.map(({ label, icon: Icon, tone }) => (
                <li key={label}>
                  <Link
                    href="/work-with-us#ways"
                    className={cn(
                      "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-espresso px-5 font-heading font-bold text-espresso shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop",
                      tone,
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        tone="sunflower"
        title="Let's build something together"
        description="Tell us a little about your organisation and what you have in mind. No commitment: it just starts the conversation."
        actions={
          <>
            <ButtonLink href="/join/partner" size="lg" icon={<Handshake className="h-5 w-5" aria-hidden />}>
              Become a partner
            </ButtonLink>
            <ButtonLink href="/contact?subject=partnership" variant="outline" size="lg">
              Ask a question first
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
