import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Gift, Info, PackageCheck, Store, Truck } from "lucide-react";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { GiftBoxArt } from "@/components/shop/GiftBoxArt";
import { InterestButton, ShopInterestForm } from "@/components/shop/ShopInterest";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Dots, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import { businesses, sortBusinesses } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import { giftBoxes, shopCategories, shopSteps } from "@/content/shop";
import { site, ogBase } from "@/lib/site";

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

export const metadata: Metadata = {
  title: "Shop Black Sheffield: buy Black, buy local",
  description:
    "Shop Black-owned businesses in Sheffield, Rotherham, Doncaster and Chesterfield. Find shops, food, fashion and beauty in the directory, and register interest in our Black-owned Sheffield gift boxes, coming soon.",
  alternates: { canonical: "/shop" },
  openGraph: {
    ...ogBase,
    title: "Shop Black Sheffield | Black Owned Sheffield",
    description: "Buy Black, buy local. Shop the directory now, and register interest in our gift boxes.",
    url: "/shop",
    // Pages that set openGraph replace the inherited one, so point at the default image explicitly
    images: [ogImage],
  },
  // Likewise for twitter: without this the card shows the site-wide title and description
  twitter: {
    card: "summary_large_image",
    title: "Shop Black Sheffield | Black Owned Sheffield",
    description: "Buy Black, buy local. Shop the directory now, and register interest in our gift boxes.",
    images: [ogImage],
  },
};

