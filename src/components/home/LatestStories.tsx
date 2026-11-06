import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { StoryCard } from "@/components/cards/StoryCard";
import { LogoBadge } from "@/components/brand/Logo";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Squiggle } from "@/components/ui/Shapes";
import { categories } from "@/content/categories";
import { stories } from "@/content/stories";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** A pretend phone screen: a tiny "feed" made of category tiles. Decorative. */
function PhoneFeed() {
  const tiles = categories.slice(0, 9);
  return (
    <div aria-hidden className="relative mx-auto w-[200px] rotate-3 rounded-[2.2rem] border-2 border-espresso bg-espresso p-2.5 shadow-pop sm:w-[240px]">
      <div className="overflow-hidden rounded-[1.7rem] bg-cream">
        <div className="flex items-center gap-2.5 border-b border-espresso/10 px-3.5 pt-5 pb-3">
          <LogoBadge size={38} />
          <div className="min-w-0">
            <p className="truncate font-heading text-[13px] font-extrabold text-espresso">{site.instagramHandle}</p>
            <p className="text-[11px] text-cocoa">{site.instagramFollowers} followers</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {tiles.map((c) => (
            <div key={c.id} className="flex aspect-square items-center justify-center" style={{ backgroundColor: c.color, color: c.ink }}>
              <CategoryIcon id={c.id} className="h-6 w-6 opacity-80" />
            </div>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

export function LatestStories() {
  const latest = stories.slice(0, 3);

  return (
    <Section tone="cream" id="stories" className="scroll-mt-[72px]">
      <SectionHeading
        eyebrow="Stories & news"
        title="Latest stories"
        description="Founder interviews, spotlights, guides and news from Black-owned Sheffield."
        action={
          <ButtonLink href="/stories" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            All stories
          </ButtonLink>
        }
      />

      {latest.length > 0 && (
        <>
          {/* Swipeable row on phones (like the featured businesses), grid from tablet up */}
          <Reveal>
            <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pt-1 pb-4 scrollbar-none sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 lg:grid-cols-3">
              {latest.map((s, i) => (
                <li key={s.slug} className={cn("w-[84%] shrink-0 snap-start sm:w-auto", i === 2 && "sm:hidden lg:block")}>
                  {/* 1200x630 panels: share-card images with text baked in show uncropped */}
                  <StoryCard story={s} imageClassName="aspect-[40/21]" />
                </li>
              ))}
            </ul>
          </Reveal>
          {latest.length > 1 && (
            <p className="mt-2 text-center text-xs font-medium text-cocoa/80 sm:hidden" aria-hidden>
              Swipe for more
            </p>
          )}
        </>
      )}

      <Reveal className="mt-12 sm:mt-16">
        <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-pink px-6 py-10 shadow-pop sm:px-10 lg:px-14 lg:py-12">
          <Blob color="#fadbe6" className="absolute -bottom-24 -left-20 h-72 w-72 opacity-70" />
          <Squiggle color="#2a1910" className="absolute top-8 right-[42%] hidden h-7 w-24 opacity-40 lg:block" />
          <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
            <div>
              <p className="font-heading text-xs font-bold tracking-[0.18em] text-espresso uppercase">Where it all started</p>
              <h3 className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl">
                Watch us on TikTok. Find us on Instagram.
              </h3>
              <p className="mt-4 max-w-xl text-lg text-espresso">
                Black Owned Sheffield began in {site.founded} as a free Instagram page. It&rsquo;s still the quickest way
                to see new businesses, market days and what we&rsquo;re up to next.
              </p>
              {/* Phones: TikTok full width, then Instagram and Facebook sharing a row */}
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  href={site.socials.tiktok}
                  size="lg"
                  icon={<TikTokIcon size={20} />}
                  className="w-full sm:w-auto"
                >
                  Watch on TikTok
                </ButtonLink>
                <div className="flex w-full gap-3 sm:w-auto">
                  <ButtonLink
                    href={site.socials.instagram}
                    variant="outline"
                    size="lg"
                    icon={<InstagramIcon size={20} />}
                    className="min-w-0 flex-1 px-4 sm:flex-none sm:px-7"
                  >
                    Follow on Instagram
                  </ButtonLink>
                  <a
                    href={site.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-white text-espresso transition-transform hover:-translate-y-0.5"
                  >
                    <FacebookIcon size={22} />
                    <span className="sr-only">Black Owned Sheffield on Facebook (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
            <PhoneFeed />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
