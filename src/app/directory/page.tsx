import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { CategoryTiles } from "@/components/directory/CategoryTiles";
import { DirectoryExplorer, DirectoryExplorerFromUrl } from "@/components/directory/DirectoryExplorer";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section, SectionHeading } from "@/components/ui/layout";
import { businesses } from "@/content/businesses";
import { liveAndSampleCounts } from "@/lib/directory-search";
import { ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Black business directory",
  description:
    "Find and support Black-owned businesses in Sheffield, Rotherham, Doncaster and Chesterfield. Search food, hair and beauty, trades, professional services and more. Free to list.",
  alternates: { canonical: "/directory" },
  openGraph: {
    ...ogBase,
    title: "Black business directory | Black Owned Sheffield",
    description: "Find and support Black-owned businesses across Sheffield and South Yorkshire.",
    url: "/directory",
  },
};

export default function DirectoryPage() {
  const counts = liveAndSampleCounts(businesses);
  return (
    <>
      {/* The explorer reads ?q=…&category=… on the client. The fallback is the
          same UI with no filters, so the static HTML lists every business. */}
      <Suspense fallback={<DirectoryExplorer />}>
        <DirectoryExplorerFromUrl />
      </Suspense>

      <Section id="browse" tone="deep">
        <SectionHeading
          eyebrow="Browse by category"
          title="What are you looking for?"
          description="Fourteen ways in, from food to finance. Pick a category to see everyone listed in it."
          action={
            <ButtonLink href="/map" variant="outline" icon={<MapIcon className="h-4 w-4" />}>
              See them on the map
            </ButtonLink>
          }
        />
        <CategoryTiles counts={counts.live} sampleCounts={counts.sample} />
      </Section>

      <CtaBand
        title={
          <>
            Run a <span className="whitespace-nowrap">Black-owned</span> business? Get listed, free.
          </>
        }
        description="Join the directory and get found by people across Sheffield, Rotherham, Doncaster and Chesterfield who want to spend with you."
        actions={
          <>
            <ButtonLink href="/join/business" variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Join the directory
            </ButtonLink>
            <ButtonLink href="/contact?subject=suggest" variant="cream" size="lg" className="border-espresso">
              Suggest a business
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
