"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import type { BosEvent } from "@/content/types";
import { eventTypes } from "@/content/events";
import { cn } from "@/lib/utils";
import {
  addDaysToKey,
  dayKeyLong,
  eventDayKeys,
  keyFromYmd,
  monthKeyLabel,
  monthKeyOf,
  parseKey,
  typeMeta,
} from "./eventUtils";

const WEEKDAYS = [
  ["M", "Mon", "Monday"],
  ["T", "Tue", "Tuesday"],
  ["W", "Wed", "Wednesday"],
  ["T", "Thu", "Thursday"],
  ["F", "Fri", "Friday"],
  ["S", "Sat", "Saturday"],
  ["S", "Sun", "Sunday"],
] as const;

/** Map of "YYYY-MM-DD" → events on that UK day */
export function buildDayIndex(events: BosEvent[]) {
  const map = new Map<string, BosEvent[]>();
  for (const e of events) {
    for (const k of eventDayKeys(e)) {
      const list = map.get(k);
      if (list) list.push(e);
      else map.set(k, [e]);
    }
  }
  for (const list of map.values()) list.sort((a, b) => a.start.localeCompare(b.start));
  return map;
}

function shiftMonth(monthKey: string, delta: number) {
  const { year, month0 } = parseKey(`${monthKey}-01`);
  return monthKeyOf(keyFromYmd(year, month0 + delta, 1));
}

/** Cells for a Monday-first month grid, including leading/trailing days */
function monthCells(monthKey: string) {
  const { year, month0 } = parseKey(`${monthKey}-01`);
  const first = new Date(Date.UTC(year, month0, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const weeks = Math.ceil((lead + daysInMonth) / 7);
  const start = keyFromYmd(year, month0, 1 - lead);
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDaysToKey(start, w * 7 + d)),
  );
}

