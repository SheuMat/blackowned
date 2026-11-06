import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Eye, Handshake, MapPin, Sprout, Target, UsersRound } from "lucide-react";
import { MediaStrip } from "@/components/about/MediaStrip";
import { LogoBadge } from "@/components/brand/Logo";
import { Team } from "@/components/about/Team";
import { Timeline } from "@/components/about/Timeline";
import { MISSION, cicFacts, goals, values } from "@/components/about/data";
import { Reveal } from "@/components/home/Reveal";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { PartnerStrip } from "@/components/partners/PartnerStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Blob, Dots, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import { regions } from "@/content/areas";
import { site, ogBase } from "@/lib/site";
import { cn } from "@/lib/utils";

const description =
  "Who Black Owned Sheffield is and why we started. Founded in 2020 by Asha and Rakaia, and a Community Interest Company since 2024, we discover, promote and connect Black-owned businesses across Sheffield and South Yorkshire.";

export const metadata: Metadata = {
  title: "About us",
  description,
  alternates: { canonical: "/about" },
  // A page-level openGraph replaces the root one, so restate type/locale/image
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    title: "About Black Owned Sheffield",
    description: "It started in 2020 with one question: what can we do to help? Meet the CIC, the founders and the story so far.",
    url: "/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
};

const jumpLinks = [
  { href: "#our-story", label: "Our story" },
  { href: "#mission", label: "Mission & vision" },
  { href: "#milestones", label: "Milestones" },
  { href: "#team", label: "The team" },
  { href: "#cic", label: "Our CIC" },
];

const VISION =
  "A city where Black-owned businesses are visible, connected and thriving, and where the next generation knows they can start something.";

