import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Map as MapIcon, Search } from "lucide-react";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { CategoryTiles } from "@/components/directory/CategoryTiles";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { BusinessMap } from "@/components/map/BusinessMap";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";
import { businesses } from "@/content/businesses";
import { categories, categoryMap } from "@/content/categories";
import type { CategoryId } from "@/content/types";
import { businessesInCategory, directoryHref, isPinnable, liveAndSampleCounts } from "@/lib/directory-search";
import { ogBase } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

function getCategoryParam(id: string) {
  return categoryMap[id as CategoryId] ?? null;
}

export async function generateMetadata({ params }: PageProps<"/directory/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryParam(category);
  if (!cat) return { title: "Category not found" };
  const title = `Black-owned ${cat.label.toLowerCase()} in Sheffield`;
  return {
    title,
    description: `${cat.description} Find Black-owned ${cat.label.toLowerCase()} businesses across Sheffield, Rotherham, Doncaster and Chesterfield.`,
    alternates: { canonical: `/directory/category/${cat.id}` },
    openGraph: {
    ...ogBase, title: `${title} | Black Owned Sheffield`, url: `/directory/category/${cat.id}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/directory/category/[category]">) {
  const { category } = await params;
  const cat = getCategoryParam(category);
  if (!cat) notFound();

  const list = businessesInCategory(businesses, cat.id);
  const pinned = list.filter(isPinnable);
  const counts = liveAndSampleCounts(businesses);
  const accent = cat.color === "#e7c39c" ? "#a8693d" : cat.color;
  const n = list.length;
  // The headline count is real listings only; samples are mentioned separately
  const live = list.filter((b) => !b.sample).length;
  const samples = n - live;

  return (
    <>
      {/* ───── Hero in the category colour ───── */}
      <section className="grain relative overflow-hidden border-b-2 border-espresso" style={{ backgroundColor: cat.color, color: cat.ink }}>
        <Sunburst color="currentColor" className="absolute -top-16 -right-10 h-64 w-64 animate-spin-slow opacity-20 sm:h-80 sm:w-80" />
        <Squiggle color="currentColor" className="absolute bottom-10 left-[8%] hidden h-10 w-32 opacity-30 md:block" />
        <Dots color="currentColor" className="absolute top-12 left-[52%] hidden h-14 w-14 opacity-25 lg:block" />
        <Container className="relative py-10 sm:py-14 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="rounded-[2rem] border-2 border-espresso bg-cream p-6 text-espresso shadow-pop sm:p-10 lg:col-span-8">
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center gap-1 text-sm text-cocoa/80">
                  <li>
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    <Link href="/directory" className="hover:underline">
                      Directory
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    <Link href="/directory/category" className="hover:underline">
                      Categories
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    <span aria-current="page" className="text-espresso">
                      {cat.label}
                    </span>
                  </li>
                </ol>
              </nav>
              <p className="inline-flex items-center gap-2 font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                Black-owned in Sheffield &amp; beyond
              </p>
              <h1 className="mt-3 font-heading text-4xl leading-[1.02] font-extrabold sm:text-5xl lg:text-6xl">{cat.label}</h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-cocoa">{cat.description}</p>
              <p className="mt-2 font-semibold text-espresso">
                {live === 0
                  ? `No ${samples > 0 ? "live " : ""}listings yet. Yours could be the first.`
                  : live === 1
                    ? "1 business listed."
                    : `${live} businesses listed.`}
                {samples > 0 && (
                  <span className="font-normal text-cocoa">
                    {" "}
                    Plus {samples} sample {samples === 1 ? "listing" : "listings"} while we&rsquo;re in preview.
                  </span>
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={directoryHref({ categories: [cat.id] })} variant="primary" icon={<Search className="h-4 w-4" />}>
                  Search and filter
                </ButtonLink>
                <ButtonLink href={`/map?category=${cat.id}`} variant="outline" icon={<MapIcon className="h-4 w-4" />}>
                  See on the map
                </ButtonLink>
              </div>
            </div>
            <div className="hidden justify-center lg:col-span-4 lg:flex">
              <span className="relative flex h-56 w-56 rotate-6 items-center justify-center rounded-[3rem] border-2 border-espresso bg-cream text-espresso shadow-pop xl:h-64 xl:w-64">
                <CategoryIcon id={cat.id} className="h-24 w-24 xl:h-28 xl:w-28" strokeWidth={1.6} />
                <span className="absolute -bottom-5 -left-6 -rotate-12 rounded-2xl border-2 border-espresso bg-pink px-4 py-1.5 font-display text-xl text-espresso shadow-pop-sm">
                  {cat.short}
                </span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Results ───── */}
      <Section tone="cream">
        {n > 0 ? (
          <>
            <SectionHeading
              eyebrow={cat.short}
              title={`Black-owned ${cat.label.toLowerCase()}`}
              description="Featured listings first, then the newest. Every business here is in or serves Sheffield, Rotherham, Doncaster or Chesterfield."
              action={
                <ButtonLink href={directoryHref({ categories: [cat.id] })} variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Filter by area or offer
                </ButtonLink>
              }
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((b, i) => (
                <li key={b.slug}>
                  <BusinessCard business={b} priority={i < 3} />
                </li>
              ))}
            </ul>

            {pinned.length > 0 && (
              <div className="mt-14">
                <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">Where to find them</h2>
                <p className="mt-2 text-cocoa">Tap a pin for contact details and directions.</p>
                <BusinessMap
                  businesses={list}
                  fitToBusinesses
                  label={`Map of Black-owned ${cat.label.toLowerCase()}`}
                  className="mt-5 h-[420px] rounded-[1.5rem] border-2 border-espresso shadow-pop-sm sm:h-[480px]"
                />
              </div>
            )}
          </>
        ) : (
          <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-dashed border-espresso/30 bg-cream-deep px-6 py-14 text-center sm:py-20">
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-espresso shadow-pop-sm"
              style={{ backgroundColor: cat.color, color: cat.ink }}
            >
              <CategoryIcon id={cat.id} className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-heading text-2xl font-extrabold sm:text-3xl">Nobody listed here yet</h2>
            <p className="mx-auto mt-3 max-w-md text-cocoa">
              Know a Black-owned business in {cat.label.toLowerCase()}? Tell us about them, or list your own. It&rsquo;s free.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact?subject=suggest" variant="pink">
                Suggest a business
              </ButtonLink>
              <ButtonLink href="/directory" variant="outline">
                Browse the directory
              </ButtonLink>
            </div>
          </div>
        )}
      </Section>

      {/* ───── Other categories ───── */}
      <Section tone="deep">
        <SectionHeading eyebrow="Keep browsing" title="Other categories" />
        <CategoryTiles counts={counts.live} sampleCounts={counts.sample} exclude={cat.id} />
      </Section>

      <CtaBand
        tone="sunflower"
        title={
          <>
            Run a <span className="whitespace-nowrap">Black-owned</span> business
            {n > 0 ? " like these" : ` in ${cat.label.toLowerCase()}`}? Get listed, free.
          </>
        }
        description="Get listed in the directory for free and get found by people across Sheffield, Rotherham, Doncaster and Chesterfield."
        actions={
          <ButtonLink href="/join/business" variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
            Join the directory
          </ButtonLink>
        }
      />
    </>
  );
}
