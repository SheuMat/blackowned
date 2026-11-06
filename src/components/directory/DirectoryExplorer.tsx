"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { LocateFixed, MapPin, SearchX, SlidersHorizontal, X } from "lucide-react";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { BusinessMap } from "@/components/map/BusinessMap";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Blob } from "@/components/ui/Shapes";
import { ToneText } from "@/components/ui/ToneText";
import { businesses } from "@/content/businesses";
import { categories } from "@/content/categories";
import {
  activeFilterPills,
  categoryCounts,
  countActiveFilters,
  createDirectoryIndex,
  defaultDirectoryQuery,
  isPinnable,
  parseDirectoryQuery,
  popularTerms,
  searchBusinesses,
  serializeDirectoryQuery,
  sortOptions,
  type DirectoryQuery,
  type DirectoryResult,
  type DirectorySort,
  type Suggestion,
} from "@/lib/directory-search";
import { cn } from "@/lib/utils";
import {
  AreaSelect,
  CategoryChip,
  RegionSelect,
  SelectControl,
  ToggleChip,
  ViewSwitcher,
  patchForArea,
  patchForRegion,
  toggleKeys,
} from "./FilterControls";
import { FilterSheet } from "./FilterSheet";
import { SearchBox } from "./SearchBox";
import { useNow } from "./useNow";

const PATH = "/directory";
const index = createDirectoryIndex(businesses);
const counts = categoryCounts(businesses);
const terms = popularTerms(businesses, 7);

/** Reads the query string. Must sit inside <Suspense> on a static page. */
export function DirectoryExplorerFromUrl() {
  const params = useSearchParams();
  return <DirectoryExplorer paramsString={params.toString()} />;
}

type Geo = "idle" | "locating" | "denied" | "unsupported";

