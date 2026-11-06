"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, BadgeCheck, ChevronUp, Loader2, LocateFixed, MapPin, Search, Truck, X } from "lucide-react";
import { BusinessLogo } from "@/components/cards/BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { areas, regionMap, regions, southYorkshireView } from "@/content/areas";
import { businesses } from "@/content/businesses";
import { categories, categoryMap } from "@/content/categories";
import type { Business, CategoryId, RegionId } from "@/content/types";
import { inCategory, isPinnable, placeLabel, recommendedOrder } from "@/lib/directory-search";
import { cn, distanceMiles } from "@/lib/utils";
import { BusinessMap } from "./BusinessMap";
import type { MapFocus, MapOrigin } from "./types";

type RegionChoice = RegionId | "all";

const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/i;
const API = "https://api.postcodes.io";
const categoryIds = new Set<string>(categories.map((c) => c.id));

type Hit = { lat: number; lng: number; label: string; zoom: number };

/** Our own neighbourhoods and towns first, then postcodes.io (postcode, district, place name). */
async function geocode(raw: string, signal: AbortSignal): Promise<Hit | null> {
  const q = raw.trim();
  if (!/\d/.test(q) && q.length >= 3) {
    const needle = q.toLowerCase();
    const region = regions.find((r) => r.label.toLowerCase() === needle);
    if (region) return { ...region.center, label: region.label, zoom: region.zoom - (isPhone() ? 1 : 0) };
    const area = areas.find((a) => a.label.toLowerCase().split(/[\s&,]+/).some((w) => w.length >= 3 && w.startsWith(needle)) || a.label.toLowerCase().startsWith(needle));
    if (area) return { ...area.center, label: area.label, zoom: 14 };
  }
  const read = async (url: string) => {
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
    return res.json();
  };
  if (FULL_POSTCODE.test(q)) {
    const data = await read(`${API}/postcodes/${encodeURIComponent(q.replace(/\s+/g, "").toUpperCase())}`);
    const r = data?.result;
    return r?.latitude != null ? { lat: r.latitude, lng: r.longitude, label: r.postcode, zoom: 14 } : null;
  }
  if (OUTCODE.test(q)) {
    const data = await read(`${API}/outcodes/${encodeURIComponent(q.toUpperCase())}`);
    const r = data?.result;
    return r?.latitude != null ? { lat: r.latitude, lng: r.longitude, label: r.outcode, zoom: 13 } : null;
  }
  const data = await read(`${API}/places?q=${encodeURIComponent(q)}&limit=1`);
  const r = data?.result?.[0];
  return r?.latitude != null ? { lat: r.latitude, lng: r.longitude, label: r.name_1, zoom: 13 } : null;
}

const isNarrow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
/** Phones get the towns one zoom level further out so all four fit between the overlays */
const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

function regionView(id: RegionChoice, narrow: boolean) {
  if (id === "all") return { center: southYorkshireView.center, zoom: southYorkshireView.zoom - (narrow ? 1 : 0) };
  const r = regionMap[id];
  return { center: r.center, zoom: r.zoom - (narrow ? 1 : 0) };
}

function parseParams(paramsString: string) {
  const p = new URLSearchParams(paramsString);
  const region = p.get("region");
  const cats = (p.get("category") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is CategoryId => categoryIds.has(s));
  return {
    region: (region && region in regionMap ? region : "all") as RegionChoice,
    categories: [...new Set(cats)],
  };
}

function writeUrl(region: RegionChoice, cats: CategoryId[]) {
  const p = new URLSearchParams();
  if (region !== "all") p.set("region", region);
  if (cats.length) p.set("category", cats.join(","));
  const qs = p.toString().replace(/%2C/g, ",");
  window.history.replaceState(null, "", qs ? `/map?${qs}` : "/map");
  return qs;
}

/** Each focus gets a new key so the map flies even to the same place twice */
const nextFocus = (lat: number, lng: number, zoom: number) => (prev: MapFocus | null): MapFocus => ({
  lat,
  lng,
  zoom,
  key: (typeof prev?.key === "number" ? prev.key : 0) + 1,
});

