import { site } from "@/lib/site";

/**
 * BUSINESS OPPORTUNITIES BOARD (members only: /business-support/opportunities)
 *
 * This board will be kept up to date by volunteers. To add an opportunity,
 * copy an entry, give it a unique `id`, and fill in the details from the
 * organisation's own advert. Always link `url` to the original advert or
 * application page, and copy the deadline exactly (ISO date with UK offset:
 * +00:00 in winter, +01:00 in summer). Closed opportunities drop to the
 * bottom of the board automatically; delete them after a month or so.
 *
 * Every entry below is SAMPLE content with fictional organisations, there to
 * show how the board works. Replace them with real opportunities before
 * launch (or set NEXT_PUBLIC_SHOW_SAMPLES=false to hide them).
 */

export type OpportunityKind = "contract" | "tender" | "job" | "opportunity" | "grant";

export type Opportunity = {
  id: string;
  title: string;
  kind: OpportunityKind;
  organisation: string;
  location: string;
  /** Contract value, salary or cost, as the advert states it */
  value?: string;
  /** ISO date-time the opportunity closes */
  deadline: string;
  description: string;
  /** A few key facts, shown when someone opens the card */
  details?: string[];
  /** Link to the original advert. Sample entries have none. */
  url?: string;
  /** ISO date it was added to the board */
  posted: string;
  sample?: boolean;
};

export const opportunityKinds: { id: OpportunityKind; label: string; plural: string; color: string; ink: string }[] = [
  { id: "contract", label: "Contract", plural: "Contracts", color: "#1e3a2d", ink: "#fbf5ec" },
  { id: "tender", label: "Tender", plural: "Tenders", color: "#1f2a63", ink: "#fbf5ec" },
  { id: "job", label: "Job", plural: "Jobs", color: "#f6bd3c", ink: "#2a1910" },
  { id: "opportunity", label: "Opportunity", plural: "Opportunities", color: "#f2a0bd", ink: "#2a1910" },
  { id: "grant", label: "Grant", plural: "Grants", color: "#ee6a35", ink: "#2a1910" },
];

export const opportunityKindMap = Object.fromEntries(opportunityKinds.map((k) => [k.id, k])) as Record<
  OpportunityKind,
  (typeof opportunityKinds)[number]
>;

