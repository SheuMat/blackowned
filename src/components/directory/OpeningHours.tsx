"use client";

import { Clock } from "lucide-react";
import type { OpeningHours as Hours } from "@/content/types";
import { dayNames, formatHour, formatHoursEntry, getOpenState, openStateLabel, type OpenState } from "@/lib/directory-search";
import { cn } from "@/lib/utils";
import { useNow } from "./useNow";

/** Open/closed state in Sheffield time, computed after mount (null on the server). */
function useOpenState(hours?: Hours[]): OpenState | null {
  const now = useNow();
  if (now == null || !hours?.length) return null;
  return getOpenState({ hours }, now);
}

/** Small "Open now · until 4pm" pill. Renders nothing until the client knows the time. */
export function OpenStatusPill({
  hours,
  className,
  kind = "opening",
}: {
  hours?: Hours[];
  className?: string;
  /** "office" reads "Office open now" for businesses that see visitors by appointment */
  kind?: "opening" | "office";
}) {
  const state = useOpenState(hours);
  if (!state || state.status === "unknown") return null;
  const open = state.status === "open";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-bold",
        open ? "border-teal bg-teal/10 text-forest" : "border-espresso/20 bg-white text-cocoa",
        className,
      )}
    >
      <span aria-hidden className={cn("relative flex h-2.5 w-2.5")}>
        {open && <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-60" />}
        <span className={cn("relative h-2.5 w-2.5 rounded-full", open ? "bg-teal" : "bg-rose")} />
      </span>
      {kind === "office" ? (open ? "Office open now" : "Office closed now") : open ? "Open now" : "Closed now"}
      <span className="font-medium text-cocoa">· {open ? `until ${formatHour(state.closesAt)}` : openStateLabel(state)}</span>
    </span>
  );
}

/** Weekly hours table with today highlighted (after mount, in Europe/London). */
export function OpeningHoursTable({
  hours,
  note,
  kind = "opening",
}: {
  hours?: Hours[];
  note?: string;
  kind?: "opening" | "office";
}) {
  const state = useOpenState(hours);
  const today = state?.today ?? null;
  const byDay = new Map(hours?.map((h) => [h.day, h]));

  return (
    <div>
      {hours?.length ? (
        <div className="flex min-h-8 flex-wrap items-center gap-2">
          {state && state.status !== "unknown" ? (
            <OpenStatusPill hours={hours} kind={kind} />
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-cocoa">
              <Clock className="h-4 w-4" aria-hidden />
              UK time
            </span>
          )}
        </div>
      ) : null}
      {hours?.length ? (
        <table className="mt-4 w-full text-[15px]">
          <caption className="sr-only">{kind === "office" ? "Office hours" : "Opening hours"} (UK time)</caption>
          <tbody>
            {dayNames.map((name, i) => {
              const isToday = today === i;
              const entry = byDay.get(i as Hours["day"]);
              const closed = !entry || entry.closed;
              return (
                <tr
                  key={name}
                  className={cn("border-b border-espresso/10 last:border-0", isToday && "bg-blush")}
                  aria-current={isToday ? "date" : undefined}
                >
                  <th scope="row" className={cn("py-2.5 pl-3 text-left font-semibold", isToday ? "font-extrabold text-espresso" : "text-cocoa")}>
                    {name}
                    {isToday && (
                      <span className="ml-2 rounded-full bg-espresso px-2 py-0.5 align-middle text-[10px] font-bold tracking-wider text-cream uppercase">
                        Today
                      </span>
                    )}
                  </th>
                  <td
                    className={cn(
                      "py-2.5 pr-3 text-right tabular-nums",
                      closed ? (isToday ? "text-espresso" : "text-cocoa/80") : "font-semibold text-espresso",
                      isToday && "font-extrabold",
                    )}
                  >
                    {formatHoursEntry(entry)}
                    {entry?.note && !closed && <span className="block text-xs font-normal text-cocoa">{entry.note}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {note && (
        <p className={cn(hours?.length ? "mt-4 text-sm text-cocoa" : "flex items-center gap-2 text-base font-semibold text-espresso")}>
          {!hours?.length && <Clock className="h-4 w-4 shrink-0 text-rose" aria-hidden />}
          {note}
        </p>
      )}
      {!hours?.length && !note && <p className="text-sm text-cocoa">Get in touch to check when they&rsquo;re open.</p>}
    </div>
  );
}
