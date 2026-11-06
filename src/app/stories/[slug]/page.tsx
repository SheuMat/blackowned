import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Award, CalendarDays, Clock, Info, MessageSquareHeart, PlayCircle, Tag } from "lucide-react";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { StoryCard } from "@/components/cards/StoryCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/stories/Breadcrumbs";
import { storyCardImage } from "@/components/stories/cardFocus";
import { PodcastSeries, seriesForVideo } from "@/components/stories/PodcastSeries";
import { ShareButtons } from "@/components/stories/ShareButtons";
import { StoryPoster } from "@/components/stories/StoryPoster";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Dots, Squiggle } from "@/components/ui/Shapes";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { getBusiness } from "@/content/businesses";
import { youtubeThumb } from "@/content/media";
import { getStory, stories, storyCategoryLabel } from "@/content/stories";
import type { Business, Story } from "@/content/types";
import { estimateReadingMinutes, markdownToPlainText, MarkdownLite } from "@/lib/markdown-lite";
import { site, ogBase } from "@/lib/site";
import { cn, formatLongDate } from "@/lib/utils";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

const newsCategories: Story["category"][] = ["news", "launches", "press"];

function storyImage(story: Story) {
  return story.image ?? (story.youtubeId ? youtubeThumb(story.youtubeId) : undefined);
}

function absolute(path: string) {
  return /^https?:/.test(path) ? path : `${site.url}${path}`;
}

export async function generateMetadata(props: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };

  const image = storyImage(story);
  // Shared links to demo stories must never preview as real news
  const title = story.sample ? `Sample story: ${story.title}` : story.title;
  return {
    title,
    description: story.excerpt,
    alternates: { canonical: `/stories/${story.slug}` },
    // Sample articles are demo content: keep them out of search results
    robots: story.sample ? { index: false, follow: true } : undefined,
    openGraph: {
    ...ogBase,
      type: "article",
      locale: "en_GB",
      siteName: site.name,
      url: `/stories/${story.slug}`,
      title,
      description: story.excerpt,
      publishedTime: story.date,
      section: storyCategoryLabel[story.category],
      tags: story.tags,
      images: image
        ? [{ url: image, alt: story.imageAlt ?? story.title }]
        : ogBase.images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: story.excerpt,
      images: image ? [image] : [ogBase.images[0].url],
    },
  };
}

function moreStories(story: Story, count = 3) {
  const others = stories.filter((s) => s.slug !== story.slug);
  const same = others.filter((s) => s.category === story.category);
  const rest = others.filter((s) => s.category !== story.category);
  return [...same, ...rest].slice(0, count);
}

