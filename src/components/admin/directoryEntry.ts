import { businesses } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import { areaMap, regionMap } from "@/content/areas";
import type { Business, CategoryId, OpeningHours, RegionId } from "@/content/types";
import type { Submission } from "@/lib/submissions";
import { slugify } from "@/lib/utils";

/**
 * Turns a "business" application into a TypeScript object literal in the
 * `Business` shape (src/content/types.ts), ready to paste into the array in
 * src/content/businesses.ts.
 */

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : []);

function todayISO() {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

function summarise(description: string, tagline: string) {
  const firstPara = description.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "";
  if (!firstPara) return tagline;
  const sentences = firstPara.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [firstPara];
  let out = "";
  for (const sentence of sentences) {
    const next = (out + " " + sentence.trim()).trim();
    if (next.length > 200 && out) break;
    out = next;
    if (out.length >= 90) break;
  }
  if (out.length > 220) out = out.slice(0, 217).replace(/\s+\S*$/, "") + "…";
  return out;
}

function socialUrl(kind: "instagram" | "tiktok" | "facebook" | "linkedin", raw: string) {
  const v = raw.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?(instagram|tiktok|facebook|linkedin)\.com\//i.test(v)) return `https://${v.replace(/^www\./i, "www.")}`;
  const h = v.replace(/^@/, "").replace(/\/+$/, "");
  switch (kind) {
    case "instagram":
      return `https://www.instagram.com/${h}/`;
    case "tiktok":
      return `https://www.tiktok.com/@${h}`;
    case "facebook":
      return `https://www.facebook.com/${h}`;
    case "linkedin":
      return `https://www.linkedin.com/company/${h}/`;
  }
}

function compact<T extends Record<string, unknown>>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")) as T;
}

export function businessFromSubmission(sub: Submission): { entry: Business; notes: string[] } {
  const d = sub.data;
  const notes: string[] = [];
  const name = s(d.businessName) || "New business";
  const tagline = s(d.tagline);
  const description = s(d.description);

  const rawCategory = s(d.category);
  const category: CategoryId = rawCategory in categoryMap ? (rawCategory as CategoryId) : "community-organisations";
  if (category !== rawCategory) notes.push(`Category "${rawCategory}" wasn't recognised: check it.`);
  const secondary = arr(d.secondaryCategories).filter(
    (c): c is CategoryId => c in categoryMap && c !== category,
  );

  const rawRegion = s(d.region);
  const region: RegionId = rawRegion in regionMap ? (rawRegion as RegionId) : "sheffield";
  let area = s(d.area);
  if (region !== "sheffield") area = regionMap[region].areas[0]!.id;
  else if (!areaMap[area]) {
    if (area === "other") notes.push("Applicant chose “somewhere else in Sheffield”: pick the nearest area.");
    area = "city-centre";
  }

  let hours: OpeningHours[] | undefined;
  if (s(d.hoursMode) === "set" && Array.isArray(d.hours)) {
    hours = (d.hours as Record<string, unknown>[])
      .filter((h) => h && typeof h === "object")
      .map((h) => {
        const day = Number(h.day) as OpeningHours["day"];
        return h.closed ? { day, closed: true } : { day, open: s(h.open), close: s(h.close) };
      });
  }
  const hoursNote =
    s(d.hoursMode) === "appointment"
      ? ["By appointment", s(d.hoursNote)].filter(Boolean).join(". ")
      : s(d.hoursNote) || undefined;

  const offerRaw = d.offer && typeof d.offer === "object" ? (d.offer as Record<string, unknown>) : null;
  const offer = offerRaw && s(offerRaw.title)
    ? compact({ title: s(offerRaw.title), details: s(offerRaw.details), code: s(offerRaw.code) || undefined, exclusive: true })
    : undefined;

  const established = Number(s(d.established));
  const contactName = s(d.contactName);

  const entry: Business = compact({
    slug: slugify(name),
    name,
    tagline,
    summary: summarise(description, tagline),
    description,
    category,
    secondaryCategories: secondary.length ? secondary : undefined,
    services: arr(d.services),
    keywords: arr(d.keywords),
    region,
    area,
    address: s(d.address) || undefined,
    postcode: s(d.postcode) || undefined,
    onlineOnly: d.onlineOnly === true ? true : undefined,
    serviceArea: s(d.serviceArea) || undefined,
    contact: compact({
      phone: s(d.publicPhone) || undefined,
      email: s(d.publicEmail) || undefined,
      website: s(d.website) || undefined,
      bookingUrl: s(d.bookingUrl) || undefined,
    }),
    socials: compact({
      instagram: socialUrl("instagram", s(d.instagram)),
      facebook: socialUrl("facebook", s(d.facebook)),
      tiktok: socialUrl("tiktok", s(d.tiktok)),
      linkedin: socialUrl("linkedin", s(d.linkedin)),
    }),
    hours,
    hoursNote,
    offer,
    founder: contactName ? compact({ name: contactName, role: s(d.role) || "Founder" }) : undefined,
    established: Number.isFinite(established) && established > 1800 ? established : undefined,
    tier: "community",
    joined: todayISO(),
  });

  const clash = businesses.find((b) => b.slug === entry.slug);
  if (clash)
    notes.push(
      `The slug "${entry.slug}" is already used by ${clash.name}${clash.sample ? " (a sample listing)" : ""}: change one of them.`,
    );
  if (!entry.contact.email && !entry.contact.phone && !entry.contact.website && !entry.contact.bookingUrl)
    notes.push(
      Object.keys(entry.socials).length
        ? "Only social links given: customers will contact them through social media."
        : "No public email, phone, website or socials given: check how customers should get in touch.",
    );
  return { entry, notes };
}