const formatMiles = (d: number) => (d < 0.1 ? "Nearby" : `${d < 10 ? d.toFixed(1) : Math.round(d)} mi`);

/** Reads ?region= and ?category=. Must sit inside <Suspense>. */
export function MapExplorerFromUrl() {
  const params = useSearchParams();
  return <MapExplorer paramsString={params.toString()} />;
}

type Status = { kind: "idle" | "loading" | "error" | "info"; message?: string };

export function MapExplorer({ paramsString = "" }: { paramsString?: string }) {
  const parsed = useMemo(() => parseParams(paramsString), [paramsString]);
  const [region, setRegion] = useState<RegionChoice>(parsed.region);
  const [cats, setCats] = useState<CategoryId[]>(parsed.categories);
  const [initialView] = useState(() => regionView(parsed.region, isPhone()));
  const [focus, setFocus] = useState<MapFocus | null>(null);

  // Adopt URL changes we didn't make (e.g. a link to /map?region=doncaster while already here)
  const [seen, setSeen] = useState(paramsString);
  const [written, setWritten] = useState(paramsString);
  if (paramsString !== seen) {
    setSeen(paramsString);
    if (paramsString !== written) {
      setWritten(paramsString);
      setRegion(parsed.region);
      setCats(parsed.categories);
      const v = regionView(parsed.region, isPhone());
      setFocus(nextFocus(v.center.lat, v.center.lng, v.zoom));
    }
  }

  const [visible, setVisible] = useState<string[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [origin, setOrigin] = useState<MapOrigin | null>(null);
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [sheet, setSheet] = useState<"peek" | "open">("peek");
  const abortRef = useRef<AbortController | null>(null);
  const dragRef = useRef<{ y: number; moved: boolean } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Fill the screen below the header (and the preview banner, if it's showing)
  const rootRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(72);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      setOffset(Math.min(Math.max(top, 72), 220));
    });
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  // ── Data ──
  const filtered = useMemo(
    () => (cats.length ? businesses.filter((b) => cats.some((c) => inCategory(b, c))) : businesses),
    [cats],
  );
  const pinned = useMemo(() => filtered.filter(isPinnable), [filtered]);
  const online = useMemo(() => recommendedOrder(filtered.filter((b) => !isPinnable(b))), [filtered]);
  const inView = useMemo(() => {
    const set = visible ? new Set(visible) : null;
    const list = set ? pinned.filter((b) => set.has(b.slug)) : pinned;
    if (origin) {
      return list
        .map((b) => ({ business: b as Business, distance: distanceMiles(origin, b.coords) }))
        .sort((a, b) => a.distance - b.distance);
    }
    return recommendedOrder(list).map((b) => ({ business: b, distance: undefined as number | undefined }));
  }, [pinned, visible, origin]);

  const onViewChange = (slugs: string[]) =>
    setVisible((prev) => (prev && prev.length === slugs.length && prev.every((s, i) => s === slugs[i]) ? prev : slugs));

  // Bring the selected card into view in the list
  useEffect(() => {
    if (!selected) return;
    const el = document.getElementById(`map-card-${selected}`);
    const list = listRef.current;
    if (!el || !list) return;
    const top = el.offsetTop - list.offsetTop;
    if (top < list.scrollTop || top + el.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTo({
        top: Math.max(0, top - 12),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  }, [selected]);

  // ── Actions ──
  const goRegion = (id: RegionChoice) => {
    setRegion(id);
    const v = regionView(id, isPhone());
    setFocus(nextFocus(v.center.lat, v.center.lng, v.zoom));
    setSelected(null);
    setWritten(writeUrl(id, cats));
  };

  const toggleCategory = (id: CategoryId) => {
    const next = cats.includes(id) ? cats.filter((c) => c !== id) : [...cats, id];
    setCats(next);
    setSelected(null);
    setWritten(writeUrl(region, next));
  };

  const clearCategories = () => {
    setCats([]);
    setWritten(writeUrl(region, []));
  };

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    const q = place.trim();
    if (!q) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus({ kind: "loading", message: "Searching…" });
    try {
      const hit = await geocode(q, ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (!hit) {
        setStatus({
          kind: "error",
          message: `We couldn’t find “${q}”. Try a full postcode (S1 2EB), a district (S11) or a place name.`,
        });
        return;
      }
      setOrigin({ lat: hit.lat, lng: hit.lng, kind: "place", label: hit.label });
      setFocus(nextFocus(hit.lat, hit.lng, hit.zoom));
      setSelected(null);
      setStatus({ kind: "info", message: `Nearest to ${hit.label}` });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setStatus({ kind: "error", message: "The postcode lookup isn’t responding right now. Check your connection and try again." });
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus({ kind: "error", message: "Your browser can’t share a location. Search by postcode instead." });
      return;
    }
    setStatus({ kind: "loading", message: "Finding you…" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const far = distanceMiles(me, southYorkshireView.center) > 40;
        setOrigin({ ...me, kind: "me", label: "You are here" });
        setSelected(null);
        if (far) {
          const v = regionView("all", isPhone());
          setFocus(nextFocus(v.center.lat, v.center.lng, v.zoom));
          setStatus({ kind: "info", message: "You’re a way from South Yorkshire, so here’s what’s nearest" });
        } else {
          setFocus(nextFocus(me.lat, me.lng, 14));
          setStatus({ kind: "info", message: "Nearest to you" });
        }
      },
      (err) =>
        setStatus({
          kind: "error",
          message:
            err.code === err.PERMISSION_DENIED
              ? "Location is switched off for this site. Allow it in your browser settings, or search by postcode."
              : "We couldn’t get your location just now. Try searching by postcode instead.",
        }),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  };

  const clearOrigin = () => {
    abortRef.current?.abort();
    setOrigin(null);
    setPlace("");
    setStatus({ kind: "idle" });
  };

  const selectFromList = (slug: string) => {
    setSelected(slug);
    if (isNarrow()) setSheet("peek");
  };

  // Sheet: tap the handle to toggle, or swipe it up and down
  const onHandleDown = (e: PointerEvent) => {
    dragRef.current = { y: e.clientY, moved: false };
  };
  const onHandleUp = (e: PointerEvent) => {
    const start = dragRef.current;
    if (!start) return;
    const dy = e.clientY - start.y;
    if (Math.abs(dy) > 24) {
      start.moved = true;
      setSheet(dy < 0 ? "open" : "peek");
    }
  };
  const onHandleClick = () => {
    if (dragRef.current?.moved) {
      dragRef.current = null;
      return;
    }
    dragRef.current = null;
    setSheet((s) => (s === "open" ? "peek" : "open"));
  };

  const nInView = inView.length;
  const heading =
    visible === null ? `${pinned.length} on the map` : nInView === 1 ? "1 business in view" : `${nInView} businesses in view`;
  const catLabel = cats.length === 1 ? categoryMap[cats[0]].label.toLowerCase() : null;

  return (
    <div
      ref={rootRef}
      style={{ "--map-offset": `${offset}px` } as CSSProperties}
      className={cn(
        "relative h-[calc(100svh-var(--map-offset,72px))] min-h-[560px] overflow-hidden bg-cream-deep",
        "[--map-bottom-inset:156px] [--map-top-inset:132px] lg:[--map-bottom-inset:0px] lg:[--map-top-inset:0px]",
        "lg:grid lg:min-h-[640px] lg:grid-cols-[420px_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[460px_minmax(0,1fr)]",
      )}
    >
      {/* ───── Search & towns ───── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4 lg:pointer-events-auto lg:static lg:z-10 lg:col-start-1 lg:row-start-1 lg:border-r-2 lg:border-espresso lg:bg-cream lg:p-6 lg:pb-4">
        <div className="pointer-events-auto">
          <p className="hidden items-center gap-2 font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase lg:inline-flex">
            <span aria-hidden className="h-2 w-2 rounded-full bg-rose" /> The map
          </p>
          <h1 className="sr-only lg:not-sr-only lg:mt-2 lg:font-heading lg:text-[1.85rem] lg:leading-[1.05] lg:font-extrabold lg:text-espresso">
            Discover Black-owned businesses near you
          </h1>
          <p className="hidden text-[15px] text-cocoa lg:mt-2 lg:block">
            Search a postcode, district or place, or let us find you. Tap a pin to see who&rsquo;s there.
          </p>

          <form role="search" onSubmit={onSearch} className="flex gap-2 lg:mt-5">
            <label htmlFor="map-place" className="sr-only">
              Postcode, district or place
            </label>
            <div className="flex h-12 min-w-0 flex-1 items-center rounded-full border-2 border-espresso bg-white pr-1 pl-4 shadow-pop-sm focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rose">
              <Search className="h-5 w-5 shrink-0 text-espresso" aria-hidden />
              <input
                id="map-place"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="postal-code"
                placeholder="Postcode, S11 or Sharrow"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[15px] text-espresso placeholder:text-cocoa/70 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                disabled={status.kind === "loading"}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-espresso px-4 font-heading text-sm font-bold text-cream transition-colors hover:bg-cocoa disabled:opacity-70"
              >
                {status.kind === "loading" && status.message === "Searching…" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Go"}
              </button>
            </div>
            <button
              type="button"
              onClick={locate}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-pink px-3.5 font-heading text-sm font-bold text-espresso shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop sm:px-4 lg:w-12 lg:px-0"
              title="Use my location"
            >
              {status.kind === "loading" && status.message === "Finding you…" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              ) : (
                <LocateFixed className="h-5 w-5" aria-hidden />
              )}
              <span className="sr-only sm:not-sr-only lg:sr-only">Use my location</span>
            </button>
          </form>

          <div aria-live="polite" className="empty:hidden">
            {status.kind === "error" && (
              <p className="mt-2 rounded-2xl border-2 border-rose bg-blush px-3 py-2 text-sm font-semibold text-rose-ink">{status.message}</p>
            )}
            {status.kind === "info" && origin && (
              <p className="mt-2 hidden max-w-full items-center gap-2 rounded-full border-2 border-espresso bg-sunflower py-1 pr-1 pl-3 text-sm font-bold text-espresso lg:inline-flex">
                <LocateFixed className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{status.message}</span>
                <button
                  type="button"
                  onClick={clearOrigin}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-espresso/10"
                  aria-label="Clear location"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </p>
            )}
          </div>

          <div className="-mx-3 mt-3 overflow-x-auto px-3 scrollbar-none sm:-mx-4 sm:px-4 lg:mx-0 lg:mt-4 lg:overflow-visible lg:px-0">
            <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap" aria-label="Jump to a town">
              {([{ id: "all", label: "All" }, ...regions] as { id: RegionChoice; label: string }[]).map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    aria-pressed={region === r.id}
                    onClick={(e) => {
                      goRegion(r.id);
                      // On phones the row scrolls sideways: bring a half-hidden chip fully into view
                      e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                    }}
                    className={cn(
                      "inline-flex h-11 items-center rounded-full border-2 border-espresso px-4 text-sm font-bold whitespace-nowrap transition-all lg:h-10 lg:px-3.5",
                      region === r.id ? "bg-espresso text-cream shadow-pop-sm" : "bg-white text-espresso shadow-pop-sm hover:-translate-y-0.5",
                    )}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ───── Map ───── */}
      <div className="absolute inset-0 z-0 lg:relative lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <BusinessMap
          businesses={filtered}
          center={initialView.center}
          zoom={initialView.zoom}
          focus={focus}
          origin={origin}
          selectedSlug={selected}
          onSelect={setSelected}
          highlightSlug={hovered}
          onViewChange={onViewChange}
          scrollWheelZoom
          label="Map of Black-owned businesses in Sheffield, Rotherham, Doncaster and Chesterfield"
          className="bos-map--hide-zoom-mobile h-full w-full"
        />
      </div>

      {/* ───── List: side panel on desktop, bottom sheet on phones ───── */}
      <section
        aria-labelledby="map-list-heading"
        className={cn(
          "absolute inset-x-0 bottom-0 z-30 flex h-[74%] flex-col rounded-t-[1.75rem] border-2 border-b-0 border-espresso bg-cream shadow-lift transition-transform duration-300 ease-out",
          sheet === "peek" ? "translate-y-[calc(100%-156px)]" : "translate-y-0",
          "lg:static lg:z-10 lg:col-start-1 lg:row-start-2 lg:h-auto lg:min-h-0 lg:translate-y-0 lg:rounded-none lg:border-0 lg:border-r-2 lg:shadow-none",
        )}
      >
        <button
          type="button"
          onPointerDown={onHandleDown}
          onPointerUp={onHandleUp}
          onClick={onHandleClick}
          aria-expanded={sheet === "open"}
          aria-controls="map-list"
          className="flex w-full touch-none flex-col items-center pt-2.5 pb-1 lg:hidden"
        >
          <span aria-hidden className="h-1.5 w-12 rounded-full bg-espresso/25" />
          <span className="sr-only">{sheet === "open" ? "Show more of the map" : "Show the list of businesses"}</span>
        </button>

        <div className="flex items-start justify-between gap-3 px-4 pt-1 lg:px-6 lg:pt-4">
          <div className="min-w-0">
            <h2 id="map-list-heading" className="font-heading text-xl font-extrabold text-espresso">
              {heading}
            </h2>
            <p className="flex min-w-0 items-center gap-1 text-sm text-cocoa">
              <span className="truncate">
                {origin ? `Sorted by distance${origin.kind === "place" && origin.label ? ` from ${origin.label}` : " from you"}` : "Move the map to explore"}
                {catLabel ? ` · ${catLabel}` : cats.length > 1 ? ` · ${cats.length} categories` : ""}
              </span>
              {origin && (
                <button
                  type="button"
                  onClick={clearOrigin}
                  className="-my-3 inline-flex h-11 shrink-0 items-center rounded-full px-2 font-bold text-rose-ink underline underline-offset-2 lg:hidden"
                >
                  Clear
                </button>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheet((s) => (s === "open" ? "peek" : "open"))}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-espresso bg-white px-3.5 text-sm font-bold text-espresso lg:hidden"
            aria-expanded={sheet === "open"}
            aria-controls="map-list"
          >
            {sheet === "open" ? "Map" : "List"}
            <ChevronUp className={cn("h-4 w-4 transition-transform", sheet === "open" && "rotate-180")} aria-hidden />
          </button>
        </div>

        <div className="mt-3 overflow-x-auto px-4 pb-1 scrollbar-none lg:px-6">
          <ul className="flex w-max gap-2" aria-label="Filter by category">
            <li>
              <button
                type="button"
                aria-pressed={cats.length === 0}
                onClick={clearCategories}
                className={cn(
                  "inline-flex h-11 items-center rounded-full border-2 px-3.5 text-sm font-semibold whitespace-nowrap transition-colors lg:h-10",
                  cats.length === 0 ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-espresso hover:border-espresso/60",
                )}
              >
                Everything
              </button>
            </li>
            {categories.map((c) => {
              const on = cats.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleCategory(c.id)}
                    className={cn(
                      "inline-flex h-11 items-center gap-1.5 rounded-full border-2 py-1 pr-3.5 pl-1 text-sm font-semibold whitespace-nowrap transition-colors lg:h-10",
                      on ? "border-espresso bg-espresso text-cream" : "border-espresso/15 bg-white text-espresso hover:border-espresso/60",
                    )}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-espresso" style={{ backgroundColor: c.color, color: c.ink }}>
                      <CategoryIcon id={c.id} className="h-3.5 w-3.5" />
                    </span>
                    {c.short}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          id="map-list"
          ref={listRef}
          onFocus={() => isNarrow() && sheet === "peek" && setSheet("open")}
          className="relative mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-8 lg:px-6"
        >
          {nInView > 0 ? (
            <ul className="space-y-3">
              {inView.map(({ business: b, distance }) => (
                <MapCard
                  key={b.slug}
                  business={b}
                  distance={distance}
                  selected={selected === b.slug}
                  onSelect={() => selectFromList(b.slug)}
                  onHover={(on) => setHovered((h) => (on ? b.slug : h === b.slug ? null : h))}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-[1.25rem] border-2 border-dashed border-espresso/25 bg-cream-deep p-5 text-center">
              <p className="font-heading text-lg font-extrabold">
                {pinned.length === 0 ? "Nothing on the map for this yet" : "No pins in this part of the map"}
              </p>
              <p className="mt-1 text-sm text-cocoa">
                {pinned.length === 0 ? "Try another category, or suggest a business we should add." : "Zoom out, or jump to a town."}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {pinned.length > 0 && (
                  <button
                    type="button"
                    onClick={() => goRegion("all")}
                    className="inline-flex h-11 items-center rounded-full border-2 border-espresso bg-white px-4 text-sm font-bold"
                  >
                    Show everywhere
                  </button>
                )}
                <Link href="/contact?subject=suggest" className="inline-flex h-11 items-center rounded-full border-2 border-espresso bg-pink px-4 text-sm font-bold">
                  Suggest a business
                </Link>
              </div>
            </div>
          )}

          {online.length > 0 && (
            <div className="mt-8">
              <h3 className="flex items-center gap-2 font-heading text-lg font-extrabold">
                <Truck className="h-5 w-5 text-rose" aria-hidden /> Online &amp; delivery
              </h3>
              <p className="mt-0.5 text-sm text-cocoa">No shopfront to pin. They trade online, deliver or come to you.</p>
              <ul className="mt-3 space-y-3">
                {online.map((b) => (
                  <MapCard key={b.slug} business={b} />
                ))}
              </ul>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-cocoa">
            Missing someone?{" "}
            <Link href="/contact?subject=suggest" className="font-bold text-rose-ink underline decoration-2 underline-offset-4">
              Suggest a business
            </Link>{" "}
            or{" "}
            <Link href="/directory" className="font-bold text-rose-ink underline decoration-2 underline-offset-4">
              search the directory
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function MapCard({
  business: b,
  distance,
  selected = false,
  onSelect,
  onHover,
}: {
  business: Business;
  distance?: number;
  selected?: boolean;
  onSelect?: () => void;
  onHover?: (on: boolean) => void;
}) {
  const cat = categoryMap[b.category];
  const body = (
    <>
      <BusinessLogo business={b} size={52} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-heading text-base font-extrabold text-espresso">{b.name}</span>
          {b.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-teal" aria-label="Verified" />}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-cocoa">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full ring-1 ring-espresso" style={{ backgroundColor: cat.color }} />
          <span className="truncate">
            {cat.label} · {placeLabel(b)}
          </span>
        </span>
        <span className="mt-1 line-clamp-1 text-sm text-cocoa">{b.tagline}</span>
        {(b.offer || b.sample) && (
          <span className="mt-1.5 flex gap-1.5">
            {b.offer && <span className="rounded-full bg-blush px-2 py-0.5 text-[11px] font-bold text-rose-ink">Offer</span>}
            {b.sample && <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold tracking-wide text-cocoa uppercase">Sample</span>}
          </span>
        )}
      </span>
    </>
  );
  return (
    <li
      id={`map-card-${b.slug}`}
      onMouseEnter={onHover ? () => onHover(true) : undefined}
      onMouseLeave={onHover ? () => onHover(false) : undefined}
      onFocus={onHover ? () => onHover(true) : undefined}
      onBlur={onHover ? () => onHover(false) : undefined}
      className={cn(
        "flex items-stretch gap-2 rounded-2xl border-2 bg-white p-3 transition-all",
        selected ? "border-espresso shadow-pop-sm" : "border-espresso/10 hover:border-espresso",
      )}
    >
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="flex min-w-0 flex-1 items-start gap-3 rounded-xl text-left"
          aria-label={`${b.name}: show on the map`}
        >
          {body}
        </button>
      ) : (
        <Link href={`/directory/${b.slug}`} className="flex min-w-0 flex-1 items-start gap-3 rounded-xl">
          {body}
        </Link>
      )}
      <span className="flex shrink-0 flex-col items-end justify-between gap-2">
        {distance != null ? (
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-espresso bg-sunflower px-2 py-0.5 text-xs font-bold text-espresso">
            <MapPin className="h-3 w-3" aria-hidden />
            {formatMiles(distance)}
          </span>
        ) : (
          <span />
        )}
        {onSelect && (
          <Link
            href={`/directory/${b.slug}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-espresso text-espresso transition-colors hover:bg-espresso hover:text-cream"
            aria-label={`View ${b.name}'s profile`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </span>
    </li>
  );
}
