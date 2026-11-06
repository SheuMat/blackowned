import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, Handshake, HeartHandshake, Minus, Plus, Store, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/layout";
import { Blob, Dots, Squiggle } from "@/components/ui/Shapes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TickList } from "./panels";

/* ─────────────────────────── Option cards ─────────────────────────── */

type JoinOption = {
  href: string;
  title: string;
  pitch: string;
  who: string;
  gets: string[];
  time: string;
  price: string;
  cta: string;
  icon: LucideIcon;
  band: string;
  dark?: boolean;
  shape: string;
};

export const joinOptions: JoinOption[] = [
  {
    href: "/join/business",
    title: "Add your business",
    pitch: "Get found by people who want to buy Black-owned, right here.",
    who: "Black-owned businesses, sole traders, side hustles, CICs and charities across Sheffield, Rotherham, Doncaster and Chesterfield.",
    gets: [
      "Your own profile page in the directory",
      "A pin on the map of Black-owned Sheffield",
      "A chance to be shared with our Instagram community",
    ],
    time: "About 10 minutes",
    price: "Free",
    cta: "Start your listing",
    icon: Store,
    band: "bg-sunflower text-espresso",
    shape: "#ee6a35",
  },
  {
    href: "/join/member",
    title: "Become a member",
    pitch: "Support, skills and people to grow with.",
    who: "Founders at any stage, people with a business idea, and anyone who wants to back Black business in the city.",
    gets: [
      "An access code for the members-only Business Support hub",
      "Workshops, the Business Opportunities board and member offers",
      "Mixers, meet-ups and new connections across the city",
    ],
    time: "About 3 minutes",
    price: "Free while we launch",
    cta: "Apply to join",
    icon: Users,
    band: "bg-pink text-espresso",
    shape: "#e0628f",
  },
  {
    href: "/join/partner",
    title: "Become a partner",
    pitch: "Put real support behind Black-owned business in South Yorkshire.",
    who: "Companies, councils, funders, venues, media, charities and education providers.",
    gets: [
      "Sponsorship and event partnerships",
      "Links into supplier diversity and procurement",
      "Visible, meaningful community impact",
    ],
    time: "About 5 minutes",
    price: "Let's talk",
    cta: "Start the conversation",
    icon: Handshake,
    band: "bg-navy text-cream",
    dark: true,
    shape: "#f2a0bd",
  },
  {
    href: "/join/volunteer",
    title: "Volunteer with us",
    pitch: "Give a few hours. Make a big difference.",
    who: "Anyone aged 16 or over with a bit of time and a skill to share. No experience needed for most roles.",
    gets: [
      "Hands-on experience at our markets and events",
      "New skills you can put on your CV",
      "Brilliant people to meet across the city",
    ],
    time: "About 4 minutes",
    price: "Any amount of time",
    cta: "Offer your time",
    icon: HeartHandshake,
    band: "bg-tangerine text-espresso",
    shape: "#f6bd3c",
  },
];

