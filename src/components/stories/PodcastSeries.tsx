import { Clock, ExternalLink } from "lucide-react";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { media } from "@/content/media";
import type { MediaItem } from "@/content/types";
import { cn } from "@/lib/utils";

/** All episodes of a podcast series from src/content/media.ts, in part order. */
export function getPodcastSeries(outlet: string) {
  return media
    .filter((m) => m.kind === "podcast" && m.outlet === outlet && m.youtubeId)
    .sort((a, b) => (partInfo(a).part ?? 0) - (partInfo(b).part ?? 0));
}

/** The podcast series a story's video belongs to (empty if it isn't one). */
export function seriesForVideo(youtubeId?: string) {
  if (!youtubeId) return [];
  const episode = media.find((m) => m.kind === "podcast" && m.youtubeId === youtubeId);
  return episode ? getPodcastSeries(episode.outlet) : [];
}

export function partInfo(item: MediaItem) {
  const m = /\(Part (\d+)\)/i.exec(item.title);
  return {
    part: m ? Number(m[1]) : undefined,
    title: item.title.replace(/\s*\(Part \d+\)\s*/i, "").trim(),
  };
}

export function formatTimestamp(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

const stickers = ["bg-pink", "bg-sunflower", "bg-tangerine"];

/**
 * A multi-part podcast as a row of click-to-load players.
 * `feature` puts part 1 full width with the rest beneath (used on the story page).
 */
export function PodcastSeries({
  items,
  layout = "grid",
  headingLevel = "h3",
  className,
}: {
  items: MediaItem[];
  layout?: "grid" | "feature";
  headingLevel?: "h3" | "h4";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <ol
      className={cn(
        "grid gap-6",
        layout === "grid" ? "md:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item, i) => {
        const { part, title } = partInfo(item);
        const isLead = layout === "feature" && i === 0;
        return (
          <li key={item.id} className={cn("flex flex-col", isLead && "sm:col-span-2")}>
            <div className="relative">
              <span
                className={cn(
                  "absolute -top-3 left-4 z-10 inline-block -rotate-3 rounded-xl border-2 border-espresso px-3 py-0.5 font-display text-sm text-espresso shadow-pop-sm",
                  stickers[i % stickers.length],
                )}
              >
                Part {part ?? i + 1}
              </span>
              <YouTubeEmbed
                id={item.youtubeId!}
                start={item.youtubeStart}
                title={`Part ${part ?? i + 1}: ${title}`}
                // The thumbnails already carry text and the title sits right below, so drop the overlay caption
                showTitle={false}
                priority={i === 0}
              />
            </div>
            <Heading
              className={cn(
                "mt-4 font-heading font-extrabold leading-snug text-espresso",
                isLead ? "text-2xl" : "text-lg",
              )}
            >
              {title}
            </Heading>
            <p className="mt-1.5 text-[15px] leading-relaxed text-cocoa">{item.description}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-cocoa/80">
              {item.youtubeStart ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-rose" aria-hidden />
                  Plays from {formatTimestamp(item.youtubeStart)}
                </span>
              ) : null}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-rose-ink underline decoration-2 underline-offset-4 hover:text-espresso"
              >
                <span>
                  Watch<span className="sr-only"> part {part ?? i + 1}</span> on YouTube
                </span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
