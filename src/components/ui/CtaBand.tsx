import type { ReactNode } from "react";
import { Container } from "./layout";
import { Blob, Squiggle, Sunburst } from "./Shapes";
import { cn } from "@/lib/utils";

/** Big closing call-to-action panel used at the bottom of most pages */
export function CtaBand({
  title,
  description,
  actions,
  tone = "pink",
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: "pink" | "espresso" | "sunflower";
  className?: string;
}) {
  const tones = {
    pink: "bg-pink text-espresso",
    espresso: "bg-espresso text-cream",
    sunflower: "bg-sunflower text-espresso",
  } as const;
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <Container>
        <div
          className={cn(
            "grain relative overflow-hidden rounded-[2rem] border-2 border-espresso px-6 py-12 shadow-pop sm:px-12 sm:py-16",
            tones[tone],
          )}
        >
          <Sunburst
            color={tone === "sunflower" ? "#ee6a35" : "#f6bd3c"}
            // Smaller and further out on phones so it doesn't run through long titles
            className="absolute -top-14 -right-14 h-32 w-32 animate-spin-slow opacity-60 sm:-top-10 sm:-right-10 sm:h-56 sm:w-56 sm:opacity-80"
          />
          <Blob color={tone === "espresso" ? "#55321f" : "#fbf5ec"} className="absolute -bottom-20 -left-16 h-64 w-64 opacity-40" />
          <Squiggle color={tone === "espresso" ? "#f2a0bd" : "#2a1910"} className="absolute bottom-6 right-10 hidden h-8 w-28 opacity-70 md:block" />
          <div className="relative max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold leading-[1.05] sm:text-5xl">{title}</h2>
            {description && (
              <p className={cn("mt-4 text-lg", tone === "espresso" ? "text-cream/80" : "text-espresso/80")}>{description}</p>
            )}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