export default function ShopPage() {
  // Each business appears once: in its main category if that's one of ours,
  // otherwise in the first shop category it lists as a secondary.
  const shopIds = shopCategories.map((c) => c.id);
  const home = (b: (typeof businesses)[number]) =>
    shopIds.includes(b.category) ? b.category : shopIds.find((id) => b.secondaryCategories?.includes(id));
  const sections = shopCategories.map((c) => {
    const list = sortBusinesses(businesses.filter((b) => home(b) === c.id));
    return { ...c, category: categoryMap[c.id], list };
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Shop Black Sheffield" }]}
        eyebrow="Shop Black Sheffield"
        accent="tangerine"
        title={
          <>
            Buy <ToneText pop className="text-[1.04em]">Black</ToneText>, buy <PinkSticker className="px-4 text-[0.9em]">local</PinkSticker>
          </>
        }
        description={
          <p>
            Find something brilliant from a Black-owned business near you. For now you buy direct from each business, and we
            point the way. Gift boxes are coming soon.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#shop-directory" variant="primary" size="lg" iconRight={<ArrowDown className="h-5 w-5" />}>
            Shop the directory
          </ButtonLink>
          <ButtonLink href="#gift-boxes" variant="outline" size="lg" icon={<Gift className="h-5 w-5" />}>
            See the gift boxes
          </ButtonLink>
        </div>
        <p className="mt-6 inline-flex max-w-xl items-start gap-2 rounded-2xl border-2 border-espresso/15 bg-cream px-4 py-3 text-sm text-cocoa">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
          <span>
            <strong className="text-espresso">No payments on this site yet.</strong> When you buy, you&apos;re buying straight
            from the business, on their own website or socials.
          </span>
        </p>
      </PageHero>
      <StripeBand />

      {/* ───────── Gift boxes ───────── */}
      <Section id="gift-boxes" className="scroll-mt-20 overflow-hidden">
        <Dots color="#ee6a35" className="absolute top-14 right-6 hidden h-14 w-14 opacity-60 sm:block" />
        <SectionHeading
          eyebrow="Gift boxes: coming soon"
          title={
            <>
              A box full of <ToneText pop className="whitespace-nowrap">Black-owned</ToneText> Sheffield
            </>
          }
          description="We're putting together gift boxes filled by businesses from the directory. Here's what we have in mind. Tell us which you'd buy and we'll make those first."
        />
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {giftBoxes.map((box) => (
            <li key={box.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
                <div className="relative aspect-[4/3] border-b-2 border-espresso">
                  <GiftBoxArt box={box} />
                  <span className="absolute top-3 left-3 -rotate-3 rounded-full border-2 border-espresso bg-sunflower px-3 py-1 font-heading text-xs font-bold text-espresso shadow-pop-sm">
                    Coming soon
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-ink">{box.tagline}</p>
                  <h3 className="mt-1.5 font-heading text-xl font-extrabold leading-tight text-espresso">{box.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{box.description}</p>
                  <h4 className="mt-5 font-heading text-sm font-bold text-espresso">What might be inside</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-cocoa">
                    {box.inside.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: box.art.box }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm text-cocoa">
                    <p className="flex items-center gap-2">
                      <Truck className="h-4 w-4 shrink-0 text-teal" aria-hidden />
                      Deliver or collect from our office at {site.office.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 shrink-0 text-teal" aria-hidden />
                      Price to be confirmed
                    </p>
                  </div>
                  <div className="mt-auto pt-5">
                    <InterestButton boxId={box.id} className={buttonClasses({ variant: "outline", size: "md", className: "w-full" })}>
                      Register interest <span className="sr-only">in {box.name}</span>
                    </InterestButton>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-cocoa/90">
          Box contents are ideas for now. We&apos;ll only include products from businesses who&apos;ve agreed to take part.
        </p>
      </Section>

      {/* ───────── How it will work ───────── */}
      <Section tone="espresso" className="overflow-hidden">
        <Sunburst color="#f2a0bd" className="absolute -top-14 -right-14 h-48 w-48 animate-spin-slow opacity-70" />
        <SectionHeading
          dark
          eyebrow="How the shop will work"
          title="From their hands to yours"
          description="Here's the plan. We'll test it with a small first run and tell you what we learn."
        />
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shopSteps.map((step, i) => (
            <li key={step.title} className="relative rounded-[1.5rem] border-2 border-cream/15 bg-cream/5 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso bg-pink font-display text-xl text-espresso">
                {i + 1}
              </span>
              <h3 className="mt-4 font-heading text-lg font-extrabold text-cream">{step.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-cream/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ───────── Register interest ───────── */}
      <Section id="register" tone="pink" className="scroll-mt-20 overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              className="mb-6 sm:mb-8"
              eyebrow="Register interest"
              title="Want first dibs?"
              description="Tell us which boxes you'd buy and how many. It takes a minute, costs nothing, and helps us decide what to make."
            />
            <ul className="space-y-3 text-[15px] text-espresso">
              {[
                "Be first to hear when boxes launch",
                "Help shape what goes inside",
                "Teams and companies: ask about branded and bulk orders",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower text-xs font-bold">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border-2 border-espresso bg-white p-4 text-sm text-cocoa">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-rose-ink" aria-hidden />
              <p>
                <strong className="text-espresso">Collect in person</strong> from our office at {site.office.name},{" "}
                {site.office.address}, or have it delivered.
              </p>
            </div>
          </div>
          <ShopInterestForm />
        </div>
      </Section>

      {/* ───────── Shop the directory ───────── */}
      <Section id="shop-directory" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Shop the directory"
          title="Buy Black today"
          description="You don't have to wait for a box. Every business below has a profile with their website, socials and how to buy."
          action={
            <ButtonLink href="/directory" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
              Browse the full directory
            </ButtonLink>
          }
        />
        <nav aria-label="Shop by category" className="-mt-4 mb-10">
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#shop-${s.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: s.category.color, color: s.category.ink }}>
                    <CategoryIcon id={s.id} className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {s.title}
                  <span className="text-cocoa/70">({s.list.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14">
          {sections.map((s) => (
            <section key={s.id} id={`shop-${s.id}`} aria-labelledby={`shop-${s.id}-title`} className="scroll-mt-24">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-espresso pb-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso"
                    style={{ backgroundColor: s.category.color, color: s.category.ink }}
                  >
                    <CategoryIcon id={s.id} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 id={`shop-${s.id}-title`} className="font-heading text-2xl font-extrabold leading-tight text-espresso">
                      {s.title}
                    </h3>
                    <p className="text-sm text-cocoa">{s.blurb}</p>
                  </div>
                </div>
                <Link
                  href={`/directory/category/${s.id}`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:decoration-rose"
                >
                  All {s.category.label.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              {s.list.length > 0 ? (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {s.list.slice(0, 3).map((b) => (
                    <li key={b.slug}>
                      <BusinessCard business={b} headingAs="h4" />
                    </li>
                  ))}
                  {s.list.length < 3 && (
                    <li>
                      <Link
                        href="/join/business"
                        className="group flex h-full min-h-56 flex-col justify-between rounded-[1.5rem] border-2 border-dashed border-espresso/35 bg-cream-deep p-6 transition-all hover:-translate-y-1 hover:border-espresso hover:bg-blush"
                      >
                        <span
                          aria-hidden
                          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso"
                          style={{ backgroundColor: s.category.color, color: s.category.ink }}
                        >
                          <CategoryIcon id={s.id} className="h-6 w-6" />
                        </span>
                        <span>
                          <span className="block font-heading text-xl font-extrabold leading-tight text-espresso">
                            Your business here?
                          </span>
                          <span className="mt-1.5 block text-[15px] leading-relaxed text-cocoa">
                            Black-owned and selling in {s.title.toLowerCase()}? Listing is free and takes a few minutes.
                          </span>
                          <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-espresso">
                            Join the directory
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </span>
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-cream-deep p-6 text-cocoa">
                  <p className="font-heading text-lg font-bold text-espresso">No listings here yet.</p>
                  <p className="mt-1 text-[15px]">
                    Know a Black-owned business that fits?{" "}
                    <Link href="/join/business" className="font-semibold text-rose-ink underline underline-offset-2">
                      Tell them it&apos;s free to join
                    </Link>
                    .
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
        {businesses.some((b) => b.sample) && (
          <p className="mt-10 text-sm text-cocoa/90">
            Listings tagged &ldquo;Sample&rdquo; are demonstration businesses while the site is in preview.
          </p>
        )}
      </Section>

      <CtaBand
        tone="sunflower"
        className="pt-0 sm:pt-0"
        title="Make something people would love in a box?"
        description="If you run a Black-owned business and sell products, list with us for free and tell us you'd like to be part of the gift boxes."
        actions={
          <>
            <ButtonLink href="/join/business" variant="primary" size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
              List your business
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Get in touch
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
