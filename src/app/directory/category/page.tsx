import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { CategoryTiles } from "@/components/directory/CategoryTiles";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { businesses } from "@/content/businesses";
import { liveAndSampleCounts } from "@/lib/directory-search";

export const metadata: Metadata = {
  title: "Directory categories",
  description:
    "Browse Black-owned businesses in Sheffield by category: food, hair and beauty, fashion, wellbeing, trades, creative, education, finance, tech and more.",
  alternates: { canonical: "/directory/category" },
};

export default function CategoriesPage() {
  const counts = liveAndSampleCounts(businesses);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Directory", href: "/directory" }, { label: "Categories" }]}
        eyebrow="Browse the directory"
        title="Every category, all in one place"
        description="Fourteen ways into Black-owned Sheffield. Pick one to see everyone listed, or search the whole directory."
        accent="teal"
      >
        <ButtonLink href="/directory" variant="primary" icon={<Search className="h-4 w-4" />}>
          Search the directory
        </ButtonLink>
      </PageHero>
      <Section tone="cream">
        <h2 className="sr-only">Categories</h2>
        <CategoryTiles counts={counts.live} sampleCounts={counts.sample} />
      </Section>
      <CtaBand
        title="Don’t see your kind of business?"
        description="List it anyway. We’ll find the right home for it in the directory, and listing is free."
        actions={
          <ButtonLink href="/join/business" variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
            Join the directory
          </ButtonLink>
        }
      />
    </>
  );
}
