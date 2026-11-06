"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Progress stepper for multi-step forms.
 * Steps the person has already reached are buttons, so they can jump back.
 */
export function Stepper({
  steps,
  current,
  furthest,
  onSelect,
  className,
}: {
  steps: { title: string; short?: string }[];
  current: number;
  /** Highest step index reached so far */
  furthest: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const pct = Math.round((current / (steps.length - 1)) * 100);
  return (
    <nav aria-label="Application progress" className={className}>
      {/* Compact bar for phones */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <p className="font-heading font-bold text-espresso">
            Step {current + 1} of {steps.length}
          </p>
          <p className="text-xs font-semibold text-cocoa/80">{pct}% done</p>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-espresso bg-white">
          <div
            className="h-full rounded-full bg-pink transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(pct, 6)}%` }}
          />
        </div>
      </div>

      {/* Full stepper from small tablets up */}
      <ol className="hidden items-start sm:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= furthest && !active;
          const dot = (
            <span
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-espresso font-heading text-sm font-extrabold transition-all",
                active && "bg-pink text-espresso shadow-pop-sm",
                done && "bg-espresso text-cream",
                !active && !done && "bg-white text-cocoa",
                reachable && "group-hover:-translate-y-0.5 group-hover:shadow-pop-sm",
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
          );
          const label = (
            <span
              className={cn(
                "mt-2 block text-center text-xs font-semibold leading-tight",
                active ? "text-espresso" : "text-cocoa/80",
              )}
            >
              {s.short ?? s.title}
            </span>
          );
          return (
            <li key={s.title} className="relative flex flex-1 flex-col items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2",
                    i <= current ? "bg-espresso" : "bg-espresso/15",
                  )}
                />
              )}
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className="group flex min-h-11 flex-col items-center rounded-xl px-1"
                >
                  {dot}
                  {label}
                  <span className="sr-only">
                    {done ? " (completed)" : ""}, go to step {i + 1}
                  </span>
                </button>
              ) : (
                <span className="flex flex-col items-center px-1" aria-current={active ? "step" : undefined}>
                  {dot}
                  {label}
                  {!active && <span className="sr-only"> (not started)</span>}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
