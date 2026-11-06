import { ArrowRight, BriefcaseBusiness, CalendarDays, Coffee, LockKeyhole } from "lucide-react";
import { latestOpportunities, openOpportunities } from "@/content/opportunities";
import { splitEvents } from "@/content/events";
import { supportResourceCount, supportSections } from "@/content/support";
import { EventCard } from "@/components/cards/EventCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { ToneText } from "@/components/ui/ToneText";
import { OpportunityCard } from "./OpportunityCard";
import { QuickActions } from "./QuickActions";
import { OpportunitiesTile, SectionTile } from "./SectionTile";
import { SignOutButton } from "./SignOutButton";

/** Signed-in view of /business-support: the members' lounge */
export function MemberHub({ name, now }: { name?: string; now: number }) {
  const open = openOpportunities(now);
  const latest = latestOpportunities(now, 3);
  const upcomingLearning = splitEvents(new Date(now)).upcoming.filter(
    (e) => e.type === "workshop" || e.type === "training",
  );
  const learning = upcomingLearning.slice(0, 4);

  // Stat tiles count real items only. If every item is a sample, the tile says so.
  const liveOpen = open.filter((o) => !o.sample).length;
  const liveLearning = upcomingLearning.filter((e) => !e.sample).length;
  const countTile = (live: number, all: number, one: string, many: string) =>
    live === 0 && all > 0
      ? { value: all, label: all === 1 ? `sample ${one}` : `sample ${many}` }
      : { value: live, label: live === 1 ? one : many };

  const stats = [
    { value: supportSections.length, label: "support areas", color: "text-pink" },
    { value: supportResourceCount, label: "handpicked resources", color: "text-sunflower" },
    { ...countTile(liveOpen, open.length, "open opportunity", "open opportunities"), color: "text-latte" },
    { ...countTile(liveLearning, upcomingLearning.length, "session coming up", "sessions coming up"), color: "text-blush" },
  ];

  return (
    <>
      <section className="grain relative overflow-hidden bg-espresso pt-10 pb-14 text-cream sm:pt-14 sm:pb-20">
        <Blob color="#f2a0bd" className="absolute -top-28 -right-24 h-80 w-80 opacity-25 sm:h-[30rem] sm:w-[30rem]" />
        <Blob color="#7a4a2e" className="absolute -bottom-36 -left-24 h-80 w-80 opacity-60" />
        <Sunburst color="#f6bd3c" className="absolute top-44 right-[12%] hidden h-24 w-24 animate-spin-slow opacity-80 lg:block" />
        <Squiggle color="#f2a0bd" className="absolute bottom-10 left-[46%] hidden h-8 w-28 opacity-70 md:block" />
        <Dots color="#d19a62" className="absolute top-14 left-[40%] hidden h-10 w-10 opacity-50 lg:block" />
        <Container className="relative">
          <div className="flex items-center justify-between gap-4">
            <Eyebrow dark>
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
              Members&apos; lounge
            </Eyebrow>
            <SignOutButton
              className="h-11 border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-espresso"
            />
          </div>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-extrabold leading-[1.02] [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
            {name ? (
              <>
                Welcome back, <ToneText onDark>{name}</ToneText>.
              </>
            ) : (
              <>
                Welcome to the <span className="text-pink">members&apos; lounge</span>.
              </>
            )}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/80 sm:text-xl">
            Pull up a chair. Everything we know about funding, advice and growing a Black-owned business in South
            Yorkshire is here, and if you can&apos;t find it, ask us.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="#one-to-one" variant="pink" size="lg" icon={<Coffee className="h-5 w-5" aria-hidden />}>
              Book a 1:1
            </ButtonLink>
            <ButtonLink
              href="/business-support/opportunities"
              variant="outline"
              size="lg"
              icon={<BriefcaseBusiness className="h-5 w-5" aria-hidden />}
              className="border-cream/60 text-cream hover:border-cream hover:bg-cream hover:text-espresso"
            >
              See opportunities
            </ButtonLink>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((s) => (
              // Label first in the DOM (read as "support areas: 10"), number shown on top
              <div key={s.label} className="flex flex-col-reverse justify-end rounded-2xl border-2 border-cream/15 bg-cream/5 px-4 py-4">
                <dt className="mt-1.5 text-sm font-medium text-cream/75">{s.label}</dt>
                <dd className={`font-display text-4xl leading-none ${s.color}`}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
      <StripeBand />

      <Section tone="cream" id="areas">
        <SectionHeading
          eyebrow="Your support areas"
          title="Where do you need a hand?"
          description="Pick an area to see checked links, official guidance and BOS services you can request."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {supportSections.map((s) => (
            <li key={s.id}>
              <SectionTile section={s} showDescription={false} />
            </li>
          ))}
          {/* Spans two columns so the last row fills at 2, 3 and 4 columns (10 sections + this) */}
          <li className="sm:col-span-2">
            <OpportunitiesTile openCount={liveOpen} sampleCount={open.length - liveOpen} />
          </li>
        </ul>
      </Section>

      <Section tone="pink" id="one-to-one" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <Eyebrow>One-to-one help</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] text-espresso sm:text-4xl lg:text-5xl">
              Talk to a real person
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cocoa">
              Some questions need a conversation, not a link. Book a 1:1 with the BOS team or someone from our network,
              or ask us to find you a mentor who has been there.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso bg-sunflower font-display text-espresso">
                  1
                </span>
                <p className="text-cocoa">
                  <strong className="font-heading text-espresso">Tell us what you need.</strong> A few lines is plenty.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso bg-tangerine font-display text-espresso">
                  2
                </span>
                <p className="text-cocoa">
                  <strong className="font-heading text-espresso">We&apos;ll email you</strong> to find a time or talk
                  through a match.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso bg-teal font-display text-cream">
                  3
                </span>
                <p className="text-cocoa">
                  <strong className="font-heading text-espresso">Leave with a plan</strong> and someone to check in with.
                </p>
              </li>
            </ul>
          </div>
          <QuickActions defaultName={name} />
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Learn something new"
          title="Upcoming workshops & training"
          description="Practical sessions for members and the wider community."
          action={
            <ButtonLink href="/events" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              All events
            </ButtonLink>
          }
        />
        {learning.length > 0 ? (
          <ul className="grid gap-5 lg:grid-cols-2">
            {learning.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-[1.5rem] border-2 border-dashed border-espresso/25 bg-cream-deep p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-cocoa">
              <CalendarDays className="h-6 w-6 shrink-0 text-rose" aria-hidden />
              New workshop dates are on the way. Tell us what you&apos;d like us to run.
            </p>
            <ButtonLink href="/business-support/workshops" variant="outline" size="sm">
              Suggest a workshop
            </ButtonLink>
          </div>
        )}
      </Section>

      <Section tone="deep">
        <SectionHeading
          eyebrow="Fresh on the board"
          title="Latest opportunities"
          description="Contracts, jobs and opportunities for Black-owned businesses."
          action={
            <ButtonLink
              href="/business-support/opportunities"
              variant="primary"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
            >
              {liveOpen === open.length ? `See all ${open.length} open` : "See all opportunities"}
            </ButtonLink>
          }
        />
        {latest.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((o) => (
              <li key={o.id}>
                <OpportunityCard opportunity={o} now={now} compact />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[1.5rem] border-2 border-dashed border-espresso/25 bg-cream p-6 text-cocoa">
            Nothing open right now. New opportunities are added as we find them.
          </p>
        )}
      </Section>
    </>
  );
}
