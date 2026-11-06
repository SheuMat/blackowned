import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Breadcrumb trail matching the one in PageHero, for bespoke page headers. */
export function Breadcrumbs({ crumbs, dark = false, className }: { crumbs: Crumb[]; dark?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1 text-sm", dark ? "text-cream/70" : "text-cocoa/80")}>
        <li>
          <Link href="/" className="-my-0.5 inline-block py-0.5 hover:underline">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {c.href ? (
              <Link href={c.href} className="-my-0.5 inline-block py-0.5 hover:underline">
                {c.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={cn("max-w-[14rem] truncate sm:max-w-md", dark ? "text-cream" : "text-espresso")}
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
