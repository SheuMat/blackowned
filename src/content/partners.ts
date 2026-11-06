import type { Partner } from "./types";

/**
 * Organisations we've worked with or been featured by.
 * Drop logo files into /public/partners/<slug>.svg|png and set `logo`.
 * Until then a styled wordmark is shown. Confirm each one is happy to be listed.
 */
export const partners: Partner[] = [
  {
    slug: "sadacca",
    name: "Sadacca",
    kind: "community",
    description:
      "Sheffield & District African Caribbean Community Association on the Wicker. Home to our office and the bar we're helping renovate.",
    url: "https://www.sadacca.co.uk",
    wordmark: "SADACCA",
    color: "#1e3a2d",
  },
  {
    slug: "cutlery-works",
    name: "Cutlery Works",
    kind: "venue",
    description: "Sheffield's food hall in Neepsend and host of our Black History Month markets in 2023 and 2026.",
    url: "https://www.cutleryworks.co.uk",
    wordmark: "Cutlery Works",
    color: "#2a1910",
  },
  {
    slug: "events-central",
    name: "Events Central",
    kind: "venue",
    description: "The Fargate venue where we held our first pop-up market and our 2022 festive market.",
    wordmark: "Events Central",
    color: "#1f2a63",
  },
  {
    slug: "south-yorkshire-police",
    name: "South Yorkshire Police",
    kind: "public-sector",
    description: "We presented at their Black History Month event and have taken part in work connected to the Police Race Action Plan.",
    url: "https://www.southyorks.police.uk",
    wordmark: "South Yorkshire Police",
    color: "#1f2a63",
  },
  {
    slug: "northside-media",
    name: "Northside Media",
    kind: "media",
    description: "Filmed our first market at Events Central for Northside Media TV.",
    wordmark: "Northside Media",
    color: "#ee6a35",
  },
  {
    slug: "exposed-magazine",
    name: "Exposed Magazine",
    kind: "media",
    description: "Sheffield's culture magazine, which interviewed our co-founders in 2022.",
    url: "https://www.exposedmagazine.co.uk",
    wordmark: "EXPOSED",
    color: "#2a1910",
  },
  {
    slug: "daily-devotion-podcast",
    name: "Daily Devotion Podcast",
    kind: "media",
    description: "Hosted our co-founders for a three-part conversation about building Black Owned Sheffield.",
    wordmark: "Daily Devotion",
    color: "#b02a62",
  },
];

export const partnerKinds: Record<Partner["kind"], string> = {
  venue: "Venues",
  media: "Media & press",
  "public-sector": "Public sector",
  community: "Community",
  business: "Business",
  funder: "Funders",
};
