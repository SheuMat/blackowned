import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarHeart,
  Clock,
  HandCoins,
  Handshake,
  HeartHandshake,
  MapPin,
  Recycle,
  Sprout,
  Store,
  UsersRound,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { OfferingCard } from "@/components/partners/OfferingCard";
import { WorkWithUsForm, WorkWithUsFormFromParams } from "@/components/partners/WorkWithUsForm";
import { offerings } from "@/components/partners/offerings";
import { PartnerStrip } from "@/components/partners/PartnerStrip";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { regions } from "@/content/areas";
import { businesses } from "@/content/businesses";
import { site, ogBase } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work with us",
  description:
    "Corporate partnerships, sponsorship, event promotion, advertising, training, supplier diversity and community research with Black Owned Sheffield CIC. Income is reinvested so listings stay free.",
  alternates: { canonical: "/work-with-us" },
  // A page-level openGraph replaces the root one, so restate type/locale/image
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
    title: "Work with Black Owned Sheffield",
    description:
      "For companies, councils, funders and brands who want to reach and support Black-owned business across Sheffield and South Yorkshire.",
    url: "/work-with-us",
  },
};

export default function WorkWithUsPage() {
  // Real listings only: sample/demo businesses never count towards reach figures
  const listed = businesses.filter((b) => !b.sample).length;
  const towns = regions.map((r) => r.label);
  const nowCount = offerings.filter((o) => o.status === "now").length;
  const laterCount = offerings.length - nowCount;

  const stats = [
    {
      value: site.instagramFollowers,
      label: "Instagram community",
      note: `Following ${site.instagramHandle}`,
      tone: "bg-pink text-espresso",
    },
    {
      value: "2022",
      label: "Year of our first market",
      note: "Markets and events ever since, from Fargate to Cutlery Works and Sadacca",
      tone: "bg-sunflower text-espresso",
    },
    {
      value: String(listed),
      label: listed === 1 ? "Business listed so far" : "Businesses listed so far",
      note: "The directory opened in November 2026, so watch this space",
      tone: "bg-cream text-espresso",
    },
    {
      value: String(towns.length),
      label: "Towns covered",
      note: towns.join(", "),
      // navy, not teal: cream small text on teal falls below AA contrast
      tone: "bg-navy text-cream",
    },
  ];

  return (
    <>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <PageHero
        crumbs={[{ label: "Work with us" }]}
        eyebrow="For companies, councils, funders and brands"
        accent="tangerine"
        title="Work with us"
        description={
          <p>
            Reach and back Black-owned businesses across {towns.slice(0, -1).join(", ")} and {towns.at(-1)}. Partner
            with us, sponsor something people love, or bring us in to help you listen. The income goes back into the
            community.
          </p>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#enquire" variant="pink" size="lg" icon={<Handshake className="h-5 w-5" aria-hidden />}>
              Make an enquiry
            </ButtonLink>
            <ButtonLink href="#ways" variant="outline" size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
              See the options
            </ButtonLink>
          </div>
          <ul className="flex flex-wrap gap-2">
            {[
              { icon: Sprout, label: "Community Interest Company" },
              { icon: Recycle, label: "Income reinvested" },
              { icon: Clock, label: `Reply within ${site.replyTime}` },
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
        </div>
      </PageHero>

      {/* ───────────── Ways to work together ───────────── */}
      <Section id="ways" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Ways to work together"
          title="Pick what fits. We'll shape the rest."
          description="Nothing here is off the shelf. Tell us what you want to achieve and we'll work it out together. We haven't set prices yet, so every option is 'Ask us'."
          action={
            <p className="flex flex-wrap gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-cream">
                <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden />
                {nowCount} available now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-espresso/30 px-3 py-1 text-cocoa">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {laterCount} coming 2027
              </span>
            </p>
          }
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o, i) => (
            <Reveal as="li" key={o.id} delay={(i % 3) * 0.06} className="h-full">
              <OfferingCard offering={o} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ───────────── Audience & reach ───────────── */}
      <Section tone="espresso" className="grain overflow-clip">
        <Sunburst color="#55321f" className="absolute -right-20 -bottom-20 h-80 w-80 animate-spin-slow" />
        <Dots color="#f6bd3c" className="absolute top-14 right-10 hidden h-12 w-12 opacity-70 lg:block" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Audience & reach"
            title="Who you'll reach"
            description="Honest numbers. We're a young platform with deep roots, and we'd rather tell you the truth than a big round number."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 0.06}>
                <div className={cn("flex h-full flex-col rounded-[1.75rem] border-2 border-espresso p-6 shadow-pop-pink", s.tone)}>
                  <p className="font-display text-5xl leading-none sm:text-6xl">{s.value}</p>
                  <p className="mt-4 font-heading text-lg leading-tight font-extrabold">{s.label}</p>
                  <p className="mt-1 text-sm opacity-80">{s.note}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center">
            <h3 className="font-heading text-2xl font-extrabold text-cream lg:col-span-4">
              The people in our community
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {[
                { icon: Store, text: "Black business owners, founders and side hustlers" },
                { icon: HeartHandshake, text: "Customers who choose to buy Black-owned" },
                { icon: CalendarHeart, text: "Families and young people at our markets" },
                { icon: UsersRound, text: "Community groups, venues and organisations across South Yorkshire" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-2xl border-2 border-cream/15 bg-cream/5 p-4 text-cream/90">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink text-espresso">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ───────────── How it supports our CIC ───────────── */}
      <Section tone="pink" className="grain overflow-clip">
        <Squiggle color="#e0628f" className="absolute top-12 right-10 hidden h-10 w-32 lg:block" />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>How it supports our CIC</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl lg:text-5xl">
              Your support keeps listings free
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cocoa">
              As a Community Interest Company, {site.name} puts the community first. Income from partnerships,
              sponsorship and paid extras is reinvested in the work, so a listing in the directory stays free for every
              Black-owned business.
            </p>
            <p className="mt-4 rounded-2xl border-2 border-espresso bg-white px-4 py-3 text-sm font-semibold text-espresso">
              <BadgeCheck className="mr-1.5 -mt-0.5 inline h-4 w-4 text-teal" aria-hidden />
              Paid placements are always clearly labelled, so our community knows what&apos;s sponsored.
            </p>
          </div>
          <ol className="grid gap-4 lg:col-span-7">
            {[
              {
                icon: Handshake,
                title: "You work with us",
                text: "A partnership, a sponsorship, a booking or an ad. Whatever fits your goals.",
                tone: "bg-sunflower",
              },
              {
                icon: HandCoins,
                title: "We reinvest the income",
                text: "Into the directory, the map, our markets and support for Black-owned businesses.",
                tone: "bg-white",
              },
              {
                icon: Sprout,
                title: "Businesses get found, for free",
                text: "More visibility, more customers and more confidence for the next generation of founders.",
                tone: "bg-pink",
              },
            ].map(({ icon: Icon, title, text, tone }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <div className="relative flex items-start gap-5 rounded-[1.5rem] border-2 border-espresso bg-cream p-5 sm:p-6">
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-espresso font-display text-xl",
                      tone,
                    )}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 font-heading text-xl font-extrabold text-espresso">
                      <Icon className="h-5 w-5 text-rose-ink" aria-hidden />
                      {title}
                    </h3>
                    <p className="mt-1 leading-relaxed text-cocoa">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* ───────────── Enquiry form ───────────── */}
      <Section id="enquire" tone="deep" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Enquire"
          title="Start the conversation"
          description="Tell us who you are and what you have in mind. A real person reads every enquiry."
        />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <Suspense fallback={<WorkWithUsForm />}>
              <WorkWithUsFormFromParams />
            </Suspense>
          </div>
          <aside className="min-w-0 lg:col-span-4" aria-label="More ways to get in touch">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <section className="rounded-[1.5rem] border-2 border-espresso bg-espresso p-6 text-cream shadow-pop-sm">
                <h3 className="font-heading text-xl font-extrabold">What happens next</h3>
                <ol className="mt-4 flex flex-col gap-4">
                  {[
                    { t: "We read it properly", d: "And think about where we could work together." },
                    { t: "We get in touch", d: `Within ${site.replyTime}, to book a chat.` },
                    { t: "We shape it together", d: "Something that works for you and for the community." },
                  ].map((s, i) => (
                    <li key={s.t} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink font-display text-sm text-espresso"
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-heading text-sm font-bold">{s.t}</span>
                        <span className="block text-sm text-cream/80">{s.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-[1.5rem] border-2 border-espresso bg-white p-6 shadow-pop-sm">
                <h3 className="font-heading text-xl font-extrabold text-espresso">Prefer a quick chat?</h3>
                <p className="mt-2 text-sm leading-relaxed text-cocoa">
                  Send us a DM on Instagram, or use our contact form and pick &ldquo;Partnerships&rdquo;.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <ButtonLink
                    href={site.socials.instagram}
                    variant="primary"
                    icon={<InstagramIcon size={18} />}
                    aria-label={`Message ${site.instagramHandle} on Instagram (opens in a new tab)`}
                  >
                    {site.instagramHandle}
                  </ButtonLink>
                  <ButtonLink href="/contact?subject=partnership" variant="outline">
                    Contact form
                  </ButtonLink>
                </div>
                <p className="mt-4 inline-flex items-start gap-2 text-sm text-cocoa">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
                  {site.office.name}, {site.office.address}
                </p>
              </section>
            </div>
          </aside>
        </div>
      </Section>

      <section aria-label="Our partners" className="border-t-2 border-espresso/10 bg-cream py-14 sm:py-16">
        <Container>
          <PartnerStrip heading="In good company" />
        </Container>
      </section>
    </>
  );
}
