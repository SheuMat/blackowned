import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "sunflower" | "white" | "blush" | "navy" | "espresso" | "pink" | "cream";

const tones: Record<Tone, { card: string; detail: string; icon: string }> = {
  sunflower: { card: "bg-sunflower text-espresso", detail: "text-espresso/80", icon: "bg-cream text-espresso" },
  white: { card: "bg-white text-espresso", detail: "text-cocoa", icon: "bg-blush text-rose-ink" },
  blush: { card: "bg-blush text-espresso", detail: "text-cocoa", icon: "bg-white text-rose-ink" },
  navy: { card: "bg-navy text-cream", detail: "text-cream/80", icon: "bg-cream/10 text-sunflower" },
  espresso: { card: "bg-espresso text-cream", detail: "text-cream/80", icon: "bg-cream/10 text-pink" },
  pink: { card: "bg-pink text-espresso", detail: "text-espresso/80", icon: "bg-cream text-rose-ink" },
  cream: { card: "bg-cream text-espresso", detail: "text-cocoa", icon: "bg-sand text-cocoa" },
};

/**
 * Headline number. Big value in the display face (a brand moment), plain
 * label underneath. Uses dt/dd so it reads "label: value" to screen readers.
 */
export function StatTile({
  value,
  label,
  detail,
  icon: Icon,
  tone = "white",
  className,
  children,
  big = false,
}: {
  value: ReactNode;
  label: string;
  detail?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  tone?: Tone;
  className?: string;
  children?: ReactNode;
  big?: boolean;
}) {
  const t = tones[tone];
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso p-5 sm:p-6",
        t.card,
        className,
      )}
    >
      <dt className="order-2 mt-3 pr-2 font-heading text-[15px] font-bold leading-snug sm:text-base">
        {label}
        {/* Icon lives in the dt so the dl only contains dt/dd; it's positioned against the card */}
        {Icon && (
          <span aria-hidden className={cn("absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full sm:top-6 sm:left-6", t.icon)}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </dt>
      <dd
        className={cn(
          "order-1 font-display leading-none",
          Icon && "mt-14",
          big ? "text-7xl sm:text-8xl" : "text-[2.75rem] sm:text-6xl",
        )}
      >
        {value}
      </dd>
      {detail && <dd className={cn("order-3 mt-1.5 text-sm leading-relaxed", t.detail)}>{detail}</dd>}
      {children && <dd className="order-4 mt-auto pt-4">{children}</dd>}
    </div>
  );
}
