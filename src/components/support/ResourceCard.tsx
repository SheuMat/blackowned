import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, ExternalLink, Link2, Sparkles } from "lucide-react";
import { resourceTypes, type ResourceType, type SupportResource } from "@/content/support";
import { cn } from "@/lib/utils";
import { RequestServiceButton } from "./RequestServiceButton";

const typeStyles: Record<ResourceType, { className: string; Icon: typeof Link2 }> = {
  link: { className: "bg-sand text-cocoa", Icon: Link2 },
  guide: { className: "bg-forest text-cream", Icon: BookOpen },
  "bos-service": { className: "bg-espresso text-pink", Icon: Sparkles },
  event: { className: "bg-sunflower text-espresso", Icon: CalendarDays },
};

export function ResourceTypeBadge({ type, className }: { type: ResourceType; className?: string }) {
  const { className: tone, Icon } = typeStyles[type];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold leading-none", tone, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {resourceTypes[type].label}
    </span>
  );
}

export function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export function ResourceCard({
  resource,
  sectionId,
  memberName,
  className,
}: {
  resource: SupportResource;
  sectionId?: string;
  memberName?: string;
  className?: string;
}) {
  const isService = resource.type === "bos-service";
  const requestable = isService && resource.requestable !== false;
  const external = resource.url ? isExternal(resource.url) : false;
  const linkLabel = resource.linkLabel ?? resourceTypes[resource.type].linkLabel;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.5rem] border-2 border-espresso bg-white p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6",
        isService ? "bg-blush/60 hover:shadow-pop-pink" : "hover:shadow-pop",
        className,
      )}
    >
      {isService && (
        <span
          aria-hidden
          className="absolute -top-3 right-5 rotate-2 rounded-full border-2 border-espresso bg-pink px-3 py-0.5 font-display text-xs text-espresso shadow-pop-sm"
        >
          From BOS
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <ResourceTypeBadge type={resource.type} />
        {resource.verified && resource.url && external && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest" title="We've checked this link">
            <BadgeCheck className="h-4 w-4 text-teal" aria-hidden />
            Verified link
          </span>
        )}
        {resource.sample && (
          <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
            Sample
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-rose-ink">{resource.provider}</p>
      <h3 className="mt-1 font-heading text-xl font-extrabold leading-snug text-espresso">{resource.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{resource.description}</p>

      {resource.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {resource.tags.map((t) => (
            <li key={t} className="rounded-full border border-espresso/15 bg-cream px-2.5 py-1 text-xs font-medium text-cocoa">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        {resource.url &&
          (external ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-colors hover:bg-espresso hover:text-cream"
            >
              {linkLabel}
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only">(opens {resource.provider} in a new tab)</span>
            </a>
          ) : (
            <Link
              href={resource.url}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-colors hover:bg-espresso hover:text-cream"
            >
              {linkLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ))}
        {requestable && (
          <RequestServiceButton
            serviceId={resource.id}
            serviceTitle={resource.title}
            section={sectionId}
            defaultName={memberName}
          />
        )}
      </div>
    </article>
  );
}
