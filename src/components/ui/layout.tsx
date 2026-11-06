import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

type Tone = "cream" | "deep" | "sand" | "espresso" | "pink" | "white";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream text-espresso",
  deep: "bg-cream-deep text-espresso",
  sand: "bg-sand text-espresso",
  espresso: "bg-espresso text-cream",
  pink: "bg-blush text-espresso",
  white: "bg-white text-espresso",
};

export function Section({
  id,
  tone = "cream",
  className,
  containerClassName,
  children,
  bleed = false,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  /** Skip the inner Container */
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("relative py-16 sm:py-20 lg:py-24", toneClasses[tone], className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}

export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.18em]",
        dark ? "text-pink" : "text-rose-ink",
        className,
      )}
    >
      <span aria-hidden className={cn("h-2 w-2 rounded-full", dark ? "bg-pink" : "bg-rose")} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  dark,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 sm:mb-12",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <Tag
          className={cn(
            "mt-3 font-heading text-3xl font-extrabold leading-[1.05] sm:text-4xl lg:text-5xl",
            dark ? "text-cream" : "text-espresso",
          )}
        >
          {title}
        </Tag>
        {description && (
          <p className={cn("mt-4 text-lg leading-relaxed", dark ? "text-cream/75" : "text-cocoa")}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "sand",
  style,
}: {
  children: ReactNode;
  className?: string;
  tone?: "sand" | "pink" | "espresso" | "sunflower" | "teal" | "outline" | "cream";
  style?: React.CSSProperties;
}) {
  const tones = {
    sand: "bg-sand text-cocoa",
    pink: "bg-blush text-rose-ink",
    espresso: "bg-espresso text-cream",
    sunflower: "bg-sunflower text-espresso",
    teal: "bg-teal text-cream",
    outline: "border border-espresso/20 text-cocoa",
    cream: "bg-cream text-espresso",
  } as const;
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
