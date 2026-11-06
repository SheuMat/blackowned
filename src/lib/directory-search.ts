/**
 * Directory search, filtering and sorting.
 *
 * Pure functions only (no React, no browser APIs) so the directory page, the
 * map, the home page search and any future tests can share one source of
 * truth. Pass `now` in explicitly wherever opening hours matter.
 */
import Fuse, { type IFuseOptions } from "fuse.js";
import { areaMap, regionMap, regions } from "@/content/areas";
import { sortBusinesses } from "@/content/businesses";
import { categories, categoryMap } from "@/content/categories";
import type { Business, CategoryId, OpeningHours, RegionId } from "@/content/types";
import { distanceMiles } from "@/lib/utils";

// ───────────────────────── Query model ─────────────────────────

export type DirectorySort = "recommended" | "az" | "newest" | "nearest";
export type DirectoryView = "grid" | "list" | "map" | "split";

export type DirectoryQuery = {
  q: string;
  categories: CategoryId[];
  region: RegionId | null;
  area: string | null;
  hasOffer: boolean;
  openNow: boolean;
  featured: boolean;
  /** Online-only businesses and anyone who delivers / trades online */
  online: boolean;
  sort: DirectorySort;
  view: DirectoryView;
};

export const defaultDirectoryQuery: DirectoryQuery = {
  q: "",
  categories: [],
  region: null,
  area: null,
  hasOffer: false,
  openNow: false,
  featured: false,
  online: false,
  sort: "recommended",
  view: "grid",
};

export const sortOptions: { value: DirectorySort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "az", label: "A to Z" },
  { value: "newest", label: "Newest" },
  { value: "nearest", label: "Nearest to me" },
];

export const viewOptions: { value: DirectoryView; label: string }[] = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "map", label: "Map" },
  { value: "split", label: "List and map" },
];

const categoryIds = new Set<string>(categories.map((c) => c.id));
const regionIds = new Set<string>(regions.map((r) => r.id));
const sortIds = new Set<string>(sortOptions.map((s) => s.value));
const viewIds = new Set<string>(viewOptions.map((v) => v.value));

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined> | string;

function readParams(input: ParamSource) {
  if (typeof input === "string") return new URLSearchParams(input);
  if (input instanceof URLSearchParams) return input;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(input)) {
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else if (typeof v === "string") p.append(k, v);
  }
  return p;
}

const truthy = (v: string | null) => v === "1" || v === "true" || v === "yes";

/** Read a DirectoryQuery from URL params. Unknown values are ignored. */
export function parseDirectoryQuery(input: ParamSource): DirectoryQuery {
  const p = readParams(input);
  const cats = p
    .getAll("category")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter((v): v is CategoryId => categoryIds.has(v));
  const region = p.get("region");
  const area = p.get("area");
  const sort = p.get("sort");
  const view = p.get("view");
  const validArea = area && areaMap[area] ? area : null;
  return {
    q: (p.get("q") ?? "").slice(0, 120),
    categories: [...new Set(cats)],
    region: region && regionIds.has(region) ? (region as RegionId) : validArea ? areaMap[validArea].region : null,
    area: validArea,
    hasOffer: truthy(p.get("offer")),
    openNow: truthy(p.get("open")),
    featured: truthy(p.get("featured")),
    online: truthy(p.get("online")),
    sort: sort && sortIds.has(sort) ? (sort as DirectorySort) : "recommended",
    view: view && viewIds.has(view) ? (view as DirectoryView) : "grid",
  };
}

/** Turn a (partial) query into a query string, leaving out defaults. No leading "?". */
export function serializeDirectoryQuery(query: Partial<DirectoryQuery>): string {
  const q = { ...defaultDirectoryQuery, ...query };
  const p = new URLSearchParams();
  if (q.q.trim()) p.set("q", q.q.trim());
  if (q.categories.length) p.set("category", q.categories.join(","));
  if (q.region) p.set("region", q.region);
  if (q.area) p.set("area", q.area);
  if (q.hasOffer) p.set("offer", "1");
  if (q.openNow) p.set("open", "1");
  if (q.featured) p.set("featured", "1");
  if (q.online) p.set("online", "1");
  if (q.sort !== "recommended") p.set("sort", q.sort);
  if (q.view !== "grid") p.set("view", q.view);
  // Keep commas readable in shared links
  return p.toString().replace(/%2C/g, ",");
}

