import { z } from "zod";
import { categories } from "@/content/categories";
import { regions } from "@/content/areas";
import {
  UK_POSTCODE,
  issuesToErrors,
  type Errors,
  consentField,
  emailField,
  formatPostcode,
  optionalEmail,
  optionalPhone,
  optionalUrl,
  req,
  withProtocol,
} from "./formKit";
import { defaultHours, summariseHours, validateHours, type HoursValue } from "./hours";

/** Everything the business application collects (also the shape saved as a draft) */
export type BusinessDraft = {
  businessName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  blackOwned: boolean;
  established: string;

  category: string;
  secondaryCategories: string[];
  tagline: string;
  description: string;
  services: string[];
  keywords: string[];

  region: string;
  area: string;
  address: string;
  postcode: string;
  onlineOnly: boolean;
  serviceArea: string;

  website: string;
  bookingUrl: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
  publicPhone: string;
  publicEmail: string;

  hours: HoursValue;
  hasOffer: boolean;
  offerTitle: string;
  offerDetails: string;
  offerCode: string;
  photos: "links" | "email";
  logoUrl: string;
  photoLinks: string;
  heardAbout: string;
  upgradeInterest: boolean;
  consent: boolean;
};

export const emptyBusinessDraft: BusinessDraft = {
  businessName: "",
  contactName: "",
  role: "",
  email: "",
  phone: "",
  blackOwned: false,
  established: "",
  category: "",
  secondaryCategories: [],
  tagline: "",
  description: "",
  services: [],
  keywords: [],
  region: "",
  area: "",
  address: "",
  postcode: "",
  onlineOnly: false,
  serviceArea: "",
  website: "",
  bookingUrl: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
  publicPhone: "",
  publicEmail: "",
  hours: defaultHours,
  hasOffer: false,
  offerTitle: "",
  offerDetails: "",
  offerCode: "",
  photos: "email",
  logoUrl: "",
  photoLinks: "",
  heardAbout: "",
  upgradeInterest: false,
  consent: false,
};

export const TAGLINE_MAX = 80;
export const DESCRIPTION_MIN = 80;
export const DESCRIPTION_MAX = 1500;

const thisYear = new Date().getFullYear();
const handle = z
  .string()
  .trim()
  .refine((v) => !/\s/.test(v), "Handles and links can't contain spaces.");

