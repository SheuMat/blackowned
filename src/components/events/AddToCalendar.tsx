import { CalendarPlus, Download } from "lucide-react";
import type { BosEvent } from "@/content/types";
import { cn } from "@/lib/utils";
import { googleCalendarUrl, icsPath } from "./eventUtils";

const linkCls =
  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-sunflower hover:shadow-pop-sm whitespace-nowrap";

/** .ics download (Apple, Outlook and most apps) plus a Google Calendar link */
export function AddToCalendar({ event, className, dark }: { event: BosEvent; className?: string; dark?: boolean }) {
  return (
    <div className={className}>
      <p className={cn("font-heading text-sm font-bold", dark ? "text-cream" : "text-espresso")}>Add to your calendar</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a href={icsPath(event)} download={`${event.slug}.ics`} className={linkCls}>
          <Download className="h-4 w-4" aria-hidden />
          Apple / Outlook
          <span className="sr-only"> (downloads an .ics calendar file)</span>
        </a>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={linkCls}>
          <CalendarPlus className="h-4 w-4" aria-hidden />
          Google
          <span className="sr-only"> Calendar (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
