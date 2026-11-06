/**
 * Deadline countdowns for the opportunities board. Pure functions: pass `now`
 * in from the server so server and client render the same label.
 */

const TZ = "Europe/London";
const DAY = 86_400_000;

/** Whole days since epoch for the calendar date in London */
function londonDayNumber(ms: number) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(ms)
    .split("-")
    .map(Number);
  return Math.round(Date.UTC(y!, m! - 1, d!) / DAY);
}

export type DeadlineState = "closed" | "today" | "soon" | "open";

export function deadlineStatus(deadline: string, now: number): { state: DeadlineState; label: string; days: number } {
  const end = new Date(deadline).getTime();
  if (Number.isNaN(end)) return { state: "open", label: "Open", days: Infinity };
  if (end < now) return { state: "closed", label: "Closed", days: -1 };
  const days = londonDayNumber(end) - londonDayNumber(now);
  if (days <= 0) return { state: "today", label: "Closes today", days: 0 };
  if (days === 1) return { state: "today", label: "Closes tomorrow", days };
  if (days <= 7) return { state: "soon", label: `Closes in ${days} days`, days };
  if (days <= 56) return { state: "open", label: `Closes in ${days} days`, days };
  const weeks = Math.floor(days / 7);
  return { state: "open", label: `Closes in ${weeks} weeks`, days };
}

/**
 * The time of the current request. Only call from force-dynamic server
 * components: they render once per request, so the value is stable for that
 * render and gets passed down as a prop to client components.
 */
export function requestNow() {
  return Date.now();
}
