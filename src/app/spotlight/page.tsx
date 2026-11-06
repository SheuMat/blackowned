import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Award, Megaphone, PenLine, Share2, Sparkles, Vote } from "lucide-react";
import { BusinessLogo } from "@/components/cards/BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { NominationForm } from "@/components/spotlight/NominationForm";
import { SpotlightPackages } from "@/components/spotlight/SpotlightPackages";
import {
  PullQuote,
  SpotlightArchiveCard,
  SpotlightAtAGlance,
  SpotlightLabels,
  SpotlightMedia,
} from "@/components/spotlight/SpotlightParts";
import { Breadcrumbs } from "@/components/stories/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import { getAreaLabel, regionMap } from "@/content/areas";
import { getBusiness } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import { currentSpotlight, formatSpotlightMonth, spotlights } from "@/content/spotlights";
import { stories } from "@/content/stories";
import type { Business, Spotlight } from "@/content/types";
import { MarkdownLite } from "@/lib/markdown-lite";
import { site, ogBase } from "@/lib/site";

const current = (() => {
  const business = currentSpotlight ? getBusiness(currentSpotlight.businessSlug) : undefined;
  return currentSpotlight && business ? { spotlight: currentSpotlight, business } : undefined;
})();

const archive = spotlights
  .filter((s) => s !== current?.spotlight)
  .map((s) => ({ spotlight: s, business: getBusiness(s.businessSlug) }))
  .filter((x): x is { spotlight: Spotlight; business: Business } => !!x.business);

const description = current
  ? `This month's Business Spotlight: ${current.spotlight.headline}. Browse past spotlights, nominate a Black-owned business and find out about Spotlight packages.`
  : "Every month Black Owned Sheffield shines a light on one Black-owned business. Nominate a business, browse past spotlights and find out about Spotlight packages.";

const ogImage = current ? (current.spotlight.image ?? current.business.cover) : undefined;

export const metadata: Metadata = {
  title: "Business Spotlight",
  description,
  alternates: { canonical: "/spotlight" },
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/spotlight",
    title: `Business Spotlight | ${site.name}`,
    description,
    images: ogImage
      ? [{ url: ogImage, alt: `${current!.business.name}: Business Spotlight` }]
      : ogBase.images,
  },
  twitter: { card: "summary_large_image", title: "Business Spotlight", description },
};