export function JoinOptionCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
      {joinOptions.map((o, i) => {
        const Icon = o.icon;
        return (
          <li key={o.href}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-espresso bg-white transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-pop hover:-translate-y-1 hover:shadow-pop has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-rose">
              <div className={cn("grain relative overflow-hidden px-6 pt-6 pb-8 sm:px-8 sm:pt-8", o.band)}>
                <Blob color={o.shape} className="absolute -right-14 -bottom-16 h-44 w-44 opacity-50 transition-transform duration-500 group-hover:scale-110" />
                {i % 2 === 0 ? (
                  <Squiggle color={o.dark ? "#fbf5ec" : "#2a1910"} className="absolute top-7 right-24 hidden h-6 w-20 opacity-30 sm:block" />
                ) : (
                  <Dots color={o.dark ? "#fbf5ec" : "#2a1910"} className="absolute top-6 right-24 hidden h-10 w-10 opacity-25 sm:block" />
                )}
                <div className="relative flex items-start justify-between gap-4">
                  <span
                    aria-hidden
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-espresso bg-white text-espresso shadow-pop-sm transition-transform duration-300 group-hover:-rotate-6"
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="font-display text-4xl leading-none opacity-25" aria-hidden>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="relative mt-6 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                  <Link href={o.href} className="focus-visible:outline-none">
                    {o.title}
                  </Link>
                </h3>
                <p className={cn("relative mt-2 max-w-sm text-base", o.dark ? "text-cream/85" : "text-espresso/80")}>{o.pitch}</p>
                <Badge
                  tone={o.dark ? "cream" : "espresso"}
                  className="relative mt-4 px-3 py-1.5 text-sm"
                >
                  {o.price}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-rose-ink">Who it&apos;s for</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-cocoa">{o.who}</p>
                </div>
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-rose-ink">What you get</p>
                  <TickList items={o.gets} className="mt-2.5 text-sm text-cocoa" />
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-espresso/15 pt-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa">
                    <Timer className="h-4 w-4 text-rose-ink" aria-hidden />
                    {o.time}
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-espresso px-5 font-heading text-[15px] font-semibold text-cream transition-all group-hover:bg-pink group-hover:text-espresso group-hover:shadow-pop-sm"
                  >
                    {o.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
              {/* Whole-card click target; the heading link above is the accessible one.
                  The focus outline sits on <article> because overflow-hidden clips anything drawn inside it. */}
              <Link href={o.href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10 rounded-[2rem]" />
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────── What happens next ─────────────────────────── */

export const processSteps = [
  {
    title: "Apply online",
    text: "Pick a form and answer a few questions. The business form saves as you go, so you can finish later.",
    color: "bg-sunflower",
  },
  {
    title: "We check and say hello",
    text: `A real person on the team reads every application and gets back to you within ${site.replyTime}.`,
    color: "bg-pink",
  },
  {
    title: "You're live and welcomed",
    text: "Businesses go live in the directory and on the map. Members get their access code. Partners and volunteers get a proper chat.",
    color: "bg-teal",
  },
];

export function ProcessSteps() {
  return (
    <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
      <span
        aria-hidden
        className="absolute top-10 right-[16%] left-[16%] hidden border-t-4 border-dotted border-espresso/25 md:block"
      />
      {processSteps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
          <span
            aria-hidden
            className={cn(
              "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-espresso font-display text-4xl text-espresso shadow-pop",
              s.color,
              i === 2 && "text-cream",
            )}
          >
            {i + 1}
          </span>
          <div className="md:mt-2">
            <h3 className="font-heading text-xl font-extrabold text-espresso">{s.title}</h3>
            <p className="mt-2 text-cocoa md:mx-auto md:max-w-xs">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────── Listing tiers ─────────────────────────── */

type Cell = boolean | string;
const tiers = [
  { id: "community", name: "Community listing", price: "Free", status: "Available now", live: true },
  { id: "plus", name: "Plus listing", price: "Coming 2027", status: "Register interest", live: false },
  { id: "featured", name: "Featured listing", price: "Coming 2027", status: "Register interest", live: false },
] as const;

const tierRows: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Profile page in the directory", cells: [true, true, true] },
  { label: "Pin on the map", cells: [true, true, true] },
  { label: "Links, socials, contact details and hours", cells: [true, true, true] },
  { label: "Photos", cells: ["Logo and cover", "More photos", "More photos"] },
  { label: "Special offers", cells: ["One offer", "More offers", "More offers"] },
  { label: "Priority in search results", cells: [false, true, "Top of results"] },
  { label: "Homepage placement", cells: [false, false, true] },
  { label: "Community Spotlight nominations", cells: [true, true, true] },
];

function CellValue({ value, dark }: { value: Cell; dark?: boolean }) {
  if (value === true)
    return (
      <span className="inline-flex items-center justify-center">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            dark ? "bg-pink text-espresso" : "bg-espresso text-cream",
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
        </span>
        <span className="sr-only">Included</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex items-center justify-center text-cocoa/40">
        <Minus className="h-5 w-5" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className="text-sm font-semibold">{value}</span>;
}

export function TiersComparison() {
  return (
    <div>
      {/* Phones: stacked cards */}
      <ul className="grid gap-5 md:hidden">
        {tiers.map((t, ti) => (
          <li
            key={t.id}
            className={cn(
              "rounded-[1.5rem] border-2 border-espresso p-5",
              t.live ? "bg-white shadow-pop" : "bg-cream-deep",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-extrabold text-espresso">{t.name}</h3>
                <p className="mt-0.5 font-display text-2xl text-espresso">{t.price}</p>
              </div>
              <Badge tone={t.live ? "espresso" : "sand"} className="shrink-0">
                {t.status}
              </Badge>
            </div>
            <ul className="mt-4 divide-y divide-espresso/10 text-sm">
              {tierRows.map((r) => (
                <li key={r.label} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-cocoa">{r.label}</span>
                  <CellValue value={r.cells[ti]!} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Tablet and up: comparison table */}
      <div className="hidden overflow-hidden rounded-[2rem] border-2 border-espresso bg-white shadow-pop md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Directory listing tiers compared</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[34%] p-6 align-bottom font-heading text-sm font-bold uppercase tracking-[0.14em] text-cocoa/80">
                What&apos;s included
              </th>
              {tiers.map((t) => (
                <th
                  key={t.id}
                  scope="col"
                  className={cn("p-6 text-center align-top", t.live ? "bg-sunflower" : "bg-cream-deep")}
                >
                  <span className="block font-heading text-lg font-extrabold text-espresso">{t.name}</span>
                  <span className="mt-1 block font-display text-3xl font-normal text-espresso">{t.price}</span>
                  <Badge tone={t.live ? "espresso" : "outline"} className="mt-3">
                    {t.status}
                  </Badge>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tierRows.map((r) => (
              <tr key={r.label} className="border-t border-espresso/10">
                <th scope="row" className="px-6 py-4 text-sm font-semibold text-espresso">
                  {r.label}
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} className={cn("px-6 py-4 text-center text-espresso", i === 0 && "bg-sunflower/15")}>
                    <CellValue value={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────── FAQ ─────────────────────────── */

export const joinFaqs: { q: string; a: string }[] = [
  {
    q: "Who counts as Black-owned?",
    a: "A business that's at least 51% Black-owned or Black-led. It's self-declared: we take you at your word. Sole traders, partnerships, limited companies, CICs and charities are all welcome.",
  },
  {
    q: "Is it free?",
    a: "Yes. A Community listing in the directory is free, and membership is free while we launch. Plus and Featured listings are coming in 2027 for businesses that want extra reach. Their prices aren't set yet.",
  },
  {
    q: "Do I need a shopfront?",
    a: "No. Online shops, mobile businesses, home kitchens, freelancers and side hustles are all welcome. Switch on “online or mobile only” in the form and tell us where you work or deliver.",
  },
  {
    q: "Which areas do you cover?",
    a: "Sheffield, Rotherham, Doncaster and Chesterfield. If you're just outside but most of your customers are here, apply anyway and we'll have a chat.",
  },
  {
    q: "How long until my listing goes live?",
    a: `We aim to check every application and say hello within ${site.replyTime}. Once we've confirmed your details, your listing goes live.`,
  },
  {
    q: "Can I change my listing later?",
    a: "Of course. Get in touch and we'll update it. Businesses change and your listing should keep up.",
  },
  {
    q: "What happens to my details?",
    a: "We use them to process your application and to keep in touch about it. Only the public details you choose appear on a business listing. Member, partner and volunteer details are never shown publicly.",
  },
];

export function FaqList({ items = joinFaqs }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((f) => (
        <details
          key={f.q}
          className="group rounded-[1.25rem] border-2 border-espresso bg-white transition-shadow open:shadow-pop-sm"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[1.1rem] px-5 py-4 font-heading text-base font-bold text-espresso sm:text-lg [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower transition-transform duration-200 group-open:rotate-45 group-open:bg-pink"
            >
              <Plus className="h-4 w-4" strokeWidth={3} />
            </span>
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-cocoa">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
