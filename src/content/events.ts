import { site } from "@/lib/site";
import type { BosEvent, EventType } from "./types";

export const eventTypes: { id: EventType; label: string; color: string; ink: string }[] = [
  { id: "networking", label: "Networking", color: "#1f2a63", ink: "#fbf5ec" },
  { id: "workshop", label: "Workshop", color: "#167a6f", ink: "#fbf5ec" },
  { id: "training", label: "Training", color: "#55321f", ink: "#fbf5ec" },
  { id: "market", label: "Market", color: "#ee6a35", ink: "#2a1910" },
  { id: "showcase", label: "Business showcase", color: "#e0628f", ink: "#2a1910" },
  { id: "community", label: "Community", color: "#f6bd3c", ink: "#2a1910" },
  { id: "social", label: "Social", color: "#b02a62", ink: "#fbf5ec" },
];

export const eventTypeMap = Object.fromEntries(eventTypes.map((t) => [t.id, t])) as Record<
  EventType,
  (typeof eventTypes)[number]
>;

const SADACCA = {
  venue: "Sadacca",
  address: "48 Wicker, Sheffield S3 8JB",
  coords: { lat: 53.386661, lng: -1.462756 },
};
const CUTLERY_WORKS = {
  venue: "Cutlery Works",
  address: "73-101 Neepsend Lane, Sheffield S3 8AT",
  coords: { lat: 53.393456, lng: -1.478746 },
};
const EVENTS_CENTRAL = {
  venue: "Events Central, Fargate",
  address: "Fargate, Sheffield S1 2HD",
  coords: { lat: 53.381548, lng: -1.468969 },
};

/**
 * EVENTS
 * Times are ISO strings with the UK offset (+00:00 in winter, +01:00 in summer).
 * Past events stay listed so the site shows a track record.
 * `sample: true` = placeholder upcoming events for the preview; replace with real ones.
 */
