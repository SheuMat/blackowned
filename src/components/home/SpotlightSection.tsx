import { ArrowRight, ArrowUpRight, MapPin, Megaphone, Quote } from "lucide-react";
import { SpotlightCarousel, type CarouselSlide } from "./SpotlightCarousel";
import { BusinessCover, BusinessLogo } from "@/components/cards/BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Blob, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { ToneText } from "@/components/ui/ToneText";
import { getAreaLabel } from "@/content/areas";
import { getBusiness } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import { currentSpotlight, formatSpotlightMonth, spotlights } from "@/content/spotlights";
import type { Business, Spotlight } from "@/content/types";

/** "2026-11" for the current month in Sheffield, to match Spotlight.month */
function londonMonth(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}`;
}

function SpotlightSlide({
  spotlight,
  business,
  isCurrent,
  thisMonth,
}: {
  spotlight: Spotlight;
  business: Business;
  isCurrent: boolean;
  /** True when the spotlight's month is the current month (it can lag if a new one isn't in yet) */
  thisMonth: boolean;
}) {
  const cat = categoryMap[business.category];
  const month = formatSpotlightMonth(spotlight.month);
  // A spotlight photo always fills the frame; a contained cover is a share card that carries its own logo
  const coverBusiness = spotlight.image ? { ...business, cover: spotlight.image, coverFit: "cover" as const } : business;
  const showLogoTile = coverBusiness.coverFit !== "contain";

  return (
    <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
      <div className="relative px-1 pt-5 pb-8 sm:px-3">
        <div className="relative -rotate-[1.5deg] overflow-hidden rounded-[1.75rem] border-2 border-cream bg-cream shadow-[8px_8px_0_0_var(--color-pink)]">
          <BusinessCover
            business={coverBusiness}
            className="aspect-[40/21] w-full"
            sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <span className="absolute top-0 left-5 inline-block -rotate-3 rounded-xl border-2 border-espresso bg-sunflower px-3 py-1 font-display text-base text-espresso shadow-pop-sm sm:left-8 sm:text-lg">
          {month}
        </span>
        {showLogoTile && (
          <BusinessLogo business={business} size={76} className="absolute right-5 bottom-0 rotate-3 shadow-lift sm:right-8" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-pink px-3 py-1 text-xs font-bold text-espresso">
            {isCurrent ? (thisMonth ? "This month\u2019s spotlight" : "Latest spotlight") : "From the archive"}
          </span>
          {spotlight.sponsored && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cream/40 px-2.5 py-1 text-xs font-bold text-cream">
              <Megaphone className="h-3.5 w-3.5" aria-hidden />
              Sponsored
            </span>
          )}
          {(spotlight.sample || business.sample) && (
            <span className="rounded-full bg-cream/15 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-cream uppercase">
              Sample
            </span>
          )}
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-cream/75">
          <span className="inline-flex items-center gap-1.5">
            <CategoryIcon id={business.category} className="h-4 w-4 text-pink" />
            {cat.label}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-pink" aria-hidden />
            {business.onlineOnly ? "Online" : getAreaLabel(business.area)}
          </span>
        </p>

        <h3 className="mt-3 font-heading text-3xl leading-[1.08] font-extrabold text-cream sm:text-4xl">{spotlight.headline}</h3>
        <p className="mt-4 text-lg leading-relaxed text-cream/80">{spotlight.intro}</p>

        {spotlight.quote && (
          <figure className="mt-6 rounded-2xl border-l-4 border-pink bg-cream/5 py-4 pr-4 pl-5">
            <Quote className="h-6 w-6 text-pink" aria-hidden />
            <blockquote className="mt-2 font-heading text-xl leading-snug font-bold text-cream sm:text-2xl">
              &ldquo;{spotlight.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm font-semibold text-cream/70">{spotlight.quote.by}</figcaption>
          </figure>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink
            href={`/directory/${business.slug}`}
            variant="pink"
            size="lg"
            iconRight={<ArrowUpRight className="h-5 w-5" aria-hidden />}
          >
            Visit {business.name}
          </ButtonLink>
          <ButtonLink
            href={isCurrent ? "/spotlight" : "/spotlight#archive"}
            variant="cream"
            size="lg"
            iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}
          >
            Read the story
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function SpotlightSection() {
  // The page revalidates hourly, so "this month" stays accurate without client code
  const month = londonMonth(new Date());
  const ordered = currentSpotlight
    ? [currentSpotlight, ...spotlights.filter((s) => s !== currentSpotlight)]
    : spotlights;

  const slides: CarouselSlide[] = ordered.flatMap((s) => {
    const business = getBusiness(s.businessSlug);
    if (!business) return [];
    return [
      {
        key: `${s.month}-${s.businessSlug}`,
        label: `${business.name}, ${formatSpotlightMonth(s.month)}`,
        content: (
          <SpotlightSlide
            spotlight={s}
            business={business}
            isCurrent={s === currentSpotlight}
            thisMonth={s.month === month}
          />
        ),
      },
    ];
  });

  if (slides.length === 0) return null;

  return (
    <section aria-labelledby="spotlight-title" className="grain relative overflow-clip bg-espresso text-cream">
      <StripeBand />
      <Sunburst color="#f6bd3c" className="absolute -top-16 -left-16 h-56 w-56 animate-spin-slow opacity-20" />
      <Blob color="#55321f" className="absolute -right-32 -bottom-40 h-[30rem] w-[30rem] opacity-70" />
      <Squiggle color="#f2a0bd" className="absolute top-24 right-[8%] hidden h-8 w-28 opacity-60 lg:block" />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between sm:mb-14">
          <div className="max-w-3xl">
            <Eyebrow dark>Black Business of the Month</Eyebrow>
            <h2 id="spotlight-title" className="mt-4 leading-[0.98]">
              <ToneText onDark className="block text-[clamp(2.3rem,9.5vw,5.25rem)]">
                BUSINESS
              </ToneText>{" "}
              <span className="mt-1 inline-block -rotate-2 rounded-2xl bg-pink px-4 pt-1 pb-2 font-display text-[clamp(2.3rem,9.5vw,5.25rem)] leading-none text-espresso shadow-[4px_4px_0_0_var(--color-cream)]">
                SPOTLIGHT
              </span>
            </h2>
            <p className="mt-6 font-heading text-xl font-bold text-cream sm:text-2xl">
              Meet this month&rsquo;s featured Sheffield business
            </p>
          </div>
          <ButtonLink
            href="/spotlight#packages"
            variant="cream"
            className="self-start md:self-auto"
            iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
          >
            Get your business spotlighted
          </ButtonLink>
        </div>

        <SpotlightCarousel label="Spotlight businesses" slides={slides} />
      </Container>
    </section>
  );
}