export function DirectoryExplorer({ paramsString = "" }: { paramsString?: string }) {
  const router = useRouter();
  const query = useMemo(() => parseDirectoryQuery(paramsString), [paramsString]);
  const now = useNow();

  // ── Keyword: typed locally, written to the URL after a pause ──
  const [qInput, setQInput] = useState(query.q);
  const [seenQ, setSeenQ] = useState(query.q);
  const [writtenQ, setWrittenQ] = useState(query.q);
  if (query.q !== seenQ) {
    setSeenQ(query.q);
    // Only adopt URL changes we didn't make ourselves (e.g. a link to /directory?q=…)
    if (query.q !== writtenQ) {
      setQInput(query.q);
      setWrittenQ(query.q);
    }
  }
  const q = useDeferredValue(qInput);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const write = (next: DirectoryQuery) => {
    window.clearTimeout(timer.current);
    const qs = serializeDirectoryQuery(next);
    setWrittenQ(next.q.trim());
    window.history.replaceState(null, "", qs ? `${PATH}?${qs}` : PATH);
  };
  const update = (patch: Partial<DirectoryQuery>) => {
    if (patch.q !== undefined) setQInput(patch.q);
    write({ ...query, q: qInput, ...patch });
  };
  const onType = (value: string) => {
    setQInput(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => write({ ...query, q: value }), 400);
  };

  // ── Distance sorting ──
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [geo, setGeo] = useState<Geo>("idle");
  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo("unsupported");
      return;
    }
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeo("idle");
      },
      () => setGeo("denied"),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  };
  const setSort = (sort: DirectorySort) => {
    update({ sort });
    if (sort === "nearest" && !origin) locate();
  };

  // ── Results ──
  const effective = useMemo(() => ({ ...query, q }), [query, q]);
  const results = useMemo(
    () => searchBusinesses(businesses, effective, { now, origin, index }),
    [effective, now, origin],
  );
  const resultBusinesses = useMemo(() => results.map((r) => r.business), [results]);
  const pills = activeFilterPills({ ...query, q: qInput });
  const filterCount = countActiveFilters(query);
  const showDistance = query.sort === "nearest" && !!origin;

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const filtersButton = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const scrollToResults = () => {
    const el = resultsRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    if (window.scrollY < top - 40) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    }
  };

  const clearAll = () => {
    setQInput("");
    write({ ...defaultDirectoryQuery, sort: query.sort, view: query.view });
  };

  const onPick = (s: Suggestion) => {
    if (s.kind === "business") {
      router.push(`/directory/${s.business.slug}`);
      return;
    }
    if (s.kind === "category") update({ q: "", categories: [s.id] });
    else if (s.kind === "area") {
      if (s.id.startsWith("region:")) update({ q: "", ...patchForRegion(query, s.id.slice(7) as DirectoryQuery["region"]) });
      else update({ q: "", ...patchForArea(s.id) });
    } else update({ q: s.label });
    scrollToResults();
  };

  const toggleCategory = (id: (typeof categories)[number]["id"]) =>
    update({
      categories: query.categories.includes(id) ? query.categories.filter((c) => c !== id) : [...query.categories, id],
    });

  const closeSheet = () => {
    setSheetOpen(false);
    requestAnimationFrame(() => filtersButton.current?.focus({ preventScroll: true }));
  };

  const n = results.length;
  const countLabel = `${n} ${n === 1 ? "business" : "businesses"}`;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Directory" }]}
        eyebrow="Black business directory"
        accent="tangerine"
        title={
          <>
            Find and back <ToneText className="font-normal whitespace-nowrap">Black-owned</ToneText> businesses
          </>
        }
        description="A free directory of Black-owned businesses across Sheffield, Rotherham, Doncaster and Chesterfield. Search by name, service or neighbourhood, then go and show them some love."
      >
        <div className="max-w-3xl">
          <SearchBox
            portal
            // Short enough to show in full on a 375px phone
            placeholder="Try jollof, braids or S11"
            value={qInput}
            onChange={onType}
            onSubmit={(v) => {
              update({ q: v });
              scrollToResults();
            }}
            onPick={onPick}
            businesses={businesses}
          />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-heading text-sm font-bold text-cocoa">Popular:</span>
            {terms.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  update({ q: t });
                  scrollToResults();
                }}
                className="min-h-11 rounded-full border-2 border-espresso/15 bg-cream px-3.5 text-sm font-semibold text-espresso capitalize transition-all hover:-translate-y-0.5 hover:border-espresso hover:shadow-pop-sm"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <section ref={resultsRef} aria-labelledby="directory-results" className="bg-cream pt-6 pb-16 sm:pt-10 sm:pb-20">
        <Container>
          {/* Desktop filters */}
          <div className="hidden rounded-[1.75rem] border-2 border-espresso bg-white p-5 shadow-pop-sm lg:block">
            <div className="flex items-center justify-between gap-4">
              <p className="font-heading text-sm font-bold tracking-wide text-cocoa uppercase">Category</p>
              {query.categories.length > 0 && (
                <button
                  type="button"
                  onClick={() => update({ categories: [] })}
                  className="-my-3 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-rose-ink underline decoration-2 underline-offset-4"
                >
                  Any category
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  category={c}
                  count={counts[c.id]}
                  selected={query.categories.includes(c.id)}
                  onToggle={() => toggleCategory(c.id)}
                />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-end gap-3 border-t-2 border-dashed border-espresso/10 pt-5">
              <RegionSelect className="w-44" value={query.region} onChange={(r) => update(patchForRegion(query, r))} />
              <AreaSelect
                className="w-64"
                region={query.region}
                value={query.area}
                onChange={(a) => update(a ? patchForArea(a) : { area: null })}
              />
              <div className="flex flex-wrap gap-2 xl:ml-auto">
                {toggleKeys.map((k) => (
                  <ToggleChip key={k} name={k} pressed={query[k]} onToggle={() => update({ [k]: !query[k] })} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile toolbar */}
          <div className="sticky top-[72px] z-30 -mx-4 flex items-center gap-2 bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
            <button
              ref={filtersButton}
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso shadow-pop-sm"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
              {filterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pink px-1.5 text-xs font-bold text-espresso">
                  {filterCount}
                </span>
              )}
            </button>
            <span className="flex-1" />
            <ViewSwitcher value={query.view} onChange={(view) => update({ view })} />
          </div>

          {/* Result summary */}
          <div className="mt-4 flex flex-col gap-4 lg:mt-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h2 id="directory-results" className="mr-1 font-heading text-2xl font-extrabold text-espresso">
                {countLabel}
              </h2>
              <p className="sr-only" aria-live="polite">
                {n === 0 ? "No businesses match your search" : `${countLabel} found`}
              </p>
              {pills.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => update(p.remove)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-espresso py-1 pr-2.5 pl-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cocoa"
                  aria-label={`Remove filter: ${p.label}`}
                >
                  {p.label}
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              ))}
              {pills.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="min-h-10 px-2 text-sm font-bold text-rose-ink underline decoration-2 underline-offset-4"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <SelectControl
                label="Sort by"
                hideLabel
                className="w-56"
                value={query.sort}
                onChange={(e) => setSort(e.target.value as DirectorySort)}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </SelectControl>
              <ViewSwitcher value={query.view} onChange={(view) => update({ view })} />
            </div>
          </div>

          {query.sort === "nearest" && !origin && (
            <NearestPrompt geo={geo} onLocate={locate} onCancel={() => update({ sort: "recommended" })} />
          )}

          {n === 0 ? (
            <EmptyState query={qInput} onClear={clearAll} />
          ) : query.view === "map" ? (
            <MapView results={results} selected={selected} onSelect={setSelected} />
          ) : query.view === "list" ? (
            <ul className="mt-6 grid gap-3 lg:grid-cols-2">
              {results.map((r) => (
                // min-w-0 lets the card's truncated text shrink instead of widening the page
                <li key={r.business.slug} className="relative min-w-0">
                  <BusinessCard business={r.business} compact className={cn(showDistance && "pr-20")} />
                  {showDistance && <DistancePill distance={r.distance} className="absolute top-4 right-4" />}
                </li>
              ))}
            </ul>
          ) : query.view === "split" ? (
            <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
              <ul className="grid content-start gap-3">
                {results.map((r) => (
                  <li
                    key={r.business.slug}
                    className="relative min-w-0"
                    onMouseEnter={() => setHovered(r.business.slug)}
                    onMouseLeave={() => setHovered((h) => (h === r.business.slug ? null : h))}
                    onFocus={() => setHovered(r.business.slug)}
                    onBlur={() => setHovered((h) => (h === r.business.slug ? null : h))}
                  >
                    <BusinessCard
                      business={r.business}
                      compact
                      className={cn(
                        "lg:pr-16",
                        selected === r.business.slug && "border-espresso shadow-pop-sm",
                      )}
                    />
                    <div className="pointer-events-none absolute top-3 right-3 flex flex-col items-end gap-2">
                      {isPinnable(r.business) ? (
                        <button
                          type="button"
                          onClick={() => setSelected(r.business.slug)}
                          className="pointer-events-auto hidden h-10 w-10 items-center justify-center rounded-full border-2 border-espresso bg-cream text-espresso transition-all hover:bg-pink hover:shadow-pop-sm lg:inline-flex"
                          aria-label={`Show ${r.business.name} on the map`}
                          title="Show on map"
                        >
                          <MapPin className="h-4 w-4" aria-hidden />
                        </button>
                      ) : (
                        <span className="hidden rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold text-cocoa lg:inline">Online</span>
                      )}
                      {showDistance && <DistancePill distance={r.distance} />}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="hidden lg:block">
                <div className="sticky top-[88px]">
                  <BusinessMap
                    businesses={resultBusinesses}
                    fitToBusinesses
                    selectedSlug={selected}
                    onSelect={setSelected}
                    highlightSlug={hovered}
                    origin={origin ? { ...origin, kind: "me" } : null}
                    className="h-[calc(100dvh-112px)] min-h-[480px] rounded-[1.5rem] border-2 border-espresso shadow-pop-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r, i) => (
                <li key={r.business.slug} className="relative">
                  <BusinessCard business={r.business} priority={i < 3} />
                  {showDistance && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/10]">
                      <DistancePill distance={r.distance} className="absolute right-3 bottom-3" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {n > 0 && (
            <p className="mt-10 text-center text-sm text-cocoa">
              Can&rsquo;t find who you&rsquo;re looking for?{" "}
              <Link
                href="/contact?subject=suggest"
                className="font-bold whitespace-nowrap text-rose-ink underline decoration-2 underline-offset-4"
              >
                Suggest a business
              </Link>
            </p>
          )}
        </Container>
      </section>

      <AnimatePresence>
        {sheetOpen && (
          <FilterSheet
            initial={{ ...query, q: qInput }}
            businesses={businesses}
            now={now}
            onClose={closeSheet}
            onApply={(next) => {
              const sortChanged = next.sort !== query.sort;
              setSheetOpen(false);
              write({ ...next, q: qInput });
              if (sortChanged && next.sort === "nearest" && !origin) locate();
              requestAnimationFrame(() => {
                filtersButton.current?.focus({ preventScroll: true });
                scrollToResults();
              });
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function DistancePill({ distance, className }: { distance?: number; className?: string }) {
  if (distance == null) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 border-espresso bg-sunflower px-2.5 py-0.5 text-xs font-bold text-espresso shadow-pop-sm",
        className,
      )}
    >
      <LocateFixed className="h-3 w-3" aria-hidden />
      {distance < 0.1 ? "Nearby" : `${distance < 10 ? distance.toFixed(1) : Math.round(distance)} mi`}
    </span>
  );
}

function NearestPrompt({ geo, onLocate, onCancel }: { geo: Geo; onLocate: () => void; onCancel: () => void }) {
  return (
    <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border-2 border-espresso bg-blush p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-espresso" role="status">
        {geo === "locating"
          ? "Finding your location…"
          : geo === "denied"
            ? "We couldn’t get your location. Check your browser’s location setting, or try the map and search by postcode."
            : geo === "unsupported"
              ? "Your browser can’t share a location. Try the map and search by postcode instead."
              : "Sorting by distance needs your location. It stays on your device."}
      </p>
      <div className="flex shrink-0 gap-2">
        {geo !== "unsupported" && (
          <Button size="sm" variant="primary" onClick={onLocate} disabled={geo === "locating"} icon={<LocateFixed className="h-4 w-4" />}>
            Use my location
          </Button>
        )}
        {geo === "denied" || geo === "unsupported" ? (
          <ButtonLink href="/map" size="sm" variant="outline">
            Open the map
          </ButtonLink>
        ) : (
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="grain relative mt-8 overflow-hidden rounded-[2rem] border-2 border-dashed border-espresso/30 bg-cream-deep px-6 py-14 text-center sm:py-20">
      <Blob color="#fadbe6" className="absolute -top-20 -left-16 h-64 w-64" />
      <Blob color="#f6bd3c" className="absolute -right-20 -bottom-24 h-64 w-64 opacity-40" />
      <div className="relative mx-auto max-w-lg">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-espresso bg-pink shadow-pop-sm">
          <SearchX className="h-7 w-7 text-espresso" aria-hidden />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-extrabold sm:text-3xl">Nothing matches that yet</h3>
        <p className="mt-3 text-cocoa">
          {query.trim() ? (
            <>
              We couldn&rsquo;t find a listing for &ldquo;{query.trim()}&rdquo; with these filters. Try another word, or clear a
              filter or two.
            </>
          ) : (
            <>No listings match these filters yet. Try clearing one or two.</>
          )}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={onClear}>
            Clear all filters
          </Button>
          <ButtonLink href="/contact?subject=suggest" variant="pink">
            Suggest a business
          </ButtonLink>
        </div>
        <p className="mt-5 text-sm text-cocoa">
          Run a business that should be here?{" "}
          <Link href="/join/business" className="font-bold whitespace-nowrap text-rose-ink underline decoration-2 underline-offset-4">
            List it free
          </Link>
        </p>
      </div>
    </div>
  );
}

function MapView({
  results,
  selected,
  onSelect,
}: {
  results: DirectoryResult[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const list = useMemo(() => results.map((r) => r.business), [results]);
  const offMap = results.filter((r) => !isPinnable(r.business));
  const onMap = results.length - offMap.length;
  return (
    <div className="mt-6">
      <p className="mb-3 text-sm font-semibold text-cocoa">
        {onMap} on the map{offMap.length > 0 && `, ${offMap.length} online or mobile`}. Tap a pin for details.
      </p>
      <BusinessMap
        businesses={list}
        fitToBusinesses
        selectedSlug={selected}
        onSelect={onSelect}
        className="h-[68vh] min-h-[420px] rounded-[1.5rem] border-2 border-espresso shadow-pop-sm"
      />
      {offMap.length > 0 && <OffMapList items={offMap} />}
    </div>
  );
}

function OffMapList({ items }: { items: DirectoryResult[] }) {
  return (
    <div className="mt-10">
      <h3 className="font-heading text-xl font-extrabold">Online &amp; delivery</h3>
      <p className="mt-1 text-sm text-cocoa">Not on the map because they trade online, deliver or come to you.</p>
      <ul className="mt-4 grid gap-3 lg:grid-cols-2">
        {items.map((r) => (
          <li key={r.business.slug} className="min-w-0">
            <BusinessCard business={r.business} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}
