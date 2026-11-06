import Link from "next/link";
import { ArrowRight, Clock, MapPin, Video } from "lucide-react";
import { eventTypeMap } from "@/content/events";
import type { BosEvent } from "@/content/types";
import { cn, dateParts, formatDate, formatTime, sameUkDay } from "@/lib/utils";

/** "12 Dec · 11:00–17:00", or "17–18 Dec · from 11:00" for multi-day events */
function whenLabel(event: BosEvent) {
  const short = { weekday: undefined, year: undefined } as const;
  // An end of exactly midnight belongs to the day before (as eventEndKey does),
  // so "19:00–00:00" stays a one-day event
  const lastMinute =
    event.end &&
    new Date(Math.max(new Date(event.start).getTime(), new Date(event.end).getTime() - 60_000)).toISOString();
  if (lastMinute && !sameUkDay(event.start, lastMinute)) {
    const a = dateParts(event.start);
    const b = dateParts(lastMinute);
    const range = a.month === b.month ? `${a.day}–${b.day} ${b.month}` : `${a.day} ${a.month} – ${b.day} ${b.month}`;
    return `${range} · from ${formatTime(event.start)}`;
  }
  return `${formatDate(event.start, short)} · ${formatTime(event.start)}${event.end ? `–${formatTime(event.end)}` : ""}`;
}

export function EventDateBlock({ event, className }: { event: BosEvent; className?: string }) {
  const p = dateParts(event.start);
  const t = eventTypeMap[event.type];
  return (
    <div
      className={cn(
        "flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-espresso py-2 text-center shadow-pop-sm",
        className,
      )}
      style={{ backgroundColor: t.color, color: t.ink }}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">{p.weekday}</span>
      <span className="font-display text-3xl leading-none">{p.day}</span>
      <span className="text-xs font-bold uppercase tracking-wider">{p.month}</span>
    </div>
  );
}

export function EventTypeBadge({ type, className }: { type: BosEvent["type"]; className?: string }) {
  const t = eventTypeMap[type];
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold", className)}
      style={{ backgroundColor: t.color, color: t.ink }}
    >
      {t.label}
    </span>
  );
}

export function EventCard({
  event,
  className,
  past = false,
  headingAs: Heading = "h3",
}: {
  event: BosEvent;
  className?: string;
  past?: boolean;
  /** Use "h4" when cards sit under an h3 (e.g. month headings) */
  headingAs?: "h2" | "h3" | "h4";
}) {
  const href = `/events/${event.slug}`;
  return (
    <article
      className={cn(
        "group relative flex gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop sm:gap-5 sm:p-5",
        past && "bg-cream-deep",
        "has-[a:focus-visible]:ring-4 has-[a:focus-visible]:ring-rose has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-cream",
        className,
      )}
    >
      {event.displayDate ? (
        <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-espresso bg-sand py-2 text-center text-espresso">
          <span className="px-1 font-heading text-sm font-extrabold leading-tight">{event.displayDate}</span>
        </div>
      ) : (
        <EventDateBlock event={event} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <EventTypeBadge type={event.type} />
          <span className="text-xs font-semibold text-cocoa/80">{event.price}</span>
          {event.sample && (
            <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
              Sample
            </span>
          )}
        </div>
        <Heading className="mt-2 font-heading text-lg font-extrabold leading-snug text-espresso sm:text-xl">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {event.title}
          </Link>
        </Heading>
        <div className="mt-2 flex flex-col gap-1 text-sm text-cocoa sm:flex-row sm:flex-wrap sm:gap-x-4">
          {!event.displayDate && (
            <span className="inline-flex items-start gap-1.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
              {whenLabel(event)}
            </span>
          )}
          <span className="inline-flex items-start gap-1.5">
            {event.online ? (
              <Video className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            ) : (
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            )}
            {event.venue}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-cocoa/90">{event.summary}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-heading text-sm font-bold text-espresso">
          {past ? (event.video ? "See recap" : "See details") : event.sample ? "See details" : (event.ticketLabel ?? "Details")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
