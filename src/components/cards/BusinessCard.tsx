import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BadgePercent, MapPin, Sparkles } from "lucide-react";
import { BusinessCover, BusinessLogo } from "./BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { getAreaLabel } from "@/content/areas";
import { categoryMap } from "@/content/categories";
import type { Business } from "@/content/types";
import { cn } from "@/lib/utils";

export function BusinessCard({
  business,
  className,
  compact = false,
  priority,
  headingAs: Heading = "h3",
}: {
  business: Business;
  className?: string;
  /** Horizontal, image-less variant for lists and map sidebars */
  compact?: boolean;
  priority?: boolean;
  /** Use "h4" when cards sit under an h3 section heading */
  headingAs?: "h2" | "h3" | "h4";
}) {
  const cat = categoryMap[business.category];
  const href = `/directory/${business.slug}`;
  // Contained covers are artwork with their own logo and text baked in (Care
  // Cove: wordmark top left, strap line bottom left). Pin the art to the top so
  // the spare band sits under it, and move the badges and the logo tile to the
  // right so they never sit on that text.
  const artwork = !!business.cover && business.coverFit === "contain";

  if (compact) {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-start gap-4 rounded-2xl border-2 border-espresso/10 bg-white p-4 transition-all hover:border-espresso hover:shadow-pop-sm",
          className,
        )}
      >
        <BusinessLogo business={business} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Heading className="truncate font-heading text-base font-bold text-espresso">{business.name}</Heading>
            {business.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-teal" aria-label="Verified" />}
          </div>
          <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs font-medium text-cocoa/80">
            <CategoryIcon
              id={business.category}
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: cat.color === "#e7c39c" ? "#a8693d" : cat.color }}
            />
            <span className="truncate">
              {cat.label}
              <span aria-hidden> · </span>
              {business.onlineOnly ? "Online" : getAreaLabel(business.area)}
            </span>
          </p>
          <p className="mt-1.5 line-clamp-2 text-sm text-cocoa">{business.summary}</p>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop",
        "has-[a:focus-visible]:ring-4 has-[a:focus-visible]:ring-rose has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-cream",
        className,
      )}
    >
      <div className="relative">
        <BusinessCover
          business={business}
          className="aspect-[16/10]"
          imgClassName={artwork ? "object-top" : undefined}
          priority={priority}
        />
        <div className={cn("absolute top-3 flex flex-wrap gap-1.5", artwork ? "right-3 justify-end" : "left-3")}>
          {business.tier === "featured" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sunflower px-2.5 py-1 text-xs font-bold text-espresso shadow-pop-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Featured
            </span>
          )}
          {business.offer && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink px-2.5 py-1 text-xs font-bold text-espresso shadow-pop-sm">
              <BadgePercent className="h-3.5 w-3.5" aria-hidden /> Offer
            </span>
          )}
          {artwork && business.sample && <SampleTag />}
        </div>
        {!artwork && business.sample && <SampleTag className="absolute top-3 right-3" />}
        <BusinessLogo
          business={business}
          size={60}
          className={cn("absolute -bottom-7 shadow-pop-sm", artwork ? "right-5" : "left-5")}
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-10 pb-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cocoa/70">
          <CategoryIcon id={business.category} className="h-3.5 w-3.5 shrink-0" />
          {cat.label}
        </p>
        <Heading className="mt-1.5 flex items-center gap-2 font-heading text-xl font-extrabold leading-tight text-espresso">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {business.name}
          </Link>
          {business.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-teal" aria-label="Verified business" />}
        </Heading>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-cocoa">{business.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-cocoa">
            <MapPin className="h-4 w-4 shrink-0 text-rose" aria-hidden />
            {business.onlineOnly ? "Online / delivery" : getAreaLabel(business.area)}
          </span>
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-espresso transition-colors group-hover:bg-espresso group-hover:text-cream group-has-[a:focus-visible]:bg-espresso group-has-[a:focus-visible]:text-cream"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-espresso/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cream backdrop-blur",
        className,
      )}
    >
      Sample
    </span>
  );
}
