/**
 * COMMUNITY (/community)
 *
 * Projects listed under `communityProjects` are real things Black Owned
 * Sheffield has done or is doing. Keep them factual: link to the story or
 * event that backs each one up.
 *
 * Youth programmes are framed as "what we're building": they're plans, not
 * a track record. Anything tied to a sample event is flagged `sample: true`
 * so the page can tag it.
 */

export type ArtMotif = "building" | "market" | "mic" | "spark" | "people" | "book" | "heart";

export type CommunityProject = {
  id: string;
  title: string;
  status: string;
  summary: string;
  body: string;
  href: string;
  linkLabel: string;
  /** Colour story for the poster art */
  color: string;
  accent: string;
  motif: ArtMotif;
  /** Big word on the poster art */
  word: string;
};

export const communityProjects: CommunityProject[] = [
  {
    id: "sadacca",
    title: "Sadacca Bar & our new office",
    status: "In progress",
    summary: "Helping renovate the bar at Sadacca on the Wicker and setting up our office in the building.",
    body: "Sadacca has been a home for Sheffield's African Caribbean community for decades. We're based at 48 Wicker and proud to be part of the renovation of the bar and our office space.",
    href: "/stories/sadacca-renovation",
    linkLabel: "Behind the scenes",
    color: "#1e3a2d",
    accent: "#f6bd3c",
    motif: "building",
    word: "Sadacca",
  },
  {
    id: "bhm-markets",
    title: "Black History Month markets",
    status: "2023 & 2026",
    summary: "Stalls, music, food and face painting at Cutlery Works, celebrating Black-owned business in Sheffield.",
    body: "Our Black History Month markets at Cutlery Works bring traders, families and music together in one room. The latest was on Sunday 11 October 2026.",
    href: "/events/black-owned-market-cutlery-works-2026",
    linkLabel: "See the 2026 market",
    color: "#ee6a35",
    accent: "#f2a0bd",
    motif: "market",
    word: "Market",
  },
  {
    id: "syp-bhm",
    title: "Speaking at South Yorkshire Police",
    // No year: we don't have a confirmed date for the talk (the about timeline leaves it undated too)
    status: "Black History Month",
    summary: "We were invited to present at South Yorkshire Police's Black History Month event.",
    body: "We shared the story of Black Owned Sheffield and the people we work with, and we've taken part in work connected to the Police Race Action Plan.",
    href: "/stories/south-yorkshire-police-black-history-month",
    linkLabel: "Read the story",
    color: "#1f2a63",
    accent: "#f2a0bd",
    motif: "mic",
    word: "Voices",
  },
];

export type YouthProgramme = {
  id: string;
  title: string;
  stage: string;
  body: string;
  points: string[];
  href?: string;
  linkLabel?: string;
  /** Chip and bullet colour. Espresso text sits on it, so keep it light enough for 4.5:1 */
  color: string;
  sample?: boolean;
};

export const youthProgrammes: YouthProgramme[] = [
  {
    id: "youth-enterprise-day",
    title: "Youth Enterprise Day",
    stage: "Pilot in planning",
    body: "A day for 14 to 19 year-olds to meet young founders, test an idea and pitch it. We're shaping the first one now.",
    points: ["Workshops with local founders", "A friendly pitch challenge", "Lunch on us"],
    href: "/events/youth-enterprise-day-2027",
    linkLabel: "See the event page",
    color: "#f6bd3c",
    sample: true,
  },
  {
    id: "mentoring",
    title: "Mentoring young founders",
    stage: "Planning",
    body: "Pairing young people who've started something, or want to, with business owners from the directory who've been there.",
    points: ["Matched with a local owner", "Regular check-ins", "Real introductions, not just advice"],
    href: "/join/volunteer",
    linkLabel: "Offer to mentor",
    color: "#f2a0bd",
  },
  {
    id: "school-talks",
    title: "School & college talks",
    stage: "Planning",
    body: "Founders from the directory talking to students about how they started, what went wrong, and why it's worth it.",
    points: ["Assemblies and careers days", "Small-group Q&As", "Built around your timetable"],
    href: "/join/partner",
    linkLabel: "Invite us in",
    // Tangerine rather than teal: the stage chip puts espresso text on this colour
    color: "#ee6a35",
  },
];

