import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { categories } from "@/content/categories";
import type { CategoryId } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Colourful "Browse by category" tiles linking to /directory/category/<id>.
 * Rows that don't fill are centred so the grid always looks intentional.
 * `counts` must be live (non-sample) listings; samples get their own tag.
 */
export function CategoryTiles({
  counts,
  sampleCounts,
  exclude,
  className,
  headingLevel = "h3",
}: {
  counts: Record<CategoryId, number>;
  sampleCounts?: Record<CategoryId, number>;
  exclude?: CategoryId;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const list = categories.filter((c) => c.id !== exclude);
  const Heading = headingLevel;
  return (
    <ul className={cn("flex flex-wrap justify-center gap-3 sm:gap-4", className)}>
      {list.map((c) => {
        const count = counts[c.id] ?? 0;
        const samples = sampleCounts?.[c.id] ?? 0;
        return (
          <li
            key={c.id}
            className="min-w-0 basis-[calc(50%-0.375rem)] sm:basis-[calc(33.333%-0.667rem)] lg:basis-[calc(25%-0.75rem)] xl:basis-[calc(20%-0.8rem)]"
          >
            <Link
              href={`/directory/category/${c.id}`}
              className="group relative flex h-full min-h-[150px] flex-col justify-between gap-6 overflow-hidden rounded-[1.5rem] border-2 border-espresso p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop sm:min-h-[170px] sm:p-5"
              style={{ backgroundColor: c.color, color: c.ink }}
            >
              <span aria-hidden className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-current opacity-[0.14] transition-transform duration-500 group-hover:scale-125" />
              <span aria-hidden className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-current opacity-[0.08]" />
              <span className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-espresso bg-cream text-espresso shadow-pop-sm transition-transform duration-300 group-hover:-rotate-6">
                  <CategoryIcon id={c.id} className="h-6 w-6" />
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                />
              </span>
              <span className="relative">
                {/* 19px+ extrabold counts as large text, so it stays readable on the lighter category colours */}
                <Heading className="font-heading text-[1.1875rem] leading-tight font-extrabold break-words hyphens-auto sm:text-xl">{c.label}</Heading>
                <span className="mt-2 flex flex-wrap gap-1">
                  <span className="inline-flex rounded-full bg-cream/95 px-2.5 py-0.5 text-xs font-bold text-espresso">
                    {count === 0 ? "Be the first" : count === 1 ? "1 listing" : `${count} listings`}
                  </span>
                  {samples > 0 && (
                    <span className="inline-flex items-center rounded-full bg-espresso/85 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cream uppercase">
                      {samples} sample
                      <span className="sr-only">{samples === 1 ? " listing" : " listings"}</span>
                    </span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
