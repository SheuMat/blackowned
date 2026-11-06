"use client";

import { useEffect, useEffectEvent, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { regions } from "@/content/areas";
import { categories } from "@/content/categories";
import type { Business, CategoryId } from "@/content/types";
import {
  categoryCounts,
  defaultDirectoryQuery,
  searchBusinesses,
  sortOptions,
  type DirectoryQuery,
} from "@/lib/directory-search";
import { cn } from "@/lib/utils";
import { AreaSelect, CategoryChip, ToggleChip, patchForArea, patchForRegion, toggleKeys } from "./FilterControls";

/**
 * Mobile filters: a slide-up sheet. Changes are a draft until "Show results".
 * Render it conditionally inside <AnimatePresence> so it animates in and out.
 */
export function FilterSheet({
  initial,
  businesses,
  now,
  onApply,
  onClose,
}: {
  initial: DirectoryQuery;
  businesses: Business[];
  now: number | null;
  onApply: (next: DirectoryQuery) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<DirectoryQuery>(initial);
  const reduce = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const counts = useMemo(() => categoryCounts(businesses), [businesses]);
  const resultCount = useMemo(() => searchBusinesses(businesses, draft, { now }).length, [businesses, draft, now]);
  const set = (patch: Partial<DirectoryQuery>) => setDraft((d) => ({ ...d, ...patch }));
  const toggleCategory = (id: CategoryId) =>
    setDraft((d) => ({
      ...d,
      categories: d.categories.includes(id) ? d.categories.filter((c) => c !== id) : [...d.categories, id],
    }));

  const requestClose = useEffectEvent(() => onClose());

  // Lock page scroll, focus the sheet, Escape closes, Tab stays inside.
  // The backdrop and the sheet's header/footer also refuse touch panning
  // (touch-none) and the list contains its own overscroll, so the page can't
  // be dragged behind the sheet on phones that ignore `overflow: hidden`.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), select:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <motion.div
        className="absolute inset-0 touch-none bg-espresso/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[2rem] border-2 border-b-0 border-espresso bg-cream shadow-lift"
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
      >
        <div className="flex touch-none justify-center pt-3" aria-hidden>
          <span className="h-1.5 w-12 rounded-full bg-espresso/20" />
        </div>
        <div className="flex touch-none items-center justify-between px-5 pt-2 pb-3">
          <h2 id={titleId} className="font-heading text-2xl font-extrabold">
            Filters
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 touch-pan-y space-y-7 overflow-y-auto overscroll-contain px-5 pt-2 pb-6">
          <fieldset>
            <legend className="mb-3 font-heading text-sm font-bold tracking-wide uppercase">Category</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  count={counts[c.id]}
                  selected={draft.categories.includes(c.id)}
                  onToggle={() => toggleCategory(c.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-heading text-sm font-bold tracking-wide uppercase">Town</legend>
            <div className="flex flex-wrap gap-2">
              {[{ id: null, label: "All towns" }, ...regions].map((r) => {
                const selected = draft.region === r.id;
                return (
                  <button
                    key={r.id ?? "all"}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => set(patchForRegion(draft, r.id))}
                    className={cn(
                      "min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                      selected ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white hover:border-espresso/60",
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <AreaSelect
              className="mt-4"
              region={draft.region}
              value={draft.area}
              onChange={(area) => set(area ? patchForArea(area) : { area: null })}
            />
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-heading text-sm font-bold tracking-wide uppercase">Good to know</legend>
            <div className="flex flex-wrap gap-2">
              {toggleKeys.map((k) => (
                <ToggleChip key={k} name={k} pressed={draft[k]} onToggle={() => set({ [k]: !draft[k] })} />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-heading text-sm font-bold tracking-wide uppercase">Sort by</legend>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((o) => {
                const selected = draft.sort === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => set({ sort: o.value })}
                    className={cn(
                      "min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                      selected ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white hover:border-espresso/60",
                    )}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex touch-none items-center gap-3 border-t-2 border-espresso/10 bg-cream px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setDraft({ ...defaultDirectoryQuery, q: draft.q, view: draft.view })}
            className="h-12 shrink-0 rounded-full px-4 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:bg-espresso/5"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border-2 border-espresso bg-pink font-heading text-base font-bold text-espresso shadow-pop-sm transition-all active:translate-y-0.5 active:shadow-none"
          >
            {resultCount === 0 ? "Apply (no matches)" : `Show ${resultCount} ${resultCount === 1 ? "business" : "businesses"}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
