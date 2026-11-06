/**
 * Spotlight packages. Prices are deliberately not set yet: use "Free",
 * "Coming 2027" or "Ask us" until the CIC agrees pricing.
 */
export type SpotlightPackageId = "community" | "sponsored" | "bundle";

export type SpotlightPackage = {
  id: SpotlightPackageId;
  name: string;
  price: string;
  priceNote: string;
  status: "available" | "coming";
  statusLabel: string;
  summary: string;
  features: string[];
  cta: { label: string; target: "nominate" | "enquire" };
  /** Paid features carry a "Sponsored" label when live */
  sponsored?: boolean;
};

export const spotlightPackages: SpotlightPackage[] = [
  {
    id: "community",
    name: "Community Spotlight",
    price: "Free",
    priceNote: "By nomination",
    status: "available",
    statusLabel: "Available now",
    summary: "Our monthly Business Spotlight, chosen by the BOS team from community nominations.",
    features: [
      "A full feature on this page for the month",
      "Shared across our Instagram and TikTok",
      "A permanent place in the Spotlight archive",
      "Linked to your directory profile",
    ],
    cta: { label: "Nominate a business", target: "nominate" },
  },
  {
    id: "sponsored",
    name: "Sponsored Spotlight",
    price: "Ask us",
    priceNote: "Pricing to be confirmed",
    status: "coming",
    statusLabel: "Coming 2027",
    summary: "A paid feature for businesses that want to choose their moment: a launch, an anniversary, a new season.",
    features: [
      "A Spotlight feature timed around your news",
      "Promotion across our social channels",
      "Always clearly labelled “Sponsored”",
      "Helps fund free Community Spotlights",
    ],
    cta: { label: "Register interest", target: "enquire" },
    sponsored: true,
  },
  {
    id: "bundle",
    name: "Spotlight + Event bundle",
    price: "Ask us",
    priceNote: "Pricing to be confirmed",
    status: "coming",
    statusLabel: "Coming 2027",
    summary: "Pair a Spotlight feature with a presence at one of our markets or events, online and in person.",
    features: [
      "Everything in the Sponsored Spotlight",
      "A presence at a BOS market or event",
      "Ideal for launches and seasonal campaigns",
      "Labelled “Sponsored”, always",
    ],
    cta: { label: "Register interest", target: "enquire" },
    sponsored: true,
  },
];

export const packageOptions = [
  ...spotlightPackages.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.status === "available" ? p.price.toLowerCase() : p.statusLabel.toLowerCase()})`,
  })),
  { value: "not-sure", label: "Not sure yet, tell me more" },
];
