import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/cards/EventCard";
import { Section, SectionHeading } from "@/components/ui/layout";
import { Squiggle } from "@/components/ui/Shapes";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import type { BosEvent } from "@/content/types";
import { cn, dateParts } from "@/lib/utils";
import { eventPath } from "./eventUtils";

/** "Where we've been": past events grouped by year, with any recap videos */
export function PastEvents({ past }: { past: BosEvent[] }) {
  if (past.length === 0) return null;
  const withVideo = past.filter((e) => e.video);
  const years = new Map<string, BosEvent[]>();
  for (const e of past) {
    const y = dateParts(e.start).year;
    years.set(y, [...(years.get(y) ?? []), e]);
  }
  const firstYear = [...years.keys()].sort()[0];
  const hasVideo = withVideo.length > 0;

  return (
    <Section tone="espresso" id="past-events" className="grain">
      <Squiggle color="#f2a0bd" className="absolute top-14 right-[8%] hidden h-10 w-32 opacity-80 md:block" />
      <SectionHeading
        dark
        eyebrow="Our track record"
        title="Where we've been"
        description={`A look back at the markets, pop-ups and parties we've put on or been part of${firstYear ? ` since ${firstYear}` : ""}. Thank you to everyone who came along and traded with us.`}
      />

      {/* Side by side only from xl: at lg the year column leaves the cards too narrow */}
      <div className={cn("grid gap-12", hasVideo && "xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14")}>
        {hasVideo && (
          <div className="space-y-6 lg:max-w-3xl xl:sticky xl:top-28 xl:col-start-2 xl:row-start-1 xl:max-w-none xl:self-start">
            {withVideo.map((e) => (
              <figure key={e.slug} className="rounded-[1.75rem] border-2 border-cream/15 bg-cream/5 p-3 sm:p-4">
                {/* The thumbnail already carries the film's title and the caption names the event */}
                <YouTubeEmbed id={e.video!.youtubeId} title={e.video!.title} showTitle={false} />
                <figcaption className="flex flex-wrap items-center justify-between gap-3 px-1 pt-4 pb-1">
                  <span>
                    <span className="block font-heading text-xs font-bold uppercase tracking-[0.18em] text-pink">
                      Watch the recap
                    </span>
                    <span className="mt-1 block font-heading text-lg font-extrabold text-cream">{e.title}</span>
                  </span>
                  <Link
                    href={eventPath(e)}
                    className="inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-cream underline decoration-pink decoration-2 underline-offset-4 hover:decoration-4"
                  >
                    About the event
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <ol className="space-y-10 xl:col-start-1 xl:row-start-1">
          {[...years.entries()].map(([year, list]) => (
            <li key={year} className="grid gap-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6">
              <h3 className="font-display text-5xl leading-none text-sunflower sm:sticky sm:top-28 sm:self-start">
                {year}
              </h3>
              {/* Cards sit on cream, so reset the section's cream text colour for them */}
              <ul className={cn("grid gap-4 text-espresso lg:grid-cols-2", hasVideo && "xl:grid-cols-1")}>
                {list.map((e) => (
                  <li key={e.slug}>
                    <EventCard event={e} past className="h-full bg-cream text-espresso" headingAs="h4" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