export const businessSteps = [
  {
    title: "Your business",
    short: "Business",
    intro: "The basics, so we know who we're talking to.",
    schema: z.object({
      businessName: req("What's your business called?"),
      contactName: req("Please tell us your name."),
      role: req("What's your role in the business?"),
      email: emailField,
      phone: optionalPhone,
      blackOwned: z.literal(true, { error: "Please confirm your business is at least 51% Black-owned or Black-led." }),
      established: z
        .string()
        .trim()
        .refine(
          (v) => v === "" || (/^\d{4}$/.test(v) && Number(v) >= 1900 && Number(v) <= thisYear),
          `Use a four-digit year, like ${thisYear - 3}.`,
        ),
    }),
  },
  {
    title: "What you do",
    short: "What you do",
    intro: "This is what customers will read on your listing. Write it like you'd say it.",
    schema: z.object({
      category: z.string().min(1, "Pick the category that fits best."),
      secondaryCategories: z.array(z.string()).max(2, "You can pick up to two extra categories."),
      tagline: req("Add a short tagline.").max(TAGLINE_MAX, `Keep your tagline to ${TAGLINE_MAX} characters or fewer.`),
      description: z
        .string()
        .trim()
        .min(DESCRIPTION_MIN, `Tell us a bit more: at least ${DESCRIPTION_MIN} characters.`)
        .max(DESCRIPTION_MAX, `Please keep it under ${DESCRIPTION_MAX} characters.`),
      services: z.array(z.string()).min(1, "Add at least one thing you offer."),
      keywords: z.array(z.string()),
    }),
  },
  {
    title: "Where you are",
    short: "Location",
    intro: "So people can find you on the map, or know where you work.",
    schema: z.object({
      region: z.string().min(1, "Choose where you're based."),
      area: z.string(),
      address: z.string().trim(),
      postcode: z.string().trim(),
      onlineOnly: z.boolean(),
      serviceArea: z.string().trim(),
    }),
    check: (v: BusinessDraft): Errors => {
      const e: Errors = {};
      const postcode = v.postcode.trim();
      if (v.region === "sheffield" && !v.onlineOnly && !v.area) e.area = "Which part of Sheffield are you in?";
      if (!v.onlineOnly) {
        if (!v.address.trim()) e.address = "Add your street address.";
        if (!postcode) e.postcode = "Add your postcode.";
        else if (!UK_POSTCODE.test(postcode)) e.postcode = "That doesn't look like a UK postcode (e.g. S3 8JB).";
      } else {
        if (postcode && !UK_POSTCODE.test(postcode) && !/^[A-Z]{1,2}\d[A-Z\d]?$/i.test(postcode))
          e.postcode = "Use a full postcode or just the first half (e.g. S3).";
        if (!v.serviceArea.trim()) e.serviceArea = "Tell customers where you work or deliver.";
      }
      return e;
    },
  },
  {
    title: "Online & contact",
    short: "Contact",
    intro: "How customers can reach you. Everything here can appear on your public listing.",
    schema: z.object({
      website: optionalUrl,
      bookingUrl: optionalUrl,
      instagram: handle,
      tiktok: handle,
      facebook: handle,
      linkedin: handle,
      publicPhone: optionalPhone,
      publicEmail: optionalEmail,
    }),
    check: (v: BusinessDraft): Errors => {
      const routes = [v.website, v.bookingUrl, v.instagram, v.tiktok, v.facebook, v.linkedin, v.publicPhone, v.publicEmail];
      return routes.some((x) => x.trim() !== "")
        ? {}
        : { _contact: "Add at least one way for customers to find you: a website, social link, phone or email." };
    },
  },
  {
    title: "Extras",
    short: "Extras",
    intro: "Hours, offers and photos. The finishing touches that make a listing pop.",
    schema: z.object({
      offerTitle: z.string().trim(),
      offerDetails: z.string().trim(),
      offerCode: z.string().trim(),
      consent: consentField,
    }),
    check: (v: BusinessDraft): Errors => {
      const e: Errors = {};
      for (const [k, message] of Object.entries(validateHours(v.hours))) e[`hours.${k}`] = message;
      if (v.hasOffer) {
        if (!v.offerTitle.trim()) e.offerTitle = "Give your offer a short title.";
        if (!v.offerDetails.trim()) e.offerDetails = "Explain how people claim the offer.";
      }
      // The logo link field only shows when "I'll add links now" is picked
      if (v.photos === "links") {
        const logo = optionalUrl.safeParse(v.logoUrl);
        if (!logo.success) e.logoUrl = logo.error.issues[0]?.message ?? "Please use a full web address.";
      }
      return e;
    },
  },
  {
    title: "Review & send",
    short: "Review",
    intro: "Check everything looks right. You can edit any section before you send.",
    schema: z.object({}),
  },
] satisfies BusinessStep[];

/**
 * Field-level rules live in `schema`. Rules that depend on several answers
 * live in `check`, which always runs (zod skips object refinements when a
 * field already has an error, which would hide some messages).
 */
type BusinessStep = {
  title: string;
  short: string;
  intro: string;
  schema: z.ZodType;
  check?: (v: BusinessDraft) => Errors;
};

export function validateBusinessStep(i: number, values: BusinessDraft): Errors {
  const step: BusinessStep | undefined = businessSteps[i];
  if (!step) return {};
  const result = step.schema.safeParse(values);
  const fieldErrors = result.success ? {} : issuesToErrors(result.error.issues);
  return { ...(step.check?.(values) ?? {}), ...fieldErrors };
}

export const categoryOptions = categories.map((c) => ({ value: c.id, label: c.label }));
export const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export const regionOptions = regions.map((r) => ({ value: r.id, label: r.label }));
export const regionLabel = (id: string) => regions.find((r) => r.id === id)?.label ?? id;

