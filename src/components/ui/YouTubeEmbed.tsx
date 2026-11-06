"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeThumb } from "@/content/media";
import { cn } from "@/lib/utils";

/**
 * Click-to-load YouTube player (privacy-enhanced domain). Shows the thumbnail
 * until the visitor presses play, so pages stay fast and cookie-free.
 */
export function YouTubeEmbed({
  id,
  title,
  start,
  className,
  showTitle = true,
  priority,
}: {
  id: string;
  title: string;
  start?: number;
  className?: string;
  /** Hide the caption over the thumbnail (e.g. when the thumbnail already has text) */
  showTitle?: boolean;
  /** Preload the thumbnail when it is the page's main image */
  priority?: boolean;
}) {
  const [active, setActive] = useState(false);
  const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1" });
  if (start) params.set("start", String(start));

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[1.25rem] border-2 border-espresso bg-espresso",
        // The play button fills this clipped box, so show its focus ring here instead
        "has-[button:focus-visible]:ring-4 has-[button:focus-visible]:ring-rose has-[button:focus-visible]:ring-offset-2 has-[button:focus-visible]:ring-offset-cream",
        className,
      )}
    >
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={youtubeThumb(id)}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload={priority}
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-espresso bg-pink shadow-pop transition-transform group-hover:scale-110 group-focus-visible:scale-110 sm:h-20 sm:w-20">
              <Play className="ml-1 h-7 w-7 fill-espresso text-espresso sm:h-8 sm:w-8" aria-hidden />
            </span>
          </span>
          {showTitle && (
            <span className="absolute right-4 bottom-4 left-4 text-left font-heading text-sm font-bold text-cream [text-shadow:0_1px_2px_rgb(42_25_16/0.6)] sm:text-base">
              {title}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
