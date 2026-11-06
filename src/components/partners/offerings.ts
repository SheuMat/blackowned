import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CalendarHeart,
  ClipboardList,
  GraduationCap,
  Handshake,
  Megaphone,
  Newspaper,
  Sparkles,
  Store,
} from "lucide-react";

/**
 * Ways organisations can work with Black Owned Sheffield (/work-with-us).
 * Be honest about status: only mark "now" what the team can deliver today.
 * Prices aren't set, so every card says "Ask us". The `id` is also the value
 * stored in the enquiry form's `interests`.
 */
export type Offering = {
  id: string;
  title: string;
  status: "now" | "2027";
  summary: string;
  includes: string[];
  note?: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile */
  tone: string;
};

export const offerings: Offering[] = [
  {
    id: "corporate-partnership",
    title: "Corporate partnerships",
    status: "now",
    summary:
      "A proper relationship with Black-owned business in Sheffield, shaped around what you want to achieve and what the community needs.",
    includes: ["Long-term partnership plans", "Employee volunteering and mentoring", "Co-hosted events and campaigns"],
    icon: Handshake,
    tone: "bg-pink text-espresso",
  },
  {
    id: "sponsorship",
    title: "Sponsorship packages",
    status: "now",
    summary: "Put your name behind the things people already love: our markets and events, the directory and the Business Spotlight.",
    includes: ["Markets and events", "The directory and map", "The Business Spotlight"],
    note: "Directory and Spotlight sponsorship launches in 2027. Markets and events are open now.",
    icon: Megaphone,
    tone: "bg-sunflower text-espresso",
  },
  {
    id: "event-promotion",
    title: "Event promotion",
    status: "2027",
    summary:
      "Running something for Black-owned businesses or the wider community? Get it in front of the people it's for, on our channels and events page.",
    includes: ["Events page listings", "Instagram and newsletter shout-outs", "Promotion at our markets"],
    icon: CalendarHeart,
    tone: "bg-teal text-cream",
  },
  {
    id: "advertising",
    title: "Advertising",
    status: "2027",
    summary: "Newsletter and website placements for organisations with something genuinely useful for our community.",
    includes: ["Newsletter placements", "Website placements", "Always clearly labelled as advertising"],
    icon: Newspaper,
    tone: "bg-latte text-espresso",
  },
  {
    id: "featured-listings",
    title: "Featured listings & directory upgrades",
    status: "2027",
    summary:
      "Plus and Featured listings for businesses that want extra reach. The free Community listing stays free.",
    includes: ["More photos and offers", "Priority in search", "Homepage placement (Featured)"],
    icon: BadgeCheck,
    tone: "bg-blush text-espresso",
  },
  {
    id: "sponsored-spotlight",
    title: "Sponsored Business Spotlights",
    status: "2027",
    summary:
      "Back a month of the Business Spotlight, or book a sponsored feature for your own business. Always labelled 'Sponsored'.",
    includes: ["A month of the Spotlight", "Story, photos and social posts", "Clear 'Sponsored' label"],
    icon: Sparkles,
    tone: "bg-tangerine text-espresso",
  },
  {
    id: "training",
    title: "Training & workshop bookings",
    status: "2027",
    summary:
      "Book us to run a session for your team or members, or book space at one of our workshops for your staff or clients.",
    includes: ["Talks and sessions run by BOS", "Places at BOS workshops", "Sessions built with you"],
    icon: GraduationCap,
    tone: "bg-navy text-cream",
  },
  {
    id: "supplier-diversity",
    title: "Supplier diversity & procurement introductions",
    status: "now",
    summary:
      "Looking to buy from more Black-owned suppliers? We'll introduce you to businesses in our network that fit what you need.",
    includes: ["Introductions to Black-owned suppliers", "Sharing your tenders and opportunities", "A chat about what you need"],
    icon: Store,
    tone: "bg-forest text-cream",
  },
  {
    id: "research",
    title: "Community research & consultation",
    status: "now",
    summary:
      "Want to hear from Black-owned businesses and the wider community? We'll help you reach people and listen properly.",
    includes: ["Surveys and focus groups", "Community engagement sessions", "Help shaping your questions"],
    icon: ClipboardList,
    tone: "bg-rose-ink text-cream",
  },
];

export const statusLabel: Record<Offering["status"], string> = {
  now: "Available now",
  "2027": "Coming 2027",
};

export const interestOptions = [
  ...offerings.map((o) => ({ value: o.id, label: o.title })),
  { value: "other", label: "Something else" },
];

export const budgetOptions = ["Under £500", "£500–£2,000", "£2,000–£5,000", "£5,000+", "Not sure"].map((v) => ({
  value: v,
  label: v,
}));

export const timelineOptions = [
  "As soon as possible",
  "In the next 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "Just exploring for now",
].map((v) => ({ value: v, label: v }));
