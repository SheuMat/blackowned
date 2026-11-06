/**
 * Content model for the whole site. Everything editorial lives in
 * src/content/*.ts so the team can add listings, events and stories without
 * touching page code. Items flagged `sample: true` are demo content.
 */

export type CategoryId =
  | "food-restaurants"
  | "beauty-hair"
  | "fashion"
  | "health-wellbeing"
  | "professional-services"
  | "trades"
  | "creative-industries"
  | "education"
  | "events-entertainment"
  | "childrens-services"
  | "finance"
  | "technology"
  | "retail"
  | "community-organisations";

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  /** lucide-react icon name, resolved by <CategoryIcon /> */
  icon: string;
  /** brand colour used for chips, pins and placeholder art */
  color: string;
  /** readable text colour on top of `color` */
  ink: string;
};

export type RegionId = "sheffield" | "rotherham" | "doncaster" | "chesterfield";

export type Region = {
  id: RegionId;
  label: string;
  center: { lat: number; lng: number };
  zoom: number;
  areas: Area[];
};

export type Area = {
  id: string;
  label: string;
  region: RegionId;
  center: { lat: number; lng: number };
};

export type OpeningHours = {
  /** 0 = Monday … 6 = Sunday */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  open?: string; // "09:00"
  close?: string; // "17:30"
  closed?: boolean;
  note?: string; // "By appointment"
};

export type Socials = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  whatsapp?: string;
};

export type ListingTier = "community" | "plus" | "featured";

export type Business = {
  slug: string;
  name: string;
  /** Legal / trading name if different from display name */
  legalName?: string;
  tagline: string;
  /** 1–2 sentence summary for cards */
  summary: string;
  /** Longer description, paragraphs separated by blank lines */
  description: string;
  category: CategoryId;
  secondaryCategories?: CategoryId[];
  services: string[];
  keywords: string[];
  region: RegionId;
  /** Area id from src/content/areas.ts */
  area: string;
  address?: string;
  postcode?: string;
  coords?: { lat: number; lng: number };
  /** Trades online / mobile only, no shopfront */
  onlineOnly?: boolean;
  serviceArea?: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    bookingUrl?: string;
  };
  socials: Socials;
  hours?: OpeningHours[];
  hoursNote?: string;
  /** "office" when the hours are office hours rather than a shop's opening hours (e.g. visits by appointment) */
  hoursKind?: "opening" | "office";
  /** Wide/horizontal logo */
  logo?: string;
  /** Square mark for small tiles and map pins (falls back to logo) */
  icon?: string;
  cover?: string;
  /**
   * "contain" for covers with text baked in (e.g. a social share card), so
   * cards letterbox them instead of cropping. Pair with coverBackground.
   */
  coverFit?: "cover" | "contain";
  /** CSS background behind a contained cover, e.g. a two-tone gradient */
  coverBackground?: string;
  photos?: { src: string; alt: string }[];
  brandColor?: string;
  offer?: {
    title: string;
    details: string;
    code?: string;
    expires?: string; // ISO date
    /** Offer is exclusive to BOS members / visitors */
    exclusive?: boolean;
  };
  founder?: { name: string; role: string; quote?: string; photo?: string };
  established?: number;
  /** Short badges e.g. "Women-led", "Family-run", "Delivers" */
  highlights?: string[];
  tier: ListingTier;
  featured?: boolean;
  verified?: boolean;
  joined: string; // ISO date added to directory
  sample?: boolean;
};

export type EventType =
  | "networking"
  | "workshop"
  | "training"
  | "market"
  | "showcase"
  | "community"
  | "social";

export type BosEvent = {
  slug: string;
  title: string;
  type: EventType;
  /** ISO with offset, e.g. "2026-11-19T08:00:00Z" */
  start: string;
  end?: string;
  /** Overrides the formatted date when the exact day isn't known ("Autumn 2022") */
  displayDate?: string;
  venue: string;
  address?: string;
  coords?: { lat: number; lng: number };
  online?: boolean;
  summary: string;
  description: string;
  price: string; // "Free", "£10", "Free for members"
  ticketUrl?: string;
  ticketLabel?: string; // "Book a place", "Get tickets", "Register"
  organiser?: string;
  highlights?: string[];
  image?: string;
  /** Video recap for past events */
  video?: { youtubeId: string; title: string };
  featured?: boolean;
  membersOnly?: boolean;
  sample?: boolean;
};

export type StoryCategory =
  | "meet-the-founder"
  | "business-of-the-month"
  | "guides"
  | "launches"
  | "community"
  | "press"
  | "video"
  | "news";

export type Story = {
  slug: string;
  title: string;
  category: StoryCategory;
  date: string; // ISO date
  excerpt: string;
  /** Markdown-lite body: paragraphs separated by blank lines; lines starting "## " are headings; "> " quotes; "- " list items */
  body: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  /**
   * "contain" for images with text baked in (e.g. a 1200x630 share card), so
   * cards letterbox them instead of cropping. Pair with imageBackground.
   */
  imageFit?: "cover" | "contain";
  /** CSS background behind a contained image */
  imageBackground?: string;
  youtubeId?: string;
  youtubeStart?: number;
  externalUrl?: string;
  externalLabel?: string;
  relatedBusinesses?: string[];
  tags?: string[];
  readingMinutes?: number;
  featured?: boolean;
  sample?: boolean;
};

export type Spotlight = {
  /** "2026-11" */
  month: string;
  businessSlug: string;
  headline: string;
  intro: string;
  story: string;
  quote?: { text: string; by: string };
  image?: string;
  sponsored?: boolean;
  sample?: boolean;
};

export type Partner = {
  slug: string;
  name: string;
  kind: "venue" | "media" | "public-sector" | "community" | "business" | "funder";
  description: string;
  url?: string;
  logo?: string;
  /** Short wordmark text used when no logo file is available */
  wordmark?: string;
  color?: string;
  since?: number;
};

export type MediaItem = {
  id: string;
  kind: "video" | "podcast" | "press" | "instagram";
  title: string;
  outlet: string;
  date?: string;
  url: string;
  youtubeId?: string;
  youtubeStart?: number;
  description: string;
};
