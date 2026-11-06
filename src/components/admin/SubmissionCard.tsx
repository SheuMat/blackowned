import { ChevronDown, Code2, ExternalLink, Mail } from "lucide-react";
import type { Submission } from "@/lib/submissions";
import { cn, displayUrl } from "@/lib/utils";
import { CopyButton } from "./CopyButton";
import { directoryEntrySnippet } from "./directoryEntry";
import {
  displayEntries,
  fieldLabel,
  formatDateTime,
  mailtoFor,
  prettyValue,
  statusMeta,
  submissionContact,
  submissionName,
  timeAgo,
  typeMeta,
} from "./format";
import { StatusForm } from "./StatusForm";

const URL_RE = /^https?:\/\/\S+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldValue({ k, v }: { k: string; v: unknown }) {
  if (typeof v === "boolean") return <>{v ? "Yes" : "No"}</>;
  if (typeof v === "number") return <>{v}</>;
  if (typeof v === "string") {
    const val = prettyValue(k, v);
    if (URL_RE.test(val))
      return (
        <a
          href={val}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 font-semibold break-all text-rose-ink underline underline-offset-2"
        >
          {displayUrl(val)}
          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
        </a>
      );
    if (EMAIL_RE.test(val))
      return (
        <a href={`mailto:${val}`} className="font-semibold break-all text-rose-ink underline underline-offset-2">
          {val}
        </a>
      );
    return <span className="whitespace-pre-line">{val}</span>;
  }
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== "object" || x === null)) {
      return (
        <ul className="flex flex-wrap gap-1.5">
          {v.map((x, i) => (
            <li key={i} className="rounded-full bg-espresso px-2.5 py-1 text-xs font-semibold text-cream">
              {prettyValue(k, String(x))}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ol className="flex flex-col gap-2">
        {v.map((x, i) => (
          <li key={i} className="rounded-xl border border-espresso/10 bg-cream/60 p-2.5">
            <FieldValue k={k} v={x} />
          </li>
        ))}
      </ol>
    );
  }
  if (v && typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined && x !== "");
    return (
      <ul className="flex flex-col gap-1 border-l-2 border-pink pl-3">
        {entries.map(([ck, cv]) => (
          <li key={ck} className="text-sm">
            <span className="font-semibold text-cocoa">{fieldLabel(ck)}:</span> <FieldValue k={ck} v={cv} />
          </li>
        ))}
      </ul>
    );
  }
  return <>—</>;
}

export function TypeBadge({ type, className }: { type: Submission["type"]; className?: string }) {
  const meta = typeMeta[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-espresso px-2.5 py-0.5 text-xs font-bold whitespace-nowrap",
        meta?.className ?? "bg-sand text-espresso",
        className,
      )}
    >
      {meta?.label ?? type}
    </span>
  );
}

export function StatusPill({ status }: { status: Submission["status"] }) {
  const meta = statusMeta[status] ?? statusMeta.new;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap", meta.className)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

export function SubmissionCard({ submission: s }: { submission: Submission }) {
  const name = submissionName(s);
  const { email } = submissionContact(s);
  const mailto = mailtoFor(s);
  const entries = displayEntries(s.data);
  const snippet = s.type === "business" ? directoryEntrySnippet(s) : null;
  const isNew = s.status === "new";

  return (
    <li>
      <details
        className={cn(
          "group rounded-[1.5rem] border-2 bg-white transition-all open:border-espresso open:shadow-pop",
          isNew ? "border-espresso" : "border-espresso/20 hover:border-espresso/60",
        )}
      >
        <summary className="flex cursor-pointer list-none flex-col gap-3 rounded-[1.4rem] p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex flex-wrap items-center gap-2 sm:w-52 sm:shrink-0">
            <TypeBadge type={s.type} />
            <StatusPill status={s.status} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-lg font-extrabold text-espresso">
              {isNew && <span className="sr-only">New: </span>}
              {name}
            </p>
            {email && email !== name && <p className="truncate text-sm text-cocoa">{email}</p>}
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-xs text-cocoa/80 sm:text-right">
              <time dateTime={s.createdAt} className="block font-semibold text-cocoa">
                {formatDateTime(s.createdAt)}
              </time>
              {timeAgo(s.createdAt)}
            </p>
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-cream transition-transform group-open:rotate-180"
            >
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </summary>

        {/* minmax(0,1fr) stops the code preview's long lines from widening the card past the screen */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t-2 border-dashed border-espresso/15 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <dl className="grid min-w-0 gap-x-6 gap-y-0 divide-y divide-espresso/10 self-start">
            {entries.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-cocoa/80">{fieldLabel(k)}</dt>
                <dd className="min-w-0 text-sm break-words text-espresso">
                  <FieldValue k={k} v={v} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-4 lg:border-l-2 lg:border-dashed lg:border-espresso/15 lg:pl-6">
            <StatusForm id={s.id} status={s.status} />
            {mailto && (
              <a
                href={mailto}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-white px-4 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Email applicant
              </a>
            )}
            {snippet && <CopyButton text={snippet} label="Copy as directory entry" />}
            <p className="text-xs text-cocoa/80">
              ID <code className="break-all">{s.id}</code>
              {s.meta?.referer && (
                <>
                  <br />
                  From <span className="break-all">{displayUrl(s.meta.referer)}</span>
                </>
              )}
            </p>
          </div>

          {snippet && (
            <details className="group/code min-w-0 rounded-2xl border-2 border-espresso/15 bg-cream-deep lg:col-span-2">
              <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 font-heading text-sm font-bold text-espresso [&::-webkit-details-marker]:hidden">
                <Code2 className="h-4 w-4 shrink-0" aria-hidden />
                Preview directory entry
                <span className="w-full text-xs font-medium text-cocoa sm:ml-auto sm:w-auto">
                  Paste into <code>src/content/businesses.ts</code>
                </span>
              </summary>
              <pre className="max-h-96 overflow-auto border-t-2 border-espresso/10 p-4 text-xs leading-relaxed text-espresso">
                <code>{snippet}</code>
              </pre>
            </details>
          )}
        </div>
      </details>
    </li>
  );
}
