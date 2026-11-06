import Link from "next/link";
import { ArrowRight, Map as MapIcon, MapPin } from "lucide-react";
import { MapTeaserArt, type TeaserPin, type TeaserTown } from "./MapTeaserArt";
import { Reveal } from "./Reveal";
import { project } from "./mapGeo";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/layout";
import { Dots } from "@/components/ui/Shapes";
import { regions } from "@/content/areas";
import { businesses } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import type { CategoryId } from "@/content/types";

export function MapTeaser() {
  const mapped = businesses.filter((b) => b.coords);
  // Town counts are real listings only. Sample pins are drawn but not counted.
  const live = mapped.filter((b) => !b.sample);
  const sampleCount = mapped.length - live.length;

  // Draw north to south so lower pins sit on top of the ones behind them
  const pins: TeaserPin[] = mapped
    .map((b) => ({
      key: b.slug,
      ...project(b.coords!),
      color: categoryMap[b.category].color,
      highlight: !b.sample && b.tier === "featured",
    }))
    .sort((a, b) => a.y - b.y);

  const towns: TeaserTown[] = regions.map((r) => ({
    id: r.id,
    label: r.label,
    ...project(r.center),
    count: live.filter((b) => b.region === r.id).length,
  }));

  const legend = Array.from(new Set(mapped.map((b) => b.category))) as CategoryId[];
  const summary = towns.map((t) => `${t.count} in ${t.label}`).join(", ");

  return (
    <Section id="map" tone="cream" className="scroll-mt-[72px] overflow-clip">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            className="mb-8 sm:mb-8"
            eyebrow="The map"
            title={
              <>
                Discover <span className="whitespace-nowrap">Black-owned</span> businesses near you
              </>
            }
            description="From Kelham Island to Chesterfield, see who’s trading on your doorstep. Pick a town to jump straight in, or open the full map and explore."
          />
          <ul className="flex flex-wrap gap-2.5" aria-label="Open the map at a town">
            {towns.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/map?region=${t.id}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-espresso bg-white pr-2 pl-4 font-heading text-[15px] font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-blush hover:shadow-pop-sm"
                >
                  <MapPin className="h-4 w-4 text-rose" aria-hidden />
                  {t.label}{" "}
                  <span className="ml-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-espresso px-2 text-xs text-cream">
                    {t.count}
                    <span className="sr-only">{t.count === 1 ? " live listing" : " live listings"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/map" size="lg" icon={<MapIcon className="h-5 w-5" aria-hidden />} iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
              Open the full map
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <div className="relative">
            <Dots color="#ee6a35" className="absolute -top-6 -right-4 h-16 w-16 sm:-right-6" />
            <Link
              href="/map"
              className="group relative block overflow-hidden rounded-[2rem] border-2 border-espresso bg-cream-deep shadow-pop transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-espresso)]"
            >
              <span className="sr-only">
                Open the interactive map of Black-owned businesses. Live listings: {summary}.
              </span>
              <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
              <div className="relative mx-auto aspect-square w-full max-w-[640px] p-2 sm:p-4">
                <MapTeaserArt pins={pins} towns={towns} />
              </div>
              <span
                aria-hidden
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-3 py-1.5 text-xs font-bold text-espresso shadow-pop-sm"
              >
                <span className="h-2 w-2 rounded-full bg-teal" />
                {sampleCount > 0 ? `${live.length} live · ${sampleCount} sample` : `${mapped.length} on the map`}
              </span>
              <span
                aria-hidden
                className="absolute right-4 bottom-4 inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-pink px-4 font-heading text-sm font-bold text-espresso shadow-pop-sm transition-transform group-hover:-translate-y-0.5"
              >
                Explore the map
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Pin colours by category">
            {legend.map((id) => (
              <li key={id} className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa">
                <span
                  aria-hidden
                  className="h-3 w-3 rounded-full border border-espresso"
                  style={{ backgroundColor: categoryMap[id].color }}
                />
                {categoryMap[id].short}
              </li>
            ))}
          </ul>
          {sampleCount > 0 && (
            <p className="mt-2 text-xs text-cocoa/80">
              Town counts show live listings only. The other {sampleCount} {sampleCount === 1 ? "pin is a sample listing" : "pins are sample listings"} while we&rsquo;re in preview.
            </p>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
