import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, Globe, MapPin, Sparkles } from "lucide-react";
import { BusinessCover, BusinessLogo } from "@/components/cards/BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { ButtonLink } from "@/components/ui/Button";
import { getAreaLabel } from "@/content/areas";
import { categoryMap } from "@/content/categories";
import { formatSpotlightMonth } from "@/content/spotlights";
import type { Business, Spotlight } from "@/content/types";
import { cn, displayUrl } from "@/lib/utils";

/* ───────────────────────── Labels ───────────────────────── */

export function SpotlightLabels({ spotlight, className }: { spotlight: Spotlight; className?: string }) {
  if (!spotlight.sponsored && !spotlight.sample) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {spotlight.sponsored && (
        <span className="inline-flex items-center gap-1 rounded-full border-2 border-espresso bg-sunflower px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-espresso">
          <Sparkles className="h-3 w-3" aria-hidden /> Sponsored
        </span>
      )}
      {spotlight.sample && (
        <span className="inline-flex items-center rounded-full bg-espresso/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream">
          Sample
        </span>
      )}
    </span>
  );
}

/* ───────────────────────── Media ───────────────────────── */

export function SpotlightMedia({
  spotlight,
  business,
  className,
  sizes,
  priority,
}: {
  spotlight: Spotlight;
  business: Business;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  // The business cover handles its own fit (some covers have text baked in)
  const src = spotlight.image;
  if (!src) return <BusinessCover business={business} className={className} sizes={sizes} priority={priority} />;
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      <Image
        src={src}
        alt={`${business.name}: ${business.tagline}`}
        fill
        sizes={sizes ?? "100vw"}
        preload={priority}
        className="object-cover"
      />
    </div>
  );
}

/* ───────────────────────── Pull quote ───────────────────────── */

export function PullQuote({ text, by, className }: { text: string; by: string; className?: string }) {
  return (
    <figure
      className={cn(
        "grain relative overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-pink px-6 pt-14 pb-8 shadow-pop sm:px-10 sm:pt-16 sm:pb-10",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-2 left-5 font-display text-[6.5rem] leading-none text-espresso/90 sm:left-8 sm:text-[8rem]"
      >
        &ldquo;
      </span>
      <blockquote className="relative font-display text-[1.85rem] leading-[1.08] text-espresso sm:text-4xl lg:text-[2.75rem]">
        <p>{text}</p>
      </blockquote>
      <figcaption className="relative mt-5 flex items-center gap-3 font-heading text-sm font-bold uppercase tracking-[0.16em] text-espresso">
        <span aria-hidden className="h-0.5 w-8 bg-espresso" />
        {by}
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── At a glance ───────────────────────── */

export function SpotlightAtAGlance({ business, className }: { business: Business; className?: string }) {
  const cat = categoryMap[business.category];
  const place = business.onlineOnly ? "Online / delivery" : getAreaLabel(business.area);
  return (
    <div className={cn("rounded-[1.75rem] border-2 border-espresso bg-white p-6", className)}>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-rose-ink">At a glance</p>
      <div className="mt-4 flex items-center gap-4">
        <BusinessLogo business={business} size={72} />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-heading text-xl font-extrabold leading-tight text-espresso">
            {business.name}
            {business.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-teal" aria-label="Verified business" />}
          </h3>
          <p className="mt-0.5 text-sm text-cocoa">{business.tagline}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t-2 border-espresso/10 pt-5 text-[15px]">
        <div className="flex items-start gap-3">
          <dt className="sr-only">Category</dt>
          <CategoryIcon id={business.category} className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
          <dd className="font-semibold text-espresso">{cat.label}</dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="sr-only">Area</dt>
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
          <dd className="text-cocoa">
            {place}
            {business.serviceArea && <span className="block text-sm text-cocoa/80">Serving {business.serviceArea}</span>}
          </dd>
        </div>
        {business.established && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">Established</dt>
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            <dd className="text-cocoa">Since {business.established}</dd>
          </div>
        )}
        {business.contact.website && (
          <div className="flex items-start gap-3">
            <dt className="sr-only">Website</dt>
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            <dd className="min-w-0 truncate text-cocoa">{displayUrl(business.contact.website)}</dd>
          </div>
        )}
      </dl>

      {business.highlights && business.highlights.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {business.highlights.map((h) => (
            <li key={h} className="rounded-full bg-blush px-2.5 py-1 text-xs font-semibold text-rose-ink">
              {h}
            </li>
          ))}
        </ul>
      )}

      {business.services.length > 0 && (
        <>
          <p className="mt-6 font-heading text-sm font-bold text-espresso">What they offer</p>
          <ul className="mt-2 space-y-1.5 text-sm text-cocoa">
            {business.services.slice(0, 6).map((s) => (
              <li key={s} className="flex gap-2">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tangerine" />
                {s}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        <ButtonLink href={`/directory/${business.slug}`} variant="primary" className="w-full">
          View profile
        </ButtonLink>
        {business.contact.website && (
          <ButtonLink
            href={business.contact.website}
            variant="outline"
            className="w-full"
            iconRight={<ArrowUpRight className="h-4 w-4" aria-hidden />}
          >
            Visit website
            <span className="sr-only"> (opens in a new tab)</span>
          </ButtonLink>
        )}
        {business.socials.instagram && (
          <ButtonLink href={business.socials.instagram} variant="ghost" className="w-full" icon={<InstagramIcon size={18} />}>
            Instagram
            <span className="sr-only"> (opens in a new tab)</span>
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Archive card ───────────────────────── */

export function SpotlightArchiveCard({ spotlight, business }: { spotlight: Spotlight; business: Business }) {
  const cat = categoryMap[business.category];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop has-[a:focus-visible]:shadow-pop">
      <div className="relative">
        <SpotlightMedia
          spotlight={spotlight}
          business={business}
          className="aspect-[16/10]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute top-3 left-3 inline-block -rotate-2 rounded-xl border-2 border-espresso bg-cream px-2.5 py-0.5 font-display text-sm text-espresso shadow-pop-sm">
          {formatSpotlightMonth(spotlight.month)}
        </span>
        <BusinessLogo business={business} size={56} className="absolute -bottom-7 left-5 shadow-soft" />
      </div>
      {/* Labels sit beside the overlapping logo so they never cover the art */}
      <SpotlightLabels spotlight={spotlight} className="justify-end px-5 pt-3 pl-24" />
      <div className={cn("flex flex-1 flex-col px-5 pb-5", spotlight.sponsored || spotlight.sample ? "pt-3" : "pt-10")}>
        <p className="text-xs font-semibold uppercase tracking-wider text-cocoa/75">
          <CategoryIcon id={business.category} className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" />
          {cat.label}
        </p>
        <p className="mt-0.5 font-heading text-sm font-bold text-cocoa">{business.name}</p>
        <h3 className="mt-2 font-heading text-xl font-extrabold leading-snug text-espresso">
          <Link href={`/directory/${business.slug}`} className="after:absolute after:inset-0">
            {spotlight.headline}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-cocoa">{spotlight.intro}</p>
        {spotlight.quote && (
          <p className="mt-4 border-l-4 border-pink pl-3 font-heading text-[15px] font-semibold text-espresso">
            &ldquo;{spotlight.quote.text}&rdquo;
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-5 font-heading text-sm font-bold text-espresso">
          View profile
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
