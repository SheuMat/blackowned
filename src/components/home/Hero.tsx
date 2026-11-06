import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroArt } from "./HeroArt";
import { HomeSearch } from "./HomeSearch";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Blob, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import { regions } from "@/content/areas";
import { businesses } from "@/content/businesses";
import { categories, categoryMap } from "@/content/categories";
import type { CategoryId } from "@/content/types";
import { site } from "@/lib/site";

const quickCategories: CategoryId[] = [
  "food-restaurants",
  "beauty-hair",
  "fashion",
  "health-wellbeing",
  "trades",
  "creative-industries",
];

// Below this many real listings the count looks thin, so the tile says listing is free instead
const LIVE_COUNT_THRESHOLD = 10;

export function Hero() {
  // Headline numbers count real listings only. Samples are mentioned separately.
  const liveCount = businesses.filter((b) => !b.sample).length;
  const sampleCount = businesses.length - liveCount;
  const showLiveCount = liveCount >= LIVE_COUNT_THRESHOLD;
  const stats = [
    showLiveCount
      ? { value: String(liveCount), label: "Live listings" }
      : { value: "Free", label: "To list your business" },
    { value: String(categories.length), label: "Categories" },
    { value: String(regions.length), label: "Towns covered" },
    { value: String(site.founded), label: "Established" },
  ];

  return (
    <section aria-labelledby="home-hero-title" className="grain relative overflow-clip bg-cream-deep">
      {/* Background decoration */}
      <Blob color="#fadbe6" className="absolute -top-32 -right-40 h-[26rem] w-[26rem] opacity-80 lg:-right-24 lg:h-[34rem] lg:w-[34rem]" />
      <Sunburst color="#f6bd3c" className="absolute top-6 -right-8 h-24 w-24 animate-spin-slow opacity-90 lg:hidden" />
      <div aria-hidden className="dot-grid absolute inset-y-0 left-0 w-1/3 opacity-60 [mask-image:linear-gradient(to_right,black,transparent)]" />

      <Container className="relative grid items-center gap-12 pt-10 pb-14 sm:pt-14 sm:pb-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="min-w-0">
          <Eyebrow>
            {/* BOS started in 2020; the CIC itself was incorporated in 2024 */}
            Since {site.founded} · <span className="sm:hidden">CIC</span>
            <span className="hidden sm:inline">Community Interest Company</span>
          </Eyebrow>

          <h1
            id="home-hero-title"
            className="mt-5 font-heading text-[2.5rem] leading-[1.02] font-extrabold text-espresso sm:text-6xl lg:text-[4.1rem] xl:text-7xl"
          >
            <PinkSticker className="mr-2 px-3 py-1 text-[0.86em] leading-none sm:mr-3">Sheffield&rsquo;s</PinkSticker>{" "}
            home for{" "}
            <ToneText className="my-1 block text-[clamp(2.85rem,12.8vw,6rem)] leading-[1.02] whitespace-nowrap lg:my-2 lg:text-[clamp(4rem,6.9vw,6.1rem)]">
              Black-owned
            </ToneText>{" "}
            business
          </h1>

          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa sm:text-xl">
            We&rsquo;re a Community Interest Company that finds, promotes and connects Black-owned businesses across
            Sheffield, Rotherham, Doncaster and Chesterfield. Search the directory, come to a market, or add your own
            business for free.
          </p>

          <HomeSearch className="mt-8 max-w-3xl" />

          <div className="scrollbar-none -mx-4 mt-5 flex items-center gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <span className="mr-1 shrink-0 text-sm font-semibold text-cocoa">Popular:</span>
            {quickCategories.map((id) => {
              const c = categoryMap[id];
              return (
                <Link
                  key={id}
                  href={`/directory?category=${id}`}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border-2 border-espresso/15 bg-white pr-4 pl-1.5 text-sm font-semibold text-espresso transition-all hover:-translate-y-0.5 hover:border-espresso hover:shadow-pop-sm"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: c.color, color: c.ink }}
                  >
                    <CategoryIcon id={id} className="h-4 w-4" />
                  </span>
                  {c.short}
                </Link>
              );
            })}
            <Link
              href="/directory"
              className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-bold whitespace-nowrap text-rose-ink underline-offset-4 hover:underline"
            >
              All {categories.length} categories
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border-2 border-espresso bg-espresso sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-cream px-4 py-3.5 sm:px-5">
                <dt className="text-xs font-semibold text-cocoa">{s.label}</dt>
                <dd className="font-display text-3xl leading-none text-espresso sm:text-[2rem]">{s.value}</dd>
              </div>
            ))}
          </dl>
          {sampleCount > 0 && (
            <p className="mt-2 text-xs text-cocoa/80">
              {showLiveCount ? "Plus" : `The directory has ${liveCount} live ${liveCount === 1 ? "listing" : "listings"} so far, plus`}{" "}
              {sampleCount} sample {sampleCount === 1 ? "listing" : "listings"} while we&rsquo;re in preview.
            </p>
          )}
        </div>

        <HeroArt className="hidden lg:block" />
      </Container>
    </section>
  );
}