// ─── Serialiser: plain object → TypeScript literal ──────────────────────────

const IDENT = /^[A-Za-z_$][\w$]*$/;

function quote(v: string) {
  return JSON.stringify(v);
}

function template(v: string) {
  return "`" + v.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function literal(value: unknown, indent: string, key?: string): string {
  if (typeof value === "string") return key === "description" && value.includes("\n") ? template(value) : quote(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "undefined";
  const inner = indent + "  ";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => literal(v, inner));
    const flat = `[${items.join(", ")}]`;
    if (flat.length + indent.length <= 96 && !flat.includes("\n")) return flat;
    return `[\n${items.map((i) => inner + i).join(",\n")},\n${indent}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "{}";
  const parts = entries.map(([k, v]) => `${IDENT.test(k) ? k : quote(k)}: ${literal(v, inner, k)}`);
  const flat = `{ ${parts.join(", ")} }`;
  if (indent && flat.length + indent.length <= 96 && !flat.includes("\n")) return flat;
  return `{\n${parts.map((p) => inner + p).join(",\n")},\n${indent}}`;
}

const oneLine = (v: string) => v.replace(/[\r\n]+/g, " ").slice(0, 300);

/** The full paste-ready snippet, including helpful comments */
export function directoryEntrySnippet(sub: Submission) {
  const { entry, notes } = businessFromSubmission(sub);
  const d = sub.data;
  const comments = [
    `// ${oneLine(entry.name)}: from online application ${sub.id.slice(0, 8)} (${sub.createdAt.slice(0, 10)}).`,
    entry.postcode
      ? `// TODO coords: look up https://api.postcodes.io/postcodes/${entry.postcode.replace(/\s+/g, "")} and add coords: { lat, lng }.`
      : "// TODO coords: no postcode given (online/mobile). Leave coords out, or add the area centre.",
    `// TODO images: put logo/cover in /public/businesses/${entry.slug}/ and add logo, icon and cover paths.`,
  ];
  if (s(d.logoUrl)) comments.push(`// Logo supplied: ${oneLine(s(d.logoUrl))}`);
  for (const link of arr(d.photoLinks).slice(0, 6)) comments.push(`// Photo supplied: ${oneLine(link)}`);
  if (s(d.photos).startsWith("Email")) comments.push("// Photos: applicant asked us to email them about photos.");
  for (const n of notes) comments.push(`// CHECK: ${oneLine(n)}`);
  return `${comments.join("\n")}\n${literal(entry, "")},\n`;
}
