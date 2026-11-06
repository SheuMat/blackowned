import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BadgeCheck, ExternalLink, HeartHandshake, Landmark, Lock } from "lucide-react";
import { openOpportunities, opportunities } from "@/content/opportunities";
import { getSession, hasRole } from "@/lib/session";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Eyebrow } from "@/components/ui/layout";
import { requestNow } from "@/components/support/deadline";
import { OpportunityBoard } from "@/components/support/OpportunityBoard";
import { ShareOpportunityForm } from "@/components/support/ShareOpportunityForm";
import { SignOutButton } from "@/components/support/SignOutButton";

// Members only: verified on every request (src/proxy.ts only checks the cookie exists)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business Opportunities | Business Support",
  description:
    "Contracts, tenders, jobs, grants and opportunities for Black-owned businesses across Sheffield and South Yorkshire, kept up to date by the Black Owned Sheffield team.",
  robots: { index: false, follow: false },
};

const tenderPortals = [
  {
    name: "Contracts Finder",
    href: "https://www.gov.uk/contracts-finder",
    body: "Public sector contracts in England, including lower-value work that suits smaller suppliers.",
  },
  {
    name: "Find a Tender",
    href: "https://www.find-tender.service.gov.uk",
    body: "The UK government's service for public procurement notices. Set up alerts for your sector.",
  },
];

export default async function OpportunitiesPage() {
  if (!(await hasRole("member"))) {
    redirect(`/members/login?next=${encodeURIComponent("/business-support/opportunities")}`);
  }

  const session = await getSession();
  const now = requestNow();
  const openCount = openOpportunities(now).length;
  const hasSamples = opportunities.some((o) => o.sample);

  return (
    <>
      <PageHero
        dark
        accent="pink"
        eyebrow="Members' area"
        crumbs={[{ label: "Business Support", href: "/business-support" }, { label: "Business Opportunities" }]}
        title="Business Opportunities"
        description="Contracts, tenders, jobs, grants and call-outs for Black-owned businesses across Sheffield and South Yorkshire. Spotted something? Share it with the community."
      >
        <ul className="flex flex-wrap gap-2 text-sm font-semibold">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1.5 text-espresso">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Members only
          </li>
          <li className="rounded-full bg-sunflower px-3 py-1.5 text-espresso">
            <span className="font-display">{openCount}</span> open now
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border-2 border-cream/20 px-3 py-1 text-cream">
            <HeartHandshake className="h-4 w-4 text-pink" aria-hidden />
            Kept up to date by the BOS team
          </li>
        </ul>
      </PageHero>

      <section className="py-12 sm:py-16">
        <Container>
          {hasSamples && (
            <p className="mb-6 rounded-2xl border-2 border-dashed border-espresso/25 bg-cream-deep px-4 py-3 text-sm text-cocoa">
              <strong className="font-heading text-espresso">Preview:</strong> listings marked Sample are fictional
              examples showing how the board works. Real opportunities will appear here as we find them.
            </p>
          )}
          <h2 className="sr-only">All opportunities</h2>
          <OpportunityBoard opportunities={opportunities} now={now} />
        </Container>
      </section>

      <section className="bg-cream-deep py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div>
              <Eyebrow>Public sector tenders</Eyebrow>
              <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] text-espresso sm:text-4xl">
                Go after the big contracts too
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cocoa">
                Councils, the NHS, universities and government departments buy from small businesses. These are the
                official places to search and set up alerts.
              </p>
              <ul className="mt-6 flex flex-col gap-4">
                {tenderPortals.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-[1.5rem] border-2 border-espresso bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-pop"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-espresso bg-navy text-cream">
                        <Landmark className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-heading text-lg font-extrabold text-espresso">{p.name}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                            <BadgeCheck className="h-4 w-4 text-teal" aria-hidden />
                            Verified link
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-cocoa">{p.body}</span>
                        <span className="mt-2 inline-flex items-center gap-1 font-heading text-sm font-bold text-rose-ink">
                          Search on GOV.UK
                          <ExternalLink className="h-4 w-4" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-cocoa">
                New to tendering? Book a{" "}
                <Link href="/business-support#one-to-one" className="font-semibold text-rose-ink underline underline-offset-4">
                  1:1 session
                </Link>{" "}
                and we&apos;ll help you work out if a contract is worth bidding for.
              </p>
            </div>
            <ShareOpportunityForm defaultName={session?.name} />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/business-support"
              className="inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to the lounge
            </Link>
            <SignOutButton />
          </div>
        </Container>
      </section>
    </>
  );
}
