import { LogoBadge } from "@/components/brand/Logo";
import { Blob, Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { storyCategoryLabel } from "@/content/stories";
import type { Story, StoryCategory } from "@/content/types";
import { cn } from "@/lib/utils";

/** Poster colours per series, each with a text colour that stays readable on it. */
const palette: Record<StoryCategory, { bg: string; ink: string; accent: string; shape: string; sticker: string }> = {
  "meet-the-founder": { bg: "bg-tangerine", ink: "text-espresso", accent: "#f6bd3c", shape: "#2a1910", sticker: "bg-pink" },
  "business-of-the-month": { bg: "bg-pink", ink: "text-espresso", accent: "#f6bd3c", shape: "#2a1910", sticker: "bg-cream" },
  guides: { bg: "bg-sunflower", ink: "text-espresso", accent: "#ee6a35", shape: "#2a1910", sticker: "bg-pink" },
  launches: { bg: "bg-navy", ink: "text-cream", accent: "#f2a0bd", shape: "#fbf5ec", sticker: "bg-pink" },
  community: { bg: "bg-teal", ink: "text-cream", accent: "#f6bd3c", shape: "#2a1910", sticker: "bg-pink" },
  press: { bg: "bg-navy", ink: "text-cream", accent: "#f6bd3c", shape: "#fbf5ec", sticker: "bg-pink" },
  video: { bg: "bg-espresso", ink: "text-cream", accent: "#f2a0bd", shape: "#fbf5ec", sticker: "bg-pink" },
  news: { bg: "bg-forest", ink: "text-cream", accent: "#f6bd3c", shape: "#fbf5ec", sticker: "bg-pink" },
};

/**
 * Hero art for stories with no photo or video: a market-poster style panel in
 * the series colour. Decorative only (the story title is the page's h1).
 */
export function StoryPoster({ story, className }: { story: Story; className?: string }) {
  const p = palette[story.category];
  return (
    <div
      aria-hidden
      className={cn("grain relative flex flex-col justify-between overflow-hidden p-5 sm:p-8 lg:p-10", p.bg, p.ink, className)}
    >
      <Blob color={p.shape} className="absolute -right-16 -bottom-28 h-72 w-72 opacity-10 sm:h-[28rem] sm:w-[28rem]" />
      <Sunburst
        color={p.accent}
        className="absolute -top-12 -right-12 h-28 w-28 animate-spin-slow sm:-top-16 sm:-right-16 sm:h-60 sm:w-60"
      />
      <Squiggle color={p.accent} className="absolute right-[28%] bottom-7 hidden h-9 w-32 sm:block" />
      <Dots color={p.shape} className="absolute top-1/2 right-[14%] hidden h-14 w-14 -translate-y-1/2 opacity-25 md:block" />

      <div className="relative flex items-center gap-3">
        <LogoBadge size={44} />
        <p className="font-heading text-[11px] leading-tight font-bold tracking-[0.18em] uppercase sm:text-xs">
          Black Owned Sheffield
          <span className="block opacity-75">Stories &amp; news</span>
        </p>
      </div>

      <div className="relative max-w-[80%]">
        <p className="font-display text-[clamp(1.9rem,7vw,5rem)] leading-[0.92]">{storyCategoryLabel[story.category]}</p>
        <span
          className={cn(
            "mt-3 inline-block -rotate-3 rounded-xl border-2 border-espresso px-3 py-0.5 font-display text-base text-espresso shadow-pop-sm sm:mt-4 sm:text-xl",
            p.sticker,
          )}
        >
          Sheffield
        </span>
      </div>
    </div>
  );
}
