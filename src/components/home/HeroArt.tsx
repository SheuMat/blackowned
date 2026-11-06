import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { LogoBadge } from "@/components/brand/Logo";
import { BusinessLogo } from "@/components/cards/BusinessArt";
import { Blob, Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { getBusiness } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import { currentSpotlight, formatSpotlightMonth } from "@/content/spotlights";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Poster-style brand composition for the hero (desktop). The logo source is
 * 150px, so it stays at 150px and the size comes from the ring around it.
 */
export function HeroArt({ className }: { className?: string }) {
  const spotlightBiz = currentSpotlight ? getBusiness(currentSpotlight.businessSlug) : undefined;
  const ring = `BLACK OWNED SHEFFIELD • SHOP LOCAL • SINCE ${site.founded} • `;

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[500px]", className)}>
      <Blob color="#f2a0bd" className="absolute inset-[2%] rotate-12" />
      <Sunburst color="#f6bd3c" className="absolute -top-2 right-[4%] h-28 w-28 animate-spin-slow" />
      <Dots color="#167a6f" className="absolute top-[14%] left-[2%] h-14 w-14 animate-float" />
      <Squiggle color="#ee6a35" className="absolute bottom-[10%] -left-[4%] h-10 w-36 -rotate-12 animate-float [animation-delay:-3s]" />
      <span aria-hidden className="absolute right-[6%] bottom-[30%] h-6 w-6 rounded-full border-2 border-espresso bg-teal" />
      <span aria-hidden className="absolute top-[30%] -right-[1%] h-4 w-4 rounded-full bg-navy" />

      {/* Badge with rotating ring of type */}
      <div className="absolute inset-[11%] rounded-full border-2 border-espresso bg-espresso shadow-pop">
        <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full animate-spin-slow [animation-duration:45s]">
          <defs>
            <path id="hero-ring" d="M100 100m-82 0a82 82 0 1 1 164 0a82 82 0 1 1-164 0" />
          </defs>
          <text fontSize="11.5" fontWeight="800" letterSpacing="2" fill="#fbf5ec" className="font-heading">
            <textPath href="#hero-ring" textLength="508" lengthAdjust="spacing">
              {ring}
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-[17%] flex items-center justify-center rounded-full border-2 border-dashed border-cream/40 bg-cream-deep">
          <LogoBadge size={150} className="shadow-lift" />
        </div>
      </div>

      {/* Stickers */}
      <p className="absolute top-[6%] left-[4%] inline-flex -rotate-6 items-center gap-1.5 rounded-full border-2 border-espresso bg-sunflower px-4 py-2 font-heading text-sm font-extrabold text-espresso shadow-pop-sm">
        <Sparkles className="h-4 w-4" aria-hidden />
        Free to list
      </p>

      {currentSpotlight && spotlightBiz && (
        <Link
          href="/spotlight"
          className="group absolute right-0 bottom-[2%] flex max-w-[300px] rotate-2 items-center gap-3 rounded-2xl border-2 border-espresso bg-white p-3 pr-4 shadow-pop transition-transform duration-300 hover:rotate-0 hover:-translate-y-1"
        >
          <BusinessLogo business={spotlightBiz} size={48} />
          <span className="min-w-0">
            <span className="block text-[10px] font-bold whitespace-nowrap uppercase tracking-[0.16em] text-rose-ink">
              Spotlight · {formatSpotlightMonth(currentSpotlight.month)}
            </span>{" "}
            <span className="mt-0.5 flex items-center gap-1 font-heading text-base font-extrabold leading-tight text-espresso">
              <span className="truncate">{spotlightBiz.name}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>{" "}
            <span className="block truncate text-xs text-cocoa">
              {categoryMap[spotlightBiz.category].label}
              {currentSpotlight.sample && " · Sample"}
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}
