import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, MessageSquareHeart, Newspaper, Rocket } from "lucide-react";
import { StoryCard } from "@/components/cards/StoryCard";
import { TikTokIcon } from "@/components/icons/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { PressMedia } from "@/components/stories/PressMedia";
import { SeriesStrip } from "@/components/stories/SeriesStrip";
import { StoryBrowser } from "@/components/stories/StoryBrowser";
import { TikTokPanel } from "@/components/stories/TikTokPanel";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { StripeBand } from "@/components/ui/Shapes";
import { stories } from "@/content/stories";
import { site, ogBase } from "@/lib/site";
import { cn } from "@/lib/utils";

const description =
  "Meet the people behind Sheffield's Black-owned businesses. Founder interviews, Black Business of the Month, guides, launch news, press and video from Black Owned Sheffield.";

export const metadata: Metadata = {
  title: "Stories & news",
  description,
  alternates: { canonical: "/stories" },
  openGraph: {
    ...ogBase,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/stories",
    title: `Stories & news | ${site.name}`,
    description,
  },
};

const quickLinks = [
  { href: "#latest", label: "Latest stories", Icon: ArrowDown },
  { href: "#tiktok", label: "Watch on TikTok", Icon: TikTokIcon },
  { href: "#press", label: "Press & media", Icon: Newspaper },
  { href: "/contact?subject=story", label: "Got a story?", Icon: MessageSquareHeart },
];

export default function StoriesPage() {
  const featured = stories.find((s) => s.featured) ?? stories[0];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Stories & news" }]}
        eyebrow="Stories & news"
        accent="tangerine"
        title={
          <>
            The people behind{" "}
            <span className="relative inline-block">
              <span className="relative z-10">the businesses</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 rounded-full bg-pink sm:h-4" />
            </span>
          </>
        }
        description="Founder interviews, our Black Business of the Month, guides to shopping Black-owned, launch news and the odd behind-the-scenes from the BOS team."
      >
        <ul className="flex flex-wrap gap-2">
          {quickLinks.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-espresso bg-cream px-4 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-pop-sm"
              >
                <Icon className="h-4 w-4" size={16} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      {featured && (
        <section aria-labelledby="featured-heading" className="relative -mt-6 pb-4 sm:-mt-8">
          <Container>
            <h2 id="featured-heading" className="sr-only">
              Featured story
            </h2>
            <div className="relative">
              <span className="absolute -top-4 right-5 z-10 inline-block rotate-2 rounded-xl border-2 border-espresso bg-sunflower px-3 py-1 font-display text-sm text-espresso shadow-pop-sm sm:right-8">
                Featured
              </span>
              <StoryCard
                story={featured}
                featured
                // A share-card image (text baked in) only fits a half-width panel without cropping
                // from xl up, so stack the card until then and show the image whole. The panel keeps
                // the share-card ratio as a minimum, so a taller text column only adds bands above
                // and below a contained image, never at its sides
                className={cn("shadow-pop", featured.image && "md:flex-col xl:flex-row")}
                imageClassName={featured.image ? "aspect-[1200/630] md:aspect-[1200/630] md:w-full xl:w-1/2" : undefined}
                // Full container width until it splits in half (about 608px inside the 1280px container)
                sizes={
                  featured.image
                    ? "(min-width: 1280px) 608px, 100vw"
                    : "(min-width: 1280px) 608px, (min-width: 768px) 50vw, 100vw"
                }
              />
            </div>
          </Container>
        </section>
      )}

      <Section id="latest" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Latest"
          title="Every story, newest first"
          description="Filter by series or topic. Each one links to the businesses involved, so you can go and support them."
        />
        <StoryBrowser stories={stories} featuredSlug={featured?.slug} />
      </Section>

      <StripeBand />

      <Section tone="deep" id="series">
        <SectionHeading
          eyebrow="Our regular series"
          title="Four ways we tell Black business stories"
          description="Recurring features you can follow, share and nominate for."
        />
        <SeriesStrip />
      </Section>

      <section id="tiktok" aria-labelledby="tiktok-heading" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <TikTokPanel />
        </Container>
      </section>

      <Section id="press" tone="white" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Press & media"
          title="As seen, heard and watched"
          description="Interviews, films and podcasts featuring Black Owned Sheffield since we started in 2020."
          action={
            <ButtonLink href="/contact?subject=press" variant="outline">
              Press enquiries
            </ButtonLink>
          }
        />
        <PressMedia />
      </Section>

      <CtaBand
        tone="pink"
        title="Got a story? Tell us."
        description="Opened a shop, hit a milestone, or know a founder Sheffield should meet? We'd love to hear it."
        actions={
          <>
            <ButtonLink
              href="/contact?subject=story"
              variant="primary"
              size="lg"
              className="h-auto min-h-14 py-3 whitespace-normal"
              icon={<MessageSquareHeart className="h-5 w-5 shrink-0" aria-hidden />}
            >
              Tell us your story
            </ButtonLink>
            <ButtonLink
              href="/contact?subject=launch"
              variant="cream"
              size="lg"
              className="h-auto min-h-14 border-espresso py-3 whitespace-normal"
              icon={<Rocket className="h-5 w-5 shrink-0" aria-hidden />}
            >
              Launching something? Let us know
            </ButtonLink>
          </>
        }
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Stories & news",
          description,
          url: `${site.url}/stories`,
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: stories.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/stories/${s.slug}`,
              name: s.title,
            })),
          },
        }}
      />
    </>
  );
}

