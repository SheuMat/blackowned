import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Compass,
  Construction,
  Globe,
  GraduationCap,
  HandCoins,
  Handshake,
  Heart,
  Megaphone,
  Mic,
  Network,
  PartyPopper,
  Presentation,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Users,
} from "lucide-react";
import { media } from "@/content/media";

/**
 * Copy and data for the About page. Facts here come from the build brief and
 * src/content (events.ts, media.ts). Only add a date when we actually know it.
 */

/** One mission statement, used on the About page and the home page's About block */
export const MISSION =
  "To discover, promote and connect Black-owned businesses and the wider community across Sheffield and South Yorkshire.";

export type Milestone = {
  id: string;
  /** Shown on the badge. Leave undefined when we don't know the date. */
  when?: string;
  /** Machine-readable date for <time>, when known */
  dateTime?: string;
  title: string;
  text: string;
  icon: LucideIcon;
  /** Tailwind classes for the badge/dot colour */
  tone: string;
  links?: { href: string; label: string }[];
  /** Highlight as "now" */
  current?: boolean;
};

const exposed = media.find((m) => m.id === "exposed-2022");
const podcastPart1 = media.find((m) => m.id === "daily-devotion-1");

export const milestones: Milestone[] = [
  {
    id: "start",
    when: "2020",
    dateTime: "2020",
    title: "It starts on Instagram and Facebook",
    text: "After George Floyd's murder and the protests that followed, Asha and Rakaia asked themselves what they could do to help. Their answer: a free page promoting Black-owned businesses in Sheffield.",
    icon: Sprout,
    tone: "bg-pink text-espresso",
  },
  {
    id: "black-expedition",
    when: "2022",
    dateTime: "2022",
    title: "Our first market: Black Expedition",
    text: "A pop-up at Events Central on Fargate showcasing Black-owned businesses. We worried no one would come. It was busy all day, and Northside Media filmed it.",
    icon: Store,
    tone: "bg-sunflower text-espresso",
    links: [{ href: "/events/black-expedition-2022", label: "See the event and the film" }],
  },
  {
    // Parts 1 to 3 went up on YouTube on 4, 6 and 8 December 2022
    id: "podcast",
    when: "Dec 2022",
    dateTime: "2022-12",
    title: "The Daily Devotion Podcast series",
    text: "A three-part conversation with our co-founders: why we started, working as a team, and why you should stop waiting and start.",
    icon: Mic,
    tone: "bg-rose-ink text-cream",
    links: podcastPart1 ? [{ href: podcastPart1.url, label: "Listen to part 1" }] : undefined,
  },
  {
    id: "festive-2022",
    when: "Dec 2022",
    dateTime: "2022-12",
    title: "A festive market and a magazine interview",
    text: "Two days of Christmas shopping at Events Central on 17 and 18 December, and an interview with Exposed Magazine about how the platform started and where it's heading.",
    icon: PartyPopper,
    // forest, not teal: the date badge needs AA contrast for cream text
    tone: "bg-forest text-cream",
    links: [
      { href: "/events/festive-market-2022", label: "About the festive market" },
      ...(exposed ? [{ href: exposed.url, label: "Read the Exposed interview" }] : []),
    ],
  },
  {
    id: "cutlery-2023",
    when: "2023",
    dateTime: "2023",
    title: "Black History Month at Cutlery Works",
    text: "Our Black History Month market at Cutlery Works in Neepsend, with stalls from Black-owned businesses across the city.",
    icon: Store,
    tone: "bg-tangerine text-espresso",
    links: [{ href: "/events/cutlery-works-market-2023", label: "About the market" }],
  },
  {
    id: "sadacca-relaunch",
    when: "Aug 2024",
    dateTime: "2024-08-23",
    title: "Sadacca Bar re-launch party",
    text: "A night on the Wicker celebrating the new and improved bar at Sadacca, with DJs, games, cocktails and canapés.",
    icon: Sparkles,
    tone: "bg-navy text-cream",
    links: [{ href: "/events/sadacca-bar-relaunch-2024", label: "About the night" }],
  },
  {
    // Companies House: BLACK OWNED SHEFFIELD CIC, company 16051708, incorporated 30 October 2024
    id: "cic",
    when: "Oct 2024",
    dateTime: "2024-10-30",
    title: "Became a Community Interest Company",
    text: "We became Black Owned Sheffield CIC, a company that exists for the community, with any surplus going back into the work.",
    icon: Building2,
    tone: "bg-latte text-espresso",
  },
  {
    id: "rebrand-mixer",
    title: "Our rebrand mixer at Sadacca",
    text: "Celebrating our new look with the community at Sadacca on the Wicker.",
    icon: Users,
    tone: "bg-pink text-espresso",
  },
  {
    id: "syp-bhm",
    title: "Presenting at South Yorkshire Police's Black History Month event",
    text: "We shared the Black Owned Sheffield story, and the businesses behind it, at the force's Black History Month event.",
    icon: Presentation,
    tone: "bg-sunflower text-espresso",
  },
  {
    id: "race-action-plan",
    title: "Involved in the Police Race Action Plan",
    text: "We've taken part in work connected to the Police Race Action Plan, the national plan to improve policing for Black people.",
    icon: ShieldCheck,
    tone: "bg-teal text-cream",
  },
  {
    id: "renovation",
    title: "Renovating Sadacca Bar and our office",
    text: "Rolling our sleeves up at 48 Wicker, helping renovate the bar and setting up our own office in the building.",
    icon: Construction,
    tone: "bg-tangerine text-espresso",
  },
  {
    id: "cutlery-2026",
    when: "Oct 2026",
    dateTime: "2026-10-11",
    title: "Back at Cutlery Works for Black History Month",
    text: "Stalls, cocktails, music, entertainment and face painting at our Black History Month market on Sunday 11 October.",
    icon: Store,
    tone: "bg-navy text-cream",
    links: [{ href: "/events/black-owned-market-cutlery-works-2026", label: "About the market" }],
  },
  {
    id: "launch",
    when: "Nov 2026",
    dateTime: "2026-11",
    title: "Launching the website and directory",
    text: "We're launching Sheffield's online hub for Black-owned business, with a free directory and map.",
    icon: Rocket,
    tone: "bg-espresso text-cream",
    links: [{ href: "/directory", label: "Explore the directory" }],
    current: true,
  },
];

