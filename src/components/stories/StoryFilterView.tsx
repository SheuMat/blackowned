import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import type { StoryCategory } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Presentational story grid + category tabs. Rendered on the server as the
 * no-JS fallback (all stories) and by <StoryFilter> on the client once the
 * ?category= search param is known. No hooks here, so it works in both.
 */

export type StoryFilterItem = {
  slug: string;
  category: StoryCategory;
  /** Hide from the unfiltered "All" grid (e.g. the featured story shown above) */
  hideInAll?: boolean;
  node: ReactNode;
};

export type StoryFilterTab = { id: StoryCategory; label: string; count: number };

export function storyFilterHref(id: StoryCategory | null) {
  return id ? `/stories?category=${id}#latest` : "/stories#latest";
}

export function StoryFilterView({
  items,
  tabs,
  active,
}: {
  items: StoryFilterItem[];
  tabs: StoryFilterTab[];
  active: StoryCategory | null;
}) {
  const visible = active ? items.filter((i) => i.category === active) : items.filter((i) => !i.hideInAll);
  const activeTab = tabs.find((t) => t.id === active);
  const total = items.length;

  return (
    <div>
      <nav aria-label="Filter stories by category" className="-mx-4 sm:mx-0">
        {/* `relative` keeps the sr-only count labels inside the scroller, otherwise they widen the page on mobile */}
        <ul className="scrollbar-none relative flex gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:overflow-visible sm:px-0">
          <li className="shrink-0">
            <FilterLink href={storyFilterHref(null)} active={!active} count={total}>
              All stories
            </FilterLink>
          </li>
          {tabs.map((t) => (
            <li key={t.id} className="shrink-0">
              <FilterLink href={storyFilterHref(t.id)} active={active === t.id} count={t.count}>
                {t.label}
              </FilterLink>
            </li>
          ))}
        </ul>
      </nav>

      <p aria-live="polite" className="mt-6 text-sm font-semibold text-cocoa">
        {active
          ? `${visible.length} ${visible.length === 1 ? "story" : "stories"} in ${activeTab?.label ?? "this category"}`
          : `The latest from the BOS team`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <li key={i.slug} className="h-full">
              {i.node}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyCategory category={active} label={activeTab?.label} />
      )}
    </div>
  );
}

function FilterLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 font-heading text-sm font-bold whitespace-nowrap transition-all",
        active
          ? "border-espresso bg-espresso text-cream shadow-pop-pink"
          : "border-espresso/15 bg-white text-espresso hover:-translate-y-0.5 hover:border-espresso",
      )}
    >
      {children}
      <span
        className={cn(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs",
          active ? "bg-pink text-espresso" : "bg-cream-deep text-cocoa",
        )}
      >
        {count}
        <span className="sr-only">{count === 1 ? " story" : " stories"}</span>
      </span>
    </Link>
  );
}

function EmptyCategory({ category, label }: { category: StoryCategory | null; label?: string }) {
  const launches = category === "launches";
  return (
    <div className="mt-5 flex flex-col items-start gap-5 rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-white/60 p-8 sm:flex-row sm:items-center sm:p-10">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
        <Megaphone className="h-6 w-6 text-espresso" aria-hidden />
      </span>
      <div className="flex-1">
        <h3 className="font-heading text-xl font-extrabold text-espresso">
          {launches ? "No launch news yet. Yours could be first." : `Nothing in ${label ?? "this category"} just yet`}
        </h3>
        <p className="mt-1 text-cocoa">
          {launches
            ? "Opening a shop, launching a product or starting a new service? Tell us and we'll help spread the word."
            : "We're always looking for stories from Black-owned businesses across Sheffield and South Yorkshire."}
        </p>
      </div>
      <Link
        href={launches ? "/contact?subject=launch" : "/contact?subject=story"}
        className={buttonClasses({ variant: "pink", className: "shrink-0" })}
      >
        {launches ? "Let us know" : "Tell us a story"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