export function EventCalendar({
  month,
  onMonthChange,
  selectedKey,
  onSelect,
  todayKey,
  events,
}: {
  /** "2026-11" */
  month: string;
  onMonthChange: (month: string) => void;
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  todayKey: string;
  /** Events to plot (already filtered by type) */
  events: BosEvent[];
}) {
  const index = useMemo(() => buildDayIndex(events), [events]);
  const weeks = useMemo(() => monthCells(month), [month]);
  const gridRef = useRef<HTMLTableElement>(null);
  const wantsFocus = useRef(false);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  // Roving tab stop: focused day if it's in view, else the selected day, today, or the 1st
  const inMonth = (k: string | null): k is string => !!k && monthKeyOf(k) === month;
  const tabKey = inMonth(focusKey)
    ? focusKey
    : inMonth(selectedKey)
      ? selectedKey
      : inMonth(todayKey)
        ? todayKey
        : `${month}-01`;

  useEffect(() => {
    if (!wantsFocus.current) return;
    wantsFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${tabKey}"]`)?.focus();
  }, [tabKey, month]);

  function moveFocus(key: string) {
    wantsFocus.current = true;
    setFocusKey(key);
    if (monthKeyOf(key) !== month) onMonthChange(monthKeyOf(key));
  }

  function onGridKeyDown(e: KeyboardEvent<HTMLTableElement>) {
    const from = tabKey;
    const { year, month0, day } = parseKey(from);
    const weekday = (new Date(Date.UTC(year, month0, day)).getUTCDay() + 6) % 7;
    let next: string | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = addDaysToKey(from, -1);
        break;
      case "ArrowRight":
        next = addDaysToKey(from, 1);
        break;
      case "ArrowUp":
        next = addDaysToKey(from, -7);
        break;
      case "ArrowDown":
        next = addDaysToKey(from, 7);
        break;
      case "Home":
        next = addDaysToKey(from, -weekday);
        break;
      case "End":
        next = addDaysToKey(from, 6 - weekday);
        break;
      case "PageUp":
        next = keyFromYmd(year, month0 - 1, Math.min(day, new Date(Date.UTC(year, month0, 0)).getUTCDate()));
        break;
      case "PageDown":
        next = keyFromYmd(year, month0 + 1, Math.min(day, new Date(Date.UTC(year, month0 + 2, 0)).getUTCDate()));
        break;
    }
    if (next) {
      e.preventDefault();
      moveFocus(next);
    }
  }

  const monthLabel = monthKeyLabel(month);
  const headingId = `cal-heading-${month}`;
  const monthHasToday = monthKeyOf(todayKey) === month;
  const typesInView = new Set(
    weeks.flat().flatMap((k) => (monthKeyOf(k) === month ? (index.get(k) ?? []).map((e) => e.type) : [])),
  );

  return (
    <div className="overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-white shadow-pop">
      {/* Month bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-espresso bg-cream-deep px-3 py-3 sm:px-5 sm:py-4">
        <h3 id={headingId} className="font-display text-2xl leading-none text-espresso sm:text-3xl" aria-live="polite">
          {monthLabel}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onMonthChange(monthKeyOf(todayKey));
              setFocusKey(todayKey);
            }}
            aria-label={monthHasToday ? "Today (showing this month)" : "Today: jump to this month"}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-espresso px-4 font-heading text-sm font-bold text-espresso transition-colors hover:bg-sunflower",
              monthHasToday ? "bg-cream-deep" : "bg-white",
            )}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Today
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso bg-white text-espresso transition-all hover:-translate-y-0.5 hover:bg-pink hover:shadow-pop-sm"
            aria-label={`Previous month, ${monthKeyLabel(shiftMonth(month, -1))}`}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso bg-white text-espresso transition-all hover:-translate-y-0.5 hover:bg-pink hover:shadow-pop-sm"
            aria-label={`Next month, ${monthKeyLabel(shiftMonth(month, 1))}`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={headingId}
        onKeyDown={onGridKeyDown}
        className="w-full table-fixed border-collapse"
      >
        <thead>
          <tr>
            {WEEKDAYS.map(([letter, short, long], i) => (
              <th
                key={long}
                scope="col"
                className={cn(
                  "py-2 text-center font-heading text-[11px] font-extrabold uppercase tracking-widest text-cocoa sm:text-xs",
                  i >= 5 && "text-rose-ink",
                )}
              >
                <span aria-hidden className="sm:hidden">
                  {letter}
                </span>
                <span aria-hidden className="hidden sm:inline">
                  {short}
                </span>
                <span className="sr-only">{long}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((key) => {
                const dayEvents = index.get(key) ?? [];
                const outside = monthKeyOf(key) !== month;
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                const isPast = key < todayKey;
                const { day } = parseKey(key);
                const count = dayEvents.length;
                const label = [
                  dayKeyLong(key),
                  isToday ? "today" : null,
                  count === 0 ? "no events" : `${count} event${count === 1 ? "" : "s"}`,
                  count > 0 ? dayEvents.map((e) => `${e.title}${e.sample ? " (sample)" : ""}`).join(", ") : null,
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <td key={key} className="border-t border-l border-line p-0 first:border-l-0">
                    <button
                      type="button"
                      data-day={key}
                      tabIndex={key === tabKey ? 0 : -1}
                      aria-label={label}
                      aria-pressed={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      onFocus={() => setFocusKey(key)}
                      onClick={() => {
                        setFocusKey(key);
                        if (outside) onMonthChange(monthKeyOf(key));
                        onSelect(isSelected ? null : key);
                      }}
                      className={cn(
                        "group/day relative flex h-14 w-full flex-col items-center gap-1 px-0.5 pt-1.5 text-left transition-colors focus-visible:-outline-offset-4 sm:h-24 sm:items-stretch sm:px-1.5 sm:pt-1.5 lg:h-28",
                        outside ? "bg-cream/60" : "bg-white",
                        count > 0 && !isSelected && "hover:bg-cream-deep",
                        count === 0 && !isSelected && "hover:bg-cream",
                        isSelected && "bg-blush",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold sm:h-8 sm:w-8",
                          outside ? "text-cocoa/70" : isPast ? "text-cocoa/80" : "text-espresso",
                          count > 0 && !outside && "font-extrabold",
                          isToday && "border-2 border-espresso bg-pink text-espresso",
                          isSelected && "border-2 border-espresso bg-espresso text-cream",
                        )}
                        aria-hidden
                      >
                        {day}
                      </span>

                      {/* Mobile: dots */}
                      {count > 0 && (
                        <span className="flex items-center justify-center gap-0.5 sm:hidden" aria-hidden>
                          {dayEvents.slice(0, 3).map((e) => (
                            <span
                              key={e.slug}
                              className="h-2 w-2 rounded-full ring-1 ring-espresso/40"
                              style={{ backgroundColor: typeMeta(e.type).color }}
                            />
                          ))}
                        </span>
                      )}

                      {/* Desktop: chips */}
                      {count > 0 && (
                        <span className="hidden min-w-0 flex-col gap-1 sm:flex" aria-hidden>
                          {dayEvents.slice(0, 2).map((e) => {
                            const t = typeMeta(e.type);
                            return (
                              <span
                                key={e.slug}
                                className={cn(
                                  "flex min-w-0 items-baseline gap-1 rounded-md border-l-4 px-1.5 py-1 text-[11px] leading-tight font-bold text-espresso lg:text-xs",
                                  (outside || isPast) && "opacity-80",
                                )}
                                style={{ borderColor: t.color, backgroundColor: `${t.color}33` }}
                              >
                                <span className="truncate">{e.title}</span>
                                {/* Kept outside the truncation so the marker always shows */}
                                {e.sample && <span className="shrink-0 font-semibold text-cocoa">(sample)</span>}
                              </span>
                            );
                          })}
                          {count > 2 && (
                            <span className="px-1.5 text-[11px] font-bold text-cocoa">+{count - 2} more</span>
                          )}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Key */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-espresso bg-cream-deep px-4 py-3 text-xs text-cocoa sm:px-5">
        <span className="font-heading font-bold text-espresso">Key</span>
        {eventTypes
          .filter((t) => typesInView.has(t.id))
          .map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full ring-1 ring-espresso/40" style={{ backgroundColor: t.color }} aria-hidden />
              {t.label}
            </span>
          ))}
        {typesInView.size === 0 && <span>No events this month</span>}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-espresso bg-pink" aria-hidden />
          Today
        </span>
        <span className="ml-auto hidden text-cocoa/80 md:inline">Tip: use the arrow keys to move between days</span>
      </div>
    </div>
  );
}
