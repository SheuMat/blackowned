import type { CategoryId } from "./types";

/**
 * SHOP BLACK SHEFFIELD (/shop)
 *
 * Gift boxes are a CONCEPT for now: no products, prices or launch date are
 * set, and the site takes no payments. "What might be inside" stays at
 * category level on purpose, so we never imply a business has signed up to
 * supply a box when it hasn't. Interest is collected with the
 * "shop-interest" submission type.
 */

export type GiftBox = {
  id: string;
  name: string;
  /** Short line under the name */
  tagline: string;
  description: string;
  /** Category-level ideas, never specific products */
  inside: string[];
  /** Directory categories the box would draw from */
  categories: CategoryId[];
  /** Poster art */
  art: {
    box: string;
    lid: string;
    ribbon: string;
    bg: string;
    pattern: "dots" | "zigzag" | "stars" | "stripes";
    /** Big word printed on the box */
    word: string;
  };
  /** For teams / clients rather than individuals */
  corporate?: boolean;
};

export const giftBoxes: GiftBox[] = [
  {
    id: "taster",
    name: "The Sheffield Taster Box",
    tagline: "Food & treats",
    description: "A box of flavour from Black-owned kitchens, bakers and makers around the city.",
    inside: ["Sauces, spice blends and seasonings", "Baked treats and sweets", "Snacks and drinks", "A recipe card from a local cook"],
    categories: ["food-restaurants", "retail"],
    art: { box: "#ee6a35", lid: "#2a1910", ribbon: "#f6bd3c", bg: "#fadbe6", pattern: "dots", word: "Taste" },
  },
  {
    id: "self-care",
    name: "The Self-Care Box",
    tagline: "Beauty & wellbeing",
    description: "Time out in a box, put together with Black-owned beauty and wellbeing businesses.",
    inside: ["Hair and skin care", "Body butters and oils", "Candles and home scents", "A treat from a wellbeing practitioner"],
    categories: ["beauty-hair", "health-wellbeing"],
    art: { box: "#f2a0bd", lid: "#b02a62", ribbon: "#167a6f", bg: "#f5ebdd", pattern: "stars", word: "Glow" },
  },
  {
    id: "little-ones",
    name: "The Little Ones Box",
    tagline: "For children",
    description: "Books, play and bits for little people, from Black-owned children's businesses and creatives.",
    inside: ["Books with characters who look like them", "Games, puzzles and activity packs", "Clothing and accessories", "Something crafty to make together"],
    categories: ["childrens-services", "creative-industries", "fashion"],
    art: { box: "#f6bd3c", lid: "#1f2a63", ribbon: "#ee6a35", bg: "#e7f3f0", pattern: "zigzag", word: "Play" },
  },
  {
    id: "corporate",
    name: "The Corporate Gift Box",
    tagline: "For teams and clients",
    description: "Thank your team or your clients and spend with Sheffield's Black-owned businesses at the same time. Branded notes and bulk orders welcome.",
    inside: ["A mix from our other boxes", "Seasonal and Black History Month editions", "A card about every business inside", "Your own message or branding"],
    categories: ["food-restaurants", "beauty-hair", "creative-industries", "retail"],
    art: { box: "#1f2a63", lid: "#2a1910", ribbon: "#f2a0bd", bg: "#fbf0d6", pattern: "stripes", word: "Thanks" },
    corporate: true,
  },
];

export const giftBoxMap = Object.fromEntries(giftBoxes.map((b) => [b.id, b])) as Record<string, GiftBox>;

/** Directory categories featured in "Shop the directory", in order */
export const shopCategories: { id: CategoryId; title: string; blurb: string }[] = [
  { id: "retail", title: "Shops & gifts", blurb: "Grocers, gifts, homeware and online stores." },
  { id: "food-restaurants", title: "Food & treats", blurb: "Order in, eat out, or book a caterer." },
  { id: "fashion", title: "Fashion", blurb: "Clothing, accessories, tailoring and textiles." },
  { id: "beauty-hair", title: "Beauty & hair", blurb: "Products to buy and appointments to book." },
];

export const shopSteps = [
  {
    title: "Businesses sign up",
    body: "Black-owned businesses in the directory tell us what they could put in a box.",
  },
  {
    title: "We curate the boxes",
    body: "We put together themed boxes and check every item with the business that makes it.",
  },
  {
    title: "You order",
    body: "Pick a box, then choose delivery or collect it from our office at Sadacca on the Wicker.",
  },
  {
    title: "Businesses get paid",
    body: "Every business in the box is paid for what they put in. We'll publish exactly how the price splits before launch.",
  },
] as const;

export const quantityOptions = [
  { value: "1", label: "Just one" },
  { value: "2-5", label: "2 to 5" },
  { value: "6-20", label: "6 to 20" },
  { value: "21-50", label: "21 to 50" },
  { value: "50+", label: "More than 50" },
];

export const fulfilmentOptions = [
  { value: "delivery", label: "Delivery" },
  { value: "collect", label: "Collect from Sadacca" },
  { value: "either", label: "Either is fine" },
];