export default async function StoryPage(props: PageProps<"/stories/[slug]">) {
  const { slug } = await props.params;
  const story = getStory(slug);
  if (!story) notFound();

  const label = storyCategoryLabel[story.category];
  const minutes = story.readingMinutes ?? estimateReadingMinutes(story.body);
  const series = seriesForVideo(story.youtubeId);
  const businesses = (story.relatedBusinesses ?? []).map(getBusiness).filter((b): b is Business => !!b);
  const more = moreStories(story);
  const url = `${site.url}/stories/${story.slug}`;
  const image = storyImage(story);
  const isSpotlight = story.category === "business-of-the-month";

  return (
    <>
      <article>
        {/* ───────── Header ───────── */}
        <header className="grain relative overflow-hidden bg-cream-deep pt-10 pb-28 sm:pt-14 sm:pb-40">
          <Blob color="#f2a0bd" className="absolute -top-28 -right-24 h-72 w-72 opacity-60 sm:h-96 sm:w-96" />
          {/* Both sit in the side margins, clear of the breadcrumbs and the hero media */}
          <Squiggle color="#ee6a35" className="absolute top-40 left-[2.5%] hidden h-8 w-28 xl:block" />
          <Dots color="#167a6f" className="absolute right-[10%] bottom-32 hidden h-12 w-12 opacity-70 lg:block" />
          <Container className="relative max-w-5xl">
            <Breadcrumbs crumbs={[{ label: "Stories & news", href: "/stories" }, { label: story.title }]} className="mb-8" />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-cocoa">
              <Link
                href={`/stories?category=${story.category}#latest`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-espresso bg-pink px-4 font-heading font-bold text-espresso transition-transform hover:-translate-y-0.5"
              >
                {label}
              </Link>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-rose" aria-hidden />
                <time dateTime={story.date}>{formatLongDate(story.date)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                {story.youtubeId ? (
                  <PlayCircle className="h-4 w-4 text-rose" aria-hidden />
                ) : (
                  <Clock className="h-4 w-4 text-rose" aria-hidden />
                )}
                {story.youtubeId ? (series.length > 1 ? `${series.length}-part video series` : "Video") : `${minutes} min read`}
              </span>
              {story.sample && (
                <span className="rounded-full bg-espresso px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cream">
                  Sample
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl font-heading text-4xl leading-[1.02] font-extrabold text-espresso sm:text-5xl lg:text-[4.25rem]">
              {story.title}
            </h1>
            <p className="mt-6 max-w-3xl font-heading text-xl leading-snug font-medium text-cocoa sm:text-2xl">
              {story.excerpt}
            </p>
            <p className="mt-6 text-sm font-semibold text-cocoa/80">
              By {story.author ?? "the Black Owned Sheffield team"}
            </p>
          </Container>
        </header>

        {/* ───────── Hero media ───────── */}
        <Container className="relative -mt-20 max-w-5xl sm:-mt-28">
          {series.length > 1 ? (
            <div className="rounded-[2rem] border-2 border-espresso bg-white p-4 pt-7 shadow-pop sm:p-6 sm:pt-8">
              <h2 className="sr-only">Watch the series</h2>
              <PodcastSeries items={series} layout="feature" />
            </div>
          ) : story.youtubeId ? (
            <YouTubeEmbed
              id={story.youtubeId}
              start={story.youtubeStart}
              title={story.title}
              // The h1 above already names the video
              showTitle={false}
              priority
              className="rounded-[1.75rem] shadow-pop"
            />
          ) : story.image ? (
            <figure>
              <div
                className="relative aspect-[1200/630] overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-sand shadow-pop"
                style={story.imageFit === "contain" && story.imageBackground ? { background: story.imageBackground } : undefined}
              >
                <Image
                  src={story.image}
                  alt={story.imageAlt ?? ""}
                  fill
                  preload
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className={story.imageFit === "contain" ? "object-contain" : "object-cover"}
                />
              </div>
            </figure>
          ) : (
            <StoryPoster
              story={story}
              className="aspect-[16/10] rounded-[1.75rem] border-2 border-espresso shadow-pop sm:aspect-[21/9]"
            />
          )}
        </Container>

        {/* ───────── Body ───────── */}
        <Container className="max-w-5xl">
          <div className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
            <div className="min-w-0">
              {story.sample && (
                <p className="mb-8 flex items-start gap-3 rounded-2xl border-2 border-dashed border-espresso/30 bg-white px-4 py-3 text-sm text-cocoa">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
                  <span>
                    <strong className="text-espresso">Sample article.</strong> This shows how{" "}
                    {story.category === "guides" ? "guides and lists" : "stories like this"} will look on the site.
                    {businesses.some((b) => b.sample) && " The businesses mentioned are sample listings, not real businesses."}
                  </span>
                </p>
              )}

              <MarkdownLite source={story.body} dropCap className="max-w-[68ch]" />

              {(story.externalUrl || isSpotlight) && (
                <div className="mt-10 flex flex-wrap gap-3">
                  {story.externalUrl && (
                    <ButtonLink
                      href={story.externalUrl}
                      variant="primary"
                      size="lg"
                      className="h-auto min-h-14 py-3 whitespace-normal"
                      iconRight={<ArrowUpRight className="h-5 w-5" aria-hidden />}
                    >
                      {story.externalLabel ?? "Read more"}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </ButtonLink>
                  )}
                  {isSpotlight && (
                    <ButtonLink
                      href="/spotlight"
                      variant="pink"
                      size="lg"
                      icon={<Award className="h-5 w-5" aria-hidden />}
                    >
                      See the Business Spotlight
                    </ButtonLink>
                  )}
                </div>
              )}

              {story.tags && story.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t-2 border-espresso/10 pt-6">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-espresso">
                    <Tag className="h-4 w-4 text-rose" aria-hidden /> Tagged
                  </span>
                  <ul className="flex flex-wrap gap-2">
                    {story.tags.map((t) => (
                      <li key={t} className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-cocoa">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside aria-label="Share and get in touch" className="lg:pt-1">
              <div className="space-y-5 lg:sticky lg:top-24">
                <div className="rounded-[1.5rem] border-2 border-espresso bg-white p-5">
                  <h2 className="font-heading text-lg font-extrabold text-espresso">Share this story</h2>
                  <p className="mt-1 text-sm text-cocoa">Every share helps a Black-owned business get seen.</p>
                  <ShareButtons url={url} title={story.title} className="mt-4" stacked />
                </div>
                <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-sunflower p-5">
                  <Dots color="#2a1910" className="absolute -right-2 -bottom-2 h-14 w-14 opacity-20" />
                  <h2 className="relative font-heading text-lg font-extrabold text-espresso">Got a story for us?</h2>
                  <p className="relative mt-1 text-sm text-espresso/80">
                    Launches, milestones, founders we should meet. Tell us.
                  </p>
                  <Link
                    href="/contact?subject=story"
                    className="relative mt-3 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4"
                  >
                    <MessageSquareHeart className="h-4 w-4" aria-hidden /> Get in touch
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {/* ───────── Businesses in this story ───────── */}
      {businesses.length > 0 && (
        <Section tone="deep" className="py-14 sm:py-16 lg:py-20">
          <SectionHeading
            eyebrow="Support them"
            title={businesses.length === 1 ? "The business in this story" : "Businesses in this story"}
            description="Find opening hours, contact details and offers on their directory profiles."
          />
          <ul
            className={cn(
              "grid gap-6 sm:grid-cols-2",
              businesses.length >= 3 && "lg:grid-cols-3",
              businesses.length === 1 && "max-w-md sm:grid-cols-1",
            )}
          >
            {businesses.map((b) => (
              <li key={b.slug}>
                <BusinessCard business={b} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ───────── More stories ───────── */}
      {more.length > 0 && (
        <Section className="py-14 sm:py-16 lg:py-20">
          <SectionHeading
            eyebrow="Keep reading"
            title="More stories"
            action={
              <ButtonLink href="/stories" variant="outline" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                All stories
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} imageClassName={storyCardImage} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": newsCategories.includes(story.category) ? "NewsArticle" : "Article",
            headline: story.title.slice(0, 110),
            description: story.excerpt,
            datePublished: story.date,
            dateModified: story.date,
            inLanguage: "en-GB",
            articleSection: label,
            keywords: story.tags?.join(", "),
            wordCount: markdownToPlainText(story.body).split(/\s+/).filter(Boolean).length,
            image: image ? [absolute(image)] : [`${site.url}/brand/bos-logo.jpg`],
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Organization", name: story.author ?? site.name, url: site.url },
            publisher: {
              "@type": "Organization",
              name: site.legalName,
              url: site.url,
              logo: { "@type": "ImageObject", url: `${site.url}/brand/bos-logo.jpg` },
            },
            ...(businesses.length
              ? {
                  mentions: businesses.map((b) => ({
                    "@type": "LocalBusiness",
                    name: b.name,
                    url: `${site.url}/directory/${b.slug}`,
                  })),
                }
              : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Stories & news", item: `${site.url}/stories` },
              { "@type": "ListItem", position: 3, name: story.title, item: url },
            ],
          },
        ]}
      />
    </>
  );
}