const allEvents: BosEvent[] = [
  // ───────────── Upcoming (sample programme — replace with confirmed dates) ─────────────
  {
    slug: "networking-breakfast-nov-2026",
    title: "Black Business Networking Breakfast",
    type: "networking",
    start: "2026-11-19T08:00:00+00:00",
    end: "2026-11-19T10:00:00+00:00",
    ...SADACCA,
    summary: "Coffee, pastries and proper introductions. Meet other Black founders and the people who want to work with them.",
    description: `Start your day with Sheffield's Black business community. Bring business cards, bring a friend, and bring the thing you need help with.

We'll run short introductions, a five-minute spotlight from a local founder, and plenty of time to talk. Pastries from a directory business.`,
    price: "Free",
    ticketLabel: "Book a place",
    organiser: "Black Owned Sheffield",
    highlights: ["Founder spotlight", "Breakfast from a directory business", "Open to all"],
    featured: true,
    sample: true,
  },
  {
    slug: "grants-and-funding-101",
    title: "Grants & Funding 101",
    type: "workshop",
    start: "2026-11-25T18:00:00+00:00",
    end: "2026-11-25T19:30:00+00:00",
    venue: "Online (Zoom)",
    online: true,
    summary: "Where the money is, who it's for, and how to write an application that gets read.",
    description: `A practical evening workshop on finding and winning funding for small businesses and CICs: grants, start-up loans, competitions and local schemes.

You'll leave with a shortlist of funds to apply for and a simple template for your next application. Members get the slides and a follow-up clinic.`,
    price: "Free for members · £5",
    ticketLabel: "Register",
    organiser: "Black Owned Sheffield",
    highlights: ["Live Q&A", "Application template", "Members' follow-up clinic"],
    sample: true,
  },
  {
    slug: "christmas-market-2026",
    title: "Black Owned Sheffield Christmas Market",
    type: "market",
    start: "2026-12-12T11:00:00+00:00",
    end: "2026-12-12T17:00:00+00:00",
    venue: "Sheffield city centre (venue to be announced)",
    address: "Sheffield city centre",
    coords: { lat: 53.3811, lng: -1.4701 },
    summary: "Our festive market is back: gifts, food, music and the best of Black-owned Sheffield under one roof.",
    description: `Do your Christmas shopping with Black-owned businesses. Expect gifts, fashion, beauty, art, cakes, hot food and live music, plus face painting for the kids.

Want a stall? [Apply for a stall](/events/stall?market=christmas-market-2026) and we'll be in touch.`,
    price: "Free entry",
    ticketLabel: "Save your spot",
    organiser: "Black Owned Sheffield",
    highlights: ["30+ stalls", "Live music", "Kids' corner", "Hot food"],
    featured: true,
    sample: true,
  },
  {
    slug: "social-media-that-sells",
    title: "Social Media That Sells",
    type: "training",
    start: "2027-01-19T18:00:00+00:00",
    end: "2027-01-19T20:30:00+00:00",
    ...SADACCA,
    summary: "Hands-on training: plan a month of content, film better short videos on your phone and turn followers into customers.",
    description: `A hands-on session for business owners who know they should be posting but don't have time. We'll cover content planning, filming on your phone, TikTok and Instagram basics, and simple ways to measure what works.

Bring your phone, charged.`,
    price: "£10 · Free for members",
    ticketLabel: "Book training",
    organiser: "Black Owned Sheffield",
    highlights: ["Bring your phone", "Content calendar template", "Small group"],
    sample: true,
  },
  {
    slug: "new-year-founders-social",
    title: "New Year Founders' Social",
    type: "social",
    start: "2027-01-29T19:00:00+00:00",
    end: "2027-01-29T23:00:00+00:00",
    ...SADACCA,
    venue: "Sadacca Bar",
    summary: "Drinks, music and good company to kick off the year with Sheffield's Black business community.",
    description: `No agenda, no name badges, just a good night. DJs playing R&B, Afrobeats and soul, cocktails at the bar and the people who make Black-owned Sheffield what it is.`,
    price: "Free entry",
    ticketLabel: "Let us know you're coming",
    organiser: "Black Owned Sheffield",
    sample: true,
  },
  {
    slug: "youth-enterprise-day-2027",
    title: "Youth Enterprise Day",
    type: "community",
    start: "2027-02-18T10:00:00+00:00",
    end: "2027-02-18T15:00:00+00:00",
    ...SADACCA,
    summary: "A half-term day for 14–19 year-olds: meet young founders, pitch an idea and learn how to start something of your own.",
    description: `Young people tell us they have ideas but don't know where to start. This half-term day pairs 14–19 year-olds with local founders for workshops, a pitch challenge and lunch.

Parents, carers and youth workers are welcome to get in touch to book a group.`,
    price: "Free",
    ticketLabel: "Book a place",
    organiser: "Black Owned Sheffield",
    highlights: ["Ages 14–19", "Pitch challenge", "Lunch included"],
    sample: true,
  },
  {
    slug: "bos-expo-2027",
    title: "BOS Expo 2027: Black Business Showcase",
    type: "showcase",
    start: "2027-03-06T10:00:00+00:00",
    end: "2027-03-06T16:00:00+00:00",
    venue: "Venue to be announced",
    address: "Sheffield",
    coords: { lat: 53.3811, lng: -1.4701 },
    summary: "Our biggest showcase of the year. Exhibitors, panels, a founders' pitch stage and buyers looking for local suppliers.",
    description: `A full day celebrating Black enterprise in South Yorkshire. Exhibitor stands, panel talks with founders and funders, a pitch stage, and a buyers' corner for councils and corporates looking for local suppliers.

Exhibitor applications open soon.`,
    price: "Free entry",
    ticketLabel: "Register interest",
    organiser: "Black Owned Sheffield",
    highlights: ["Exhibitors", "Pitch stage", "Buyers' corner", "Panels"],
    featured: true,
    sample: true,
  },

  // ───────────── Past events (from our history) ─────────────
  {
    slug: "black-owned-market-cutlery-works-2026",
    title: "Black Owned Market: Black History Month",
    type: "market",
    start: "2026-10-11T12:00:00+01:00",
    end: "2026-10-11T18:00:00+01:00",
    ...CUTLERY_WORKS,
    summary: "Celebrating Black-owned businesses in Sheffield this Black History Month with stalls, cocktails, music, entertainment and face painting.",
    description: `Our Black History Month market at Cutlery Works brought together stalls from across the city with cocktails, music, entertainment, face painting and plenty more on the day.`,
    price: "Free entry",
    organiser: "Black Owned Sheffield",
    highlights: ["Stalls", "Cocktail special", "Music", "Face painting"],
  },
  {
    slug: "sadacca-bar-relaunch-2024",
    title: "Sadacca Bar Re-launch Party",
    type: "social",
    start: "2024-08-23T19:00:00+01:00",
    end: "2024-08-24T00:00:00+01:00",
    ...SADACCA,
    venue: "Sadacca Bar",
    summary: "Celebrating the new and improved bar at Sadacca with DJs playing R&B, neo soul and hip hop, games, cocktails and canapés.",
    description: `A night to celebrate the new and improved bar at Sadacca, with DJs playing R&B, neo soul and hip hop, interactive games, cocktails and delicious canapés.`,
    price: "Free entry",
    organiser: "Sadacca",
  },
  {
    slug: "cutlery-works-market-2023",
    title: "Black Owned Market at Cutlery Works",
    type: "market",
    start: "2023-10-15T12:00:00+01:00",
    displayDate: "October 2023",
    ...CUTLERY_WORKS,
    summary: "Our Black History Month market at Cutlery Works, with stalls, food and music.",
    description: `Our 2023 Black History Month market at Cutlery Works, the food hall in Neepsend, with stalls from Black-owned businesses across the city.`,
    price: "Free entry",
    organiser: "Black Owned Sheffield",
  },
  {
    slug: "festive-market-2022",
    title: "Festive Market at Events Central",
    type: "market",
    // Opening hours aren't confirmed: these times only order the event, displayDate is what shows
    start: "2022-12-17T11:00:00+00:00",
    end: "2022-12-18T17:00:00+00:00",
    displayDate: "17 and 18 December 2022",
    ...EVENTS_CENTRAL,
    summary: "Our second expo: a special festive pop-up on Fargate showcasing Black-owned businesses.",
    description: `Our second expo, a two-day festive pop-up at Events Central on Fargate, with Black-owned businesses selling gifts, beauty, food and more in the run-up to Christmas.`,
    price: "Free entry",
    organiser: "Black Owned Sheffield",
  },
  {
    slug: "black-expedition-2022",
    title: "Black Expedition 2022: Our First Market",
    type: "showcase",
    start: "2022-10-01T11:00:00+01:00",
    displayDate: "2022",
    ...EVENTS_CENTRAL,
    summary: "Where it started: our first pop-up showcasing Black businesses at Events Central on Fargate. Busy all day.",
    description: `Our very first event: a pop-up store at Events Central on Fargate showcasing Black-owned businesses from 11am to 7pm. We worried no one would come. It was busy all day.`,
    price: "Free entry",
    organiser: "Black Owned Sheffield",
    video: { youtubeId: "Ynx7h2ijapE", title: "Black Owned Sheffield | Black Expedition 2022 (Northside Media TV)" },
  },
];

export const events: BosEvent[] = site.showSampleContent
  ? allEvents
  : allEvents.filter((e) => !e.sample);

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

/**
 * Split by a reference time. Pass `now` explicitly from the caller
 * (server components) so pages stay deterministic at build time.
 */
export function splitEvents(now: Date = new Date()) {
  const t = now.getTime();
  const endOf = (e: BosEvent) => new Date(e.end ?? e.start).getTime();
  const upcoming = events.filter((e) => endOf(e) >= t).sort((a, b) => a.start.localeCompare(b.start));
  const past = events.filter((e) => endOf(e) < t).sort((a, b) => b.start.localeCompare(a.start));
  return { upcoming, past };
}
