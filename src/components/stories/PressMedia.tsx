import { ArrowUpRight, Clapperboard, Newspaper, Podcast, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/layout";
import { Sunburst, Squiggle } from "@/components/ui/Shapes";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { media } from "@/content/media";
import { site } from "@/lib/site";
import { displayUrl, formatLongDate } from "@/lib/utils";
import { PodcastSeries, getPodcastSeries } from "./PodcastSeries";

/**
 * Videos we know exist but haven't linked yet (Instagram reels).
 * Remove a line once its reel is added to src/content/media.ts as kind: "instagram".
 */
const comingSoon = [
  "Our Christmas market",
  "The rebrand mixer at Sadacca",
  "Cutlery Works market, 2023",
];

function monthYear(iso?: string) {
  if (!iso) return undefined;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Europe/London" }).format(
    new Date(iso),
  );
}

/** PRESS & MEDIA: press coverage, video and the podcast series, all from src/content/media.ts. */
export function PressMedia() {
  const press = media.filter((m) => m.kind === "press");
  const videos = media.filter((m) => m.kind === "video" && m.youtubeId);
  const reels = media.filter((m) => m.kind === "instagram");
  const podcastOutlet = media.find((m) => m.kind === "podcast")?.outlet;
  const podcast = podcastOutlet ? getPodcastSeries(podcastOutlet) : [];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Press + lead video */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {press.map((p) => (
          <article
            key={p.id}
            className="grain relative flex flex-col overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-sunflower p-6 shadow-pop sm:p-8 lg:col-span-5"
          >
            <Sunburst color="#ee6a35" className="absolute -top-10 -right-10 h-40 w-40 animate-spin-slow opacity-70" />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso bg-cream">
                <Newspaper className="h-5 w-5 text-espresso" aria-hidden />
              </span>
              <Badge tone="espresso">In the press</Badge>
            </div>
            <p className="relative mt-8 font-heading text-sm font-bold uppercase tracking-[0.18em] text-espresso/80">
              {p.outlet}
              {p.date && (
                <>
                  {" · "}
                  <time dateTime={p.date}>{monthYear(p.date)}</time>
                </>
              )}
            </p>
            <h3 className="relative mt-2 font-heading text-2xl font-extrabold leading-tight text-espresso sm:text-3xl">
              {p.title}
            </h3>
            <p className="relative mt-3 text-[15px] leading-relaxed text-espresso/85">{p.description}</p>
            <div className="relative mt-auto pt-8">
              <ButtonLink href={p.url} variant="primary" iconRight={<ArrowUpRight className="h-4 w-4" aria-hidden />}>
                Read the interview
                <span className="sr-only"> on {displayUrl(p.url).split("/")[0]} (opens in a new tab)</span>
              </ButtonLink>
            </div>
          </article>
        ))}

        {videos.slice(0, 1).map((v) => (
          <article key={v.id} className="flex flex-col lg:col-span-7">
            {/* The title sits right below and the thumbnail has its own text, so no overlay caption */}
            <YouTubeEmbed id={v.youtubeId!} start={v.youtubeStart} title={v.title} showTitle={false} className="shadow-pop" />
            <div className="mt-5 flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-teal text-cream">
                <Clapperboard className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-rose-ink">
                  {v.outlet}
                  {v.date && ` · ${monthYear(v.date)}`}
                </p>
                <h3 className="mt-1 font-heading text-xl font-extrabold text-espresso sm:text-2xl">{v.title}</h3>
                <p className="mt-1.5 text-cocoa">{v.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Podcast series */}
      {podcast.length > 0 && (
        <div>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-pink">
                <Podcast className="h-5 w-5 text-espresso" aria-hidden />
              </span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-espresso sm:text-3xl">
                  {podcastOutlet}: a {podcast.length}-part series
                </h3>
                <p className="mt-1 max-w-2xl text-cocoa">
                  Our co-founders on why they started, working as a team, and why you should stop waiting and start.
                </p>
              </div>
            </div>
          </div>
          <PodcastSeries items={podcast} headingLevel="h4" />
        </div>
      )}

      {/* Instagram reels (once added) */}
      {reels.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-start gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-pop"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-blush text-espresso">
                  <InstagramIcon size={20} />
                </span>
                <span>
                  <span className="block font-heading text-lg font-extrabold text-espresso">{r.title}</span>
                  {r.date && <span className="block text-sm text-cocoa/80">{formatLongDate(r.date)}</span>}
                  <span className="mt-1 block text-[15px] text-cocoa">{r.description}</span>
                  <span className="sr-only"> (opens Instagram in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Coming soon */}
      {comingSoon.length > 0 && (
        <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-dashed border-espresso/40 bg-white/70 p-6 sm:p-8">
          <Squiggle color="#f2a0bd" className="absolute right-6 bottom-6 hidden h-8 w-28 sm:block" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">
                <Sparkles className="h-4 w-4" aria-hidden /> Coming soon
              </p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold text-espresso">More videos on the way</h3>
              <p className="mt-2 max-w-2xl text-cocoa">
                We&apos;re gathering our Instagram reels so you can watch them here. Until then, you&apos;ll find them on
                our Instagram.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {comingSoon.map((c) => (
                  <li key={c} className="rounded-full bg-cream-deep px-3 py-1.5 text-sm font-semibold text-cocoa">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink href={site.socials.instagram} variant="outline" icon={<InstagramIcon size={18} />}>
              Watch on Instagram
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
