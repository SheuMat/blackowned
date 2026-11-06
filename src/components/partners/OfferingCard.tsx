import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusLabel, type Offering } from "./offerings";

export function OfferingCard({ offering: o }: { offering: Offering }) {
  const Icon = o.icon;
  const now = o.status === "now";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] border-2 border-espresso p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-pop sm:p-7",
        now ? "bg-white shadow-pop-sm" : "bg-cream",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso", o.tone)}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
            // forest, not teal: keeps the small cream label above AA contrast
            now ? "bg-forest text-cream" : "border-2 border-dashed border-espresso/30 text-cocoa",
          )}
        >
          {now ? <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden /> : <Clock className="h-3 w-3" aria-hidden />}
          {statusLabel[o.status]}
        </span>
      </div>

      <h3 className="mt-5 font-heading text-xl leading-snug font-extrabold text-espresso sm:text-2xl">{o.title}</h3>
      <p className="mt-2 leading-relaxed text-cocoa">{o.summary}</p>

      <ul className="mt-4 space-y-2">
        {o.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] text-cocoa">
            <span
              aria-hidden
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-espresso text-cream"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      {o.note && <p className="mt-4 rounded-xl bg-sunflower/25 px-3 py-2 text-sm text-espresso">{o.note}</p>}

      <div className="mt-auto pt-6" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-espresso/15 pt-5">
        <p className="text-sm text-cocoa">
          Price: <span className="font-heading font-extrabold text-espresso">Ask us</span>
        </p>
        <Link
          href={`/work-with-us?interest=${o.id}#enquire`}
          className="group/ask inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-espresso bg-espresso px-4 font-heading text-sm font-bold text-cream transition-colors hover:bg-pink hover:text-espresso"
        >
          {now ? "Ask about this" : "Register interest"}
          <span className="sr-only">: {o.title}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/ask:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