const allOpportunities: Opportunity[] = [
  {
    id: "sample-brand-photographer-spring-campaign",
    title: "Brand photographer for a spring campaign",
    kind: "contract",
    organisation: "Riverside Living Homes",
    location: "Rotherham",
    value: "£2,500 fixed fee",
    deadline: "2026-11-10T17:00:00+00:00",
    description:
      "A housing provider wants a local photographer to shoot residents, neighbourhoods and staff for a spring campaign. Two shoot days plus a set of edited images. A portfolio of people photography is essential.",
    details: ["Two shoot days in February 2027", "Usage rights for print and social media", "Send a portfolio link and day rate"],
    posted: "2026-10-27",
    sample: true,
  },
  {
    id: "sample-meet-the-buyer-day",
    title: "Meet the buyer: supplier diversity day",
    kind: "opportunity",
    organisation: "Northern Buyers' Forum",
    location: "Sheffield, Kelham Island",
    value: "Free to attend",
    deadline: "2026-11-14T12:00:00+00:00",
    description:
      "Ten-minute one-to-one meetings with procurement teams from large local organisations that want more diverse supply chains. Bring a one-page summary of what you do and who you've done it for.",
    details: ["Meetings on Thursday 26 November 2026", "Places allocated by sector", "One-page capability statement required"],
    posted: "2026-10-20",
    sample: true,
  },
  {
    id: "sample-website-refresh-family-charity",
    title: "Website refresh for a family support charity",
    kind: "contract",
    organisation: "Hillside Family Hub",
    location: "Chesterfield (remote friendly)",
    value: "£4,000–£6,000",
    deadline: "2026-11-18T17:00:00+00:00",
    description:
      "A small charity needs a designer-developer to rebuild its website on a platform staff can update themselves, with accessible design and an events calendar.",
    details: ["Accessible design to WCAG 2.2 AA", "Staff training included in the scope", "Launch by March 2027"],
    posted: "2026-10-22",
    sample: true,
  },
  {
    id: "sample-community-events-coordinator",
    title: "Community Events Coordinator (part-time)",
    kind: "job",
    organisation: "Fiveways Youth Collective",
    location: "Sheffield (hybrid)",
    value: "£25,000 pro rata · 22.5 hours a week",
    deadline: "2026-11-21T23:59:00+00:00",
    description:
      "Plan and deliver a year-round programme of youth events, from open mic nights to enterprise days. You'll work with young people aged 14 to 25, volunteers and local businesses.",
    details: ["18-month fixed term", "Some evening and weekend work", "Lived experience of the communities served is welcomed"],
    posted: "2026-10-29",
    sample: true,
  },
  {
    id: "sample-pop-up-shop-units",
    title: "Pop-up shop units for independent makers",
    kind: "opportunity",
    organisation: "Canal Wharf Market Hall",
    location: "Doncaster",
    value: "First month rent-free",
    deadline: "2026-11-28T17:00:00+00:00",
    description:
      "Short-term retail units for makers, food producers and designers in a busy market hall, from January 2027. Ideal if you trade online or at markets and want to test a physical shop.",
    details: ["Lets from one to three months", "Shared card machines and Wi-Fi", "Group launch event for new traders"],
    posted: "2026-10-31",
    sample: true,
  },
  {
    id: "sample-apprentice-barber",
    title: "Apprentice Barber",
    kind: "job",
    organisation: "Crown & Clippers Barbershop",
    location: "Sheffield city centre",
    value: "Apprentice wage, reviewed after year one",
    deadline: "2026-11-30T18:00:00+00:00",
    description:
      "A busy barbershop is looking for an apprentice who's keen to learn fades, beard work and proper customer care, with training towards a Level 2 qualification.",
    details: ["Full-time, Tuesday to Saturday", "No experience needed, just the right attitude", "Ages 16 and over"],
    posted: "2026-11-01",
    sample: true,
  },
  {
    id: "sample-catering-framework",
    title: "Catering suppliers for community events",
    kind: "tender",
    organisation: "Pennine Community Venues Trust",
    location: "Sheffield and Rotherham",
    value: "Est. £15,000–£25,000 a year",
    deadline: "2026-12-04T12:00:00+00:00",
    description:
      "A community venues charity is building a list of local caterers for weddings, wakes, conferences and community events across four venues. Small and new caterers are encouraged to bid for one or more lots.",
    details: ["Three-year framework", "Lots for hot food, buffets and drinks", "Food hygiene rating of 4 or 5 required"],
    posted: "2026-10-30",
    sample: true,
  },
  {
    id: "sample-community-centre-cleaning",
    title: "Cleaning services for three community centres",
    kind: "tender",
    organisation: "Don Valley Community Partnership",
    location: "Sheffield (S3, S4 and S9)",
    value: "Est. £40,000 over two years",
    deadline: "2026-12-11T12:00:00+00:00",
    description:
      "Regular cleaning, deep cleans and event turnarounds for three busy community centres in the east of the city. Open to small firms and to businesses bidding together.",
    details: ["Two-year contract, with an option to extend", "Real Living Wage employers preferred", "Site visits on 20 and 21 November 2026"],
    posted: "2026-10-25",
    sample: true,
  },
  {
    id: "sample-creative-micro-grants",
    title: "Creative start-up micro-grants",
    kind: "grant",
    organisation: "Steelworks Arts Foundation",
    location: "South Yorkshire",
    value: "Up to £1,500",
    deadline: "2027-01-15T12:00:00+00:00",
    description:
      "Small grants for creative businesses under two years old: equipment, a first collection, a website or studio time. Applicants from under-represented communities are particularly encouraged.",
    details: ["Two-page application", "Decisions within six weeks", "Online information session in December"],
    posted: "2026-11-02",
    sample: true,
  },
  {
    id: "sample-winter-fair-stallholders",
    title: "Winter fair stallholders wanted",
    kind: "opportunity",
    organisation: "Hallam Square Winter Fair",
    location: "Sheffield",
    value: "£60 a day per stall",
    deadline: "2026-10-20T17:00:00+01:00",
    description:
      "Stalls for food, gifts and crafts at a three-weekend winter fair. Gazebos provided; bring your own table and stock.",
    details: ["Three weekends in December 2026", "Electric hook-up for food traders", "Public liability insurance required"],
    posted: "2026-09-28",
    sample: true,
  },
];

export const opportunities: Opportunity[] = site.showSampleContent
  ? allOpportunities
  : allOpportunities.filter((o) => !o.sample);

export function deadlineTime(o: Pick<Opportunity, "deadline">) {
  return new Date(o.deadline).getTime();
}

/** Open opportunities, soonest deadline first */
export function openOpportunities(now: number) {
  return opportunities
    .filter((o) => deadlineTime(o) >= now)
    .sort((a, b) => deadlineTime(a) - deadlineTime(b));
}

/** Most recently posted open opportunities */
export function latestOpportunities(now: number, limit = 3) {
  return openOpportunities(now)
    .sort((a, b) => b.posted.localeCompare(a.posted))
    .slice(0, limit);
}
