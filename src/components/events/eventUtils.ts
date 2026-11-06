import { eventTypeMap } from "@/content/events";
import type { BosEvent, EventType } from "@/content/types";
import { site } from "@/lib/site";
import { formatTime } from "@/lib/utils";

/**
 * Helpers for the events section. Safe to import from server and client
 * components (no server-only APIs). All dates are worked out in UK time.
 */

const TZ = "Europe/London";

/** Plural labels for filter chips ("Workshops", "Markets"…) */
export const eventTypePlural: Record<EventType, string> = {
  networking: "Networking",
  workshop: "Workshops",
  training: "Training",
  market: "Markets",
  // Short so all eight chips fit on one row at desktop widths
  showcase: "Showcases",
  community: "Community",
  social: "Social",
};

/** Nouns for status messages and empty states ("1 market", "3 networking events") */
export const eventTypeNoun: Record<EventType, [singular: string, plural: string]> = {
  networking: ["networking event", "networking events"],
  workshop: ["workshop", "workshops"],
  training: ["training session", "training sessions"],
  market: ["market", "markets"],
  showcase: ["business showcase", "business showcases"],
  community: ["community event", "community events"],
  social: ["social", "socials"],
};

/** "1 event", "2 markets", "1 networking event" */
export function countEvents(n: number, type?: EventType) {
  const [one, many] = type ? eventTypeNoun[type] : ["event", "events"];
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Decorative shape colours for poster-style panels, picked so they contrast
 * with each event type's background colour.
 */
export const posterAccents: Record<EventType, [string, string, string]> = {
  networking: ["#f2a0bd", "#f6bd3c", "#ee6a35"],
  workshop: ["#f6bd3c", "#f2a0bd", "#1f2a63"],
  training: ["#f6bd3c", "#f2a0bd", "#ee6a35"],
  market: ["#f6bd3c", "#1f2a63", "#f2a0bd"],
  showcase: ["#f6bd3c", "#1f2a63", "#167a6f"],
  community: ["#ee6a35", "#e0628f", "#167a6f"],
  social: ["#f2a0bd", "#f6bd3c", "#2a1910"],
};

export function typeMeta(type: EventType) {
  return eventTypeMap[type];
}

/** True when the type colour is dark enough to need cream text */
export function isDarkType(type: EventType) {
  return eventTypeMap[type].ink.toLowerCase() === "#fbf5ec";
}

// ───────────── Day keys ("2026-11-19", always UK calendar days) ─────────────

const keyFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const pad = (n: number) => String(n).padStart(2, "0");

/** UK calendar day for an instant, as "YYYY-MM-DD" */
export function londonDayKey(input: Date | string): string {
  const parts = keyFormatter.formatToParts(new Date(input));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function keyFromYmd(year: number, month0: number, day: number): string {
  const d = new Date(Date.UTC(year, month0, day));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y!, month0: m! - 1, day: d! };
}

export function addDaysToKey(key: string, days: number) {
  const { year, month0, day } = parseKey(key);
  return keyFromYmd(year, month0, day + days);
}

/** Month id "2026-11" */
export function monthKeyOf(dayKey: string) {
  return dayKey.slice(0, 7);
}

/** Last UK day an event touches. An end time of exactly midnight counts as the day before. */
export function eventEndKey(event: BosEvent) {
  const startKey = londonDayKey(event.start);
  if (!event.end) return startKey;
  const endKey = londonDayKey(new Date(new Date(event.end).getTime() - 60_000));
  return endKey < startKey ? startKey : endKey;
}

/** Every UK day an event covers (capped at 31 so a typo can't explode the calendar) */
export function eventDayKeys(event: BosEvent): string[] {
  const keys: string[] = [];
  let k = londonDayKey(event.start);
  const last = eventEndKey(event);
  while (k <= last && keys.length < 31) {
    keys.push(k);
    k = addDaysToKey(k, 1);
  }
  return keys;
}

const utcLong = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const utcWeekdayLong = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const utcMonthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const utcMonth = new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" });

const keyToDate = (key: string) => {
  const { year, month0, day } = parseKey(key);
  return new Date(Date.UTC(year, month0, day));
};

/** "19 November 2026" */
export const dayKeyLong = (key: string) => utcLong.format(keyToDate(key));
/** "Thursday 19 November" */
export const dayKeyWeekday = (key: string) => utcWeekdayLong.format(keyToDate(key));
/** "November 2026" from a month key "2026-11" */
export const monthKeyLabel = (monthKey: string) => utcMonthYear.format(keyToDate(`${monthKey}-01`));
/** "November" from a month key */
export const monthKeyName = (monthKey: string) => utcMonth.format(keyToDate(`${monthKey}-01`));

// ───────────── Human-friendly date and time labels ─────────────

const longParts = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TZ,
});
/** "Thursday 19 November 2026" (built from parts so there's never a stray comma) */
function ukLongDate(iso: string, withYear = true) {
  const parts = longParts.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return [get("weekday"), get("day"), get("month"), withYear ? get("year") : ""].filter(Boolean).join(" ");
}
const longDate = { format: (d: Date) => ukLongDate(d.toISOString()) };
const longDateNoYear = { format: (d: Date) => ukLongDate(d.toISOString(), false) };
const shortDay = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });

export function eventWhen(event: BosEvent) {
  if (event.displayDate) {
    return { dateLabel: event.displayDate, timeLabel: undefined as string | undefined, multiDay: false };
  }
  const startKey = londonDayKey(event.start);
  const endKey = eventEndKey(event);
  const multiDay = endKey !== startKey;
  if (multiDay && event.end) {
    return {
      dateLabel: `${longDateNoYear.format(new Date(event.start))} to ${longDate.format(new Date(event.end))}`,
      timeLabel: `${shortDay.format(new Date(event.start))} ${formatTime(event.start)} to ${shortDay.format(new Date(event.end))} ${formatTime(event.end)}`,
      multiDay,
    };
  }
  return {
    dateLabel: longDate.format(new Date(event.start)),
    timeLabel: event.end ? `${formatTime(event.start)}–${formatTime(event.end)}` : `From ${formatTime(event.start)}`,
    multiDay,
  };
}

// ───────────── Links ─────────────

export function eventPath(event: Pick<BosEvent, "slug">) {
  return `/events/${event.slug}`;
}

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

/** End time for calendar files: given end, or two hours after the start */
export function eventEndIso(event: BosEvent) {
  return event.end ?? new Date(new Date(event.start).getTime() + 2 * 60 * 60 * 1000).toISOString();
}

/** "20261119T080000Z" */
export function icsUtc(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Venue not confirmed yet ("Venue to be announced"): no directions, pins or GEO */
export function isVenueTbc(event: Pick<BosEvent, "venue">) {
  return /to be (announced|confirmed)|\bTB[AC]\b/i.test(event.venue);
}

/** Address line worth showing under the venue (skips repeats like "Sheffield city centre") */
export function extraAddress(event: Pick<BosEvent, "venue" | "address">) {
  if (!event.address) return undefined;
  return event.venue.toLowerCase().includes(event.address.toLowerCase()) ? undefined : event.address;
}

export function eventLocationText(event: BosEvent) {
  if (event.online || !event.address) return event.venue;
  const venue = event.venue.toLowerCase();
  const address = event.address.toLowerCase();
  // Avoid "Sheffield city centre (venue to be announced), Sheffield city centre"
  if (venue.includes(address)) return event.venue;
  return address.includes(venue) ? event.address : `${event.venue}, ${event.address}`;
}

/** Plain-text description for calendar apps */
export function eventCalendarDetails(event: BosEvent) {
  const lines = [event.summary, "", `Price: ${event.price}`, `Details: ${absoluteUrl(eventPath(event))}`];
  if (event.sample) lines.push("", "Sample event shown while the Black Owned Sheffield website is in preview.");
  return lines.join("\n");
}

export function googleCalendarUrl(event: BosEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    // Matches the .ics export, so a saved sample never looks like a real booking
    text: event.sample ? `${event.title} (sample event)` : event.title,
    dates: `${icsUtc(event.start)}/${icsUtc(eventEndIso(event))}`,
    details: eventCalendarDetails(event),
    location: eventLocationText(event),
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsPath(event: Pick<BosEvent, "slug">) {
  return `/api/events/${event.slug}/ics`;
}

export function directionsUrl(event: BosEvent) {
  const destination = event.coords ? `${event.coords.lat},${event.coords.lng}` : eventLocationText(event);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function osmEmbedUrl(coords: { lat: number; lng: number }) {
  const { lat, lng } = coords;
  const f = (n: number) => n.toFixed(6);
  const bbox = [f(lng - 0.006), f(lat - 0.003), f(lng + 0.006), f(lat + 0.003)].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${f(lat)},${f(lng)}`;
}

export function osmLargerMapUrl(coords: { lat: number; lng: number }) {
  return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`;
}

/**
 * Lowest public price in a price string for schema.org offers. Members-only
 * discounts don't count, so "Free for members · £5" → 5 and "Free entry" → 0.
 */
export function lowestPrice(price: string): number | undefined {
  const amounts = [...price.matchAll(/£\s?(\d+(?:\.\d{1,2})?)/g)].map((m) => Number(m[1]));
  if (/\bfree\b(?!\s+for\s+members)/i.test(price)) amounts.push(0);
  return amounts.length ? Math.min(...amounts) : undefined;
}

const shortParts = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TZ,
});
/** "Sat 12 Dec 2026" (UK time, no comma after the weekday) */
export function shortDateLabel(iso: string, withYear = true) {
  const parts = shortParts.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return [get("weekday"), get("day"), get("month"), withYear ? get("year") : ""].filter(Boolean).join(" ");
}

/** Related upcoming events: same type first, then soonest */
export function relatedEvents(current: BosEvent, upcoming: BosEvent[], limit = 3) {
  const others = upcoming.filter((e) => e.slug !== current.slug);
  const same = others.filter((e) => e.type === current.type);
  const rest = others.filter((e) => e.type !== current.type);
  return [...same, ...rest].slice(0, limit);
}
