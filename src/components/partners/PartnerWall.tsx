import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { events } from "@/content/events";
import { media } from "@/content/media";
import { partnerKinds, partners } from "@/content/partners";
import type { Partner } from "@/content/types";
import { cn, displayUrl } from "@/lib/utils";
import { PartnerLogo } from "./PartnerLogo";

/** Order the groups appear in on /partners */
const kindOrder: Partner["kind"][] = ["community", "venue", "public-sector", "media", "funder", "business"];

const kindIntro: Record<Partner["kind"], string> = {
  community: "The community organisations we call home.",
  venue: "The spaces that have hosted our markets and events.",
  "public-sector": "Public bodies we've worked alongside.",
  media: "The people who've filmed, interviewed and platformed us.",
  funder: "Funders backing Black-owned business in South Yorkshire.",
  business: "Businesses supporting what we do.",
};

export function PartnerWall() {
  const groups = kindOrder
    .map((kind) => ({ kind, items: partners.filter((p) => p.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      {groups.map(({ kind, items }) => (
        <section
          key={kind}
          id={`kind-${kind}`}
          aria-labelledby={`kind-${kind}-title`}
          className="grid scroll-mt-28 gap-6 lg:grid-cols-12 lg:gap-10"
        >
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-2 border-b-2 border-espresso/10 pb-4 lg:sticky lg:top-28 lg:border-b-0 lg:pb-0">
              <h2
                id={`kind-${kind}-title`}
                className="flex items-center gap-3 font-heading text-2xl font-extrabold text-espresso sm:text-3xl"
              >
                {partnerKinds[kind]}
                <span
                  aria-hidden
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-espresso px-2 font-display text-sm text-cream"
                >
                  {items.length}
                </span>
                <span className="sr-only">
                  ({items.length} {items.length === 1 ? "organisation" : "organisations"})
                </span>
              </h2>
              <p className="text-cocoa">{kindIntro[kind]}</p>
            </div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {items.map((p, i) => {
              // Odd one out gets a wide, side-by-side card so the grid never has a gap
              const wide = items.length % 2 === 1 && i === 0;
              return (
                <li key={p.slug} id={p.slug} className={cn("scroll-mt-28", wide && "sm:col-span-2")}>
                  <PartnerCard partner={p} wide={wide} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <Link
        href="/join/partner"
        className="group flex flex-col items-start gap-5 rounded-[1.75rem] border-2 border-dashed border-espresso/40 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:border-solid hover:border-espresso hover:bg-white hover:shadow-pop sm:flex-row sm:items-center sm:p-8"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower transition-transform group-hover:rotate-90">
          <Plus className="h-7 w-7 text-espresso" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="block font-heading text-2xl font-extrabold text-espresso">Your organisation here?</span>
          <span className="mt-1 block text-cocoa">
            Venues, funders, councils, media and businesses: if you want to back Black-owned business in South
            Yorkshire, we&apos;d love to hear from you.
          </span>
        </span>
        <span className="inline-flex items-center gap-2 font-heading font-bold text-espresso">
          Become a partner
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </div>
  );
}

/** No website on file? Link to their piece about us instead, if we have one */
function mediaLinkFor(p: Partner) {
  const m = media.find((x) => x.outlet.toLowerCase().startsWith(p.name.toLowerCase()));
  if (!m) return undefined;
  const label = { video: "Watch the film", podcast: "Listen to the series", press: "Read the piece", instagram: "Watch the reel" }[m.kind];
  return { href: m.url, label, host: displayUrl(m.url).split("/")[0] };
}

/** Still nothing? Point to the first real event we held at their venue */
function eventLinkFor(p: Partner) {
  const e = events
    .filter((x) => !x.sample && x.venue.toLowerCase().startsWith(p.name.toLowerCase()))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
  if (!e) return undefined;
  return { href: `/events/${e.slug}`, label: `See ${e.title.split(":")[0]}` };
}

function PartnerCard({ partner: p, wide }: { partner: Partner; wide?: boolean }) {
  const fallback = p.url ? undefined : mediaLinkFor(p);
  const eventLink = p.url || fallback ? undefined : eventLinkFor(p);
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[1.75rem] border-2 border-espresso bg-white p-3 shadow-pop-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-pop",
        wide && "sm:grid sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:items-stretch sm:gap-2",
      )}
    >
      <PartnerLogo partner={p} className={cn(wide && "sm:h-full sm:min-h-44")} />
      <div className={cn("flex flex-1 flex-col px-3 pt-5 pb-3", wide && "sm:py-4")}>
        <h3 className="font-heading text-xl font-extrabold text-espresso">{p.name}</h3>
        {p.since && <p className="mt-0.5 text-sm font-semibold text-rose-ink">Working together since {p.since}</p>}
        <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{p.description}</p>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
          >
            {displayUrl(p.url)}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden
            />
            <span className="sr-only"> ({p.name} website, opens in a new tab)</span>
          </a>
        )}
        {fallback && (
          <a
            href={fallback.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
          >
            {fallback.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden
            />
            <span className="sr-only"> on {fallback.host} (opens in a new tab)</span>
          </a>
        )}
        {eventLink && (
          <Link
            href={eventLink.href}
            className="group/link mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
          >
            {eventLink.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}
