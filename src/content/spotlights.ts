import { site } from "@/lib/site";
import type { Spotlight } from "./types";

/**
 * BUSINESS SPOTLIGHT
 * Newest first. The first entry is "this month's" spotlight on the homepage.
 * `sponsored: true` marks a paid/promotional spotlight package (future income stream).
 */
const allSpotlights: Spotlight[] = [
  {
    month: "2026-11",
    businessSlug: "care-cove",
    headline: "Care Cove: rebuilding futures, one young person at a time",
    intro:
      "Our first ever Business Spotlight goes to Care Cove, the Sheffield alternative provision giving young people that mainstream school can no longer reach a fresh start.",
    story: `Every young person who walks through Care Cove's door on Townhead Street has a story. Some have been excluded, some are at risk of it, and some have found the school gates impossible to face. Care Cove meets them where they are, without judgement, and builds a plan around who they can become.

What makes Care Cove stand out is how much sits under one roof: core curriculum, a Vocational Academy covering construction, digital media, enterprise and employability, a boxing academy and basketball development, and trauma-informed mentoring and therapeutic support.

They also run short breaks for disabled children and young people, giving families time to rest while children have fun, make friends and try new things.

For Black Owned Sheffield, Care Cove is exactly the kind of business we exist to celebrate: rooted in Sheffield, built around young people, and serious about what happens next for them.`,
    quote: { text: "We don't just educate. We rebuild futures.", by: "Care Cove" },
    image: "/businesses/care-cove/cover.png",
  },
  {
    month: "2026-10",
    businessSlug: "jollof-and-co-kitchen",
    headline: "Jollof & Co: the family kitchen feeding Sharrow",
    intro: "A sample spotlight showing how past features appear in the archive.",
    story: `This is sample content. Past spotlights stay on the site as a growing archive, so every featured business keeps the benefit long after its month is over.`,
    quote: { text: "Food is how we say welcome.", by: "Sample founder" },
    sample: true,
  },
  {
    month: "2026-09",
    businessSlug: "crown-and-coil",
    headline: "Crown & Coil: textured hair, done properly",
    intro: "A sample spotlight showing how past features appear in the archive.",
    story: `This is sample content. Spotlights can also be offered as paid promotional packages, with a clear "Sponsored" label.`,
    sponsored: true,
    sample: true,
  },
];

export const spotlights: Spotlight[] = site.showSampleContent
  ? allSpotlights
  : allSpotlights.filter((s) => !s.sample);

export const currentSpotlight = spotlights[0];

export function formatSpotlightMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y!, m! - 1, 1)),
  );
}