/** Build a link into the directory, e.g. directoryHref({ q: "jollof" }) or directoryHref({ categories: ["trades"] }) */
export function directoryHref(query: Partial<DirectoryQuery> = {}) {
  const qs = serializeDirectoryQuery(query);
  return qs ? `/directory?${qs}` : "/directory";
}

/** Number of active filters (keyword, sort and view not included) */
export function countActiveFilters(q: DirectoryQuery) {
  return (
    q.categories.length +
    (q.region ? 1 : 0) +
    (q.area ? 1 : 0) +
    Number(q.hasOffer) +
    Number(q.openNow) +
    Number(q.featured) +
    Number(q.online)
  );
}

export type FilterPill = { key: string; label: string; remove: Partial<DirectoryQuery> };

/** Human-readable pills for the active filters, each with the patch that removes it */
export function activeFilterPills(q: DirectoryQuery): FilterPill[] {
  const pills: FilterPill[] = [];
  if (q.q.trim()) pills.push({ key: "q", label: `“${q.q.trim()}”`, remove: { q: "" } });
  for (const id of q.categories) {
    pills.push({
      key: `cat-${id}`,
      label: categoryMap[id].label,
      remove: { categories: q.categories.filter((c) => c !== id) },
    });
  }
  if (q.region) pills.push({ key: "region", label: regionMap[q.region].label, remove: { region: null, area: null } });
  if (q.area) pills.push({ key: "area", label: areaMap[q.area]?.label ?? q.area, remove: { area: null } });
  if (q.hasOffer) pills.push({ key: "offer", label: "Has a BOS offer", remove: { hasOffer: false } });
  if (q.openNow) pills.push({ key: "open", label: "Open now", remove: { openNow: false } });
  if (q.featured) pills.push({ key: "featured", label: "Featured", remove: { featured: false } });
  if (q.online) pills.push({ key: "online", label: "Online & delivery", remove: { online: false } });
  return pills;
}

// ───────────────────────── Business helpers ─────────────────────────

/** Recommended order: real before sample, featured tier first, then newest (see sortBusinesses). */
export function recommendedOrder(list: Business[]) {
  return sortBusinesses(list);
}

export function inCategory(b: Business, id: CategoryId) {
  return b.category === id || (b.secondaryCategories?.includes(id) ?? false);
}

export function businessesInCategory(list: Business[], id: CategoryId) {
  return recommendedOrder(list.filter((b) => inCategory(b, id)));
}

export function categoryCounts(list: Business[]) {
  return Object.fromEntries(categories.map((c) => [c.id, list.filter((b) => inCategory(b, c.id)).length])) as Record<
    CategoryId,
    number
  >;
}

/** Per-category counts split into real (live) and sample listings, so a headline number never includes samples. */
export function liveAndSampleCounts(list: Business[]) {
  return {
    live: categoryCounts(list.filter((b) => !b.sample)),
    sample: categoryCounts(list.filter((b) => b.sample)),
  };
}

export function isFeatured(b: Business) {
  return !!b.featured || b.tier === "featured";
}

const ONLINE_RE = /\b(deliver(s|y|ies)?|online|order online|mobile|nationwide|remote|ships?)\b/i;

/** Trades online / delivers / comes to you */
export function isOnlineOrDelivers(b: Business) {
  if (b.onlineOnly) return true;
  return [...(b.highlights ?? []), ...b.services, b.serviceArea ?? ""].some((s) => ONLINE_RE.test(s));
}

/** Has a physical location we can pin on a map */
export function isPinnable(b: Business): b is Business & { coords: { lat: number; lng: number } } {
  return !!b.coords && !b.onlineOnly;
}