const steps = [
  {
    Icon: Vote,
    title: "Nominate",
    text: "Anyone can nominate a Black-owned business in Sheffield, Rotherham, Doncaster or Chesterfield. Owners can put themselves forward too.",
    color: "bg-pink",
  },
  {
    Icon: Award,
    title: "One business a month",
    text: "The BOS team picks a business from the nominations each month and gets to know the people behind it.",
    color: "bg-sunflower",
  },
  {
    Icon: PenLine,
    title: "Featured here",
    text: "Their story goes up on this page and in Stories & news, linked straight to their directory profile.",
    color: "bg-tangerine",
  },
  {
    Icon: Share2,
    title: "Shared everywhere",
    text: "We share the feature across our Instagram and TikTok, and it stays in the Spotlight archive for good.",
    color: "bg-latte",
  },
];

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function SpotlightPage() {
  const paragraphs = current ? splitParagraphs(current.spotlight.story) : [];
  const breakAt = Math.min(2, Math.max(1, Math.ceil(paragraphs.length / 2)));
  const storyLink = current
    ? stories.find((s) => s.category === "business-of-the-month" && s.relatedBusinesses?.includes(current.business.slug))
    : undefined;

  return (
    <>
      {/* ───────── Masthead ───────── */}
      <section className="grain relative overflow-hidden bg-espresso pt-10 pb-28 text-cream sm:pt-14 sm:pb-36">
        <Sunburst color="#f6bd3c" className="absolute -top-24 -right-20 h-48 w-48 animate-spin-slow opacity-80 sm:-top-24 sm:-right-24 sm:h-64 sm:w-64 sm:opacity-90" />
        <Blob color="#55321f" className="absolute -bottom-32 -left-24 h-96 w-96 opacity-80" />
        <Squiggle color="#f2a0bd" className="absolute right-10 bottom-32 hidden h-8 w-28 lg:block" />
        <Dots color="#167a6f" className="absolute top-24 left-[52%] hidden h-12 w-12 opacity-80 lg:block" />
        <Container className="relative">
          <Breadcrumbs dark crumbs={[{ label: "Business Spotlight" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <Eyebrow dark>
                {current ? `${formatSpotlightMonth(current.spotlight.month)} · Black Business of the Month` : "Black Business of the Month"}
              </Eyebrow>
              <h1 className="mt-5">
                <span className="block text-[clamp(2.6rem,9.5vw,7.25rem)] leading-[0.92]">
                  <ToneText onDark>Business</ToneText>
                </span>
                <span className="mt-3 block sm:mt-4">
                  <PinkSticker className="rounded-2xl px-4 text-[clamp(2.4rem,9vw,6.75rem)] leading-[1.08] shadow-[5px_5px_0_0_var(--color-sunflower)] sm:px-6">
                    Spotlight
                  </PinkSticker>
                </span>
              </h1>
            </div>
            <div className="max-w-md">
              <p className="text-lg leading-relaxed text-cream/85">
                Every month, one Black-owned business gets the full treatment: a feature here, shared across Instagram
                and TikTok, and a place in our archive for good.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="#nominate" variant="pink" icon={<Vote className="h-4 w-4" aria-hidden />}>
                  Nominate a business
                </ButtonLink>
                <ButtonLink href="#packages" variant="cream" icon={<ArrowDown className="h-4 w-4" aria-hidden />}>
                  Spotlight packages
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {current ? (
        <>
          {/* ───────── This month's feature ───────── */}
          <section aria-labelledby="spotlight-headline" className="relative -mt-16 sm:-mt-20">
            <Container>
              <article className="overflow-hidden rounded-[2rem] border-2 border-espresso bg-cream shadow-pop">
                {/* The cover stays clear: real covers often carry the business's own logo and text */}
                <SpotlightMedia
                  spotlight={current.spotlight}
                  business={current.business}
                  priority
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="aspect-[1200/630] border-b-2 border-espresso"
                />

                <div className="grid gap-8 px-5 pt-7 pb-8 sm:px-10 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-xl border-2 border-espresso bg-sunflower px-3 py-1 font-display text-base text-espresso shadow-pop-sm sm:text-lg">
                        <Sparkles className="h-4 w-4" aria-hidden />
                        {formatSpotlightMonth(current.spotlight.month)}
                      </span>
                      <SpotlightLabels spotlight={current.spotlight} />
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <BusinessLogo business={current.business} size={64} className="shadow-pop-sm" />
                      <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-semibold text-cocoa">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1 text-rose-ink">
                          <CategoryIcon id={current.business.category} className="h-4 w-4" />
                          {categoryMap[current.business.category].label}
                        </span>
                        <span>
                          {current.business.onlineOnly
                            ? "Online"
                            : `${getAreaLabel(current.business.area)}, ${regionMap[current.business.region].label}`}
                        </span>
                      </p>
                    </div>
                    <h2
                      id="spotlight-headline"
                      className="mt-5 font-heading text-3xl leading-[1.04] font-extrabold text-espresso sm:text-5xl lg:text-[3.4rem]"
                    >
                      {current.spotlight.headline}
                    </h2>
                  </div>
                  <div className="lg:pt-[7.5rem]">
                    <p className="text-lg leading-relaxed text-cocoa sm:text-xl">{current.spotlight.intro}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonLink
                        href={`/directory/${current.business.slug}`}
                        variant="primary"
                        size="lg"
                        iconRight={<ArrowUpRight className="h-5 w-5" aria-hidden />}
                      >
                        View profile
                      </ButtonLink>
                      {current.business.contact.website && (
                        <ButtonLink href={current.business.contact.website} variant="outline" size="lg">
                          Visit website
                          <span className="sr-only"> (opens in a new tab)</span>
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Container>
          </section>

          {/* ───────── The story ───────── */}
          <Section className="pt-14 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="min-w-0 lg:col-span-7">
                <Eyebrow>The story</Eyebrow>
                <h2 className="mt-3 font-heading text-3xl font-extrabold text-espresso sm:text-4xl">
                  Why {current.business.name}?
                </h2>
                <MarkdownLite source={paragraphs.slice(0, breakAt).join("\n\n")} dropCap className="mt-6" />
                {current.spotlight.quote && (
                  <PullQuote
                    text={current.spotlight.quote.text}
                    by={current.spotlight.quote.by}
                    className="my-10 lg:-mr-6 lg:-ml-4 2xl:-ml-10"
                  />
                )}
                <MarkdownLite source={paragraphs.slice(breakAt).join("\n\n")} />

                <div className="mt-10 flex flex-wrap items-center gap-3 border-t-2 border-espresso/10 pt-6">
                  {/* Own line on phones so the buttons line up beneath it */}
                  <span className="w-full font-heading text-sm font-bold text-espresso sm:w-auto">Follow the Spotlight:</span>
                  <ButtonLink href={site.socials.instagram} variant="outline" icon={<InstagramIcon size={18} />}>
                    Instagram
                  </ButtonLink>
                  <ButtonLink href={site.socials.tiktok} variant="outline" icon={<TikTokIcon size={18} />}>
                    TikTok
                  </ButtonLink>
                  {storyLink && (
                    <ButtonLink href={`/stories/${storyLink.slug}`} variant="ghost">
                      Read it in Stories & news
                    </ButtonLink>
                  )}
                </div>
              </div>
              <aside aria-label={`${current.business.name} at a glance`} className="lg:col-span-4 lg:col-start-9">
                <SpotlightAtAGlance business={current.business} className="lg:sticky lg:top-24" />
              </aside>
            </div>
          </Section>
        </>
      ) : (
        <section className="relative -mt-16 sm:-mt-20">
          <Container>
            <div className="rounded-[2rem] border-2 border-espresso bg-cream p-8 text-center shadow-pop sm:p-12">
              <Megaphone className="mx-auto h-10 w-10 text-rose" aria-hidden />
              <h2 className="mt-4 font-heading text-3xl font-extrabold text-espresso">Our next Spotlight is on its way</h2>
              <p className="mx-auto mt-3 max-w-xl text-lg text-cocoa">
                Know a business that deserves it? Nominate them below.
              </p>
            </div>
          </Container>
        </section>
      )}

      <StripeBand />

      {/* ───────── Archive ───────── */}
      <Section tone="deep" id="archive">
        <SectionHeading
          eyebrow="The archive"
          title="Past spotlights"
          description="Every featured business keeps its place here, long after its month is over."
          action={
            <ButtonLink href="/directory" variant="outline">
              Browse the directory
            </ButtonLink>
          }
        />
        {archive.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map(({ spotlight, business }) => (
              <li key={spotlight.month}>
                <SpotlightArchiveCard spotlight={spotlight} business={business} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-white/60 p-8 text-cocoa">
            The archive starts here. Past spotlights will appear as each month goes by.
          </p>
        )}
        {archive.some((a) => a.spotlight.sponsored || a.spotlight.sample) && (
          <p className="mt-6 flex items-start gap-2 text-sm text-cocoa">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-caramel" aria-hidden />
            <span>
              {archive.some((a) => a.spotlight.sponsored) && "Spotlights marked “Sponsored” are paid features. "}
              {archive.some((a) => a.spotlight.sample) && "Entries marked “Sample” are demonstration content, not real features."}
            </span>
          </p>
        )}
      </Section>

      {/* ───────── How it works ───────── */}
      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How the Spotlight works"
          title="From nomination to the spotlight"
          description="The Community Spotlight is free. It's how we say thank you to the businesses that make Black Sheffield what it is."
        />
        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute top-8 right-[12%] left-[12%] hidden border-t-2 border-dashed border-espresso/30 lg:block"
          />
          {steps.map(({ Icon, title, text, color }, i) => (
            <li key={title} className="relative rounded-[1.5rem] border-2 border-espresso bg-white p-6">
              <div className="flex items-center gap-3">
                <span
                  className={`relative inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-espresso font-display text-3xl text-espresso ${color}`}
                >
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-cocoa" aria-hidden />
              </div>
              <h3 className="mt-5 font-heading text-xl font-extrabold text-espresso">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{text}</p>
              {i === 0 && (
                <Link
                  href="#nominate"
                  className="mt-3 inline-flex min-h-11 items-center gap-1 font-heading text-sm font-bold text-rose-ink underline decoration-2 underline-offset-4"
                >
                  Nominate now
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* ───────── Packages ───────── */}
      <Section id="packages" tone="pink" className="scroll-mt-20 overflow-clip">
        <Blob color="#f2a0bd" className="absolute top-10 -right-24 h-72 w-72 opacity-50" />
        <div className="relative">
          <SectionHeading
            eyebrow="Spotlight packages"
            title="Free for the community. More reach if you want it."
            description="The Community Spotlight is free and chosen from nominations. Paid packages are coming in 2027 for businesses that want to pick their moment."
          />
          <SpotlightPackages />
        </div>
      </Section>

      {/* ───────── Nominate ───────── */}
      <Section id="nominate" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <Eyebrow>Nominate a business</Eyebrow>
            <h2 className="mt-3 font-heading text-4xl leading-[1.02] font-extrabold text-espresso sm:text-5xl">
              Who deserves the <span className="font-display text-rose-ink">spotlight?</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cocoa">
              Your favourite barber, the caterer who smashed your party, the tutor who changed your kid&apos;s year. If
              they&apos;re Black-owned and based in Sheffield, Rotherham, Doncaster or Chesterfield, tell us about them.
            </p>
            <div className="mt-8 rounded-[1.5rem] border-2 border-espresso bg-sunflower p-6">
              <h3 className="font-heading text-lg font-extrabold text-espresso">What helps</h3>
              <ul className="mt-3 space-y-2 text-[15px] text-espresso/85">
                {[
                  "What makes them special, in your own words",
                  "Where to find them: Instagram, TikTok or a website",
                  "Owners: yes, you can nominate yourself",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-espresso" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-sm text-cocoa">
              Not listed in the directory yet?{" "}
              <Link href="/join/business" className="font-semibold text-rose-ink underline decoration-2 underline-offset-4">
                Join for free
              </Link>
              .
            </p>
          </div>
          <NominationForm />
        </div>
      </Section>

      {current && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: current.spotlight.headline.slice(0, 110),
            description: current.spotlight.intro,
            datePublished: `${current.spotlight.month}-01`,
            inLanguage: "en-GB",
            articleSection: "Business Spotlight",
            url: `${site.url}/spotlight`,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/spotlight` },
            image: ogImage ? [`${site.url}${ogImage}`] : undefined,
            author: { "@type": "Organization", name: site.name, url: site.url },
            publisher: {
              "@type": "Organization",
              name: site.legalName,
              logo: { "@type": "ImageObject", url: `${site.url}/brand/bos-logo.jpg` },
            },
            about: {
              "@type": "LocalBusiness",
              name: current.business.name,
              url: `${site.url}/directory/${current.business.slug}`,
            },
          }}
        />
      )}
    </>
  );
}
