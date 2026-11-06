/**
 * Site-wide settings. Edit here rather than hunting through components.
 */
export const site = {
  name: "Black Owned Sheffield",
  shortName: "BOS",
  legalName: "Black Owned Sheffield CIC",
  tagline: "Sheffield's home for Black-owned business",
  description:
    "Black Owned Sheffield is a Community Interest Company and Sheffield's online hub for discovering, promoting and connecting with Black-owned businesses and the wider community across Sheffield, Rotherham, Doncaster and Chesterfield.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackownedsheffield.co.uk",
  founded: 2020,
  founders: ["Asha", "Rakaia"],
  email: "hello@blackownedsheffield.co.uk", // TODO: confirm public inbox
  office: {
    name: "Sadacca",
    address: "48 Wicker, Sheffield S3 8JB",
    lat: 53.386661,
    lng: -1.462756,
  },
  /** From Companies House (checked Nov 2026). TODO: client to confirm before launch */
  companyNumber: "16051708",
  registeredOffice: "48 Wicker, Sheffield, England S3 8JB",
  socials: {
    instagram: "https://www.instagram.com/blackownedsheffield/",
    // Checked Nov 2026: @blackownedsheffield exists and its bio matches BOS. TODO: confirm ownership with the client
    tiktok: "https://www.tiktok.com/@blackownedsheffield",
    // Northside Media's 2022 Black Expedition video links this as BOS's page. Facebook blocks automated
    // checks, so the page itself is unverified. TODO: confirm it is live and owned by the client
    facebook: "https://www.facebook.com/blackownedsheffield",
    // Channel "Black Owned Sheffield" (joined Oct 2023, one Cutlery Works video). Its description is empty,
    // so nothing on it names the CIC. TODO: confirm ownership with the client
    youtube: "https://www.youtube.com/@BlackOwnedSheffield",
  },
  /** How long we take to reply to applications and messages. TODO: confirm with the team */
  replyTime: "5 working days",
  instagramHandle: "@blackownedsheffield",
  instagramFollowers: "2.1k+",

  /**
   * Preview mode shows a slim banner explaining that sample listings and
   * events are on display. Set NEXT_PUBLIC_PREVIEW_MODE=false once real
   * content is in, and set `sample: true` items to be removed or replaced.
   */
  previewMode: process.env.NEXT_PUBLIC_PREVIEW_MODE !== "false",
  showSampleContent: process.env.NEXT_PUBLIC_SHOW_SAMPLES !== "false",
} as const;

/** The generated 1200x630 share card (src/app/opengraph-image.tsx) */
export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name}: ${site.tagline}`,
};

/**
 * Next.js merges metadata shallowly, so a page that sets `openGraph` loses the
 * root one. Spread this first in every page-level `openGraph` object:
 * `openGraph: { ...ogBase, title, url }`. A page's own `images` still win.
 */
export const ogBase = {
  type: "website" as const,
  locale: "en_GB",
  siteName: site.name,
  images: [defaultOgImage],
};

export type NavLink = { label: string; href: string; description?: string };

export const mainNav: NavLink[] = [
  { label: "Directory", href: "/directory" },
  { label: "Map", href: "/map" },
  { label: "Events", href: "/events" },
  { label: "Stories", href: "/stories" },
  { label: "Business Support", href: "/business-support" },
];

export const moreNav: NavLink[] = [
  { label: "About us", href: "/about", description: "Who we are and why we started" },
  { label: "Business Spotlight", href: "/spotlight", description: "This month's featured business" },
  { label: "Shop Black Sheffield", href: "/shop", description: "Gift boxes and things to buy" },
  { label: "Community", href: "/community", description: "Projects, youth and volunteering" },
  { label: "Our impact", href: "/impact", description: "What we've achieved so far" },
  { label: "Partners", href: "/partners", description: "Organisations we work with" },
  { label: "Work with us", href: "/work-with-us", description: "Sponsorship and partnerships" },
  { label: "Contact", href: "/contact", description: "Get in touch with the team" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Discover",
    links: [
      { label: "Business directory", href: "/directory" },
      { label: "Map of Black-owned Sheffield", href: "/map" },
      { label: "Business Spotlight", href: "/spotlight" },
      { label: "Shop Black Sheffield", href: "/shop" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { label: "Join the directory", href: "/join/business" },
      { label: "Become a member", href: "/join/member" },
      { label: "Become a partner", href: "/join/partner" },
      { label: "Volunteer with us", href: "/join/volunteer" },
      { label: "Work with us", href: "/work-with-us" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our impact", href: "/impact" },
      { label: "Community", href: "/community" },
      { label: "Partners", href: "/partners" },
      { label: "Stories & news", href: "/stories" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
