import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Database, Download, Inbox, LogOut, Search, Webhook } from "lucide-react";
import { LoginCard } from "@/components/admin/LoginCard";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { STATUSES, statusMeta, typeMeta } from "@/components/admin/format";
import { Container } from "@/components/ui/layout";
import { Blob, Squiggle } from "@/components/ui/Shapes";
import { hasRole } from "@/lib/session";
import { SUBMISSION_TYPES, listSubmissions, type Submission, type SubmissionType } from "@/lib/submissions";
import { cn } from "@/lib/utils";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team dashboard",
  description: "Applications and messages sent through the Black Owned Sheffield website. Team only.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const MAIN_TYPES: SubmissionType[] = ["business", "member", "partner", "volunteer"];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function buildHref(params: { type?: string; status?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  const qs = sp.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage(props: PageProps<"/admin">) {
  if (!(await hasRole("admin"))) {
    return (
      <section className="grain relative overflow-hidden bg-cream-deep py-16 sm:py-24">
        <Blob color="#f2a0bd" className="absolute -top-24 -right-24 h-80 w-80 opacity-60" />
        <Squiggle color="#ee6a35" className="absolute bottom-10 left-[10%] hidden h-10 w-32 md:block" />
        <Container className="relative">
          <LoginCard />
        </Container>
      </section>
    );
  }

  const sp = await props.searchParams;
  const rawType = one(sp.type);
  const type = (SUBMISSION_TYPES as readonly string[]).includes(rawType) ? (rawType as SubmissionType) : undefined;
  const rawStatus = one(sp.status);
  const status = (STATUSES as readonly string[]).includes(rawStatus) ? (rawStatus as Submission["status"]) : undefined;
  const q = one(sp.q).trim().slice(0, 100);

  const all = (await listSubmissions()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = Object.fromEntries(
    SUBMISSION_TYPES.map((t) => {
      const ofType = all.filter((s) => s.type === t);
      return [t, { total: ofType.length, fresh: ofType.filter((s) => s.status === "new").length }];
    }),
  ) as Record<SubmissionType, { total: number; fresh: number }>;
  const totalNew = all.filter((s) => s.status === "new").length;
  const otherTypes = SUBMISSION_TYPES.filter((t) => !MAIN_TYPES.includes(t) && counts[t].total > 0);

  const needle = q.toLowerCase();
  const filtered = all.filter(
    (s) =>
      (!type || s.type === type) &&
      (!status || s.status === status) &&
      (!needle || s.id.startsWith(needle) || JSON.stringify(s.data).toLowerCase().includes(needle)),
  );
  const filtering = !!(type || status || q);
  const exportParams = new URLSearchParams({ type: type ?? "all" });
  if (status) exportParams.set("status", status);
  if (q) exportParams.set("q", q);
  const exportHref = `/api/admin/export?${exportParams.toString()}`;
  const webhookOn = !!process.env.SUBMISSIONS_WEBHOOK_URL;

  return (
    <>
      <section className="grain relative overflow-hidden bg-espresso pt-10 pb-12 text-cream sm:pt-14 sm:pb-16">
        <Blob color="#55321f" className="absolute -top-24 -right-20 h-80 w-80 opacity-70" />
        <Squiggle color="#f2a0bd" className="absolute right-[10%] bottom-8 hidden h-8 w-28 opacity-70 md:block" />
        <Container className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.18em] text-pink">
                <span aria-hidden className="h-2 w-2 rounded-full bg-pink" />
                Team only
              </p>
              <h1 className="mt-3 font-heading text-4xl font-extrabold sm:text-5xl">Team dashboard</h1>
              <p className="mt-3 max-w-xl text-cream/80">
                Every application and message sent through the website lands here.{" "}
                {totalNew > 0 ? (
                  <strong className="text-cream">
                    {totalNew} new {totalNew === 1 ? "one needs" : "ones need"} a look.
                  </strong>
                ) : (
                  "You're all caught up."
                )}
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-cream/30 px-5 font-heading text-sm font-bold text-cream transition-colors hover:border-pink hover:bg-pink hover:text-espresso"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </form>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            <li className="col-span-2 lg:col-span-1">
              <StatLink
                href={buildHref({ status, q })}
                label="Everything"
                total={all.length}
                fresh={totalNew}
                active={!type}
                className="bg-cream text-espresso"
              />
            </li>
            {MAIN_TYPES.map((t) => (
              <li key={t}>
                <StatLink
                  href={buildHref({ type: t, status, q })}
                  label={typeMeta[t].plural}
                  total={counts[t].total}
                  fresh={counts[t].fresh}
                  active={type === t}
                  className={typeMeta[t].className}
                />
              </li>
            ))}
          </ul>
          {otherTypes.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Other submission types">
              {otherTypes.map((t) => (
                <li key={t}>
                  <Link
                    href={buildHref({ type: t, status, q })}
                    aria-current={type === t ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                      type === t ? "border-pink bg-pink text-espresso" : "border-cream/25 text-cream hover:border-cream/60",
                    )}
                  >
                    {typeMeta[t].plural}
                    <span className="font-display">{counts[t].total}</span>
                    {counts[t].fresh > 0 && <span className="text-xs">({counts[t].fresh} new)</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section className="bg-cream py-10 sm:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <div className="min-w-0">
              <Form
                action="/admin"
                className="flex flex-col gap-3 rounded-[1.5rem] border-2 border-espresso bg-white p-4 shadow-pop-sm sm:flex-row sm:flex-wrap sm:items-end sm:p-5"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-56">
                  <label htmlFor="admin-q" className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-cocoa/80">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cocoa/60" aria-hidden />
                    <input
                      id="admin-q"
                      name="q"
                      type="search"
                      defaultValue={q}
                      placeholder="Name, email, postcode…"
                      className="h-11 w-full rounded-full border-2 border-espresso/20 bg-cream pr-4 pl-10 text-sm text-espresso placeholder:text-cocoa/50 focus:border-espresso focus:outline-none"
                    />
                  </div>
                </div>
                <FilterSelect
                  id="admin-type"
                  name="type"
                  label="Type"
                  value={type ?? ""}
                  options={[
                    { value: "", label: "All types" },
                    ...SUBMISSION_TYPES.map((t) => ({ value: t, label: `${typeMeta[t].plural} (${counts[t].total})` })),
                  ]}
                />
                <FilterSelect
                  id="admin-status"
                  name="status"
                  label="Status"
                  value={status ?? ""}
                  options={[{ value: "", label: "Any status" }, ...STATUSES.map((s) => ({ value: s, label: statusMeta[s].label }))]}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-espresso bg-espresso px-5 font-heading text-sm font-bold text-cream transition-all hover:bg-pink hover:text-espresso sm:flex-none"
                  >
                    Apply
                  </button>
                  {filtering && (
                    <Link
                      href="/admin"
                      className="inline-flex h-11 items-center justify-center rounded-full border-2 border-espresso/20 px-4 font-heading text-sm font-bold text-espresso hover:border-espresso"
                    >
                      Clear
                    </Link>
                  )}
                </div>
              </Form>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-2xl font-extrabold text-espresso" aria-live="polite">
                  {filtering
                    ? `${filtered.length} of ${all.length} ${all.length === 1 ? "submission" : "submissions"}`
                    : `${all.length} ${all.length === 1 ? "submission" : "submissions"}`}
                  {type && <span className="text-cocoa"> · {typeMeta[type].plural}</span>}
                </h2>
                {filtered.length > 0 && (
                  <a
                    href={exportHref}
                    className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-sunflower px-4 font-heading text-sm font-bold text-espresso shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Export {filtering ? "these" : "all"} as CSV
                  </a>
                )}
              </div>

              {filtered.length > 0 ? (
                <ul className="mt-5 flex flex-col gap-3">
                  {filtered.map((s) => (
                    <SubmissionCard key={s.id} submission={s} />
                  ))}
                </ul>
              ) : (
                <div className="mt-5 flex flex-col items-center rounded-[1.5rem] border-2 border-dashed border-espresso/25 bg-white px-6 py-14 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-espresso bg-blush">
                    <Inbox className="h-6 w-6 text-espresso" aria-hidden />
                  </span>
                  <p className="mt-4 font-heading text-xl font-extrabold text-espresso">
                    {filtering ? "Nothing matches those filters" : "No submissions yet"}
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-cocoa">
                    {filtering
                      ? "Try a different search, or clear the filters."
                      : "When someone fills in a form on the website, it'll appear here."}
                  </p>
                  {filtering && (
                    <Link href="/admin" className="mt-4 font-semibold text-rose-ink underline underline-offset-4">
                      Clear filters
                    </Link>
                  )}
                </div>
              )}
            </div>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start" aria-label="How submissions are stored">
              <div className="rounded-[1.5rem] border-2 border-espresso bg-white p-5">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-espresso">
                  <Database className="h-5 w-5" aria-hidden />
                  Where submissions go
                </h2>
                <p className="mt-2 text-sm text-cocoa">
                  Every form on the site saves to <code className="rounded bg-cream-deep px-1">data/submissions.json</code>{" "}
                  on the server. That&apos;s what you see here.
                </p>
                <p className="mt-3 text-sm text-cocoa">
                  If <code className="rounded bg-cream-deep px-1">SUBMISSIONS_WEBHOOK_URL</code> is set, each submission is
                  also sent there as JSON, so it can go straight to email, Slack, Google Sheets, Airtable, Zapier or Make.
                  On hosts without a permanent disk (like Vercel), the webhook is the copy to rely on.
                </p>
                <p
                  className={cn(
                    "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
                    webhookOn ? "bg-forest text-cream" : "bg-sand text-cocoa",
                  )}
                >
                  <Webhook className="h-3.5 w-3.5" aria-hidden />
                  {webhookOn ? "Webhook connected" : "Webhook not set"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border-2 border-espresso bg-blush p-5">
                <h2 className="font-heading text-lg font-extrabold text-espresso">Adding a business</h2>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-cocoa">
                  <li>Open the application and check the details.</li>
                  <li>
                    Press <strong>Copy as directory entry</strong>.
                  </li>
                  <li>
                    Paste it into <code className="rounded bg-white/70 px-1">src/content/businesses.ts</code> and follow the
                    TODO notes.
                  </li>
                  <li>
                    Set the status to <strong>Approved</strong> and email the applicant.
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

function StatLink({
  href,
  label,
  total,
  fresh,
  active,
  className,
}: {
  href: string;
  label: string;
  total: number;
  fresh: number;
  active: boolean;
  className: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-full flex-col justify-between gap-3 rounded-[1.25rem] border-2 p-4 transition-all hover:-translate-y-1",
        active ? "border-pink shadow-pop-pink" : "border-espresso",
        className,
      )}
    >
      <span className="font-heading text-sm leading-tight font-bold">{label}</span>
      <span className="flex items-end justify-between gap-2">
        <span className="font-display text-4xl leading-none">{total}</span>
        {fresh > 0 && (
          <span className="rounded-full border-2 border-espresso bg-white px-2 py-0.5 text-xs font-bold text-espresso">
            {fresh} new
          </span>
        )}
      </span>
    </Link>
  );
}

function FilterSelect({
  id,
  name,
  label,
  value,
  options,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-cocoa/80">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        key={value}
        className="h-11 appearance-none rounded-full border-2 border-espresso/20 bg-cream bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%232a1910%22%20stroke-width%3D%222.5%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-9 pl-4 text-sm font-semibold text-espresso focus:border-espresso focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
