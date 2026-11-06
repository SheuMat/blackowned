import type { Metadata } from "next";
import { ArrowDown, Store } from "lucide-react";
import { EventCtas } from "@/components/events/EventCtas";
import { EventPoster } from "@/components/events/EventPoster";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { PastEvents } from "@/components/events/PastEvents";
import { londonDayKey, monthKeyOf } from "@/components/events/eventUtils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { StripeBand } from "@/components/ui/Shapes";
import { PinkSticker } from "@/components/ui/ToneText";
import { splitEvents } from "@/content/events";
import { ogBase } from "@/lib/site";

// Upcoming and past are split at render time, so refresh hourly
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What's on: events, markets and networking",
  description:
    "Black Owned Sheffield events: markets, networking breakfasts, workshops, training and socials across Sheffield. See what's coming up, browse the calendar and book your place.",
  alternates: { canonical: "/events" },
  openGraph: {
    ...ogBase,
    title: "What's on at Black Owned Sheffield",
    description: "Markets, networking, workshops and socials celebrating Black-owned business in Sheffield.",
    url: "/events",
  },
};

export default function EventsPage() {
  const now = new Date();
  const { upcoming, past } = splitEvents(now);
  const featured = upcoming.find((e) => e.featured) ?? upcoming[0];
  const todayKey = londonDayKey(now);
  const initialMonth = upcoming[0] ? monthKeyOf(londonDayKey(upcoming[0].start)) : monthKeyOf(todayKey);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Events" }]}
        eyebrow="Events"
        accent="tangerine"
        title={
          <>
            What&apos;s <PinkSticker className="px-4 text-[0.9em]">on</PinkSticker>
          </>
        }
        description="Markets, networking breakfasts, workshops and good nights out. Everything Black Owned Sheffield is putting on, in one place."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#whats-on" variant="primary" size="lg" iconRight={<ArrowDown className="h-5 w-5" />}>
            See what&apos;s coming up
          </ButtonLink>
          <ButtonLink href="/events/stall" variant="outline" size="lg" icon={<Store className="h-5 w-5" />}>
            Apply for a stall
          </ButtonLink>
        </div>
      </PageHero>
      <StripeBand />

      {featured && (
        <section aria-label="Next featured event" className="pt-12 sm:pt-16">
          <Container>
            <EventPoster event={featured} />
          </Container>
        </section>
      )}

      <section id="whats-on" aria-labelledby="whats-on-heading" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <EventsExplorer upcoming={upcoming} past={past} serverToday={todayKey} initialMonth={initialMonth} />
        </Container>
      </section>

      <PastEvents past={past} />

      <EventCtas />
    </>
  );
}
