import { getEvent } from "@/content/events";
import type { BosEvent } from "@/content/types";
import {
  absoluteUrl,
  eventCalendarDetails,
  eventEndIso,
  eventLocationText,
  eventPath,
  icsUtc,
  isVenueTbc,
} from "@/components/events/eventUtils";
import { site } from "@/lib/site";

/**
 * GET /api/events/:slug/ics
 * Downloads a single-event iCalendar file (RFC 5545) that Apple Calendar,
 * Outlook and Google Calendar can import.
 */

/** Escape TEXT values: backslash, semicolon, comma and newlines */
function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold content lines at 75 octets (UTF-8 aware), continuation lines start with a space */
function fold(line: string) {
  const encoder = new TextEncoder();
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > 75) {
      out.push(current);
      current = " ";
      bytes = 1;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n");
}

function buildIcs(event: BosEvent, now: Date) {
  const host = new URL(site.url).hostname;
  const url = absoluteUrl(eventPath(event));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeText(site.legalName)}//Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${host}`,
    `DTSTAMP:${icsUtc(now.toISOString())}`,
    `DTSTART:${icsUtc(event.start)}`,
    `DTEND:${icsUtc(eventEndIso(event))}`,
    `SUMMARY:${escapeText(event.sample ? `${event.title} (sample event)` : event.title)}`,
    `DESCRIPTION:${escapeText(eventCalendarDetails(event))}`,
    `LOCATION:${escapeText(eventLocationText(event))}`,
    ...(event.coords && !event.online && !isVenueTbc(event) ? [`GEO:${event.coords.lat};${event.coords.lng}`] : []),
    `URL:${url}`,
    `STATUS:${event.sample ? "TENTATIVE" : "CONFIRMED"}`,
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export async function GET(_req: Request, ctx: RouteContext<"/api/events/[slug]/ics">) {
  const { slug } = await ctx.params;
  const event = getEvent(slug);
  if (!event) {
    return new Response("Event not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(buildIcs(event, new Date()), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
