import Link from "next/link";
import { ArrowRight, Clock, MapPin, Ticket, Video } from "lucide-react";
import type { BosEvent } from "@/content/types";
import { ButtonLink } from "@/components/ui/Button";
import { Blob, Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { cn, dateParts } from "@/lib/utils";
import { eventPath, eventWhen, isDarkType, posterAccents, typeMeta } from "./eventUtils";

/** Chunky tilted date "ticket" used on posters */
export function PosterDate({ event, className }: { event: BosEvent; className?: string }) {
  const p = dateParts(event.start);
  return (
    <div
      className={cn(
        "relative flex w-32 shrink-0 flex-col items-center rounded-[1.5rem] border-2 border-espresso bg-cream px-3 pt-3 pb-4 text-center text-espresso shadow-pop sm:w-40",
        className,
      )}
    >
      <span className="font-heading text-xs font-extrabold uppercase tracking-[0.2em] text-rose-ink">{p.weekday}</span>
      <span className="mt-1 font-display text-7xl leading-[0.85] sm:text-8xl">{p.day}</span>
      <span className="mt-1 font-display text-2xl uppercase leading-none sm:text-3xl">{p.month}</span>
      <span className="mt-2 rounded-full bg-espresso px-2.5 py-0.5 text-xs font-bold tracking-wider text-cream">
        {p.year}
      </span>
    </div>
  );
}

/**
 * Big poster-style card for the next featured event, styled after the
 * Black Owned Market posters: bold type colour, chunky date, playful shapes.
 */
export function EventPoster({ event, className }: { event: BosEvent; className?: string }) {
  const t = typeMeta(event.type);
  const dark = isDarkType(event.type);
  const [a1, a2, a3] = posterAccents[event.type];
  const when = eventWhen(event);
  const bookHref = event.ticketUrl ?? `${eventPath(event)}#book`;

  return (
    <article
      className={cn(
        "grain relative overflow-hidden rounded-[2rem] border-2 border-espresso shadow-pop sm:rounded-[2.5rem]",
        className,
      )}
      style={{ backgroundColor: t.color, color: t.ink }}
      aria-labelledby={`poster-${event.slug}`}
    >
      {/* Poster shapes */}
      <Blob color={a1} className="absolute -top-20 -right-16 h-64 w-64 opacity-90 sm:h-96 sm:w-96" />
      <Sunburst color={a2} className="absolute -bottom-12 -left-12 h-40 w-40 animate-spin-slow sm:h-52 sm:w-52" />
      <Squiggle color={a3} className="absolute top-8 left-[38%] hidden h-10 w-32 lg:block" />
      <Dots
        color={dark ? "#fbf5ec" : "#2a1910"}
        className="absolute right-8 bottom-8 hidden h-14 w-14 opacity-40 sm:block"
      />

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14 lg:p-14">
        <div className="flex items-start gap-4 lg:block">
          <PosterDate event={event} className="-rotate-3" />
          <span className="mt-2 inline-flex -rotate-2 items-center rounded-full border-2 border-espresso bg-sunflower px-3 py-1 font-heading text-xs font-extrabold uppercase tracking-widest text-espresso shadow-pop-sm lg:mt-6 lg:rotate-2">
            Next up
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border-2 border-espresso bg-cream px-3 py-1 text-xs font-bold text-espresso">
              {t.label}
            </span>
            {event.membersOnly && (
              <span className="inline-flex items-center rounded-full border-2 border-espresso bg-pink px-3 py-1 text-xs font-bold text-espresso">
                Members only
              </span>
            )}
            {event.sample && (
              <span className="inline-flex items-center rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cocoa">
                Sample
              </span>
            )}
          </div>

          <h2
            id={`poster-${event.slug}`}
            className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl"
          >
            <Link href={eventPath(event)} className="hover:underline hover:decoration-4 hover:underline-offset-8">
              {event.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-2xl text-xl font-bold leading-snug">{event.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {when.timeLabel && (
              <li className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-cream px-3.5 py-2 text-sm font-semibold text-espresso">
                <Clock className="h-4 w-4 text-rose-ink" aria-hidden />
                <span className="sr-only">Time: </span>
                {when.timeLabel}
              </li>
            )}
            <li className="inline-flex max-w-full items-center gap-2 rounded-full border-2 border-espresso bg-cream px-3.5 py-2 text-sm font-semibold text-espresso">
              {event.online ? (
                <Video className="h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
              ) : (
                <MapPin className="h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
              )}
              <span className="sr-only">Where: </span>
              <span className="truncate">{event.venue}</span>
            </li>
            <li className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-sunflower px-3.5 py-2 text-sm font-bold text-espresso">
              <Ticket className="h-4 w-4" aria-hidden />
              <span className="sr-only">Price: </span>
              {event.price}
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Sample events don't take bookings, so skip straight to the details */}
            {!event.sample && (
              <ButtonLink
                href={bookHref}
                variant={dark ? "sunflower" : "primary"}
                size="lg"
                iconRight={<ArrowRight className="h-5 w-5" />}
              >
                {event.ticketLabel ?? "Book a place"}
                {event.ticketUrl && <span className="sr-only"> (opens in a new tab)</span>}
              </ButtonLink>
            )}
            <ButtonLink
              href={eventPath(event)}
              variant="cream"
              size="lg"
              className="border-espresso"
              aria-label={`Full details about ${event.title}`}
            >
              Full details
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
