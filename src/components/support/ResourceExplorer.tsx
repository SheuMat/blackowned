"use client";

import { useId, useMemo, useState } from "react";
import { Check, Search, SearchX, X } from "lucide-react";
import type { SupportResource } from "@/content/support";
import { cn } from "@/lib/utils";
import { ResourceCard } from "./ResourceCard";

/** Search and tag filter for a section's resources */
export function ResourceExplorer({
  resources,
  sectionId,
  sectionTitle,
  memberName,
}: {
  resources: SupportResource[];
  sectionId: string;
  sectionTitle: string;
  memberName?: string;
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState(false);
  const searchId = useId();

  // Tags ordered by how often they appear, then alphabetically
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of resources) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [resources]);

  const q = query.trim().toLowerCase();
  const results = resources.filter((r) => {
    if (tag && !r.tags.includes(tag)) return false;
    if (!q) return true;
    return [r.title, r.provider, r.description, ...r.tags].join(" ").toLowerCase().includes(q);
  });

  const filtered = q.length > 0 || tag !== null;

  // Keep the chip list short: the most-used tags first, the rest behind "More"
  const TAG_LIMIT = 8;
  const hiddenTags = Math.max(0, tags.length - TAG_LIMIT);
  const visibleTags = allTags || hiddenTags === 0 ? tags : tags.slice(0, TAG_LIMIT);
  if (tag && !visibleTags.includes(tag)) visibleTags.push(tag);

  return (
    <div>
      <div className="rounded-[1.5rem] border-2 border-espresso bg-white p-4 shadow-pop-sm sm:p-5">
        <label htmlFor={searchId} className="sr-only">
          Search {sectionTitle}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-cocoa/60" aria-hidden />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="h-12 w-full rounded-full border-2 border-espresso/15 bg-cream pr-12 pl-12 text-[15px] text-espresso placeholder:text-cocoa/60 focus:border-espresso focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cocoa hover:bg-espresso/5"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        {tags.length > 1 && (
          <div className="mt-4">
            <p id={`${searchId}-tags`} className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-cocoa/80">
              Filter by tag
            </p>
            {/* One swipeable row on phones, wrapped from sm up */}
            <div
              role="group"
              aria-labelledby={`${searchId}-tags`}
              className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              <TagChip active={tag === null} onClick={() => setTag(null)}>
                All
              </TagChip>
              {visibleTags.map((t) => (
                <TagChip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </TagChip>
              ))}
              {hiddenTags > 0 && (
                <button
                  type="button"
                  onClick={() => setAllTags((v) => !v)}
                  aria-expanded={allTags}
                  className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold text-rose-ink underline-offset-4 hover:underline"
                >
                  {allTags ? "Fewer tags" : `+${hiddenTags} more`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-cocoa" aria-live="polite">
          {results.length === resources.length
            ? `${resources.length} ${resources.length === 1 ? "resource" : "resources"}`
            : `Showing ${results.length} of ${resources.length}`}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag(null);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-rose-ink underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-5 pt-2 md:grid-cols-2">
          {results.map((r) => (
            <li key={r.id}>
              <ResourceCard resource={r} sectionId={sectionId} memberName={memberName} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-[1.5rem] border-2 border-dashed border-espresso/25 bg-cream-deep px-6 py-12 text-center">
          <SearchX className="h-10 w-10 text-rose" aria-hidden />
          <p className="mt-3 font-heading text-lg font-extrabold text-espresso">Nothing matches that yet</p>
          <p className="mt-1 max-w-sm text-sm text-cocoa">
            Try another word or tag. Know a resource that should be here? Suggest it and we&apos;ll take a look.
          </p>
        </div>
      )}
    </div>
  );
}

function TagChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-4 text-sm font-semibold transition-all",
        active ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-cocoa hover:border-espresso/50",
      )}
    >
      {active && <Check className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </button>
  );
}
