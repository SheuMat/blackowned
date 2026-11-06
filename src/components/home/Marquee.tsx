"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Seamless scrolling strip. `children` (list items) render first and `duplicate`
 * (the same items, with their links set to tabIndex -1) render after them, so the
 * track can slide by -50% and loop. The copy is hidden from assistive tech and the
 * tab order but stays clickable, so a chip that has scrolled round still works.
 * Pauses on hover, on keyboard focus, and via the toggle button (WCAG 2.2.2).
 * With reduced motion the copy is dropped: phones get a swipeable row, and wider
 * screens a static wrapped cloud.
 */
export function Marquee({
  children,
  duplicate,
  label,
  className,
  fade = "sunflower",
}: {
  children: ReactNode;
  /** The same items again for the loop, with interactive elements given tabIndex={-1} */
  duplicate: ReactNode;
  label: string;
  className?: string;
  /** Background colour the edges fade into */
  fade?: "sunflower" | "espresso" | "cream";
}) {
  const [paused, setPaused] = useState(false);
  const fadeFrom = { sunflower: "from-sunflower", espresso: "from-espresso", cream: "from-cream" }[fade];

  return (
    <div className={cn("group/marquee relative", className)}>
      <div className="scrollbar-none overflow-hidden motion-reduce:overflow-x-auto sm:motion-reduce:overflow-visible">
        <div
          className={cn(
            "flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]",
            "motion-reduce:animate-none sm:motion-reduce:w-full",
            paused && "[animation-play-state:paused]",
          )}
        >
          <ul
            aria-label={label}
            className="flex shrink-0 items-center gap-3 py-1 pr-3 motion-reduce:px-4 sm:motion-reduce:w-full sm:motion-reduce:flex-wrap sm:motion-reduce:justify-center"
          >
            {children}
          </ul>
          <ul aria-hidden className="flex shrink-0 items-center gap-3 py-1 pr-3 motion-reduce:hidden">
            {duplicate}
          </ul>
        </div>
      </div>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r to-transparent sm:w-20 motion-reduce:hidden", fadeFrom)}
      />
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l to-transparent sm:w-32 motion-reduce:hidden", fadeFrom)}
      />
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute top-1/2 right-3 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-espresso bg-cream text-espresso shadow-pop-sm transition-colors hover:bg-pink motion-reduce:hidden sm:right-5"
      >
        {paused ? (
          <Play className="ml-0.5 h-4 w-4 fill-espresso" aria-hidden />
        ) : (
          <Pause className="h-4 w-4 fill-espresso" aria-hidden />
        )}
        <span className="sr-only">{paused ? `Play: ${label}` : `Pause: ${label}`}</span>
      </button>
    </div>
  );
}
