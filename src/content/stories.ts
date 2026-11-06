import { site } from "@/lib/site";
import type { Story, StoryCategory } from "./types";

export const storyCategories: { id: StoryCategory; label: string }[] = [
  { id: "meet-the-founder", label: "Meet the Founder" },
  { id: "business-of-the-month", label: "Black Business of the Month" },
  { id: "guides", label: "Guides & lists" },
  { id: "launches", label: "Launches" },
  { id: "community", label: "Community" },
  { id: "press", label: "Press" },
  { id: "video", label: "Video" },
  { id: "news", label: "News" },
];

export const storyCategoryLabel = Object.fromEntries(storyCategories.map((c) => [c.id, c.label])) as Record<
  StoryCategory,
  string
>;

/**
 * STORIES & NEWS
 * Body format: blank-line paragraphs, "## " headings, "> " quotes, "- " bullet lines.
 * Link TikTok videos with `externalUrl` until we embed them.
 */
const allStories: Story[] = [
  {
    slug: "spotlight-care-cove",
    title: "Business Spotlight: Care Cove",
    category: "business-of-the-month",
    date: "2026-11-01",
    excerpt:
      "Our first Business Spotlight goes to Care Cove, the Sheffield alternative provision giving young people a fresh start through learning, sport and practical skills.",
    body: `Our first ever Business Spotlight goes to Care Cove, an alternative provision on Townhead Street in Sheffield city centre.

## Who they support

Care Cove works with young people from Key Stage 3 to post-16 who are excluded, at risk of exclusion, or struggling to attend school. That includes young people with SEND and social, emotional and mental-health needs, and those with emotionally based school avoidance.

## What happens there

- Core curriculum built around each young person's gaps and goals
- A Vocational Academy: construction, digital media, enterprise and employability
- Boxing, basketball development and strength & conditioning
- Trauma-informed mentoring, key workers and therapeutic support
- Short breaks for disabled children and young people

> We don't just educate. We rebuild futures.

## Get in touch

Schools, local authorities and virtual schools can make a referral, and parents and carers are welcome to ask. Find Care Cove's full profile in our directory.`,
    image: "/businesses/care-cove/cover.png",
    imageAlt: "Care Cove Alternative Provision: We don't just educate. We rebuild futures.",
    // A 1200x630 share card with text on it: letterbox it rather than crop
    imageFit: "contain",
    imageBackground: "linear-gradient(180deg, #fbfaf6 0 50%, #1f3b2c 50% 100%)",
    relatedBusinesses: ["care-cove"],
    tags: ["Spotlight", "Education", "Young people"],
    readingMinutes: 3,
    featured: true,
  },
  {
    slug: "black-history-month-market-2026",
    title: "Black Owned Market returns to Cutlery Works for Black History Month",
    category: "news",
    date: "2026-10-12",
    excerpt:
      "Stalls, cocktails, music, entertainment and face painting: our Black History Month market at Cutlery Works on Sunday 11 October.",
    body: `We were back at Cutlery Works on Sunday 11 October, from 12pm to 6pm, celebrating Black-owned businesses in Sheffield this Black History Month.

There were stalls, cocktails, music, entertainment, face painting and plenty more on the day. Thank you to every trader and every person who came down.

Missed it? Join our mailing list or follow us on Instagram to hear about our next market first.`,
    tags: ["Markets", "Black History Month"],
    readingMinutes: 1,
  },
  {
    slug: "meet-the-founders-asha-and-rakaia",
    title: "Meet the Founders: Asha and Rakaia",
    category: "meet-the-founder",
    date: "2026-11-01",
    excerpt:
      "How two friends turned a question in 2020 (“what can we do to help?”) into Sheffield's home for Black-owned business.",
    body: `Black Owned Sheffield started in 2020, in the weeks after the murder of George Floyd. Like a lot of people, co-founders Asha and Rakaia asked themselves what they could actually do to help the Black community, beyond the protests.

Their answer was close to home: give Black-owned businesses in Sheffield a platform, for free.

## From an Instagram page to a market on Fargate

It started with Instagram and Facebook. Businesses messaged, the team posted them with photos and a description, and then they'd check back. Sometimes a business had gained 30 new followers. As Asha told Exposed Magazine, even something small like that feels great.

Next came events. Their first pop-up at Events Central on Fargate ran from 11am to 7pm, and the night before they were convinced nobody would turn up. It was busy all day.

## Where next

The goal hasn't changed: encourage the next generation to feel confident starting a business, and make sure there's a community there to back them. That now means a CIC, a directory, a calendar of events, and support with grants and growth.

> You can do it, and there's a community for people to network with here.

Read the [original interview in Exposed Magazine](/stories/exposed-magazine-interview-2022), or listen to the [three-part Daily Devotion Podcast conversation](/stories/daily-devotion-podcast-series).`,
    tags: ["Founders", "Our story"],
    externalUrl: "https://www.exposedmagazine.co.uk/arts-culture/providing-a-platform-interview-with-owners-of-black-owned-sheffield/",
    externalLabel: "Read the Exposed Magazine interview",
    readingMinutes: 3,
    featured: true,
  },
  {
    slug: "daily-devotion-podcast-series",
    title: "Listen: Black Owned Sheffield on the Daily Devotion Podcast",
    category: "video",
    date: "2022-12-04",
    excerpt: "A three-part conversation about why we started, working as a team, and why you should just do it.",
    body: `Our co-founders sat down with the Daily Devotion Podcast for a three-part conversation.

- Part 1: “We Wanted To Do More For Black Business”
- Part 2: “We Are So In Sync”
- Part 3: “Just DO It”

Watch all three on this page.`,
    youtubeId: "R1KtvbOwWG4",
    youtubeStart: 210,
    tags: ["Podcast", "Founders"],
    readingMinutes: 1,
  },
  {
    slug: "sadacca-renovation",
    title: "Behind the scenes: renovating Sadacca Bar and our new office",
    category: "community",
    date: "2026-11-01",
    excerpt: "We're helping renovate the bar at Sadacca on the Wicker and setting up our office in the building.",
    body: `Sadacca on the Wicker has been a home for Sheffield's African Caribbean community for decades. We're proud to be based there, and to be part of the renovation of the bar and our new office space.

We'll share the full before-and-after soon. In the meantime, follow along on Instagram.`,
    tags: ["Sadacca", "Behind the scenes"],
    readingMinutes: 1,
  },
  {
    slug: "south-yorkshire-police-black-history-month",
    title: "Presenting at South Yorkshire Police's Black History Month event",
    category: "community",
    // No confirmed date for the talk yet: dated to the site launch until the client confirms
    date: "2026-11-01",
    excerpt: "We were invited to talk about Black Owned Sheffield and the community we serve.",
    body: `We were invited to present at South Yorkshire Police's Black History Month event, sharing the story of Black Owned Sheffield and the businesses and people we work with.`,
    tags: ["Black History Month", "Partnerships"],
    readingMinutes: 1,
  },
  {
    slug: "black-expedition-2022-video",
    title: "Watch: our first market at Events Central, Fargate",
    category: "video",
    date: "2022-10-31",
    excerpt: "Northside Media filmed Black Expedition 2022, our first pop-up showcasing Black-owned businesses on Fargate.",
    body: `Where it all started. Northside Media came down to film our first market at Events Central on Fargate, Black Expedition 2022.`,
    youtubeId: "Ynx7h2ijapE",
    tags: ["Markets", "Video"],
    readingMinutes: 1,
  },
  {
    slug: "exposed-magazine-interview-2022",
    title: "In the press: “Providing a Platform” in Exposed Magazine",
    category: "press",
    date: "2022-12-08",
    excerpt:
      "Ahead of our festive pop-up on Fargate, Exposed Magazine interviewed our co-founders about how the platform has grown since 2020.",
    body: `Exposed Magazine spoke to co-founders Asha and Rakaia ahead of our 2022 festive market at Events Central, about how Black Owned Sheffield started, what we'd been up to, and our goals for the future.`,
    externalUrl: "https://www.exposedmagazine.co.uk/arts-culture/providing-a-platform-interview-with-owners-of-black-owned-sheffield/",
    externalLabel: "Read the full interview",
    tags: ["Press"],
    readingMinutes: 1,
  },
  {
    slug: "five-black-owned-businesses-to-discover",
    title: "5 Black-owned businesses to discover in Sheffield this winter",
    category: "guides",
    date: "2026-11-03",
    excerpt: "Cake, catering, a new look and a website: our picks to support this season. (Sample article.)",
    body: `This is a sample guide showing how list-style articles link straight to directory profiles.

## 1. Sweet Sorrel Bakery
Rum cake, black cake and patties to order.

## 2. Jollof & Co Kitchen
Party jollof for your Christmas do.

## 3. Crown & Coil Hair Studio
Protective styles before the holidays.

## 4. Kente & Co Threads
Occasion wear with West African prints.

## 5. Ubuntu Digital
Get your website sorted for the new year.`,
    relatedBusinesses: ["sweet-sorrel-bakery", "jollof-and-co-kitchen", "crown-and-coil", "kente-and-co-threads", "ubuntu-digital"],
    tags: ["Guides", "Shop local"],
    readingMinutes: 2,
    sample: true,
  },
];

export const stories: Story[] = (site.showSampleContent ? allStories : allStories.filter((s) => !s.sample)).sort(
  (a, b) => b.date.localeCompare(a.date),
);

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}
