"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Accessible on/off switch with a label and optional description */
export function Switch({
  id,
  checked,
  onChange,
  label,
  description,
  className,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  const descId = description ? `${id}-desc` : undefined;
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border-2 p-4 transition-colors",
        checked ? "border-espresso bg-blush/60" : "border-espresso/15 bg-white",
        className,
      )}
    >
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer font-heading text-sm font-bold text-espresso">
          {label}
        </label>
        {description && (
          <p id={descId} className="mt-1 text-xs leading-relaxed text-cocoa/80">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descId}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 border-espresso transition-colors",
          checked ? "bg-espresso" : "bg-sand",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-6 w-6 rounded-full border-2 border-espresso bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[1.6rem] bg-pink" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
