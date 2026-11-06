import Link from "next/link";
import { Marquee } from "./Marquee";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { categories } from "@/content/categories";

/**
 * One run of category chips. The marquee renders it twice for a seamless loop;
 * the second run (`copy`) is hidden from screen readers and skipped in the tab
 * order, but its chips still work with a mouse or tap.
 */
function CategoryChips({ copy = false }: { copy?: boolean }) {
  return categories.map((c) => (
    <li key={c.id} className="flex items-center gap-3">
      <Link
        href={`/directory?category=${c.id}`}
        tabIndex={copy ? -1 : undefined}
        className="inline-flex h-12 items-center gap-2.5 rounded-full border-2 border-espresso bg-cream pr-5 pl-1.5 font-heading text-[15px] font-bold whitespace-nowrap text-espresso transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-pop-sm"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-espresso"
          style={{ backgroundColor: c.color, color: c.ink }}
        >
          <CategoryIcon id={c.id} className="h-4 w-4" />
        </span>
        {c.label}
      </Link>
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-espresso motion-reduce:hidden">
        <path fill="currentColor" d="M10 0c.8 5.6 4.4 9.2 10 10-5.6.8-9.2 4.4-10 10-.8-5.6-4.4-9.2-10-10C5.6 9.2 9.2 5.6 10 0Z" />
      </svg>
    </li>
  ));
}

/** Sunflower band of every category, scrolling. Each chip opens the filtered directory. */
export function CategoryStrip() {
  return (
    <section aria-labelledby="category-strip-title" className="border-y-2 border-espresso bg-sunflower py-5 sm:py-6">
      <h2 id="category-strip-title" className="sr-only">
        Browse by category
      </h2>
      <Marquee label="Browse by category" fade="sunflower" duplicate={<CategoryChips copy />}>
        <CategoryChips />
      </Marquee>
    </section>
  );
}
