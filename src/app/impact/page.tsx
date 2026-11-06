import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock3,
  FileBarChart2,
  HandHeart,
  Handshake,
  LayoutGrid,
  MapPinned,
  MessageSquareHeart,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { CategoryBars } from "@/components/impact/CategoryBars";
import { ChartCard } from "@/components/impact/ChartCard";
import { chartColors } from "@/components/impact/chartKit";
import { EventsColumns } from "@/components/impact/EventsColumns";
import { GrowthLines } from "@/components/impact/GrowthLines";
import { ReportSignup } from "@/components/impact/ReportSignup";
import { StatTile } from "@/components/impact/StatTile";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Blob, Dots, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import {
  comingSoonMetrics,
  directoryGrowth,
  eventsByYear,
  impactStats,
  listingsByCategory,
  methodology,
  type GrowthPoint,
} from "@/content/impact";
import { site, ogBase } from "@/lib/site";
import { formatLongDate } from "@/lib/utils";

// Events delivered depends on today's date, so refresh hourly
export const revalidate = 3600;

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

export const metadata: Metadata = {
  title: "Our impact",
  description:
    "How Black Owned Sheffield CIC is doing, in honest numbers: businesses in the directory, events delivered, partners and community, worked out live from the site. Plus what we'll measure in our first annual impact report.",
  alternates: { canonical: "/impact" },
  openGraph: {
    ...ogBase,
    title: "Our impact | Black Owned Sheffield",
    description: "Honest, live numbers from Sheffield's home for Black-owned business, and what we'll report on next.",
    url: "/impact",
    // Pages that set openGraph replace the inherited one, so point at the default image explicitly
    images: [ogImage],
  },
  // Likewise for twitter: without this the card shows the site-wide title and description
  twitter: {
    card: "summary_large_image",
    title: "Our impact | Black Owned Sheffield",
    description: "Honest, live numbers from Sheffield's home for Black-owned business, and what we'll report on next.",
    images: [ogImage],
  },
};

const metricIcons: Record<string, LucideIcon> = { Store, Users, HandHeart, Handshake };

