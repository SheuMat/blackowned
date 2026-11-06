import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Layout pieces shared by the Join forms: the two-column form layout, the
 * white form card, grouped form sections and the side panels.
 * Server-safe (no client hooks).
 */

export function JoinFormLayout({ form, aside, className }: { form: ReactNode; aside: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="min-w-0 lg:col-span-8">{form}</div>
      <aside className="min-w-0 lg:col-span-4" aria-label="About this application">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">{aside}</div>
      </aside>
    </div>
  );
}

export function FormCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[1.75rem] border-2 border-espresso bg-white p-5 shadow-pop sm:rounded-[2rem] sm:p-8 lg:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A titled group of fields inside a form. Pass `first` to drop the divider above it. */
export function FormSection({
  title,
  description,
  children,
  number,
  first,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  number?: number;
  first?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(!first && "mt-10 border-t-2 border-dashed border-espresso/15 pt-8", className)}>
      <fieldset className="min-w-0">
        <legend className="flex items-center gap-3">
          {number !== undefined && (
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower font-heading text-sm font-extrabold text-espresso"
            >
              {number}
            </span>
          )}
          <span className="font-heading text-xl font-extrabold text-espresso sm:text-2xl">{title}</span>
        </legend>
        {description && <p className="mt-2 text-sm text-cocoa">{description}</p>}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
      </fieldset>
    </div>
  );
}

const panelTones = {
  white: "bg-white text-espresso",
  pink: "bg-blush text-espresso",
  sunflower: "bg-sunflower text-espresso",
  espresso: "bg-espresso text-cream",
  teal: "bg-teal text-cream",
  cream: "bg-cream-deep text-espresso",
} as const;

export function SidePanel({
  eyebrow,
  title,
  children,
  tone = "white",
  className,
  icon: Icon,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  tone?: keyof typeof panelTones;
  className?: string;
  icon?: LucideIcon;
}) {
  const dark = tone === "espresso" || tone === "teal";
  return (
    <section
      className={cn(
        "grain relative overflow-hidden rounded-[1.5rem] border-2 border-espresso p-6 shadow-pop-sm",
        panelTones[tone],
        className,
      )}
    >
      {Icon && (
        <span
          aria-hidden
          className={cn(
            "mb-4 flex h-11 w-11 items-center justify-center rounded-full border-2",
            dark ? "border-cream/30 bg-cream/10" : "border-espresso bg-white",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      {eyebrow && (
        <p
          className={cn(
            "font-heading text-xs font-bold uppercase tracking-[0.18em]",
            // rose-ink is too low-contrast on sunflower for small caps text, so use espresso there
            dark ? "text-pink" : tone === "sunflower" ? "text-espresso/80" : "text-rose-ink",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={cn("font-heading text-xl font-extrabold leading-tight", eyebrow && "mt-1.5")}>{title}</h2>
      <div className={cn("mt-3 text-sm leading-relaxed", dark ? "text-cream/85" : "text-cocoa")}>{children}</div>
    </section>
  );
}

export function TickList({ items, dark, className }: { items: ReactNode[]; dark?: boolean; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              dark ? "bg-pink text-espresso" : "bg-espresso text-cream",
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BenefitList({
  items,
  className,
}: {
  items: { icon: LucideIcon; title: string; text: ReactNode }[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-espresso bg-white text-espresso"
          >
            <Icon className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-heading text-sm font-bold text-espresso">{title}</span>
            <span className="block text-sm text-cocoa">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Small pills in the page hero: "Free", "About 10 minutes" … */
export function HeroFacts({ items }: { items: { icon: LucideIcon; label: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-3.5 py-2 text-sm font-semibold text-espresso"
        >
          <Icon className="h-4 w-4 text-rose-ink" aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** "What happens next" list used in side panels and success messages */
export function NextSteps({
  steps,
  className,
  dark,
}: {
  steps: { title: string; text: ReactNode }[];
  className?: string;
  dark?: boolean;
}) {
  return (
    <ol className={cn("flex flex-col gap-4", className)}>
      {steps.map((s, i) => (
        <li key={s.title} className="flex items-start gap-3 text-left">
          <span
            aria-hidden
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm",
              dark ? "border-cream/40 bg-pink text-espresso" : "border-espresso bg-pink text-espresso",
            )}
          >
            {i + 1}
          </span>
          <span>
            <span className={cn("block font-heading text-sm font-bold", dark ? "text-cream" : "text-espresso")}>
              {s.title}
            </span>
            <span className={cn("block text-sm", dark ? "text-cream/80" : "text-cocoa")}>{s.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
