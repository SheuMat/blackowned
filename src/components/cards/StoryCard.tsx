import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { storyCategoryLabel } from "@/content/stories";
import { youtubeThumb } from "@/content/media";
import type { Story } from "@/content/types";
import { cn, formatLongDate } from "@/lib/utils";

const fallbackColors = ["#ee6a35", "#167a6f", "#f2a0bd", "#1f2a63", "#f6bd3c", "#a8693d"];
/** Backgrounds dark enough to need cream text */
const darkFallbacks = new Set(["#167a6f", "#1f2a63"]);

export function StoryImage({ story, className, sizes, priority }: { story: Story; className?: string; sizes?: string; priority?: boolean }) {
  const src = story.image ?? (story.youtubeId ? youtubeThumb(story.youtubeId) : undefined);
  if (src) {
    // Share cards with text baked in are letterboxed, never cropped (and skip the hover zoom, which would crop them)
    const contain = !!story.image && story.imageFit === "contain";
    return (
      <div
        className={cn("relative overflow-hidden", contain && !story.imageBackground ? "bg-cream" : "bg-sand", className)}
        style={contain && story.imageBackground ? { background: story.imageBackground } : undefined}
      >
        <Image
          src={src}
          alt={story.imageAlt ?? ""}
          fill
          sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          preload={priority}
          className={contain ? "object-contain" : "object-cover transition-transform duration-500 group-hover:scale-[1.03]"}
        />
        {story.youtubeId && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-espresso bg-pink shadow-pop-sm">
              <Play className="ml-0.5 h-6 w-6 fill-espresso text-espresso" aria-hidden />
            </span>
          </span>
        )}
      </div>
    );
  }
  // XOR of the slug's character codes: stable per story, and it spreads today's
  // slugs across all six colours so neighbouring cards don't share a panel
  const color = fallbackColors[[...story.slug].reduce((h, c) => h ^ c.charCodeAt(0), 0) % fallbackColors.length];
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: color }} aria-hidden>
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        <circle cx="320" cy="60" r="80" fill="#fbf5ec" />
        <path d="M-20 140c50-40 100-40 150 0s100 40 150 0 100-40 150 0" stroke="#2a1910" strokeWidth="16" fill="none" strokeLinecap="round" />
      </svg>
      <span
        className={cn(
          "absolute bottom-4 left-5 max-w-[80%] font-display text-2xl leading-tight",
          darkFallbacks.has(color) ? "text-cream" : "text-espresso",
        )}
      >
        {storyCategoryLabel[story.category]}
      </span>
    </div>
  );
}

export function StoryCard({
  story,
  className,
  imageClassName,
  sizes,
  featured = false,
  headingAs: Heading = "h3",
}: {
  story: Story;
  className?: string;
  /** Extra classes for the image panel, e.g. a different aspect ratio */
  imageClassName?: string;
  /** next/image `sizes` for the image panel. Pass one whenever the layout changes its width. */
  sizes?: string;
  featured?: boolean;
  /** Use "h4" when cards sit under an h3 section heading */
  headingAs?: "h2" | "h3" | "h4";
}) {
  const href = `/stories/${story.slug}`;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop",
        featured && "md:flex-row",
        "has-[a:focus-visible]:ring-4 has-[a:focus-visible]:ring-rose has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-cream",
        className,
      )}
    >
      <StoryImage
        story={story}
        sizes={sizes ?? (featured ? "(min-width: 768px) 50vw, 100vw" : undefined)}
        className={cn("aspect-[16/10]", featured && "md:aspect-auto md:w-1/2", imageClassName)}
      />
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "md:justify-center md:p-10")}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-blush px-2.5 py-1 text-rose-ink">{storyCategoryLabel[story.category]}</span>
          <time dateTime={story.date} className="text-cocoa/75">
            {formatLongDate(story.date)}
          </time>
          {story.sample && (
            <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cocoa">Sample</span>
          )}
        </div>
        <Heading
          className={cn(
            "mt-3 font-heading font-extrabold leading-snug text-espresso",
            featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
          )}
        >
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {story.title}
          </Link>
        </Heading>
        <p className={cn("mt-2 text-cocoa", featured ? "text-base sm:text-lg" : "line-clamp-3 text-[15px]")}>{story.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 font-heading text-sm font-bold text-espresso">
          {story.youtubeId ? "Watch" : "Read story"}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