export const sheffieldAreaOptions = [
  ...(regions.find((r) => r.id === "sheffield")?.areas ?? []).map((a) => ({ value: a.id, label: a.label })),
  { value: "other", label: "Somewhere else in Sheffield" },
];
export const areaLabel = (id: string) => sheffieldAreaOptions.find((a) => a.value === id)?.label ?? id;

export const roleSuggestions = ["Founder", "Co-founder", "Owner", "Director", "Manager", "Sole trader"];

export const serviceIdeas: Record<string, string[]> = {
  "food-restaurants": ["Takeaway", "Event catering", "Delivery", "Eat in", "Meal prep"],
  "beauty-hair": ["Braids", "Barbering", "Locs", "Nails", "Wigs & installs", "Skincare"],
  fashion: ["Made to order", "Alterations", "Online shop", "Ready to wear"],
  "health-wellbeing": ["1:1 sessions", "Group classes", "Online sessions", "Massage"],
  "professional-services": ["Consultancy", "HR support", "Recruitment", "Legal advice"],
  trades: ["Free quotes", "Emergency call-outs", "Domestic", "Commercial"],
  "creative-industries": ["Photography", "Videography", "Graphic design", "Content creation"],
  education: ["Tutoring", "Workshops", "Courses", "Mentoring"],
  "events-entertainment": ["DJ", "Event planning", "Venue hire", "Decor"],
  "childrens-services": ["After-school clubs", "Holiday clubs", "Childminding", "Parties"],
  finance: ["Bookkeeping", "Tax returns", "Payroll", "Mortgage advice"],
  technology: ["Websites", "IT support", "App development", "Digital marketing"],
  retail: ["Online shop", "Gifts", "Click and collect", "Delivery"],
  "community-organisations": ["Volunteering", "Youth projects", "Support groups", "Community events"],
};

function clean<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)),
  ) as Partial<T>;
}

/** The payload posted to /api/applications (type "business") */
export function businessPayload(d: BusinessDraft) {
  const h = d.hours;
  return clean({
    businessName: d.businessName.trim(),
    contactName: d.contactName.trim(),
    role: d.role.trim(),
    email: d.email.trim(),
    phone: d.phone.trim(),
    blackOwned: true,
    established: d.established.trim(),

    category: d.category,
    secondaryCategories: d.secondaryCategories.filter((c) => c !== d.category),
    tagline: d.tagline.trim(),
    description: d.description.trim(),
    services: d.services,
    keywords: d.keywords,

    region: d.region,
    area: d.region === "sheffield" ? d.area : undefined,
    address: d.address.trim(),
    postcode: d.postcode ? formatPostcode(d.postcode) : "",
    onlineOnly: d.onlineOnly,
    serviceArea: d.serviceArea.trim(),

    website: withProtocol(d.website),
    bookingUrl: withProtocol(d.bookingUrl),
    instagram: d.instagram.trim(),
    tiktok: d.tiktok.trim(),
    facebook: d.facebook.trim(),
    linkedin: d.linkedin.trim(),
    publicPhone: d.publicPhone.trim(),
    publicEmail: d.publicEmail.trim(),

    hoursMode: h.mode,
    hours:
      h.mode === "set"
        ? h.days.map((day, i) => (day.closed ? { day: i, closed: true } : { day: i, open: day.open, close: day.close }))
        : undefined,
    hoursNote: h.note.trim(),
    hoursSummary: summariseHours(h),

    offer: d.hasOffer
      ? clean({ title: d.offerTitle.trim(), details: d.offerDetails.trim(), code: d.offerCode.trim() })
      : undefined,

    photos: d.photos === "links" ? "Links provided" : "Email me about photos",
    logoUrl: d.photos === "links" ? withProtocol(d.logoUrl) : "",
    photoLinks:
      d.photos === "links"
        ? d.photoLinks
            .split(/\s*\n\s*/)
            .map((l) => l.trim())
            .filter(Boolean)
            .slice(0, 12)
        : undefined,
    heardAbout: d.heardAbout,
    upgradeInterest: d.upgradeInterest || undefined,
    consent: true,
  });
}
