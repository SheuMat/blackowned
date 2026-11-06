import { categoryMap } from "@/content/categories";
import { areaMap, regionMap } from "@/content/areas";
import type { CategoryId, RegionId } from "@/content/types";
import type { Submission, SubmissionType } from "@/lib/submissions";

/**
 * Formatting helpers for the team dashboard and CSV export.
 * Pure functions: no server-only imports, no client hooks.
 */

export const typeMeta: Record<SubmissionType, { label: string; plural: string; className: string }> = {
  business: { label: "Business listing", plural: "Business listings", className: "bg-sunflower text-espresso" },
  member: { label: "Member", plural: "Members", className: "bg-pink text-espresso" },
  partner: { label: "Partner", plural: "Partners", className: "bg-navy text-cream" },
  volunteer: { label: "Volunteer", plural: "Volunteers", className: "bg-tangerine text-espresso" },
  newsletter: { label: "Newsletter", plural: "Newsletter sign-ups", className: "bg-sand text-espresso" },
  contact: { label: "Contact", plural: "Contact messages", className: "bg-latte text-espresso" },
  "work-with-us": { label: "Work with us", plural: "Work with us enquiries", className: "bg-espresso text-cream" },
  spotlight: { label: "Spotlight", plural: "Spotlight enquiries", className: "bg-blush text-rose-ink" },
  "shop-interest": { label: "Shop interest", plural: "Shop interest", className: "bg-honey text-espresso" },
  "event-booking": { label: "Event booking", plural: "Event bookings", className: "bg-cream-deep text-espresso" },
  stall: { label: "Market stall", plural: "Market stalls", className: "bg-rose text-espresso" },
};

export const STATUSES = ["new", "reviewing", "approved", "declined"] as const satisfies readonly Submission["status"][];

export const statusMeta: Record<Submission["status"], { label: string; className: string }> = {
  new: { label: "New", className: "bg-pink text-espresso" },
  reviewing: { label: "Reviewing", className: "bg-sunflower text-espresso" },
  approved: { label: "Approved", className: "bg-forest text-cream" },
  declined: { label: "Declined", className: "bg-sand text-cocoa" },
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Best display name for a submission */
export function submissionName(s: Submission) {
  const d = s.data;
  return (
    str(d.businessName) ||
    str(d.organisationName) ||
    str(d.name) ||
    str(d.contactName) ||
    str(d.email) ||
    "Unnamed submission"
  );
}

/** The person to reply to */
export function submissionContact(s: Submission) {
  const d = s.data;
  return { name: str(d.contactName) || str(d.name), email: str(d.email) };
}

const LABELS: Record<string, string> = {
  businessName: "Business name",
  contactName: "Contact name",
  role: "Role",
  email: "Email",
  phone: "Phone",
  blackOwned: "51%+ Black-owned or Black-led",
  established: "Established",
  category: "Main category",
  secondaryCategories: "Also fits under",
  tagline: "Tagline",
  description: "Description",
  services: "Services",
  keywords: "Keywords",
  region: "Region",
  area: "Sheffield area",
  address: "Address",
  postcode: "Postcode",
  onlineOnly: "Online or mobile only",
  serviceArea: "Service area",
  website: "Website",
  bookingUrl: "Booking or shop link",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  publicPhone: "Public phone",
  publicEmail: "Public email",
  hoursMode: "Hours type",
  hoursSummary: "Opening hours",
  hoursNote: "Hours note",
  offer: "Special offer",
  photos: "Photos",
  logoUrl: "Logo link",
  photoLinks: "Photo links",
  heardAbout: "Heard about us via",
  upgradeInterest: "Wants Plus/Featured updates",
  consent: "Consent given",
  name: "Name",
  businessNameOptional: "Business name",
  stage: "Stage",
  support: "Support wanted",
  about: "About their business",
  organisationName: "Organisation",
  organisationType: "Organisation type",
  organisationWebsite: "Organisation website",
  interests: "Partnership interests",
  message: "Message",
  ageRange: "Age range",
  guardianName: "Parent or guardian",
  guardianEmail: "Guardian email",
  guardianConsentNeeded: "Guardian consent needed",
  skills: "Skills",
  availability: "Availability",
  why: "Why they want to volunteer",
  experience: "Experience",
  source: "Source",
};

export function fieldLabel(key: string) {
  if (LABELS[key]) return LABELS[key]!;
  const words = key
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Keys to show, in order, for a submission's data */
export function displayEntries(data: Record<string, unknown>) {
  return Object.entries(data).filter(([k, v]) => {
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    // `hours` is the raw per-day array; `hoursSummary` says the same thing nicely
    if (k === "hours" && "hoursSummary" in data) return false;
    if (k === "hoursMode" && "hoursSummary" in data) return false;
    return true;
  });
}

/** Swap known ids (categories, regions, areas) for human labels */
export function prettyValue(key: string, value: string) {
  if ((key === "category" || key === "secondaryCategories") && value in categoryMap)
    return categoryMap[value as CategoryId].label;
  if (key === "region" && value in regionMap) return regionMap[value as RegionId].label;
  if (key === "area") return value === "other" ? "Somewhere else in Sheffield" : (areaMap[value]?.label ?? value);
  if (key === "photos") return value === "links" ? "Added links below" : value === "email" ? "Email them about photos" : value;
  return value;
}

export function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string, now = Date.now()) {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return rtf.format(Math.round(diff / (86400 * 30)), "month");
}

/** mailto: link with a friendly subject line */
export function mailtoFor(s: Submission) {
  const { name, email } = submissionContact(s);
  if (!email) return null;
  const first = name.split(/\s+/)[0];
  const subjects: Partial<Record<SubmissionType, string>> = {
    business: `Your Black Owned Sheffield listing: ${submissionName(s)}`,
    member: "Your Black Owned Sheffield membership",
    partner: "Partnering with Black Owned Sheffield",
    volunteer: "Volunteering with Black Owned Sheffield",
    stall: "Your Black Owned market stall application",
  };
  const subject = subjects[s.type] ?? "Your message to Black Owned Sheffield";
  const body = `Hi${first ? ` ${first}` : ""},\n\nThanks for getting in touch with Black Owned Sheffield.\n\n`;
  return `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Plain-text value for CSV cells */
export function plainValue(key: string, v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return prettyValue(key, v);
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) {
    return v
      .map((x) => (x && typeof x === "object" ? objectToText(x as Record<string, unknown>) : plainValue(key, x)))
      .join("; ");
  }
  if (typeof v === "object") return objectToText(v as Record<string, unknown>);
  return String(v);
}

function objectToText(o: Record<string, unknown>) {
  return Object.entries(o)
    .filter(([, x]) => x !== undefined && x !== "")
    .map(([k, x]) => `${fieldLabel(k)}: ${plainValue(k, x)}`)
    .join(", ");
}
