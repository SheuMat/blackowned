import Link from "next/link";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import type { CommunityLink } from "@/content/community";
import { cn } from "@/lib/utils";

/** Card that links out (external) or across the site (internal). The whole card is the link. */
export function LinkCard({ item, className }: { item: CommunityLink; className?: string }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-extrabold leading-snug text-espresso">{item.title}</h3>
        {item.tag && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sunflower px-2.5 py-1 text-xs font-bold text-espresso">
            <Lock className="h-3 w-3" aria-hidden />
            {item.tag}
          </span>
        )}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{item.body}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-heading text-sm font-bold text-rose-ink">
        <span className="break-all">{item.linkLabel}</span>
        {item.external ? (
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        )}
        {item.external && <span className="sr-only">(external site, opens in a new tab)</span>}
      </span>
    </>
  );
  const cls = cn(
    "group flex h-full flex-col rounded-[1.25rem] border-2 border-espresso bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-pop",
    className,
  );
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={cls}>
      {inner}
    </Link>
  );
}