export type CommunityLink = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  external?: boolean;
  /** Shown as a small tag, e.g. "Members" */
  tag?: string;
};

export const employmentLinks: CommunityLink[] = [
  {
    title: "Jobs on the Business Opportunities board",
    body: "Jobs, apprenticeships, contracts and calls for suppliers, shared with members. We add new ones as we find them.",
    href: "/business-support/opportunities",
    linkLabel: "Open the board",
    tag: "Members",
  },
  {
    title: "National Careers Service",
    body: "Free careers advice, CV help and skills checks from the government's careers service.",
    href: "https://nationalcareers.service.gov.uk",
    linkLabel: "nationalcareers.service.gov.uk",
    external: true,
  },
  {
    title: "Find a job on GOV.UK",
    body: "Search vacancies across the UK, including roles in Sheffield and South Yorkshire.",
    href: "https://www.gov.uk/find-a-job",
    linkLabel: "gov.uk/find-a-job",
    external: true,
  },
  {
    title: "Local employers",
    body: "Hiring in Sheffield? Partner with us to share roles with our community and meet Black talent where it already is.",
    href: "/join/partner",
    linkLabel: "Partner with us",
  },
];

export const volunteerRoles = [
  { title: "Market day crew", body: "Set up, welcome traders and keep the day running.", icon: "Store" },
  { title: "Social media & content", body: "Help us post, film and tell business stories.", icon: "Smartphone" },
  { title: "Photography & video", body: "Capture markets, founders and community moments.", icon: "Camera" },
  { title: "Mentoring", body: "Share what you know with a young or new founder.", icon: "Sprout" },
  { title: "Admin & data", body: "Check listings, tidy records and keep the directory accurate.", icon: "ClipboardCheck" },
  { title: "Fundraising & bids", body: "Help us find and write funding bids for community work.", icon: "PiggyBank" },
] as const;

export const collaborationAudiences = [
  {
    title: "Community groups",
    body: "Running something for the community? Let's co-host, cross-promote or share a stall.",
    icon: "Users",
    color: "#f2a0bd",
  },
  {
    title: "Faith groups",
    body: "Churches, mosques and faith organisations: we'd love to bring markets, talks and support to your members.",
    icon: "HeartHandshake",
    color: "#f6bd3c",
  },
  {
    title: "Schools & colleges",
    body: "Careers days, enterprise weeks and assemblies with founders your students can relate to.",
    icon: "GraduationCap",
    color: "#167a6f",
  },
  {
    title: "Youth organisations",
    body: "Youth clubs and projects: partner with us on enterprise days, workshops and mentoring.",
    icon: "Sparkles",
    color: "#ee6a35",
  },
] as const;

/** Reliable public services. All external. */
export const communityResources: CommunityLink[] = [
  {
    title: "Sheffield City Council",
    body: "Council services, housing, benefits and support in Sheffield.",
    href: "https://www.sheffield.gov.uk",
    linkLabel: "sheffield.gov.uk",
    external: true,
  },
  {
    title: "Citizens Advice",
    body: "Free, confidential advice on money, work, housing, debt and your rights.",
    href: "https://www.citizensadvice.org.uk",
    linkLabel: "citizensadvice.org.uk",
    external: true,
  },
  {
    title: "Mind",
    body: "Mental health information, support and services near you.",
    href: "https://www.mind.org.uk",
    linkLabel: "mind.org.uk",
    external: true,
  },
  {
    title: "Benefits on GOV.UK",
    body: "Check what you could get, how to apply and how to report a change.",
    href: "https://www.gov.uk/browse/benefits",
    linkLabel: "gov.uk/browse/benefits",
    external: true,
  },
  {
    title: "Jobcentre Plus",
    body: "Help finding work and claiming benefits, including how to contact your local Jobcentre.",
    href: "https://www.gov.uk/contact-jobcentre-plus",
    linkLabel: "gov.uk/contact-jobcentre-plus",
    external: true,
  },
  {
    title: "National Careers Service",
    body: "Free careers advice for adults and young people, online and by phone.",
    href: "https://nationalcareers.service.gov.uk",
    linkLabel: "nationalcareers.service.gov.uk",
    external: true,
  },
];
