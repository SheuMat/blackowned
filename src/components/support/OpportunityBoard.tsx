"use client";

import { useEffect, useId, useState } from "react";
import { ArrowUpDown, Check, Inbox } from "lucide-react";
import { deadlineTime, opportunityKinds, type Opportunity, type OpportunityKind } from "@/content/opportunities";
import { cn } from "@/lib/utils";
import { OpportunityCard } from "./OpportunityCard";

type Sort = "deadline" | "newest";

/**
 * Filterable, sortable opportunities board. `now` comes from the server so
 * countdown labels match between server render and hydration.
 */
export function OpportunityBoard({ opportunities, now }: { opportunities: Opportunity[]; now: number }) {
  const [kind, setKind] = useState<OpportunityKind | "all">("all");
  const [sort, setSort] = useState<Sort>("deadline");
  const [showClosed, setShowClosed] = useState(false);
  const ids = useId();

  // Links from the lounge point at /business-support/opportunities#<id>: open that card's details
  useEffect(() => {
    function openFromHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const details = document.getElementById(id)?.querySelector("details");
      if (details) details.open = true;
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const isOpen = (o: Opportunity) => deadlineTime(o) >= now;
  const pool = showClosed ? opportunities : opportunities.filter(isOpen);
  const closedCount = opportunities.length - opportunities.filter(isOpen).length;

  const counts = Object.fromEntries(opportunityKinds.map((k) => [k.id, pool.filter((o) => o.kind === k.id).length])) as Record<
    OpportunityKind,
    number
  >;

  const results = pool
    .filter((o) => kind === "all" || o.kind === kind)
    .sort((a, b) => {
      // Closed ones always sink to the bottom
      const open = Number(isOpen(b)) - Number(isOpen(a));
      if (open !== 0) return open;
      if (sort === "newest") return b.posted.localeCompare(a.posted);
      return isOpen(a) ? deadlineTime(a) - deadlineTime(b) : deadlineTime(b) - deadlineTime(a);
    });

  const activeKind = opportunityKinds.find((k) => k.id === kind);
  const plural = activeKind ? activeKind.plural.toLowerCase() : "opportunities";
  const singular = activeKind ? activeKind.label.toLowerCase() : "opportunity";

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-4 shadow-pop-sm sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div role="group" aria-label="Filter by type" className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
          <KindChip active={kind === "all"} onClick={() => setKind("all")} count={pool.length}>
            All
          </KindChip>
          {opportunityKinds.map((k) => (
            <KindChip
              key={k.id}
              active={kind === k.id}
              onClick={() => setKind(k.id)}
              count={counts[k.id]}
              dot={k.color}
            >
              {k.plural}
            </KindChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-rose" aria-hidden />
            <label htmlFor={`${ids}-sort`} className="font-heading text-sm font-bold text-espresso">
              Sort
            </label>
            <select
              id={`${ids}-sort`}
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 cursor-pointer appearance-none rounded-full border-2 border-espresso/15 bg-cream bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%232a1910%22%20stroke-width%3D%222.5%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-9 pl-4 text-sm font-semibold text-espresso hover:border-espresso/40 focus:border-espresso focus:outline-none"
            >
              <option value="deadline">Closing soonest</option>
              <option value="newest">Newest first</option>
            </select>
          </div>
          {closedCount > 0 && (
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-cocoa">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded-md accent-espresso"
              />
              Show closed ({closedCount})
            </label>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm font-medium text-cocoa" aria-live="polite">
        {results.length === 0
          ? `No ${plural} open right now`
          : `Showing ${results.length} ${results.length === 1 ? singular : plural}`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((o) => (
            <li key={o.id}>
              <OpportunityCard opportunity={o} now={now} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-[1.5rem] border-2 border-dashed border-espresso/25 bg-cream-deep px-6 py-12 text-center">
          <Inbox className="h-10 w-10 text-rose" aria-hidden />
          <p className="mt-3 font-heading text-lg font-extrabold text-espresso">Nothing here at the moment</p>
          <p className="mt-1 max-w-sm text-sm text-cocoa">
            New opportunities are added as we find them. Check back soon, or share one you&apos;ve seen.
          </p>
        </div>
      )}
    </div>
  );
}

function KindChip({
  active,
  onClick,
  count,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  dot?: string;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold whitespace-nowrap transition-all",
        active ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-cocoa hover:border-espresso/50",
      )}
    >
      {active ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        dot && <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-espresso/30" style={{ backgroundColor: dot }} />
      )}
      {children}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none",
          active ? "bg-pink text-espresso" : "bg-cream-deep text-cocoa",
        )}
      >
        <span className="sr-only">(</span>
        {count}
        <span className="sr-only">)</span>
      </span>
    </button>
  );
}
