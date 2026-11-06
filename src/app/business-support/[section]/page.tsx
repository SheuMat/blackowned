import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarCheck, Lock } from "lucide-react";
import { getSupportSection, supportSections } from "@/content/support";
import { getSession, hasRole } from "@/lib/session";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/layout";
import { ResourceExplorer } from "@/components/support/ResourceExplorer";
import { SignOutButton } from "@/components/support/SignOutButton";
import { SuggestResourceForm } from "@/components/support/SuggestResourceForm";
import { SupportIcon } from "@/components/support/SupportIcon";

// Members only: verified on every request (src/proxy.ts only checks the cookie exists)
export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/business-support/[section]">): Promise<Metadata> {
  const { section: id } = await props.params;
  const section = getSupportSection(id);
  if (!section) return { title: "Business Support", robots: { index: false } };
  return {
    title: `${section.title} | Business Support`,
    description: section.description,
    robots: { index: false, follow: false },
  };
}

export default async function SupportSectionPage(props: PageProps<"/business-support/[section]">) {
  const { section: id } = await props.params;

  if (!(await hasRole("member"))) {
    redirect(`/members/login?next=${encodeURIComponent(`/business-support/${id}`)}`);
  }

  const section = getSupportSection(id);
  if (!section) notFound();

  const session = await getSession();
  const verified = section.resources.filter((r) => r.verified && r.url && /^https?:/.test(r.url)).length;
  const services = section.resources.filter((r) => r.type === "bos-service").length;

  return (
    <>
      <PageHero
        dark
        accent="pink"
        eyebrow="Members' area"
        crumbs={[{ label: "Business Support", href: "/business-support" }, { label: section.title }]}
        title={
          <span className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <span
              className="flex h-16 w-16 shrink-0 -rotate-3 items-center justify-center rounded-[1.25rem] border-2 border-cream shadow-pop-pink sm:h-20 sm:w-20"
              style={{ backgroundColor: section.color, color: section.ink }}
            >
              <SupportIcon name={section.icon} className="h-8 w-8 sm:h-10 sm:w-10" />
            </span>
            <span>{section.title}</span>
          </span>
        }
        description={section.description}
      >
        <ul className="flex flex-wrap gap-2 text-sm font-semibold">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1.5 text-espresso">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Members only
          </li>
          <li className="rounded-full border-2 border-cream/20 px-3 py-1 text-cream">
            {section.resources.length} {section.resources.length === 1 ? "resource" : "resources"}
          </li>
          {verified > 0 && (
            <li className="inline-flex items-center gap-1.5 rounded-full border-2 border-cream/20 px-3 py-1 text-cream">
              <BadgeCheck className="h-4 w-4 text-pink" aria-hidden />
              {verified} verified {verified === 1 ? "link" : "links"}
            </li>
          )}
          {services > 0 && (
            <li className="rounded-full border-2 border-cream/20 px-3 py-1 text-cream">
              {services} BOS {services === 1 ? "service" : "services"}
            </li>
          )}
        </ul>
      </PageHero>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
            <div className="min-w-0">
              <h2 className="sr-only">Resources</h2>
              <ResourceExplorer
                resources={section.resources}
                sectionId={section.id}
                sectionTitle={section.title}
                memberName={session?.name}
              />
            </div>

            <aside className="flex flex-col gap-6" aria-label="More business support">
              <div className="rounded-[1.75rem] border-2 border-espresso bg-espresso p-5 text-cream shadow-pop-pink sm:p-6">
                <CalendarCheck className="h-8 w-8 text-pink" aria-hidden />
                <h2 className="mt-3 font-heading text-xl font-extrabold">Rather talk it through?</h2>
                <p className="mt-1 text-sm text-cream/80">
                  Book a 1:1 with the team or ask us to find you a mentor. Real people, no call centres.
                </p>
                <ButtonLink href="/business-support#one-to-one" variant="pink" size="md" className="mt-4">
                  Book a 1:1
                </ButtonLink>
              </div>

              <nav aria-labelledby="areas-heading" className="rounded-[1.75rem] border-2 border-espresso/15 bg-white p-5">
                <h2 id="areas-heading" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-cocoa/80">
                  Support areas
                </h2>
                <ul className="mt-3 flex flex-col gap-1">
                  {supportSections.map((s) => {
                    const current = s.id === section.id;
                    return (
                      <li key={s.id}>
                        <Link
                          href={`/business-support/${s.id}`}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-1.5 text-[15px] font-semibold transition-colors",
                            current ? "bg-espresso text-cream" : "text-espresso hover:bg-blush",
                          )}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-espresso/20"
                            style={{ backgroundColor: s.color, color: s.ink }}
                          >
                            <SupportIcon name={s.icon} className="h-4 w-4" />
                          </span>
                          <span className="flex-1">{s.short}</span>
                          <span className={cn("text-xs font-bold", current ? "text-pink" : "text-cocoa/70")}>
                            {s.resources.length}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href="/business-support/opportunities"
                      className="flex min-h-11 items-center gap-3 rounded-xl px-2.5 py-1.5 text-[15px] font-semibold text-espresso transition-colors hover:bg-blush"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-espresso/20 bg-pink text-espresso">
                        <SupportIcon name="BriefcaseBusiness" className="h-4 w-4" />
                      </span>
                      <span className="flex-1">Business Opportunities board</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              <SuggestResourceForm sectionId={section.id} sectionTitle={section.title} defaultName={session?.name} />

              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <Link
                  href="/business-support"
                  className="inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back to the lounge
                </Link>
                <SignOutButton variant="ghost" />
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
