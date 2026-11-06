import type { ReactNode } from "react";
import { CalendarDays, Clock, ExternalLink, MapPin, Navigation, Ticket, Users, Video } from "lucide-react";
import type { BosEvent } from "@/content/types";
import { AddToCalendar } from "./AddToCalendar";
import { ShareButton } from "./ShareButton";
import {
  directionsUrl,
  eventPath,
  eventWhen,
  extraAddress,
  isVenueTbc,
  osmEmbedUrl,
  osmLargerMapUrl,
  typeMeta,
} from "./eventUtils";

function Fact({ icon, label, children, color }: { icon: ReactNode; label: string; children: ReactNode; color: string }) {
  return (
    // dt and dd stay direct children of the group div (valid <dl> markup); the icon lives inside the dt
    <div className="min-h-[4.5rem] px-5 py-4 sm:px-6">
      <dt className="relative pl-14 font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-rose-ink">
        <span
          className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-espresso bg-cream"
          style={{ boxShadow: `2px 2px 0 0 ${color}` }}
          aria-hidden
        >
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 min-w-0 pl-14 text-[15px] leading-relaxed text-espresso">{children}</dd>
    </div>
  );
}

/** Sidebar panel: date, time, location (with map), price, organiser, calendar and share */
export function EventKeyFacts({ event, finished }: { event: BosEvent; finished: boolean }) {
  const when = eventWhen(event);
  const t = typeMeta(event.type);
  const iconCls = "h-5 w-5 text-espresso";
  const tbc = isVenueTbc(event);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-white shadow-pop">
      <h2 className="border-b-2 border-espresso bg-cream-deep px-5 py-4 font-heading text-lg font-extrabold sm:px-6">Key facts</h2>
      <dl className="divide-y-2 divide-cream-deep">
        <Fact icon={<CalendarDays className={iconCls} />} label="Date" color={t.color}>
          <span className="font-semibold">{when.dateLabel}</span>
        </Fact>
        {when.timeLabel && (
          <Fact icon={<Clock className={iconCls} />} label="Time" color={t.color}>
            <span className="font-semibold">{when.timeLabel}</span>
            <span className="block text-sm text-cocoa">UK time</span>
          </Fact>
        )}
        <Fact
          icon={event.online ? <Video className={iconCls} /> : <MapPin className={iconCls} />}
          label="Location"
          color={t.color}
        >
          {event.online ? (
            <>
              <span className="font-semibold">Online</span>
              <span className="block text-sm text-cocoa">
                {event.venue}
                {finished ? "" : ". Joining details are sent to everyone who books."}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold">{event.venue}</span>
              {extraAddress(event) && <span className="block text-sm text-cocoa">{extraAddress(event)}</span>}
              {tbc ? (
                !finished && (
                  <span className="mt-1 block text-sm text-cocoa">
                    We&apos;ll add the address and a map here as soon as the venue is confirmed.
                  </span>
                )
              ) : (
                <a
                  href={directionsUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-rose-ink underline decoration-2 underline-offset-4 hover:decoration-4"
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Get directions
                  <span className="sr-only"> on Google Maps (opens in a new tab)</span>
                </a>
              )}
            </>
          )}
        </Fact>
        <Fact icon={<Ticket className={iconCls} />} label="Price" color={t.color}>
          <span className="font-semibold">{event.price}</span>
        </Fact>
        {event.organiser && (
          <Fact icon={<Users className={iconCls} />} label="Organiser" color={t.color}>
            <span className="font-semibold">{event.organiser}</span>
          </Fact>
        )}
      </dl>

      {!event.online && !tbc && event.coords && (
        <div className="border-t-2 border-espresso">
          <iframe
            title={`Map showing ${event.venue}`}
            src={osmEmbedUrl(event.coords)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full border-0 bg-cream-deep"
          />
          <a
            href={osmLargerMapUrl(event.coords)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-end gap-1.5 border-t-2 border-espresso bg-cream-deep px-5 text-xs font-semibold text-cocoa hover:text-espresso hover:underline"
          >
            View larger map on OpenStreetMap
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      <div className="space-y-4 border-t-2 border-espresso px-5 py-5 sm:px-6">
        {!finished && !event.displayDate && <AddToCalendar event={event} />}
        <ShareButton path={eventPath(event)} title={event.title} text={event.summary} />
      </div>
    </div>
  );
}
