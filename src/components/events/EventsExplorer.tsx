"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, CalendarDays, List, X } from "lucide-react";
import { EventCard } from "@/components/cards/EventCard";
import { Eyebrow } from "@/components/ui/layout";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { eventTypes } from "@/content/events";
import type { BosEvent, EventType } from "@/content/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EventCalendar, buildDayIndex } from "./EventCalendar";
import {
  countEvents,
  dayKeyLong,
  dayKeyWeekday,
  eventDayKeys,
  eventTypeNoun,
  eventTypePlural,
  londonDayKey,
  monthKeyLabel,
  monthKeyOf,
} from "./eventUtils";

type View = "list" | "calendar";
type Filter = "all" | EventType;

const noopSubscribe = () => () => {};

/** `?type=networking` etc. from the URL (the page is static, so read it in the browser) */
function readTypeParam(): Filter | null {
  const t = new URLSearchParams(window.location.search).get("type");
  return t && eventTypes.some((e) => e.id === t) ? (t as EventType) : null;
}

/**
 * Upcoming events with a List / Calendar toggle and type filters.
 * `serverToday` keeps the first render identical to the server HTML; the
 * browser's own date takes over straight after hydration.
 */
export function EventsExplorer({
  upcoming,
  past,
  serverToday,
  initialMonth,
}: {
  upcoming: BosEvent[];
  past: BosEvent[];
  serverToday: string;
  initialMonth: string;
}) {
  const todayKey = useSyncExternalStore(noopSubscribe, () => londonDayKey(new Date()), () => serverToday);
  const [view, setView] = useState<View>("list");
  const typeParam = useSyncExternalStore(noopSubscribe, readTypeParam, () => null);
  const [chosenFilter, setFilter] = useState<Filter | null>(null);
  // The visitor's own choice wins; otherwise start from ?type= in the link
  const filter: Filter = chosenFilter ?? typeParam ?? "all";
  const [month, setMonth] = useState(initialMonth);
  const [selected, setSelected] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  // On phones the chips scroll sideways: keep the active one in view, so a
  // link like ?type=social doesn't open with its chip hidden off to the right
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    if (left < row.scrollLeft || left + chip.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: Math.max(0, left - 16), behavior: "smooth" });
    }
  }, [filter]);

  const pastSlugs = useMemo(() => new Set(past.map((e) => e.slug)), [past]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(eventTypes.map((t) => [t.id, 0])) as Record<EventType, number>;
    for (const e of upcoming) c[e.type]++;
    return c;
  }, [upcoming]);

  const upcomingShown = useMemo(
    () => upcoming.filter((e) => filter === "all" || e.type === filter),
    [upcoming, filter],
  );

  // Calendar plots everything with an exact date (past and future)
  const calendarEvents = useMemo(
    () =>
      [...upcoming, ...past]
        .filter((e) => !e.displayDate && (filter === "all" || e.type === filter))
        .sort((a, b) => a.start.localeCompare(b.start)),
    [upcoming, past, filter],
  );
  const dayIndex = useMemo(() => buildDayIndex(calendarEvents), [calendarEvents]);
  const monthsWithEvents = useMemo(
    () => [...new Set([...dayIndex.keys()].map(monthKeyOf))].sort(),
    [dayIndex],
  );

  const selectedInView = selected && monthKeyOf(selected) === month ? selected : null;
  const calendarList = selectedInView
    ? (dayIndex.get(selectedInView) ?? [])
    : calendarEvents.filter((e) => eventDayKeys(e).some((k) => monthKeyOf(k) === month));

  const nextMonthWithEvents = monthsWithEvents.find((m) => m > month);
  const prevMonthWithEvents = [...monthsWithEvents].reverse().find((m) => m < month);

  const groups = useMemo(() => {
    const map = new Map<string, BosEvent[]>();
    for (const e of upcomingShown) {
      const k = monthKeyOf(londonDayKey(e.start));
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return [...map.entries()];
  }, [upcomingShown]);

  function changeMonth(m: string) {
    setMonth(m);
    setSelected((s) => (s && monthKeyOf(s) === m ? s : null));
  }

  const typeFilter = filter === "all" ? undefined : filter;
  const status =
    view === "list"
      ? `Showing ${countEvents(upcomingShown.length, typeFilter)} coming up`
      : selectedInView
        ? `Showing ${countEvents(calendarList.length, typeFilter)} on ${dayKeyLong(selectedInView)}`
        : `Showing ${countEvents(calendarList.length, typeFilter)} in ${monthKeyLabel(month)}`;

  return (
    <div>
      {/* Heading + view toggle */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>The diary</Eyebrow>
          <h2 id="whats-on-heading" className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-5xl">
            Coming up
          </h2>
          <p className="mt-3 text-lg text-cocoa">
            Filter by the kind of thing you&apos;re after, or switch to the calendar to plan ahead.
          </p>
        </div>
        <div
          role="group"
          aria-label="Choose how to view events"
          className="inline-flex shrink-0 self-start rounded-full border-2 border-espresso bg-white p-1 shadow-pop-sm md:self-auto"
        >
          {(
            [
              ["list", "List", List],
              ["calendar", "Calendar", CalendarDays],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-5 font-heading text-[15px] font-bold transition-colors",
                view === id ? "bg-espresso text-cream" : "text-espresso hover:bg-cream-deep",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div
        ref={chipsRef}
        role="group"
        aria-label="Filter by event type"
        className="scrollbar-none -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pt-1 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All events" count={upcoming.length} />
        {eventTypes.map((t) => (
          <FilterChip
            key={t.id}
            active={filter === t.id}
            onClick={() => setFilter(filter === t.id ? "all" : t.id)}
            label={eventTypePlural[t.id]}
            count={counts[t.id]}
            color={t.color}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {status}
      </p>

      {view === "calendar" ? (
        <div className="mt-6">
          <EventCalendar
            month={month}
            onMonthChange={changeMonth}
            selectedKey={selectedInView}
            onSelect={setSelected}
            todayKey={todayKey}
            events={calendarEvents}
          />

          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-heading text-2xl font-extrabold text-espresso sm:text-3xl">
                {selectedInView ? `On ${dayKeyWeekday(selectedInView)}` : `In ${monthKeyLabel(month)}`}
              </h3>
              {selectedInView && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-colors hover:bg-pink"
                >
                  <X className="h-4 w-4" aria-hidden />
                  Show all of {monthKeyLabel(month).split(" ")[0]}
                </button>
              )}
            </div>

            {calendarList.length > 0 ? (
              <ul className="mt-5 grid gap-4 lg:grid-cols-2">
                {calendarList.map((e) => (
                  <li key={e.slug}>
                    <EventCard event={e} past={pastSlugs.has(e.slug)} className="h-full" headingAs="h4" />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title={
                  selectedInView
                    ? `Nothing on ${dayKeyWeekday(selectedInView)}${selectedInView < todayKey ? "" : " yet"}.`
                    : `Nothing in the diary for ${monthKeyLabel(month)}${month < monthKeyOf(todayKey) ? "" : " yet"}.`
                }
              >
                {selectedInView ? (
                  <button type="button" onClick={() => setSelected(null)} className={chipButton}>
                    See the rest of {monthKeyLabel(month).split(" ")[0]}
                  </button>
                ) : (
                  <>
                    {nextMonthWithEvents && (
                      <button type="button" onClick={() => changeMonth(nextMonthWithEvents)} className={chipButton}>
                        Jump to {monthKeyLabel(nextMonthWithEvents)}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                    {!nextMonthWithEvents && prevMonthWithEvents && (
                      <button type="button" onClick={() => changeMonth(prevMonthWithEvents)} className={chipButton}>
                        Back to {monthKeyLabel(prevMonthWithEvents)}
                      </button>
                    )}
                  </>
                )}
              </EmptyState>
            )}
          </div>
        </div>
      ) : groups.length > 0 ? (
        <div className="mt-8 space-y-12">
          {groups.map(([m, list]) => (
            <section key={m} aria-labelledby={`month-${m}`}>
              <div className="flex items-center gap-4">
                <h3 id={`month-${m}`} className="flex items-baseline gap-2 text-espresso">
                  <span className="font-display text-3xl leading-none sm:text-4xl">{monthKeyLabel(m).split(" ")[0]}</span>
                  <span className="font-heading text-lg font-bold text-cocoa">{m.slice(0, 4)}</span>
                </h3>
                <span aria-hidden className="h-0.5 flex-1 rounded-full bg-espresso/15" />
                <span className="shrink-0 rounded-full bg-sand px-3 py-1 text-xs font-bold text-cocoa">
                  {list.length} event{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="mt-5 grid gap-4 lg:grid-cols-2">
                {list.map((e) => (
                  <li key={e.slug}>
                    <EventCard event={e} className="h-full" headingAs="h4" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            filter === "all"
              ? "No dates in the diary right now."
              : `No ${eventTypeNoun[filter][1]} in the diary right now.`
          }
        >
          {filter !== "all" && (
            <button type="button" onClick={() => setFilter("all")} className={chipButton}>
              Show all events
            </button>
          )}
          <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className={chipButton}>
            <InstagramIcon className="h-4 w-4" />
            Follow {site.instagramHandle} for new dates
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </EmptyState>
      )}
    </div>
  );
}

const chipButton =
  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 py-2 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-sunflower hover:shadow-pop-sm";

function FilterChip({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label}, ${count} upcoming`}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 font-heading text-sm font-bold whitespace-nowrap transition-all xl:gap-1.5 xl:px-3.5",
        active
          ? "border-espresso bg-espresso text-cream shadow-pop-sm"
          : "border-espresso/15 bg-white text-espresso hover:border-espresso",
        !active && count === 0 && "text-cocoa/80",
      )}
    >
      {color && (
        <span
          aria-hidden
          className="h-3 w-3 rounded-full ring-2 ring-white/70"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
      <span
        aria-hidden
        className={cn(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-extrabold",
          active ? "bg-cream text-espresso" : "bg-cream-deep text-cocoa",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-cream-deep p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <p className="font-heading text-lg font-bold text-espresso">{title}</p>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
