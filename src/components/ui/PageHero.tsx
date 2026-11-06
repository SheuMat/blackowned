import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Eyebrow } from "./layout";
import { Blob, Dots, Squiggle } from "./Shapes";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

/**
 * Standard header for inner pages. Keep titles short; put the detail in `description`.
 * `accent` picks the decorative colour story.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  crumbs,
  accent = "pink",
  className,
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  crumbs?: Crumb[];
  accent?: "pink" | "tangerine" | "teal" | "sunflower" | "navy";
  className?: string;
  dark?: boolean;
}) {
  const colors = {
    pink: ["#f2a0bd", "#ee6a35", "#167a6f"],
    tangerine: ["#ee6a35", "#f6bd3c", "#1f2a63"],
    teal: ["#167a6f", "#f2a0bd", "#f6bd3c"],
    sunflower: ["#f6bd3c", "#e0628f", "#167a6f"],
    navy: ["#1f2a63", "#f2a0bd", "#ee6a35"],
  }[accent];
  return (
    <section
      className={cn(
        "grain relative overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-20",
        dark ? "bg-espresso text-cream" : "bg-cream-deep text-espresso",
        className,
      )}
    >
      {/* Sized per breakpoint so it frames the title instead of running under the text.
          Stronger on espresso, where 60% turns the warm accents muddy. */}
      <Blob
        color={colors[0]}
        className={cn(
          "absolute -top-24 -right-28 h-60 w-60 sm:-right-24 sm:h-72 sm:w-72 lg:h-96 lg:w-96",
          dark ? "opacity-90" : "opacity-60",
        )}
      />
      <Squiggle color={colors[1]} className="absolute bottom-8 right-[12%] hidden h-10 w-32 md:block" />
      <Dots color={colors[2]} className="absolute top-10 left-[46%] hidden h-12 w-12 opacity-70 lg:block" />
      <Container className="relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            {/* Links are 44px tall for touch; the negative margin keeps the visual spacing */}
            <ol className={cn("-my-3 flex flex-wrap items-center gap-x-1 text-sm", dark ? "text-cream/70" : "text-cocoa/80")}>
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {c.href ? (
                    <Link href={c.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={cn("py-3", dark ? "text-cream" : "text-espresso")}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">{title}</h1>
          {description && (
            <div className={cn("mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl", dark ? "text-cream/80" : "text-cocoa")}>
              {description}
            </div>
          )}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
