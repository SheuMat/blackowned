import type { Metadata } from "next";
import { ArrowRight, Store } from "lucide-react";
import { AboutCic } from "@/components/home/AboutCic";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { Hero } from "@/components/home/Hero";
import { JoinUs } from "@/components/home/JoinUs";
import { LatestStories } from "@/components/home/LatestStories";
import { MapTeaser } from "@/components/home/MapTeaser";
import { QuickActions } from "@/components/home/QuickActions";
import { SpotlightSection } from "@/components/home/SpotlightSection";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { splitEvents } from "@/content/events";
import { site } from "@/lib/site";

// Upcoming events roll over as dates pass
export const revalidate = 3600;

const title = `${site.name} | ${site.tagline}`;
const description =
  "Find, support and connect with Black-owned businesses across Sheffield, Rotherham, Doncaster and Chesterfield. Search the directory, explore the map, meet this month's spotlight business and come to our next event.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const { upcoming } = splitEvents(new Date());

  return (
    <>
      {/* Reveal animations start hidden; make sure content shows without JavaScript */}
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <Hero />
      <QuickActions />
      <CategoryStrip />
      <MapTeaser />
      <SpotlightSection />
      <FeaturedBusinesses />
      <UpcomingEvents events={upcoming.slice(0, 3)} />
      <LatestStories />
      <AboutCic />
      <JoinUs />
      <CtaBand
        tone="sunflower"
        className="pt-0 sm:pt-0"
        title={
          <>
            Know a <span className="whitespace-nowrap">Black-owned</span> business we should shout about?
          </>
        }
        description="Tell us about them, or add your own. Listing in the directory is free."
        actions={
          <>
            <ButtonLink href="/join/business" size="lg" icon={<Store className="h-5 w-5" aria-hidden />}>
              Add a business
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
              Recommend one
            </ButtonLink>
          </>
        }
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${site.url}/directory?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </>
  );
}
