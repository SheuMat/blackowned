import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TZ = "Europe/London";

/** "Thu 19 Nov 2026" */
/** Some ICU versions shorten September to "Sept"; keep it at three letters */
const tidyMonth = (m: string) => (m === "Sept" ? "Sep" : m);

/** "Sat 12 Dec 2026". No comma, whatever the Node/ICU version. Pass `undefined` to drop a part. */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
    ...opts,
  }).formatToParts(new Date(iso));
  return parts
    .filter((p) => p.type !== "literal")
    .map((p) => (p.type === "month" ? tidyMonth(p.value) : p.value))
    .join(" ");
}

/** True when two instants fall on the same calendar day in the UK */
export function sameUkDay(a: string, b: string) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  return f.format(new Date(a)) === f.format(new Date(b));
}

/** "19:00" */
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** "19 November 2026" */
export function formatLongDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Parts for a calendar-style date block: { day: "19", month: "Nov", weekday: "Thu" } */
export function dateParts(iso: string) {
  const d = new Date(iso);
  const get = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...o }).format(d);
  return {
    day: get({ day: "numeric" }),
    month: tidyMonth(get({ month: "short" })),
    weekday: get({ weekday: "short" }),
    year: get({ year: "numeric" }),
  };
}

/** Haversine distance in miles */
export function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.8;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function initials(name: string) {
  return name
    .replace(/\b(ltd|limited|cic|and|&|the|of)\b/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? "+44" + digits.slice(1) : digits}`;
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
