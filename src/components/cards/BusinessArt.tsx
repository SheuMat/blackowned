import Image from "next/image";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { categoryMap } from "@/content/categories";
import type { Business } from "@/content/types";
import { cn, initials } from "@/lib/utils";

/**
 * Cover art for a business. Uses the real cover image if present, otherwise
 * generates a poster-style panel from the category colour + initials so the
 * directory never shows a grey box.
 */
export function BusinessCover({
  business,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: {
  business: Business;
  className?: string;
  /** Extra classes for the <img>, e.g. object-position for a contained cover */
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const cat = categoryMap[business.category];
  if (business.cover) {
    const contain = business.coverFit === "contain";
    return (
      <div
        className={cn("relative overflow-hidden bg-sand", className)}
        style={contain && business.coverBackground ? { background: business.coverBackground } : undefined}
      >
        <Image
          src={business.cover}
          alt={`${business.name} cover image`}
          fill
          sizes={sizes}
          preload={priority}
          className={cn(contain ? "object-contain" : "object-cover", imgClassName)}
        />
      </div>
    );
  }
  const seed = business.slug.length;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: cat.color, color: cat.ink }}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <circle cx={seed % 2 ? 340 : 60} cy="40" r="90" fill="currentColor" opacity="0.35" />
        <circle cx={seed % 2 ? 40 : 360} cy="230" r="70" fill="currentColor" opacity="0.25" />
        <path
          d="M-10 170c40-30 80-30 120 0s80 30 120 0 80-30 120 0 80 30 120 0"
          stroke="currentColor"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-6xl tracking-tight drop-shadow-sm sm:text-7xl">{initials(business.name)}</span>
      </div>
      <CategoryIcon id={business.category} className="absolute right-4 bottom-4 h-7 w-7 opacity-70" />
    </div>
  );
}

/** Square logo tile. Falls back to an initials monogram. */
export function BusinessLogo({ business, size = 56, className }: { business: Business; size?: number; className?: string }) {
  const cat = categoryMap[business.category];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-espresso bg-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {business.icon || business.logo ? (
        <Image
          src={(business.icon ?? business.logo)!}
          alt={`${business.name} logo`}
          fill
          sizes={`${size}px`}
          className="object-contain p-1"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-display"
          style={{ backgroundColor: cat.color, color: cat.ink, fontSize: size * 0.38 }}
        >
          {initials(business.name)}
        </span>
      )}
    </span>
  );
}
