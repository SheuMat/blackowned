import { ArrowRight, CalendarHeart } from "lucide-react";
import { Reveal } from "./Reveal";
import { EventCard } from "@/components/cards/EventCard";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Squiggle, Sunburst } from "@/components/ui/Shapes";
import type { BosEvent } from "@/content/types";
import { site } from "@/lib/site";

export function UpcomingEvents({ events }: { events: BosEvent[] }) {
  return (
    <section aria-labelledby="events-title" className="relative overflow-clip bg-cream-deep py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-tangerine p-7 shadow-pop sm:p-10 lg:sticky lg:top-28">
              <Sunburst color="#f6bd3c" className="absolute -top-10 -right-10 h-40 w-40 animate-spin-slow" />
              <Squiggle color="#2a1910" className="absolute right-8 bottom-8 h-7 w-24 opacity-25" />
              <div className="relative">
                <Eyebrow className="text-espresso [&>span]:bg-espresso">What&rsquo;s on</Eyebrow>
                <h2 id="events-title" className="mt-3 font-heading text-4xl leading-[1.02] font-extrabold text-espresso sm:text-5xl">
                  Upcoming events
                </h2>
                <p className="mt-4 max-w-sm text-lg leading-relaxed text-espresso">
                  Markets, networking, workshops and socials. Come and meet the people behind{" "}
                  <span className="whitespace-nowrap">Black-owned</span> Sheffield.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/events" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                    See all events
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {events.length > 0 ? (
              <ul className="flex flex-col gap-4 sm:gap-5">
                {events.map((e, i) => (
                  <Reveal as="li" key={e.slug} delay={i * 0.08}>
                    <EventCard event={e} />
                  </Reveal>
                ))}
              </ul>
            ) : (
              <div className="flex h-full flex-col items-start justify-center rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-white/60 p-8">
                <CalendarHeart className="h-10 w-10 text-rose" aria-hidden />
                <p className="mt-4 font-heading text-2xl font-extrabold text-espresso">New dates coming soon</p>
                <p className="mt-2 max-w-md text-cocoa">
                  We&rsquo;re planning the next market and meet-up now. Follow us on Instagram to hear first.
                </p>
                <ButtonLink
                  href={site.socials.instagram}
                  variant="outline"
                  className="mt-6"
                  icon={<InstagramIcon size={18} />}
                >
                  Follow {site.instagramHandle}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
