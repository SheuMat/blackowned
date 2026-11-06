import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, ChevronDown, ExternalLink, Hourglass, MapPin, PoundSterling } from "lucide-react";
import { opportunityKindMap, type Opportunity } from "@/content/opportunities";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { deadlineStatus, type DeadlineState } from "./deadline";

const deadlineTones: Record<DeadlineState, string> = {
  closed: "bg-espresso/10 text-cocoa",
  today: "bg-rose-ink text-cream",
  soon: "bg-tangerine text-espresso",
  open: "bg-teal/15 text-forest",
};

export function DeadlineBadge({ deadline, now, className }: { deadline: string; now: number; className?: string }) {
  const s = deadlineStatus(deadline, now);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none",
        deadlineTones[s.state],
        className,
      )}
    >
      <Hourglass className="h-3.5 w-3.5" aria-hidden />
      {s.label}
    </span>
  );
}

export function OpportunityKindBadge({ kind }: { kind: Opportunity["kind"] }) {
  const k = opportunityKindMap[kind];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold leading-none"
      style={{ backgroundColor: k.color, color: k.ink }}
    >
      {k.label}
    </span>
  );
}

/**
 * One opportunity. "View opportunity" opens the full details in place
 * (a native <details>, so it works without JavaScript).
 */
export function OpportunityCard({
  opportunity: o,
  now,
  compact = false,
  className,
}: {
  opportunity: Opportunity;
  now: number;
  compact?: boolean;
  className?: string;
}) {
  const closed = deadlineStatus(o.deadline, now).state === "closed";
  const external = o.url && /^https?:\/\//.test(o.url);

  return (
    <article
      id={compact ? undefined : o.id}
      className={cn(
        "group relative flex h-full scroll-mt-28 flex-col rounded-[1.5rem] border-2 border-espresso bg-white p-5 transition-all duration-300 sm:p-6",
        closed ? "border-espresso/30 bg-cream-deep" : "hover:-translate-y-1 hover:shadow-pop",
        // Compact cards are one big link: ring the whole card when it has keyboard focus
        compact && "has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-rose",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <OpportunityKindBadge kind={o.kind} />
        <DeadlineBadge deadline={o.deadline} now={now} />
        {o.sample && (
          <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
            Sample
          </span>
        )}
      </div>

      <h3 className={cn("mt-4 font-heading font-extrabold leading-snug", compact ? "text-lg" : "text-xl", closed ? "text-cocoa" : "text-espresso")}>
        {compact ? (
          <Link
            href={`/business-support/opportunities#${o.id}`}
            className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
          >
            {o.title}
          </Link>
        ) : (
          o.title
        )}
      </h3>

      <dl className="mt-3 grid gap-1.5 text-sm text-cocoa">
        <div>
          <dt className="sr-only">Organisation</dt>
          <dd className="flex items-start gap-2 font-semibold text-espresso">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            {o.organisation}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Location</dt>
          <dd className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
            {o.location}
          </dd>
        </div>
        {o.value && (
          <div>
            <dt className="sr-only">Value</dt>
            <dd className="flex items-start gap-2">
              <PoundSterling className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
              {o.value}
            </dd>
          </div>
        )}
        {!compact && (
          <div>
            <dt className="sr-only">Deadline</dt>
            <dd className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
              <span>
                {closed ? "Closed " : "Closes "}
                {formatDate(o.deadline)}, {formatTime(o.deadline)}
              </span>
            </dd>
          </div>
        )}
      </dl>

      <p className={cn("mt-3 text-[15px] leading-relaxed text-cocoa", compact && "line-clamp-3")}>{o.description}</p>

      {compact && (
        <span aria-hidden className="mt-auto inline-flex items-center gap-1 pt-4 font-heading text-sm font-bold text-espresso">
          View on the board
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}

      {!compact && (
        <details className="group/details mt-auto pt-5">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-colors hover:bg-espresso hover:text-cream [&::-webkit-details-marker]:hidden">
            View opportunity
            <ChevronDown className="h-4 w-4 transition-transform group-open/details:rotate-180" aria-hidden />
          </summary>
          <div className="mt-4 rounded-2xl bg-cream p-4 text-sm text-cocoa">
            {o.details && o.details.length > 0 && (
              <ul className="list-disc space-y-1 pl-5">
                {o.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <p className={cn("text-xs text-cocoa/80", o.details?.length && "mt-3")}>
              Added to the board {formatDate(o.posted, { weekday: undefined })}
            </p>
            {o.url ? (
              <a
                href={o.url}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-espresso px-4 font-heading text-sm font-bold text-cream transition-colors hover:bg-cocoa"
              >
                {closed ? "See the original advert" : "Apply or find out more"}
                <ExternalLink className="h-4 w-4" aria-hidden />
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-espresso/25 px-3 py-2 text-xs">
                This is a sample listing for a fictional organisation. Real opportunities link straight to the
                organisation&apos;s own advert or application page.
              </p>
            )}
          </div>
        </details>
      )}
    </article>
  );
}
