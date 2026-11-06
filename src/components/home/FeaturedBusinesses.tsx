import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/layout";
import { businesses, featuredBusinesses } from "@/content/businesses";

/** Featured listings first, topped up with the newest, six in all. */
export function FeaturedBusinesses() {
  const featuredSlugs = new Set(featuredBusinesses.map((b) => b.slug));
  const newest = [...businesses]
    .filter((b) => !featuredSlugs.has(b.slug))
    .sort((a, b) => Number(!!a.sample) - Number(!!b.sample) || b.joined.localeCompare(a.joined));
  const list = [...featuredBusinesses, ...newest].slice(0, 6);

  if (list.length === 0) return null;

  return (
    <Section tone="cream" id="featured" className="scroll-mt-[72px]">
      <SectionHeading
        eyebrow="In the directory"
        title="Featured businesses"
        description="Featured listings and the newest arrivals. Every profile has contact details, opening hours and any offers in one place."
        action={
          <ButtonLink href="/directory" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Browse the full directory
          </ButtonLink>
        }
      />
      {/* Swipeable row on phones, grid from tablet up. The row reveals as one piece:
          cards off to the side never scroll into view vertically, so they'd stay hidden. */}
      <Reveal>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pt-1 pb-4 scrollbar-none sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 lg:grid-cols-3">
          {list.map((b) => (
            <li key={b.slug} className="w-[84%] shrink-0 snap-start sm:w-auto">
              <BusinessCard business={b} />
            </li>
          ))}
        </ul>
      </Reveal>
      <p className="mt-2 text-center text-xs font-medium text-cocoa/80 sm:hidden" aria-hidden>
        Swipe for more
      </p>
    </Section>
  );
}
