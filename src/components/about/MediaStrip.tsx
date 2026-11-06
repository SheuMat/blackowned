import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clapperboard, Mic, Newspaper, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { media } from "@/content/media";
import type { MediaItem } from "@/content/types";
import { cn } from "@/lib/utils";

const kindMeta: Record<MediaItem["kind"], { label: string; Icon: LucideIcon; tile: string }> = {
  press: { label: "Interview", Icon: Newspaper, tile: "bg-sunflower text-espresso" },
  video: { label: "Film", Icon: Clapperboard, tile: "bg-teal text-cream" },
  podcast: { label: "Podcast", Icon: Mic, tile: "bg-rose-ink text-cream" },
  instagram: { label: "Reel", Icon: Play, tile: "bg-pink text-espresso" },
};

function year(iso?: string) {
  return iso ? new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "Europe/London" }).format(new Date(iso)) : undefined;
}

/** "As seen in & heard on": one tile per outlet, linking to the piece itself */
export function MediaStrip({ className }: { className?: string }) {
  const outlets = Array.from(
    media
      .reduce((map, m) => {
        const list = map.get(m.outlet) ?? [];
        list.push(m);
        return map.set(m.outlet, list);
      }, new Map<string, MediaItem[]>())
      .values(),
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase">As seen in &amp; heard on</h2>
        <Link
          href="/stories#press"
          className="group inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:text-rose-ink"
        >
          All press &amp; media
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {outlets.map((items) => {
          const first = items[0]!;
          const { label, Icon, tile } = kindMeta[first.kind];
          const y = year(first.date);
          const detail =
            items.length > 1 ? `${items.length}-part ${label.toLowerCase()} series` : [label, y].filter(Boolean).join(" · ");
          return (
            // An odd tile out on the two-column tablet grid spans both columns instead of sitting alone
            <li key={first.outlet} className="sm:last:odd:col-span-2 lg:last:odd:col-span-1">
              <a
                href={first.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-center gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-3 pr-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
              >
                <span
                  aria-hidden
                  className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] sm:h-[4.5rem] sm:w-[4.5rem]", tile)}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-lg leading-tight font-extrabold text-espresso sm:text-xl">
                    {first.outlet}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-cocoa">{detail}</span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-cocoa transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
                <span className="sr-only">: {first.title} (opens in a new tab)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
