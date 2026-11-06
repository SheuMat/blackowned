import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/utils";
import { milestones, type Milestone } from "./data";

/**
 * Vertical milestones timeline. A single rail on the left on mobile; on
 * desktop the rail runs down the middle and cards alternate either side,
 * overlapping slightly so the two columns interlock.
 */
export function Timeline() {
  return (
    <div className="relative">
      {/* The rail: the logo's skin-tone spectrum, dark to light to pink.
          Kept outside the <ol> so the list only contains <li> children. */}
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-[1.375rem] w-1 -translate-x-1/2 rounded-full bg-linear-to-b from-espresso via-caramel to-pink md:left-1/2"
      />
      <ol className="relative">
        {milestones.map((m, i) => (
          <TimelineItem key={m.id} m={m} index={i} />
        ))}
      </ol>
    </div>
  );
}

function TimelineItem({ m, index }: { m: Milestone; index: number }) {
  const left = index % 2 === 0;
  const Icon = m.icon;
  return (
    <li
      className={cn(
        "relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0 md:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] md:gap-x-6 md:pb-10",
        index > 0 && "md:-mt-20",
      )}
    >
      {/* Node on the rail */}
      <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
        <span
          className={cn(
            "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso shadow-pop-sm md:mt-3 md:h-14 md:w-14",
            m.tone,
            m.current && "ring-4 ring-pink ring-offset-2 ring-offset-cream",
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
        </span>
      </div>

      {/* Card */}
      <Reveal
        y={16}
        className={cn("col-start-2 row-start-1 min-w-0", left ? "md:col-start-1" : "md:col-start-3")}
      >
        <article
          className={cn(
            "relative rounded-[1.5rem] border-2 border-espresso p-5 shadow-pop-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-pop sm:p-6",
            m.current ? "bg-blush" : "bg-white",
          )}
        >
          {/* Little arm reaching back to the rail on desktop */}
          <span
            aria-hidden
            className={cn(
              "absolute top-[2.4rem] hidden h-0.5 w-6 bg-espresso/30 md:block",
              left ? "-right-[1.65rem]" : "-left-[1.65rem]",
            )}
          />
          <div className="flex flex-wrap items-center gap-2">
            {m.when ? (
              <time
                dateTime={m.dateTime}
                className={cn(
                  "inline-flex items-center rounded-full border-2 border-espresso px-3.5 py-1.5 font-display text-base leading-none",
                  m.tone,
                )}
              >
                {m.when}
              </time>
            ) : (
              <span className="inline-flex items-center rounded-full border-2 border-dashed border-espresso/30 px-3 py-1 text-xs font-semibold text-cocoa">
                Along the way
              </span>
            )}
            {m.current && (
              <span className="inline-block -rotate-2 rounded-lg bg-pink px-2 py-0.5 font-display text-xs text-espresso shadow-pop-sm">
                We are here
              </span>
            )}
          </div>
          <h3 className="mt-3 font-heading text-xl leading-snug font-extrabold text-espresso sm:text-[1.35rem]">
            {m.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{m.text}</p>
          {m.links && m.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-5">
              {m.links.map((l) => (
                <MilestoneLink key={l.href} {...l} />
              ))}
            </div>
          )}
        </article>
      </Reveal>
    </li>
  );
}

function MilestoneLink({ href, label }: { href: string; label: string }) {
  const cls =
    "group/ml inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso";
  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/ml:-translate-y-0.5 group-hover/ml:translate-x-0.5" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/ml:translate-x-0.5" aria-hidden />
    </Link>
  );
}
