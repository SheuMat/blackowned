import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, BriefcaseBusiness, Lock } from "lucide-react";
import type { SupportSection } from "@/content/support";
import { cn } from "@/lib/utils";
import { SupportIcon } from "./SupportIcon";

/**
 * Base tile for the Business Support grids. Horizontal on phones (icon left)
 * to keep long grids short, stacked from `sm` up.
 */
export function SupportTile({
  href,
  title,
  description,
  icon,
  iconColor,
  iconInk,
  pill,
  footer,
  locked = false,
  dark = false,
  className,
}: {
  href: string;
  title: string;
  description?: string;
  icon: ReactNode;
  iconColor: string;
  iconInk: string;
  pill?: ReactNode;
  footer: ReactNode;
  locked?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full gap-4 rounded-[1.5rem] border-2 border-espresso p-4 transition-all duration-300 hover:-translate-y-1 sm:flex-col sm:gap-0 sm:p-6",
        // The whole tile is one link: ring the tile, not just the title, when it has keyboard focus
        "has-[a:focus-visible]:-translate-y-1 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-rose",
        dark ? "bg-espresso text-cream hover:shadow-pop-pink" : "bg-white text-espresso hover:shadow-pop",
        className,
      )}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 sm:w-full">
        <span
          className={cn(
            "flex h-12 w-12 -rotate-3 items-center justify-center rounded-2xl border-2 shadow-pop-sm transition-transform duration-300 group-hover:rotate-3 sm:h-14 sm:w-14",
            dark ? "border-cream" : "border-espresso",
          )}
          style={{ backgroundColor: iconColor, color: iconInk }}
        >
          {icon}
        </span>
        {pill && <span className="hidden sm:inline-flex">{pill}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-lg font-extrabold leading-tight sm:mt-5 sm:text-xl">
          <Link href={href} className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        {description && (
          <p className={cn("mt-1.5 text-sm leading-relaxed sm:mt-2 sm:text-[15px]", dark ? "text-cream/80" : "text-cocoa")}>
            {description}
          </p>
        )}
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1 pt-3 font-heading text-sm font-bold sm:pt-4",
            dark ? "text-pink" : "text-espresso",
          )}
        >
          {locked && <Lock className={cn("h-3.5 w-3.5 sm:hidden", dark ? "text-pink" : "text-rose")} aria-hidden />}
          {footer}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

function MembersPill({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        dark ? "bg-pink text-espresso" : "bg-espresso text-pink",
      )}
    >
      <Lock className="h-3 w-3" aria-hidden />
      Members
    </span>
  );
}

/** Tile for a support section. `locked` shows the members-only treatment used on the public teaser. */
export function SectionTile({
  section,
  locked = false,
  showDescription = true,
  className,
}: {
  section: SupportSection;
  locked?: boolean;
  showDescription?: boolean;
  className?: string;
}) {
  const count = section.resources.length;
  const countLabel = `${count} ${count === 1 ? "resource" : "resources"}`;
  return (
    <SupportTile
      href={`/business-support/${section.id}`}
      title={section.title}
      description={showDescription ? section.description : undefined}
      icon={<SupportIcon name={section.icon} className="h-6 w-6 sm:h-7 sm:w-7" />}
      iconColor={section.color}
      iconInk={section.ink}
      locked={locked}
      pill={
        locked ? (
          <MembersPill />
        ) : (
          <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-bold text-cocoa">{countLabel}</span>
        )
      }
      footer={locked ? `${countLabel} inside` : <span>Open <span className="sm:hidden">· {countLabel}</span></span>}
      className={className}
    />
  );
}

/** The espresso "Business Opportunities board" tile that sits at the end of the grids */
export function OpportunitiesTile({
  locked = false,
  openCount,
  sampleCount = 0,
  className,
}: {
  locked?: boolean;
  /** Live (non-sample) open opportunities */
  openCount?: number;
  /** Sample opportunities, shown instead while there are no live ones */
  sampleCount?: number;
  className?: string;
}) {
  const label = !openCount && sampleCount ? `${sampleCount} sample` : `${openCount ?? 0} open`;
  return (
    <SupportTile
      dark
      href="/business-support/opportunities"
      title="Business Opportunities board"
      description={
        locked
          ? "Contracts, tenders, jobs and grants shared with Black-owned businesses, with countdowns so you never miss a deadline."
          : undefined
      }
      icon={<BriefcaseBusiness className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />}
      iconColor="#f2a0bd"
      iconInk="#2a1910"
      locked={locked}
      pill={
        locked ? (
          <MembersPill dark />
        ) : (
          <span className="rounded-full bg-pink px-2.5 py-1 text-xs font-bold text-espresso">{label}</span>
        )
      }
      footer={locked ? "Kept up to date by the BOS team" : <span>Open the board <span className="sm:hidden">· {label}</span></span>}
      className={className}
    />
  );
}
