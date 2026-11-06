import { site } from "@/lib/site";
import { businesses } from "./businesses";
import { categories } from "./categories";
import { regions } from "./areas";
import { splitEvents } from "./events";
import { partners } from "./partners";
import type { Business, BosEvent, CategoryId } from "./types";

/**
 * IMPACT
 * Everything on /impact is worked out from the content files, so the numbers
 * update themselves when a listing, event or partner is added. Nothing here
 * is typed in by hand except the Instagram figure (from src/lib/site.ts).
 *
 * Sample listings and events (`sample: true`) never count towards a headline
 * number. While the site is in preview they still appear in the category
 * chart, and the chart says so. The growth chart leaves them out entirely,
 * because their join dates are made up and would draw a false trend.
 */

const TZ = "Europe/London";

function londonYear(d: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: TZ }).format(d));
}

function londonMonthKey(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", timeZone: TZ }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  return `${y}-${m}`;
}

/** "2026-03" → "Mar 2026" */
export function monthLabel(key: string, style: "short" | "long" = "short") {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: style, year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y!, m! - 1, 1)),
  );
}

function nextMonthKey(key: string) {
  const [y, m] = key.split("-").map(Number);
  const ny = m === 12 ? y! + 1 : y!;
  const nm = m === 12 ? 1 : m! + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

/** Events we have actually delivered: in the past and not sample content */
export function deliveredEvents(now: Date): BosEvent[] {
  return splitEvents(now).past.filter((e) => !e.sample);
}

export type ImpactStats = {
  liveListings: number;
  sampleListings: number;
  /** Categories you can browse in the directory */
  totalCategories: number;
  /** Categories with at least one live (non-sample) listing */
  liveCategories: number;
  towns: number;
  townNames: string[];
  eventsDelivered: number;
  firstEventYear?: number;
  yearsSupporting: number;
  instagram: string;
  partnerships: number;
  hasSamples: boolean;
};

export function impactStats(now: Date, list: Business[] = businesses): ImpactStats {
  const live = list.filter((b) => !b.sample);
  const delivered = deliveredEvents(now);
  const firstEvent = [...delivered].sort((a, b) => a.start.localeCompare(b.start))[0];
  return {
    liveListings: live.length,
    sampleListings: list.length - live.length,
    totalCategories: categories.length,
    liveCategories: new Set(live.map((b) => b.category)).size,
    towns: regions.length,
    townNames: regions.map((r) => r.label),
    eventsDelivered: delivered.length,
    firstEventYear: firstEvent ? Number(firstEvent.start.slice(0, 4)) : undefined,
    yearsSupporting: Math.max(1, londonYear(now) - site.founded),
    instagram: site.instagramFollowers,
    partnerships: partners.length,
    hasSamples: list.some((b) => b.sample),
  };
}

export type CategoryCount = {
  id: CategoryId;
  label: string;
  short: string;
  live: number;
  sample: number;
  total: number;
};

/** Listings per primary category, biggest first. Empty categories are kept so gaps are visible. */
export function listingsByCategory(list: Business[] = businesses): CategoryCount[] {
  return categories
    .map((c) => {
      const inCat = list.filter((b) => b.category === c.id);
      const live = inCat.filter((b) => !b.sample).length;
      return { id: c.id, label: c.label, short: c.short, live, sample: inCat.length - live, total: inCat.length };
    })
    .sort((a, b) => b.total - a.total || b.live - a.live || a.label.localeCompare(b.label));
}

export type YearCount = { year: number; count: number; titles: string[] };

/** Delivered events per calendar year, from the first event to this year (zero years included) */
export function eventsByYear(now: Date): YearCount[] {
  const delivered = deliveredEvents(now);
  if (delivered.length === 0) return [];
  const years = delivered.map((e) => Number(e.start.slice(0, 4)));
  const first = Math.min(...years);
  const last = Math.max(londonYear(now), ...years);
  const out: YearCount[] = [];
  for (let y = first; y <= last; y++) {
    const inYear = delivered
      .filter((e) => Number(e.start.slice(0, 4)) === y)
      .sort((a, b) => a.start.localeCompare(b.start));
    out.push({ year: y, count: inYear.length, titles: inYear.map((e) => e.title) });
  }
  return out;
}

export type GrowthPoint = {
  /** "2026-03" */
  month: string;
  /** "Mar 2026" */
  label: string;
  /** "March 2026" */
  longLabel: string;
  /** Cumulative live (non-sample) listings */
  live: number;
  /** Live listings that joined in this month */
  joined: string[];
};

/**
 * Cumulative live directory size at the end of each month, from the first
 * live listing to this month. Sample listings are left out.
 */
export function directoryGrowth(now: Date, list: Business[] = businesses): GrowthPoint[] {
  const liveList = list.filter((b) => !b.sample);
  if (liveList.length === 0) return [];
  const sorted = [...liveList].sort((a, b) => a.joined.localeCompare(b.joined));
  const firstKey = sorted[0]!.joined.slice(0, 7);
  const lastJoined = sorted[sorted.length - 1]!.joined.slice(0, 7);
  const nowKey = londonMonthKey(now);
  const endKey = nowKey > lastJoined ? nowKey : lastJoined;

  const out: GrowthPoint[] = [];
  let live = 0;
  for (let key = firstKey; key <= endKey; key = nextMonthKey(key)) {
    const joined = sorted.filter((b) => b.joined.slice(0, 7) === key);
    live += joined.length;
    out.push({
      month: key,
      label: monthLabel(key),
      longLabel: monthLabel(key, "long"),
      live,
      joined: joined.map((b) => b.name),
    });
  }
  return out;
}

/** Metrics we will publish in the first annual report. No numbers until we have them. */
export const comingSoonMetrics = [
  {
    title: "Businesses supported",
    body: "Every business we promote, feature, list or put in front of customers at a market.",
    icon: "Store",
  },
  {
    title: "People reached",
    body: "People who come to our events, read the directory and see our posts, counted carefully and never guessed.",
    icon: "Users",
  },
  {
    title: "Businesses receiving support",
    body: "Owners who get hands-on help from us: grant applications, workshops, mentoring or one-to-one advice.",
    icon: "HandHeart",
  },
  {
    title: "Partnerships created",
    body: "New links we make between Black-owned businesses and venues, buyers, councils, schools and funders.",
    icon: "Handshake",
  },
] as const;

/** "How we measure" principles shown on /impact */
export const methodology = [
  {
    title: "Straight from the site",
    body: "Directory, event and partner counts are worked out from the same records that power this website. Add a listing and the numbers move.",
  },
  {
    title: "Samples never count",
    body: "While we're in preview, some listings and upcoming events are samples. They're tagged, they're shown separately in the category chart, and they never go into a headline number or the growth chart.",
  },
  {
    title: "Only what's happened",
    body: "Events delivered counts the markets, showcases and socials on our events page that we ran or were part of, once they've taken place. Plans don't count until the day is done.",
  },
  {
    title: "Rounded down, not up",
    body: "Our Instagram figure comes from our profile and is rounded down. Where we can't count something properly yet, we say so instead of guessing.",
  },
  {
    title: "Measured from 2026/27",
    body: "From this year we're recording support sessions, event attendance and referrals, and asking businesses what difference we made. Our first report will explain exactly how.",
  },
  {
    title: "Private by design",
    body: "We report totals, never people. Nothing in our impact work identifies an individual or a business without their say-so.",
  },
] as const;