export type Goal = { title: string; text: string; icon: LucideIcon; tone: string };

export const goals: Goal[] = [
  {
    title: "Visibility",
    text: "Make Black-owned businesses easy to find, in search, on the map and in the places people already look.",
    icon: Megaphone,
    tone: "bg-pink",
  },
  {
    title: "Customers beyond Sheffield",
    text: "Help businesses reach people across South Yorkshire and further, online and at our markets.",
    icon: Globe,
    tone: "bg-sunflower",
  },
  {
    title: "Grants and funding",
    text: "Point businesses to the grants, funding and support they're entitled to, and help them apply with confidence.",
    icon: HandCoins,
    tone: "bg-latte",
  },
  {
    title: "Networking",
    text: "Bring founders together, with each other and with venues, buyers and partners who can open doors.",
    icon: Network,
    tone: "bg-blush",
  },
  {
    title: "Confidence for young people",
    text: "Show the next generation that people who look like them run brilliant businesses here, and that they can too.",
    icon: Rocket,
    tone: "bg-sunflower",
  },
  {
    title: "Employment and education",
    text: "Open up pathways into jobs, training and education through the businesses and partners in our network.",
    icon: GraduationCap,
    tone: "bg-pink",
  },
];

export type Value = { title: string; text: string; icon: LucideIcon; color: string; ink: string };

export const values: Value[] = [
  {
    title: "Community first",
    text: "We exist for Black-owned businesses and the people who support them. Every decision starts there.",
    icon: Heart,
    color: "#f2a0bd",
    ink: "#2a1910",
  },
  {
    title: "Free to be found",
    text: "Being in the directory costs nothing. Paid extras help fund the free stuff, never the other way round.",
    icon: Compass,
    color: "#f6bd3c",
    ink: "#2a1910",
  },
  {
    title: "Pride, out loud",
    text: "We celebrate Black business with colour, music and good food. Joyful, never apologetic.",
    icon: Sparkles,
    color: "#ee6a35",
    ink: "#2a1910",
  },
  {
    title: "Better together",
    text: "Venues, media, councils and community groups: we work with anyone who wants to help, because nobody does this alone.",
    icon: Handshake,
    // navy rather than teal: cream body text on teal is only ~3.6:1
    color: "#1f2a63",
    ink: "#fbf5ec",
  },
];

/** What a CIC is, in plain English. Keep it general and accurate. */
export const cicFacts: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Profits go back into the community",
    text: "A CIC is a limited company that exists for a community purpose. Any surplus is mainly reinvested in that purpose, not paid out to owners.",
    icon: Sprout,
  },
  {
    title: "An asset lock",
    text: "A legal promise that a CIC's assets are used for the community. They can't be handed out for private gain, and if a CIC ever closes they pass to another asset-locked body.",
    icon: ShieldCheck,
  },
  {
    title: "A community interest statement",
    text: "When a CIC registers it sets out who it will benefit and how. Every year it reports on what it has done for that community.",
    icon: Building2,
  },
];
