import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { partners } from "@/content/partners";
import { cn } from "@/lib/utils";
import { PartnerLogo } from "./PartnerLogo";

/** Compact row of partner wordmarks, each linking to its entry on /partners */
export function PartnerStrip({ className, heading = "Partners & friends" }: { className?: string; heading?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase">{heading}</h2>
        <Link
          href="/partners"
          className="group inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:text-rose-ink"
        >
          Meet our partners
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {partners.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/partners#${p.slug}`}
              className="group block rounded-2xl border-2 border-espresso transition-all duration-200 hover:-translate-y-1 hover:shadow-pop"
            >
              <span className="sr-only">{p.name}</span>
              <PartnerLogo partner={p} size="sm" className="rounded-[0.85rem]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
