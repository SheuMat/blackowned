import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { media } from "@/content/media";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Co-founders and the open "this could be you" seat.
 * PHOTOS: when we have them, put headshots in /public/team/<name>.jpg and
 * swap the <Monogram /> for a next/image of the same size.
 */

type Person = {
  name: string;
  role: string;
  bio: string;
  /** Monogram colours: skin tones from the logo */
  from: string;
  to: string;
  ink: string;
  ring: string;
  link?: { href: string; label: string; site: string };
};

const [asha, rakaia] = site.founders;
const podcast = media.find((m) => m.kind === "podcast");
const interview = media.find((m) => m.kind === "press");

const founders: Person[] = [
  {
    name: asha,
    role: "Co-founder",
    bio: `Started Black Owned Sheffield with ${rakaia} in ${site.founded}, from a simple question: what can we do to help?`,
    from: "#7a4a2e",
    to: "#2a1910",
    ink: "#e7c39c",
    ring: "#f2a0bd",
    link: podcast && { href: podcast.url, label: `Hear ${asha} and ${rakaia} on the podcast`, site: "YouTube" },
  },
  {
    name: rakaia,
    role: "Co-founder",
    bio: `Built Black Owned Sheffield alongside ${asha}, from the first Instagram posts and the first market on Fargate to the CIC it is today.`,
    from: "#e7c39c",
    to: "#a8693d",
    ink: "#2a1910",
    ring: "#f6bd3c",
    link: interview && { href: interview.url, label: `Read the ${interview.outlet.replace(/ Magazine$/, "")} interview`, site: interview.outlet },
  },
];

function Monogram({ p, className }: { p: Person; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex aspect-square w-28 shrink-0 items-center justify-center rounded-full border-2 border-espresso sm:w-32",
        className,
      )}
      style={{ background: `radial-gradient(circle at 30% 25%, ${p.from}, ${p.to})`, boxShadow: `6px 6px 0 0 ${p.ring}` }}
    >
      <span className="font-display text-6xl leading-none sm:text-7xl" style={{ color: p.ink }}>
        {p.name[0]}
      </span>
      {/* A little sticker dot, like the logo's pink band */}
      <span
        className="absolute -top-1 -right-1 h-7 w-7 rounded-full border-2 border-espresso"
        style={{ backgroundColor: p.ring }}
      />
    </span>
  );
}

export function Team() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {founders.map((p) => (
        <li key={p.name}>
          <article className="flex h-full flex-col items-start rounded-[1.75rem] border-2 border-espresso bg-white p-6 shadow-pop-sm sm:p-7">
            <Monogram p={p} />
            <h3 className="mt-6 font-heading text-2xl font-extrabold text-espresso">{p.name}</h3>
            <p className="mt-0.5 font-heading text-sm font-bold tracking-[0.14em] text-rose-ink uppercase">{p.role}</p>
            <p className="mt-3 leading-relaxed text-cocoa">{p.bio}</p>
            {p.link && (
              <a
                href={p.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
              >
                {p.link.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                <span className="sr-only"> (opens {p.link.site} in a new tab)</span>
              </a>
            )}
          </article>
        </li>
      ))}
      <li className="md:col-span-2 lg:col-span-1">
        <Link
          href="/join/volunteer"
          className="group flex h-full flex-col items-start rounded-[1.75rem] border-2 border-dashed border-espresso/40 bg-cream p-6 transition-all hover:-translate-y-1 hover:border-solid hover:border-espresso hover:shadow-pop sm:p-7"
        >
          <span
            aria-hidden
            className="flex aspect-square w-28 items-center justify-center rounded-full border-2 border-dashed border-espresso/50 bg-white transition-colors group-hover:border-solid group-hover:bg-sunflower sm:w-32"
          >
            <Plus className="h-10 w-10 text-espresso transition-transform duration-300 group-hover:rotate-90" />
          </span>
          <h3 className="mt-6 font-heading text-2xl font-extrabold text-espresso">Volunteers &amp; advisors</h3>
          <span className="mt-0.5 block font-heading text-sm font-bold tracking-[0.14em] text-rose-ink uppercase">
            This could be you
          </span>
          <span className="mt-3 block leading-relaxed text-cocoa">
            Got time, skills or experience to share? Events, social media, photography, finance, mentoring: there&apos;s
            a seat at the table.
          </span>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-heading text-sm font-bold text-espresso">
            Volunteer with us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </Link>
      </li>
    </ul>
  );
}