export function placeLabel(b: Business) {
  if (b.onlineOnly) return "Online & delivery";
  const area = areaMap[b.area];
  if (!area) return regionMap[b.region]?.label ?? "";
  return area.label === regionMap[b.region]?.label ? area.label : `${area.label}, ${regionMap[b.region].label}`;
}

/** Google Maps directions link (coords first, then address) */
export function directionsUrl(b: Business) {
  const dest = b.coords
    ? `${b.coords.lat},${b.coords.lng}`
    : [b.address, b.postcode].filter(Boolean).join(" ");
  if (!dest) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

/** Related listings: same category first, then same area, never the business itself. */
export function relatedBusinesses(list: Business[], business: Business, limit = 3) {
  const others = list.filter((b) => b.slug !== business.slug);
  const cats = [business.category, ...(business.secondaryCategories ?? [])];
  const sameCat = recommendedOrder(
    others.filter((b) => cats.some((c) => inCategory(b, c))),
  ).sort((a, b) => Number(b.category === business.category) - Number(a.category === business.category));
  const sameArea = recommendedOrder(others.filter((b) => b.area === business.area && !sameCat.includes(b)));
  const sameRegion = recommendedOrder(
    others.filter((b) => b.region === business.region && !sameCat.includes(b) && !sameArea.includes(b)),
  );
  return [...sameCat, ...sameArea, ...sameRegion].slice(0, limit);
}

// ───────────────────────── Opening hours (Europe/London) ─────────────────────────

export const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const londonClockFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Day (0 = Monday) and minutes past midnight in Sheffield, whatever the viewer's time zone. */
export function londonClock(date: Date | number) {
  const parts = londonClockFmt.formatToParts(typeof date === "number" ? new Date(date) : date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = Math.max(0, dayShort.indexOf(get("weekday") as (typeof dayShort)[number]));
  const hour = Number(get("hour")) % 24;
  return { day: day as OpeningHours["day"], minutes: hour * 60 + Number(get("minute")) };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** "09:00" → "9am", "17:30" → "5:30pm", "12:00" → "12pm" */
export function formatHour(t: string) {
  const mins = toMinutes(t);
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`;
}

export function formatHoursEntry(entry?: OpeningHours) {
  if (!entry || entry.closed) return entry?.note ?? "Closed";
  if (entry.open && entry.close) return `${formatHour(entry.open)} to ${formatHour(entry.close)}`;
  return entry.note ?? "Hours vary";
}

export type OpenState =
  | { status: "unknown"; today: number }
  | { status: "open"; today: number; closesAt: string }
  | { status: "closed"; today: number; next?: { day: number; time: string; isToday: boolean; isTomorrow: boolean } };

/**
 * Is the business open at `date` (Sheffield time)? Supports late closes past
 * midnight ("18:00"–"02:00"). Returns "unknown" when there are no structured hours.
 */
export function getOpenState(b: Pick<Business, "hours">, date: Date | number): OpenState {
  const { day, minutes } = londonClock(date);
  const hours = b.hours;
  if (!hours?.length) return { status: "unknown", today: day };
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const span = (h?: OpeningHours) =>
    h && !h.closed && h.open && h.close ? { open: toMinutes(h.open), close: toMinutes(h.close), h } : null;

  const today = span(byDay.get(day));
  if (today) {
    const overnight = today.close <= today.open;
    if (minutes >= today.open && (overnight || minutes < today.close)) {
      return { status: "open", today: day, closesAt: today.h.close! };
    }
  }
  const yesterday = span(byDay.get(((day + 6) % 7) as OpeningHours["day"]));
  if (yesterday && yesterday.close <= yesterday.open && minutes < yesterday.close) {
    return { status: "open", today: day, closesAt: yesterday.h.close! };
  }

  for (let i = 0; i < 7; i++) {
    const d = ((day + i) % 7) as OpeningHours["day"];
    const s = span(byDay.get(d));
    if (!s) continue;
    if (i === 0 && minutes >= s.open) continue;
    return { status: "closed", today: day, next: { day: d, time: s.h.open!, isToday: i === 0, isTomorrow: i === 1 } };
  }
  return { status: "closed", today: day };
}

export function isOpenNow(b: Business, date: Date | number) {
  return getOpenState(b, date).status === "open";
}

/** Short label for an OpenState: "Open until 9pm", "Opens tomorrow at 12pm" */
export function openStateLabel(state: OpenState) {
  if (state.status === "open") return `Open until ${formatHour(state.closesAt)}`;
  if (state.status === "closed") {
    if (!state.next) return "Closed";
    const when = state.next.isToday ? "today" : state.next.isTomorrow ? "tomorrow" : dayNames[state.next.day];
    return `Opens ${when} at ${formatHour(state.next.time)}`;
  }
  return "";
}

// ───────────────────────── Search ─────────────────────────

type SearchDoc = {
  slug: string;
  name: string;
  legalName: string;
  tagline: string;
  summary: string;
  description: string;
  categoryLabel: string;
  secondaryLabels: string[];
  areaLabel: string;
  regionLabel: string;
  postcode: string;
  services: string[];
  keywords: string[];
  highlights: string[];
};

/**
 * Field weights. Used twice: by our word-prefix scorer (exact matches, ranked
 * by where they hit) and by Fuse.js (typo-tolerant fallback when nothing
 * matches exactly, e.g. "jolof" or "acountant").
 */
const searchKeys: { name: Exclude<keyof SearchDoc, "slug">; weight: number }[] = [
  { name: "name", weight: 10 },
  { name: "legalName", weight: 6 },
  { name: "keywords", weight: 6 },
  { name: "services", weight: 5 },
  { name: "categoryLabel", weight: 7 },
  { name: "areaLabel", weight: 5 },
  { name: "postcode", weight: 5 },
  { name: "regionLabel", weight: 4 },
  { name: "secondaryLabels", weight: 3 },
  { name: "tagline", weight: 3 },
  { name: "highlights", weight: 3 },
  { name: "summary", weight: 2 },
  { name: "description", weight: 1 },
];

const fuseOptions: IFuseOptions<SearchDoc> = {
  keys: searchKeys,
  includeScore: true,
  ignoreLocation: true,
  ignoreFieldNorm: true,
  threshold: 0.34,
  minMatchCharLength: 2,
};

function toDoc(b: Business): SearchDoc {
  return {
    slug: b.slug,
    name: b.name,
    legalName: b.legalName ?? "",
    tagline: b.tagline,
    summary: b.summary,
    description: b.description,
    categoryLabel: categoryMap[b.category]?.label ?? "",
    secondaryLabels: (b.secondaryCategories ?? []).map((c) => categoryMap[c]?.label ?? ""),
    areaLabel: areaMap[b.area]?.label ?? "",
    regionLabel: regionMap[b.region]?.label ?? "",
    postcode: b.postcode ?? "",
    services: b.services,
    keywords: b.keywords,
    highlights: b.highlights ?? [],
  };
}

export type DirectoryIndex = { fuse: Fuse<SearchDoc>; docs: Map<string, SearchDoc>; bySlug: Map<string, Business> };

const indexCache = new WeakMap<Business[], DirectoryIndex>();

/** Build (or reuse) the search index for a list of businesses. */
export function createDirectoryIndex(list: Business[]): DirectoryIndex {
  const cached = indexCache.get(list);
  if (cached) return cached;
  const docs = list.map(toDoc);
  const index = {
    fuse: new Fuse(docs, fuseOptions),
    docs: new Map(docs.map((d) => [d.slug, d])),
    bySlug: new Map(list.map((b) => [b.slug, b])),
  };
  indexCache.set(list, index);
  return index;
}

const STOP_WORDS = new Set(["the", "and", "in", "near", "for", "of", "a", "an", "to", "me", "my", "with", "&", "uk"]);

/** Split a query into lower-case search words */
export function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”"'’]/g, "")
    .split(/[\s,/]+/)
    .map((t) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t))
    .slice(0, 6);
}

/** Very light stemming so "tutors", "caterers" and "braiding" still hit */
const stem = (t: string) => (t.length >= 5 ? t.replace(/(ers|er|ing|es|s)$/, "") : t);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function tokenScore(doc: SearchDoc, token: string) {
  const prefix = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(stem(token))}`, "iu");
  const whole = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(token)}($|[^\\p{L}\\p{N}])`, "iu");
  let best = 0;
  for (const { name, weight } of searchKeys) {
    if (weight <= best) continue;
    const value = doc[name];
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (!v || !prefix.test(v)) continue;
      best = Math.max(best, weight + (whole.test(v) ? 0.5 : 0));
      break;
    }
  }
  return best;
}

/**
 * Keyword search. Every word has to match the start of a word somewhere in
 * the listing; results are ranked by where they matched (name beats
 * description). If nothing matches exactly, Fuse.js finds near misses.
 */
export function searchText(list: Business[], text: string, index = createDirectoryIndex(list)) {
  const tokens = tokenize(text);
  if (!tokens.length) return recommendedOrder(list).map((b) => ({ business: b, score: 0 }));

  const ordered = recommendedOrder(list);
  const rankOf = new Map(ordered.map((b, i) => [b.slug, i]));
  const exact = ordered
    .map((business) => {
      const doc = index.docs.get(business.slug) ?? toDoc(business);
      const scores = tokens.map((t) => tokenScore(doc, t));
      return { business, score: scores.every((s) => s > 0) ? scores.reduce((a, b) => a + b, 0) : 0 };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || rankOf.get(a.business.slug)! - rankOf.get(b.business.slug)!);
  if (exact.length) return exact.map((r) => ({ business: r.business, score: r.score }));

  // Fuzzy fallback: keep only results close to the best match
  const allowed = new Set(list.map((b) => b.slug));
  const fuzzy = index.fuse.search(tokens.join(" ")).filter((r) => allowed.has(r.item.slug));
  if (!fuzzy.length) return [];
  const best = fuzzy[0].score ?? 0;
  return fuzzy
    .filter((r) => (r.score ?? 1) <= Math.min(0.75, best + 0.15))
    .slice(0, 8)
    .map((r) => ({ business: index.bySlug.get(r.item.slug)!, score: 1 - (r.score ?? 1) }))
    .filter((r) => !!r.business);
}

export type DirectoryResult = { business: Business; distance?: number; score?: number };

/**
 * Apply every filter and the chosen sort.
 * - `now` is required for the "open now" filter (skipped when absent, e.g. on the server)
 * - `origin` enables the "nearest" sort and distances
 */
export function searchBusinesses(
  list: Business[],
  query: Partial<DirectoryQuery>,
  opts: { now?: Date | number | null; origin?: { lat: number; lng: number } | null; index?: DirectoryIndex } = {},
): DirectoryResult[] {
  const q = { ...defaultDirectoryQuery, ...query };
  const filtered = list.filter((b) => {
    if (q.categories.length && !q.categories.some((c) => inCategory(b, c))) return false;
    if (q.region && b.region !== q.region) return false;
    if (q.area && b.area !== q.area) return false;
    if (q.hasOffer && !b.offer) return false;
    if (q.featured && !isFeatured(b)) return false;
    if (q.online && !isOnlineOrDelivers(b)) return false;
    if (q.openNow && opts.now != null && !isOpenNow(b, opts.now)) return false;
    return true;
  });

  const hasText = q.q.trim().length > 0;
  let results: DirectoryResult[] = hasText
    ? searchText(filtered, q.q, opts.index ?? createDirectoryIndex(list))
    : recommendedOrder(filtered).map((business) => ({ business }));

  if (opts.origin) {
    const o = opts.origin;
    results = results.map((r) => ({
      ...r,
      distance: isPinnable(r.business) ? distanceMiles(o, r.business.coords) : undefined,
    }));
  }
  return sortResults(results, q.sort);
}

/** Recommended keeps the incoming order (relevance for text searches, recommended otherwise). */
export function sortResults(results: DirectoryResult[], sort: DirectorySort) {
  const list = [...results];
  switch (sort) {
    case "az":
      return list.sort((a, b) => a.business.name.localeCompare(b.business.name, "en-GB"));
    case "newest":
      return list.sort((a, b) => b.business.joined.localeCompare(a.business.joined));
    case "nearest":
      if (!list.some((r) => r.distance != null)) return list;
      return list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    default:
      return list;
  }
}

// ───────────────────────── Suggestions ─────────────────────────

/** A handful of search terms that actually exist in the directory, for "Popular searches". */
export function popularTerms(list: Business[], limit = 8) {
  const seen = new Set<string>();
  const out: string[] = [];
  const ordered = recommendedOrder(list);
  // First keyword of each business, then second keywords, until we have enough
  for (let round = 0; round < 3 && out.length < limit; round++) {
    for (const b of ordered) {
      const term = b.keywords[round];
      if (!term || term.length < 3) continue;
      const key = term.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(term);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export type Suggestion =
  | { kind: "business"; id: string; label: string; detail: string; business: Business }
  | { kind: "category"; id: CategoryId; label: string; detail: string }
  | { kind: "area"; id: string; label: string; detail: string }
  | { kind: "term"; id: string; label: string; detail: string };

/** Type-ahead suggestions: businesses, categories, places and services/keywords. */
export function autocomplete(list: Business[], text: string, limit = 8): Suggestion[] {
  const t = text.trim().toLowerCase();
  if (t.length < 2) return [];
  const starts = (s: string) => s.toLowerCase().startsWith(t) || s.toLowerCase().includes(` ${t}`);
  const has = (s: string) => s.toLowerCase().includes(t);
  const rank = (s: string) => (s.toLowerCase().startsWith(t) ? 0 : starts(s) ? 1 : 2);

  const biz: Suggestion[] = recommendedOrder(list)
    .filter((b) => has(b.name) || (b.legalName && has(b.legalName)))
    .sort((a, b) => rank(a.name) - rank(b.name))
    .slice(0, 3)
    .map((b) => ({
      kind: "business",
      id: b.slug,
      label: b.name,
      detail: `${categoryMap[b.category].label} · ${placeLabel(b)}${b.sample ? " · Sample" : ""}`,
      business: b,
    }));

  const cats: Suggestion[] = categories
    .filter((c) => has(c.label) || has(c.short) || c.description.toLowerCase().split(/[ ,.]+/).some((w) => w.startsWith(t)))
    .sort((a, b) => rank(a.label) - rank(b.label))
    .slice(0, 2)
    .map((c) => ({ kind: "category", id: c.id, label: c.label, detail: "Category" }));

  const places: Suggestion[] = regions
    .flatMap((r) => [
      { id: `region:${r.id}`, label: r.label, detail: "Town" },
      ...(r.areas.length > 1 ? r.areas.map((a) => ({ id: a.id, label: a.label, detail: `Area of ${r.label}` })) : []),
    ])
    .filter((p) => has(p.label))
    .sort((a, b) => rank(a.label) - rank(b.label))
    .slice(0, 2)
    .map((p) => ({ kind: "area", ...p }));

  const termCounts = new Map<string, { label: string; count: number }>();
  for (const b of list) {
    for (const term of [...b.services, ...b.keywords]) {
      if (!has(term)) continue;
      const key = term.toLowerCase();
      const cur = termCounts.get(key);
      termCounts.set(key, { label: cur?.label ?? term, count: (cur?.count ?? 0) + 1 });
    }
  }
  const terms: Suggestion[] = [...termCounts.values()]
    .sort((a, b) => rank(a.label) - rank(b.label) || b.count - a.count || a.label.length - b.label.length)
    .slice(0, 4)
    .map((x) => ({
      kind: "term",
      id: `term:${x.label.toLowerCase()}`,
      label: x.label,
      detail: x.count === 1 ? "1 business" : `${x.count} businesses`,
    }));

  return [...biz, ...cats, ...places, ...terms].slice(0, limit);
}