export default function AboutPage() {
  const [asha, rakaia] = site.founders;
  const towns = regions.map((r) => r.label);

  return (
    <>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <PageHero
        crumbs={[{ label: "About us" }]}
        eyebrow="About us"
        accent="pink"
        title={
          <>
            Hello, we&apos;re{" "}
            <ToneText pop className="font-normal whitespace-nowrap" offset={1}>
              Black Owned
            </ToneText>{" "}
            <PinkSticker className="mt-2 text-[0.8em] font-normal sm:mt-0">Sheffield</PinkSticker>
          </>
        }
        description={
          <p>
            A Community Interest Company on a mission to get Black-owned businesses seen, supported and celebrated
            across {towns.slice(0, -1).join(", ")} and {towns.at(-1)}. Free to be found, proud to be here.
          </p>
        }
      >
        {/* Wide screens only: the badge fills the hero's empty right-hand side */}
        <div aria-hidden className="pointer-events-none absolute top-4 right-8 hidden xl:block">
          <div className="relative h-72 w-72">
            <Sunburst color="#f6bd3c" className="absolute inset-0 h-full w-full animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LogoBadge size={150} className="-rotate-6 shadow-pop ring-4" />
            </div>
            <span className="absolute bottom-6 -left-2 inline-block -rotate-6 rounded-xl border-2 border-espresso bg-white px-3 py-1 font-display text-lg text-espresso shadow-pop-sm">
              Free to be found
            </span>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2">
          {[
            { icon: Sprout, label: `Founded ${site.founded}` },
            { icon: UsersRound, label: "Community Interest Company" },
            { icon: MapPin, label: `Based at ${site.office.name} on the Wicker` },
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
        <nav aria-label="On this page" className="mt-6">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
            {jumpLinks.map((l) => (
              <li key={l.href} className="shrink-0">
                <a
                  href={l.href}
                  className="inline-flex min-h-11 items-center rounded-full bg-espresso/5 px-4 text-sm font-semibold text-espresso transition-colors hover:bg-espresso hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <StripeBand />

      {/* ───────────── Why we started ───────────── */}
      <Section id="our-story" className="scroll-mt-20 overflow-clip">
        <Dots color="#f2a0bd" className="absolute top-16 right-6 hidden h-14 w-14 lg:block" />
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Why we started</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl lg:text-5xl">
              It started with one question
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-cocoa">
              <p>
                In {site.founded}, after the murder of George Floyd and the protests that followed around the world,{" "}
                {asha} and {rakaia} sat down and asked themselves what they could actually do to help, here in
                Sheffield.
              </p>
              <p>
                Their answer was to put a spotlight on Black-owned businesses. They started a free page on Instagram and
                Facebook, sharing the barbers, cooks, makers and professionals who were already here but too often hard to
                find. No fees, no catch: just a platform.
              </p>
              <p>
                People shared it, followed it and turned up. The page became pop-up markets, the markets became a
                community, and in 2024 that community became a Community Interest Company. Now it has a home at{" "}
                {site.office.name} on the Wicker, and this website.
              </p>
            </div>
          </Reveal>

          <Reveal className="relative lg:col-span-5" delay={0.1}>
            <Blob color="#fadbe6" className="absolute -top-10 -left-8 h-72 w-72 opacity-90 sm:h-80 sm:w-80" />
            <div className="relative flex flex-col gap-5">
              <figure className="-rotate-2 rounded-[2rem] border-2 border-espresso bg-sunflower p-7 shadow-pop sm:p-9">
                <blockquote className="font-display text-4xl leading-[1.05] text-espresso sm:text-5xl">
                  &ldquo;What can we do to help?&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-heading text-sm font-bold tracking-[0.14em] text-espresso/80 uppercase">
                  {asha} &amp; {rakaia}, {site.founded}
                </figcaption>
              </figure>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group ml-auto flex w-full max-w-sm rotate-1 items-center gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-4 shadow-pop-sm transition-all hover:rotate-0 hover:shadow-pop"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-espresso text-pink">
                  <InstagramIcon size={26} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-none text-espresso">
                    {site.instagramFollowers}
                  </span>
                  <span className="mt-1 block text-sm text-cocoa">
                    following <span className="font-semibold text-espresso">{site.instagramHandle}</span>, where it all
                    began
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-cocoa" aria-hidden />
                <span className="sr-only"> (opens Instagram in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ───────────── Mission & vision ───────────── */}
      <Section id="mission" tone="espresso" className="grain scroll-mt-20 overflow-clip">
        <Sunburst color="#55321f" className="absolute -top-20 -left-20 h-72 w-72 animate-spin-slow" />
        <Squiggle color="#f2a0bd" className="absolute right-8 bottom-10 hidden h-10 w-32 lg:block" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="What we're for"
            title="Our mission and vision"
            description="Two sentences we come back to whenever we have a decision to make."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              // espresso/80: /70 dips under 4.5:1 on pink at this small size
              { label: "Our mission", text: MISSION, icon: Target, card: "bg-pink text-espresso", ink: "text-espresso/80" },
              { label: "Our vision", text: VISION, icon: Eye, card: "bg-cream text-espresso", ink: "text-espresso/80" },
            ].map(({ label, text, icon: Icon, card, ink }, i) => (
              <Reveal key={label} delay={i * 0.1}>
                <article className={cn("h-full rounded-[2rem] border-2 border-cream/20 p-7 shadow-pop-pink sm:p-10", card)}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso bg-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className={cn("font-heading text-sm font-bold tracking-[0.18em] uppercase", ink)}>{label}</h3>
                  </div>
                  <p className="mt-6 font-heading text-2xl leading-snug font-extrabold sm:text-3xl lg:text-[2.1rem]">
                    {text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────────── What we want to achieve ───────────── */}
      <Section tone="deep">
        <SectionHeading
          eyebrow="What we want to achieve"
          title="Real outcomes for Black business in Sheffield"
          description="Likes are lovely. These are the things we're actually working towards."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map(({ title, text, icon: Icon, tone }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 0.06}>
              <article className="flex h-full flex-col rounded-[1.5rem] border-2 border-espresso bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-pop">
                <div className="flex items-start justify-between gap-4">
                  <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-espresso", tone)}>
                    <Icon className="h-6 w-6 text-espresso" aria-hidden />
                  </span>
                  <span aria-hidden className="font-display text-3xl leading-none text-espresso/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-extrabold text-espresso">{title}</h3>
                <p className="mt-2 leading-relaxed text-cocoa">{text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ───────────── Milestones ───────────── */}
      <Section id="milestones" className="scroll-mt-20 overflow-clip">
        <Blob color="#f6bd3c" className="absolute top-40 -right-32 hidden h-80 w-80 opacity-25 lg:block" />
        <Blob color="#f2a0bd" className="absolute bottom-40 -left-32 hidden h-80 w-80 opacity-30 lg:block" />
        <div className="relative">
          <SectionHeading
            align="center"
            eyebrow="Milestones"
            title="How we got here"
            description="From an Instagram page to markets, a home on the Wicker and a directory for the whole city."
          />
          <Timeline />
        </div>
      </Section>

      {/* ───────────── Team ───────────── */}
      <Section id="team" tone="white" className="scroll-mt-20">
        <SectionHeading
          eyebrow="The team"
          title="Small team, big community"
          description={`${site.name} is led by its co-founders, with help from a growing circle of volunteers, venues and friends.`}
        />
        <Team />
      </Section>

      {/* ───────────── The CIC ───────────── */}
      <Section id="cic" tone="pink" className="grain scroll-mt-20 overflow-clip">
        <Sunburst color="#f2a0bd" className="absolute -right-16 -bottom-16 h-64 w-64 animate-spin-slow opacity-70" />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>{site.legalName}</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl lg:text-5xl">
              What is a Community Interest Company?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cocoa">
              We&apos;re a CIC: a type of company in the UK made for organisations that want to use business to do good.
              It&apos;s regulated by the independent Regulator of Community Interest Companies, and it means the community
              always comes first.
            </p>
            <div className="mt-8 rounded-[1.5rem] border-2 border-espresso bg-white p-6 shadow-pop-sm">
              <h3 className="font-heading text-lg font-extrabold text-espresso">What that means for you</h3>
              <p className="mt-2 leading-relaxed text-cocoa">
                Listing your business with us is free. Income from partnerships, sponsorship and future paid extras goes
                back into the work: the directory, the markets and support for Black-owned businesses.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/work-with-us" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Work with us
                </ButtonLink>
                <ButtonLink
                  href="https://www.gov.uk/government/organisations/office-of-the-regulator-of-community-interest-companies"
                  variant="outline"
                  iconRight={<ArrowUpRight className="h-4 w-4" aria-hidden />}
                >
                  About CICs on GOV.UK
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-5 lg:col-span-7">
            {cicFacts.map(({ title, text, icon: Icon }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <article className="flex gap-5 rounded-[1.5rem] border-2 border-espresso bg-cream p-6 sm:p-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
                    <Icon className="h-6 w-6 text-espresso" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-extrabold text-espresso">{title}</h3>
                    <p className="mt-1.5 leading-relaxed text-cocoa">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ───────────── Values ───────────── */}
      <Section>
        <SectionHeading
          eyebrow="Our values"
          title="What we stand for"
          action={
            <ButtonLink href="/join" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Get involved
            </ButtonLink>
          }
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, text, icon: Icon, color, ink }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06}>
              <article
                className={cn(
                  "grain relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-espresso p-6 shadow-pop-sm transition-transform duration-200 hover:-translate-y-1",
                  i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1",
                )}
                style={{ backgroundColor: color, color: ink }}
              >
                <Icon className="h-8 w-8" aria-hidden />
                <h3 className="mt-8 font-display text-2xl leading-tight">{title}</h3>
                <p className="mt-2 leading-relaxed opacity-90">{text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ───────────── Media & partners ───────────── */}
      <section aria-label="Press and partners" className="border-y-2 border-espresso/10 bg-cream-deep py-14 sm:py-16">
        <Container className="flex flex-col gap-14">
          <MediaStrip />
          <PartnerStrip heading="Partners & friends" />
        </Container>
      </section>

      <CtaBand
        tone="espresso"
        title={
          <>
            Be part of the <span className="text-pink">next chapter</span>
          </>
        }
        description="List your business for free, become a member, volunteer, or bring your organisation on board. There's a place for you here."
        actions={
          <>
            <ButtonLink href="/join" variant="pink" size="lg" icon={<UsersRound className="h-5 w-5" aria-hidden />}>
              Join us
            </ButtonLink>
            <ButtonLink href="/work-with-us" variant="cream" size="lg" icon={<Handshake className="h-5 w-5" aria-hidden />}>
              Work with us
            </ButtonLink>
          </>
        }
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `About ${site.name}`,
          url: `${site.url}/about`,
          description,
          mainEntity: {
            "@type": "Organization",
            // The organisation dates from 2020; the CIC (legalName) was incorporated in 2024
            name: site.name,
            legalName: site.legalName,
            foundingDate: String(site.founded),
            founder: site.founders.map((name) => ({ "@type": "Person", name })),
            slogan: MISSION,
            areaServed: towns,
          },
        }}
      />
    </>
  );
}
