import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronRight, Clock, MapPin, Ticket, Video } from "lucide-react";
import type { BosEvent } from "@/content/types";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { dateParts } from "@/lib/utils";
import { eventWhen, isDarkType, posterAccents, typeMeta } from "./eventUtils";

/** Ticket-stub date block with a perforated edge */
function TicketStub({ event, finished }: { event: BosEvent; finished: boolean }) {
  const p = dateParts(event.start);
  const when = eventWhen(event);
  const t = typeMeta(event.type);
  return (
    <div className="relative mx-auto w-full max-w-sm rotate-0 lg:mx-0 lg:ml-auto lg:rotate-2">
      <div className="overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-cream text-espresso shadow-pop">
        <div className="flex items-center gap-5 px-6 pt-6 pb-5">
          {event.displayDate ? (
            <p className="font-display text-4xl leading-none sm:text-5xl">{event.displayDate}</p>
          ) : (
            <>
              <div className="text-center">
                <p className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-rose-ink">{p.weekday}</p>
                <p className="font-display text-7xl leading-[0.85] sm:text-8xl">{p.day}</p>
              </div>
              <div>
                <p className="font-display text-3xl uppercase leading-none sm:text-4xl">{p.month}</p>
                <p className="mt-1 font-heading text-lg font-bold text-cocoa">{p.year}</p>
              </div>
            </>
          )}
        </div>
        {/* Perforation */}
        <div className="relative h-0 border-t-2 border-dashed border-espresso/40" aria-hidden>
          <span
            className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full border-2 border-espresso"
            style={{ backgroundColor: t.color }}
          />
          <span
            className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full border-2 border-espresso"
            style={{ backgroundColor: t.color }}
          />
        </div>
        <dl className="space-y-3 px-6 pt-5 pb-6 text-[15px]">
          {when.timeLabel && (
            <div className="flex items-start gap-3">
              <dt>
                <Clock className="mt-0.5 h-5 w-5 text-rose-ink" aria-hidden />
                <span className="sr-only">Time</span>
              </dt>
              <dd className="font-semibold">{when.timeLabel}</dd>
            </div>
          )}
          <div className="flex items-start gap-3">
            <dt>
              {event.online ? (
                <Video className="mt-0.5 h-5 w-5 text-rose-ink" aria-hidden />
              ) : (
                <MapPin className="mt-0.5 h-5 w-5 text-rose-ink" aria-hidden />
              )}
              <span className="sr-only">Where</span>
            </dt>
            <dd className="font-semibold">{event.venue}</dd>
          </div>
          <div className="flex items-start gap-3">
            <dt>
              <Ticket className="mt-0.5 h-5 w-5 text-rose-ink" aria-hidden />
              <span className="sr-only">Price</span>
            </dt>
            <dd>
              <span className="inline-flex rounded-full bg-sunflower px-3 py-0.5 font-heading font-bold">{event.price}</span>
            </dd>
          </div>
        </dl>
        {finished && (
          <p className="border-t-2 border-espresso bg-espresso px-6 py-2.5 text-center font-heading text-sm font-bold uppercase tracking-[0.18em] text-cream">
            This event has finished
          </p>
        )}
      </div>
    </div>
  );
}

/** Event page header, styled like a market poster in the event-type colour */
export function EventHero({
  event,
  finished,
  bookingHref,
}: {
  event: BosEvent;
  finished: boolean;
  /** "#book" or an external ticket URL; omitted for past events */
  bookingHref?: string;
}) {
  const t = typeMeta(event.type);
  const dark = isDarkType(event.type);
  const [a1, a2, a3] = posterAccents[event.type];

  return (
    <section
      className="grain relative overflow-hidden border-b-2 border-espresso pt-8 pb-14 sm:pt-12 sm:pb-20"
      style={{ backgroundColor: t.color, color: t.ink }}
    >
      <Blob color={a1} className="absolute -top-28 -right-24 h-80 w-80 opacity-90 sm:h-[28rem] sm:w-[28rem]" />
      <Sunburst color={a2} className="absolute -bottom-24 -left-24 h-48 w-48 animate-spin-slow opacity-90 sm:h-60 sm:w-60" />
      <Squiggle color={a3} className="absolute top-24 left-[45%] hidden h-10 w-36 lg:block" />
      <Dots color={dark ? "#fbf5ec" : "#2a1910"} className="absolute right-[38%] bottom-10 hidden h-14 w-14 opacity-40 lg:block" />

      <Container className="relative">
        {/* Breadcrumbs sit on a cream tag so small text stays readable on every event colour */}
        <nav aria-label="Breadcrumb" className="mb-8 flex">
          <ol className="flex max-w-full min-w-0 items-center gap-1 rounded-full border-2 border-espresso bg-cream px-3.5 py-1.5 text-sm font-semibold text-espresso shadow-pop-sm">
            <li className="shrink-0">
              <Link href="/" className="-my-0.5 inline-block py-0.5 hover:underline">
                Home
              </Link>
            </li>
            <li className="flex shrink-0 items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <Link href="/events" className="-my-0.5 inline-block py-0.5 hover:underline">
                Events
              </Link>
            </li>
            <li className="flex min-w-0 items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span aria-current="page" className="truncate text-cocoa">
                {event.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border-2 border-espresso bg-cream px-3 py-1 text-xs font-bold text-espresso">
                {t.label}
              </span>
              {finished && (
                <span className="inline-flex items-center rounded-full border-2 border-espresso bg-espresso px-3 py-1 text-xs font-bold text-cream">
                  Past event
                </span>
              )}
              {event.membersOnly && (
                <span className="inline-flex items-center rounded-full border-2 border-espresso bg-pink px-3 py-1 text-xs font-bold text-espresso">
                  Members only
                </span>
              )}
              {event.sample && (
                <span
                  className="inline-flex items-center rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cocoa"
                  title="Sample event for the website preview"
                >
                  Sample event
                </span>
              )}
            </div>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[0.98] sm:text-6xl lg:text-7xl">{event.title}</h1>
            <p className="mt-5 max-w-2xl text-xl font-bold leading-snug sm:text-2xl">{event.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {bookingHref && (
                <ButtonLink
                  href={bookingHref}
                  variant={dark ? "sunflower" : "primary"}
                  size="lg"
                  iconRight={
                    bookingHref.startsWith("#") ? <ArrowDown className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />
                  }
                >
                  {event.ticketLabel ?? "Book a place"}
                  {!bookingHref.startsWith("#") && <span className="sr-only"> (opens in a new tab)</span>}
                </ButtonLink>
              )}
              {finished && event.video && (
                <ButtonLink href="#recap" variant={dark ? "sunflower" : "primary"} size="lg" iconRight={<ArrowDown className="h-5 w-5" />}>
                  Watch the recap
                </ButtonLink>
              )}
              <ButtonLink href="/events" variant="cream" size="lg" className="border-espresso">
                {finished ? "See what's coming up" : "All events"}
              </ButtonLink>
            </div>
          </div>

          <TicketStub event={event} finished={finished} />
        </div>
      </Container>
    </section>
  );
}
