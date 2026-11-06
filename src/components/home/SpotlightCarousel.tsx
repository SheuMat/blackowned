"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type CarouselSlide = {
  key: string;
  /** Accessible name for the slide and its tab, e.g. "Care Cove, November 2026" */
  label: string;
  content: ReactNode;
};

const INTERVAL_MS = 8000;

/**
 * Accessible rotating carousel (WAI-ARIA APG "tabbed carousel").
 * Slides are rendered on the server and passed in as nodes; this island only
 * decides which one is showing.
 * - Prev/next buttons, tab dots with arrow-key support, swipe on touch.
 * - Autoplays every 8s while on screen; pauses on hover and keyboard focus;
 *   has an explicit pause button; never autoplays with reduced motion.
 * - Live region is polite when the user is in control, off while rotating.
 */
export function SpotlightCarousel({ slides, label }: { slides: CarouselSlide[]; label: string }) {
  const id = useId();
  const count = slides.length;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);

  const playing = count > 1 && !reduce && !stopped && !hovered && !focused && inView;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [playing, index, count]);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % count;
    else if (e.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next === null) return;
    e.preventDefault();
    go(next);
    tabRefs.current[next]?.focus();
  }

  if (count === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div
        id={`${id}-slides`}
        aria-live={playing ? "off" : "polite"}
        className="grid"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          const t = e.changedTouches[0];
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // Only a clearly sideways swipe changes slide, so scrolling the page past it doesn't
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.key}
              id={`${id}-slide-${i}`}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              inert={!active}
              className={cn(
                "[grid-area:1/1] transition-[opacity,transform,visibility] duration-500 ease-out",
                active ? "visible translate-x-0 opacity-100" : "invisible translate-x-6 opacity-0",
              )}
            >
              {s.content}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 sm:mt-10">
          <div role="tablist" aria-label="Choose a spotlight" className="-ml-2 flex items-center">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${id}-slide-${i}`}
                  aria-label={s.label}
                  tabIndex={active ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={onTabKeyDown}
                  className="group/dot flex h-11 min-w-11 items-center justify-center px-2"
                >
                  <span
                    className={cn(
                      "relative block h-3 overflow-hidden rounded-full border-2 border-cream transition-all duration-300",
                      active ? "w-12 bg-cream/20" : "w-3 bg-transparent group-hover/dot:bg-cream/40",
                    )}
                  >
                    {active && (
                      <motion.span
                        key={`${index}-${playing}`}
                        aria-hidden
                        className="absolute inset-0 origin-left rounded-full bg-pink"
                        initial={{ scaleX: playing ? 0 : 1 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: playing ? INTERVAL_MS / 1000 : 0, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStopped((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream/40 text-cream transition-colors hover:border-cream hover:bg-cream/10 motion-reduce:hidden"
            >
              {stopped ? <Play className="ml-0.5 h-4 w-4 fill-cream" aria-hidden /> : <Pause className="h-4 w-4 fill-cream" aria-hidden />}
              <span className="sr-only">{stopped ? "Start automatic rotation" : "Stop automatic rotation"}</span>
            </button>
            <button
              type="button"
              aria-controls={`${id}-slides`}
              onClick={() => go(index - 1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-cream bg-espresso text-cream transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-espresso"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
              <span className="sr-only">Previous spotlight</span>
            </button>
            <button
              type="button"
              aria-controls={`${id}-slides`}
              onClick={() => go(index + 1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-cream bg-pink text-espresso shadow-[3px_3px_0_0_var(--color-cream)] transition-all hover:-translate-y-0.5"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
              <span className="sr-only">Next spotlight</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