export default function ImpactPage() {
  const now = new Date();
  const stats = impactStats(now);
  const byCategory = listingsByCategory();
  const byYear = eventsByYear(now);
  const growth = directoryGrowth(now);
  const showSamples = stats.hasSamples;
  const totalListings = stats.liveListings + stats.sampleListings;
  const coveredCategories = byCategory.filter((c) => (showSamples ? c.total : c.live) > 0).length;
  const lastGrowth = growth[growth.length - 1];
  const yearsLabel = `${stats.yearsSupporting}`;

  const categoryLabel = `Bar chart of directory listings by category. ${byCategory
    .filter((c) => c.total > 0)
    .map((c) => `${c.label}: ${c.total}${showSamples ? ` (${c.live} live)` : ""}`)
    .join("; ")}.`;
  const yearLabel = `Column chart of events delivered by year. ${byYear.map((y) => `${y.year}: ${y.count}`).join("; ")}.`;
  // Growth counts live listings only: sample join dates are made up, so they must never draw a trend
  const growthLabel = lastGrowth
    ? `Line chart of cumulative live directory listings by month, from ${growth[0]!.longLabel} to ${lastGrowth.longLabel}. Ends at ${lastGrowth.live} ${
        lastGrowth.live === 1 ? "listing" : "listings"
      }.`
    : "Line chart of directory growth. No live listings yet.";

  return (
    <>
      <PageHero
        crumbs={[{ label: "Our impact" }]}
        eyebrow="Research & impact"
        accent="teal"
        title={
          <>
            Our <PinkSticker className="px-4 text-[0.9em]">impact</PinkSticker>
          </>
        }
        description={
          <p>
            We&apos;re a young CIC, so we keep score honestly. Every number here is worked out live from the site, sample
            content never counts, and anything we can&apos;t measure yet is marked as coming soon.
          </p>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="#numbers" variant="primary" size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
            See the numbers
          </ButtonLink>
          <ButtonLink href="#report" variant="outline" size="lg" icon={<FileBarChart2 className="h-5 w-5" />}>
            Get the 2027 report
          </ButtonLink>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cocoa">
          <Clock3 className="h-4 w-4 text-teal" aria-hidden />
          Figures as of {formatLongDate(now.toISOString())}. Updated automatically.
        </p>
      </PageHero>
      <StripeBand />

      {/* ───────── Headline numbers ───────── */}
      <Section id="numbers" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Where we are today"
          title="The story so far, in numbers"
          description={`Since ${site.founded}, ${site.founders.join(" and ")} have grown a free Instagram page into a CIC with a directory, markets and partners across Sheffield and beyond.`}
        />
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatTile
            big
            tone="sunflower"
            icon={Store}
            value={stats.liveListings}
            label={stats.liveListings === 1 ? "Business in the directory" : "Businesses in the directory"}
            detail="Live listings from real Black-owned businesses. The directory opened in November 2026 and it's free to join."
            className="col-span-2 grain"
          >
            <div className="flex flex-wrap items-center gap-2">
              {showSamples && (
                <Badge tone="espresso" className="rounded-xl leading-snug">
                  +{stats.sampleListings} sample listings while we&apos;re in preview
                </Badge>
              )}
              <Link
                href="/join/business"
                className="inline-flex min-h-11 items-center gap-1 rounded-full px-1 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:decoration-rose"
              >
                List your business <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </StatTile>
          <StatTile
            tone="white"
            icon={LayoutGrid}
            value={stats.totalCategories}
            label="Business categories"
            detail={
              showSamples
                ? `From food to finance. ${stats.liveCategories} with a live listing so far.`
                : `From food to finance. ${stats.liveCategories} with a listing so far.`
            }
          />
          <StatTile
            tone="blush"
            icon={MapPinned}
            value={stats.towns}
            label="Towns and cities"
            detail={stats.townNames.join(", ").replace(/, ([^,]*)$/, " and $1")}
          />
          <StatTile
            tone="navy"
            icon={CalendarCheck}
            value={stats.eventsDelivered}
            label="Events delivered"
            detail={stats.firstEventYear ? `Markets, showcases and socials we've run or been part of since ${stats.firstEventYear}.` : "Our first events are on the way."}
          />
          <StatTile
            tone="white"
            icon={Clock3}
            value={yearsLabel}
            label="Years supporting Black business"
            detail={`Since ${site.founded}, when it all started with one question: what can we do to help?`}
          />
          <StatTile
            tone="pink"
            icon={InstagramIcon}
            value={stats.instagram}
            label="Instagram community"
            detail="People following us on Instagram, where it all began."
          />
          <StatTile
            tone="espresso"
            icon={Handshake}
            value={stats.partnerships}
            label="Organisations we've worked with or been featured by"
            detail="Venues, community groups, public bodies and the media."
          >
            <Link
              href="/partners"
              className="inline-flex min-h-11 items-center gap-1 font-heading text-sm font-bold text-pink underline decoration-2 underline-offset-4 hover:decoration-sunflower"
            >
              Meet them <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </StatTile>
        </dl>
      </Section>

      {/* ───────── Charts ───────── */}
      <Section tone="deep" className="overflow-hidden">
        <Dots color="#167a6f" className="absolute top-12 right-6 hidden h-14 w-14 opacity-50 sm:block" />
        <SectionHeading
          eyebrow="The detail"
          title="How the directory and events are growing"
          description="Hover, tap or use your arrow keys on a chart for the breakdown. These charts redraw themselves whenever the directory or events change."
        />
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <ChartCard
            id="chart-categories"
            className="lg:row-span-2"
            title="Directory listings by category"
            subtitle={
              showSamples
                ? `${totalListings} listings across ${coveredCategories} of ${stats.totalCategories} categories, biggest first.`
                : `${stats.liveListings} listings across ${coveredCategories} of ${stats.totalCategories} categories, biggest first.`
            }
            legend={
              showSamples
                ? [
                    { label: "Live listings", color: chartColors.live },
                    { label: "Sample listings", color: chartColors.sample },
                  ]
                : undefined
            }
            note={
              showSamples
                ? "Includes sample listings while in preview. Sample listings are fictional and show how the directory will look; only live listings count in our headline numbers."
                : "Each business is counted once, in its main category."
            }
            table={{
              caption: "Directory listings by category",
              columns: showSamples ? ["Category", "Live listings", "Sample listings", "Total"] : ["Category", "Listings"],
              rows: byCategory.map((c) => (showSamples ? [c.label, c.live, c.sample, c.total] : [c.label, c.live])),
            }}
          >
            <CategoryBars data={byCategory} showSamples={showSamples} label={categoryLabel} />
          </ChartCard>

          <ChartCard
            id="chart-events"
            title="Events delivered by year"
            subtitle={`${stats.eventsDelivered} markets, showcases and socials we've run or been part of${stats.firstEventYear ? ` since ${stats.firstEventYear}` : ""}.`}
            note="Counts events that have already happened. Upcoming events join the chart once they're done."
            table={{
              caption: "Events delivered by year",
              columns: ["Year", "Events", "Which events"],
              rows: byYear.map((y) => [String(y.year), y.count, y.titles.join(", ") || "None"]),
            }}
          >
            {byYear.length > 0 ? (
              <EventsColumns data={byYear} label={yearLabel} />
            ) : (
              <p className="text-sm text-cocoa">Our first events are coming soon.</p>
            )}
          </ChartCard>

          <ChartCard
            id="chart-growth"
            title="Directory growth"
            subtitle={
              lastGrowth
                ? `Live listings at the end of each month: ${lastGrowth.live} so far.`
                : "Listings will appear here as businesses join."
            }
            note={
              showSamples
                ? "Live listings only, counted by the month each business joined. Sample listings are left out of this chart."
                : "Counted by the month each business joined the directory."
            }
            table={{
              caption: "Cumulative live directory listings by month",
              columns: ["Month", "Live listings"],
              rows: growth.map((g) => [g.longLabel, g.live]),
            }}
          >
            {growth.length > 1 ? (
              <GrowthLines data={growth} label={growthLabel} />
            ) : (
              <GrowthEarly first={growth[0]} />
            )}
          </ChartCard>
        </div>
      </Section>

      {/* ───────── Coming in the first report ───────── */}
      <Section>
        <SectionHeading
          eyebrow="Coming in our first impact report"
          title="What we'll measure next"
          description="These are the numbers that matter most, and we won't guess them. We're starting to measure this in 2026/27, and the results go in our first annual report."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comingSoonMetrics.map((m, i) => {
            const Icon = metricIcons[m.icon] ?? Store;
            const accents = ["#f6bd3c", "#f2a0bd", "#167a6f", "#ee6a35"];
            return (
              <li
                key={m.title}
                className="relative flex flex-col overflow-hidden rounded-[1.5rem] border-2 border-dashed border-espresso/40 bg-white p-6"
              >
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso"
                  style={{ backgroundColor: accents[i % accents.length] }}
                >
                  <Icon className="h-6 w-6 text-espresso" />
                </span>
                <p className="mt-5 font-display text-4xl leading-none text-espresso/25" aria-hidden>
                  ?
                </p>
                <h3 className="mt-3 font-heading text-lg font-extrabold leading-snug text-espresso">{m.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{m.body}</p>
                <p className="mt-auto pt-5">
                  <Badge tone="pink">Measuring from 2026/27</Badge>
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ───────── How we measure ───────── */}
      <Section tone="sand" className="overflow-hidden">
        <Squiggle color="#ee6a35" className="absolute top-10 right-8 hidden h-10 w-32 md:block" />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              className="mb-0 sm:mb-0"
              eyebrow="How we measure"
              title="Our rules for counting"
              description="Funders, partners and the community should be able to trust every number we publish. These are the rules we hold ourselves to."
            />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {methodology.map((m, i) => (
              <li key={m.title} className="rounded-[1.25rem] border-2 border-espresso bg-cream p-5">
                <span className="font-display text-2xl leading-none text-rose-ink" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-lg font-extrabold text-espresso">{m.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-cocoa">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ───────── Annual report ───────── */}
      <section id="report" aria-labelledby="report-title" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-espresso px-6 py-10 text-cream shadow-pop sm:px-12 sm:py-14">
            <Sunburst
              color="#f6bd3c"
              className="absolute -top-16 -right-16 h-36 w-36 animate-spin-slow opacity-90 sm:-top-12 sm:-right-12 sm:h-56 sm:w-56"
            />
            <Blob color="#55321f" className="absolute -bottom-24 -left-20 h-72 w-72 opacity-70" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <Badge tone="sunflower">Coming 2027</Badge>
                <h2 id="report-title" className="mt-4 font-heading text-3xl font-extrabold leading-[1.05] sm:text-5xl">
                  Our first annual impact report:{" "}
                  <ToneText onDark className="text-[1.05em]">
                    2027
                  </ToneText>
                </h2>
                <p className="mt-4 max-w-lg text-lg text-cream/80">
                  A full look at 2026/27: who we supported, what changed, what didn&apos;t work, and what we&apos;ll do next.
                  Register and we&apos;ll send it to you the day it&apos;s out.
                </p>
              </div>
              <div className="rounded-[1.5rem] border-2 border-cream/15 bg-espresso/60 p-5 backdrop-blur sm:p-7">
                <ReportSignup />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        tone="pink"
        className="pt-0 sm:pt-0"
        title="Have we helped your business? Tell us"
        description="A new customer, a grant, a stall that sold out? Your story is the best evidence we have, and it helps us win support for the next business."
        actions={
          <>
            <ButtonLink href="/contact?subject=story" variant="primary" size="lg" icon={<MessageSquareHeart className="h-5 w-5" />}>
              Share your story
            </ButtonLink>
            <ButtonLink href="/join/business" variant="outline" size="lg">
              Join the directory
            </ButtonLink>
          </>
        }
      />
    </>
  );
}

/**
 * Shown until there are two months of live listings to draw a line between.
 * One point is not a trend, so we say where things stand instead.
 */
function GrowthEarly({ first }: { first?: GrowthPoint }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-start justify-center rounded-[1.25rem] border-2 border-dashed border-espresso/30 bg-cream p-5 sm:p-6">
      {first ? (
        <>
          <p className="font-display text-5xl leading-none text-espresso">{first.live}</p>
          <p className="mt-2 font-heading text-base font-bold text-espresso">
            {first.live === 1 ? "Live listing" : "Live listings"} in {first.longLabel}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-cocoa">
            The directory only opened this month, so there&apos;s no trend to show yet. The line starts once we have a
            second month of listings.
          </p>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-cocoa">
          No live listings yet. The line starts as businesses join.
        </p>
      )}
    </div>
  );
}
