/**
 * MEMBERS-ONLY BUSINESS SUPPORT
 *
 * Everything shown in /business-support lives here. Each section has a list
 * of resources. To add one, copy an existing entry and edit it.
 *
 *  - type "link":        an external site, tool or organisation
 *  - type "guide":       step-by-step official guidance (mostly GOV.UK)
 *  - type "bos-service": something the BOS team does for members. These get a
 *                        "Request this" button that sends a request to the team.
 *  - type "event":       workshops, webinars and programmes with dates
 *
 * `verified: true` means someone has checked the link works and goes to the
 * right place. Set it to false if you're unsure, and re-check links every few
 * months: organisations move pages around. Never add grant amounts or
 * deadlines for real funds here; they change, so link to the source instead.
 * `sample: true` marks demo content that should be replaced before launch.
 */

export type SupportSectionId =
  | "funding"
  | "grants"
  | "advice"
  | "workshops"
  | "training"
  | "mentoring"
  | "networking"
  | "legal-accounting"
  | "marketing"
  | "resources";

export type ResourceType = "link" | "guide" | "bos-service" | "event";

export type SupportResource = {
  id: string;
  title: string;
  provider: string;
  description: string;
  /** External URL or internal path. BOS services without a page can leave this out. */
  url?: string;
  /** Button text for the link (defaults by type) */
  linkLabel?: string;
  /**
   * BOS services get a "Request this" button. Set false when the link already
   * goes to the service's own form or page (e.g. joining the directory).
   */
  requestable?: boolean;
  type: ResourceType;
  tags: string[];
  /** true only when the URL has been checked and is correct */
  verified: boolean;
  sample: boolean;
};

export type SupportSection = {
  id: SupportSectionId;
  title: string;
  /** Short label for tiles and nav */
  short: string;
  description: string;
  /** lucide-react icon name, resolved by <SupportIcon /> */
  icon: string;
  /** Tile colour and readable ink on top of it */
  color: string;
  ink: string;
  resources: SupportResource[];
};

export const resourceTypes: Record<ResourceType, { label: string; linkLabel: string }> = {
  link: { label: "Link", linkLabel: "Visit site" },
  guide: { label: "Guide", linkLabel: "Read the guide" },
  "bos-service": { label: "BOS service", linkLabel: "Find out more" },
  event: { label: "Events", linkLabel: "See what's on" },
};

const BOS = "Black Owned Sheffield";

export const supportSections: SupportSection[] = [
  {
    id: "funding",
    title: "Funding opportunities",
    short: "Funding",
    description:
      "Loans, investment and finance finders to help you start or grow, plus a second pair of eyes on your application before you send it.",
    icon: "Banknote",
    color: "#f6bd3c",
    ink: "#2a1910",
    resources: [
      {
        id: "funding-application-review",
        title: "Funding application review",
        provider: BOS,
        description:
          "Writing a funding bid or loan application? Send it to us before you submit. We'll read it with fresh eyes and give you honest feedback on clarity, evidence and whether it actually answers the question.",
        type: "bos-service",
        tags: ["Members", "Applications", "Feedback"],
        verified: false,
        sample: false,
      },
      {
        id: "gov-finance-finder",
        title: "Finance and support for your business",
        provider: "GOV.UK",
        description:
          "Search government-backed finance and support by where you are, your stage and what you need the money for. A good first stop before you apply for anything.",
        url: "https://www.gov.uk/business-finance-support",
        linkLabel: "Search the finder",
        type: "link",
        tags: ["Finder tool", "Loans", "Grants", "All stages"],
        verified: true,
        sample: false,
      },
      {
        id: "start-up-loans",
        title: "Start Up Loans",
        provider: "British Business Bank",
        description:
          "Government-backed personal loans for people starting a business or in their first years of trading, with help to write a business plan and free mentoring once you're funded. Check the eligibility rules before you apply.",
        url: "https://www.startuploans.co.uk",
        type: "link",
        tags: ["Start-up", "Loans", "Mentoring"],
        verified: true,
        sample: false,
      },
      {
        id: "british-business-bank",
        title: "British Business Bank",
        provider: "British Business Bank",
        description:
          "The government-owned bank behind Start Up Loans and a range of programmes delivered through partner lenders. Its guidance helps you compare types of finance, from loans and asset finance to equity investment.",
        url: "https://www.british-business-bank.co.uk",
        type: "link",
        tags: ["Loans", "Investment", "Guides"],
        verified: true,
        sample: false,
      },
      {
        id: "symca",
        title: "South Yorkshire Mayoral Combined Authority",
        provider: "SYMCA",
        description:
          "The regional authority for Sheffield, Rotherham, Doncaster and Barnsley. Check its business pages for current regional support and funding programmes.",
        url: "https://www.southyorkshire-ca.gov.uk",
        type: "link",
        tags: ["South Yorkshire", "Regional"],
        verified: true,
        sample: false,
      },
      {
        id: "sheffield-council-business-support",
        title: "Business support from Sheffield City Council",
        provider: "Sheffield City Council",
        description:
          "The council's business support pages: local schemes, advice and help for businesses based in the city.",
        url: "https://www.sheffield.gov.uk/business/business-support",
        type: "link",
        tags: ["Sheffield", "Local schemes"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "grants",
    title: "Grants",
    short: "Grants",
    description:
      "Money you don't pay back. Grants for small businesses, social enterprises, CICs and community projects, and help working out which ones are worth your time.",
    icon: "HandCoins",
    color: "#167a6f",
    ink: "#fbf5ec",
    resources: [
      {
        id: "grant-search-help",
        title: "Grant search help",
        provider: BOS,
        description:
          "Not sure what you'd qualify for? Tell us about your business and what the money is for. We'll point you towards funds that fit, so you don't waste evenings on applications you can't win.",
        type: "bos-service",
        tags: ["Members", "Grants", "1:1"],
        verified: false,
        sample: false,
      },
      {
        id: "tnl-community-fund",
        title: "The National Lottery Community Fund",
        provider: "The National Lottery Community Fund",
        description:
          "A major funder of community projects across the UK. Its programmes are open to voluntary and community groups, charities and social enterprises. Read each programme's rules to check whether your organisation can apply.",
        url: "https://www.tnlcommunityfund.org.uk/funding/funding-programmes",
        linkLabel: "Browse programmes",
        type: "link",
        tags: ["Community projects", "CICs", "Social enterprise"],
        verified: true,
        sample: false,
      },
      {
        id: "unltd",
        title: "UnLtd",
        provider: "UnLtd",
        description:
          "Support for social entrepreneurs: people starting or growing a business that tackles a social problem. Its awards combine funding with practical support.",
        url: "https://www.unltd.org.uk",
        type: "link",
        tags: ["Social enterprise", "Awards", "Support"],
        verified: true,
        sample: false,
      },
      {
        id: "sycf",
        title: "South Yorkshire Community Foundation",
        provider: "South Yorkshire Community Foundation",
        description:
          "Runs grant programmes for voluntary and community groups across South Yorkshire. Worth a look if you run a CIC or a community project alongside your business.",
        url: "https://www.sycf.org.uk",
        type: "link",
        tags: ["South Yorkshire", "Community groups", "CICs"],
        verified: true,
        sample: false,
      },
      {
        id: "innovate-uk-competitions",
        title: "Innovate UK funding competitions",
        provider: "Innovate UK",
        description:
          "Competitive funding for businesses developing new products, services or processes. Search open competitions and read the scope carefully before you start writing.",
        url: "https://apply-for-innovation-funding.service.gov.uk/competition/search",
        linkLabel: "Search competitions",
        type: "link",
        tags: ["Innovation", "Tech", "Competitive"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "advice",
    title: "Business advice",
    short: "Advice",
    description:
      "Straight answers on starting, running and growing a business. Talk it through with us, or go straight to the official guidance.",
    icon: "Lightbulb",
    color: "#ee6a35",
    ink: "#2a1910",
    resources: [
      {
        id: "one-to-one-advice",
        title: "1:1 business advice session",
        provider: BOS,
        description:
          "A conversation with the BOS team or someone from our network. Bring your question, whether it's pricing, finding customers, premises or what to do next, and leave with a plan. Sessions are arranged around availability.",
        type: "bos-service",
        tags: ["Members", "1:1", "All stages"],
        verified: false,
        sample: false,
      },
      {
        id: "gov-business-support-service",
        title: "Business Support Service",
        provider: "GOV.UK",
        description:
          "Government phone and online advice for businesses in England, covering setting up, running and growing a business.",
        url: "https://www.gov.uk/get-business-support",
        type: "link",
        tags: ["Helpline", "England", "All stages"],
        verified: true,
        sample: false,
      },
      {
        id: "bipc-sheffield",
        title: "BIPC Sheffield",
        provider: "British Library Business & IP Centre network",
        description:
          "Part of the British Library's national network, based at Sheffield Central Library. Use market research databases and business information for free, get help protecting your ideas, and join workshops for start-ups.",
        url: "https://www.bl.uk/bipc/find-your-local-bipc",
        linkLabel: "Find BIPC Sheffield",
        type: "link",
        tags: ["Sheffield", "Market research", "Free", "Intellectual property"],
        verified: true,
        sample: false,
      },
      {
        id: "gov-set-up-business",
        title: "Set up a business",
        provider: "GOV.UK",
        description:
          "The official step-by-step: choosing a legal structure, registering, and the rules you need to follow when you start out.",
        url: "https://www.gov.uk/set-up-business",
        type: "guide",
        tags: ["Start-up", "Step by step"],
        verified: true,
        sample: false,
      },
      {
        id: "gov-business-plan",
        title: "Write a business plan",
        provider: "GOV.UK",
        description:
          "Guidance and free templates for the document every lender and funder will ask for. Worth doing even if nobody asks: it makes the next decision easier.",
        url: "https://www.gov.uk/write-business-plan",
        type: "guide",
        tags: ["Planning", "Templates", "Start-up"],
        verified: true,
        sample: false,
      },
      {
        id: "gov-social-enterprise",
        title: "Set up a social enterprise",
        provider: "GOV.UK",
        description:
          "Thinking of running your business as a CIC, co-operative or charity? This guide explains the structures and what each one means for you.",
        url: "https://www.gov.uk/set-up-a-social-enterprise",
        type: "guide",
        tags: ["Social enterprise", "CICs", "Legal structure"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "workshops",
    title: "Workshops",
    short: "Workshops",
    description:
      "Practical sessions where you learn something on Tuesday and use it on Wednesday. Ours, plus the best free ones around the city and online.",
    icon: "Presentation",
    color: "#f2a0bd",
    ink: "#2a1910",
    resources: [
      {
        id: "bos-workshops",
        title: "BOS workshops",
        provider: BOS,
        description:
          "Practical workshops on the things members ask us about most, like funding, social media and pricing. See what's coming up, or tell us the workshop you wish existed.",
        url: "/events",
        linkLabel: "See upcoming workshops",
        type: "bos-service",
        tags: ["Members", "In person", "Online"],
        verified: true,
        sample: false,
      },
      {
        id: "bipc-workshops",
        title: "BIPC workshops and webinars",
        provider: "British Library Business & IP Centre",
        description:
          "Workshops and webinars on business planning, market research, branding and protecting your ideas, run in Sheffield and online across the national network. Many are free.",
        url: "https://www.bl.uk/bipc",
        linkLabel: "See BIPC events",
        type: "event",
        tags: ["Webinars", "Market research", "Intellectual property"],
        verified: true,
        sample: false,
      },
      {
        id: "hmrc-self-assessment-help",
        title: "Help and support for Self Assessment",
        provider: "HMRC",
        description:
          "HMRC's webinars, videos and email updates explaining Self Assessment, from registering to paying your bill. Short, free and less painful than you'd think.",
        url: "https://www.gov.uk/guidance/help-and-support-for-self-assessment",
        type: "event",
        tags: ["Tax", "Webinars", "Self-employed"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "training",
    title: "Training",
    short: "Training",
    description:
      "Build skills that last: courses for founders, programmes for young people starting out, and help training the people you hire.",
    icon: "GraduationCap",
    color: "#1f2a63",
    ink: "#fbf5ec",
    resources: [
      {
        id: "bos-training",
        title: "BOS training sessions",
        provider: BOS,
        description:
          "Hands-on sessions on the practical stuff, like social media, selling online and getting organised. Check upcoming dates or tell us what you'd like us to run next.",
        url: "/events?type=training",
        linkLabel: "See training dates",
        type: "bos-service",
        tags: ["Members", "Hands-on", "Small groups"],
        verified: true,
        sample: false,
      },
      {
        id: "kings-trust-enterprise",
        title: "The King's Trust Enterprise programme",
        provider: "The King's Trust",
        description:
          "Support for 18 to 30 year-olds who want to explore self-employment or start a business, with workshops and mentoring. Ideal for young people with an idea and no idea where to start.",
        url: "https://www.kingstrust.org.uk",
        type: "link",
        tags: ["Ages 18–30", "Young founders", "Mentoring"],
        verified: true,
        sample: false,
      },
      {
        id: "openlearn",
        title: "OpenLearn free courses",
        provider: "The Open University",
        description:
          "Free short online courses on money, management and business from the Open University. Study at your own pace, around the day job or the school run.",
        url: "https://www.open.edu/openlearn/",
        linkLabel: "Browse courses",
        type: "link",
        tags: ["Online", "Free", "Self-paced"],
        verified: true,
        sample: false,
      },
      {
        id: "employing-an-apprentice",
        title: "Employing an apprentice",
        provider: "GOV.UK",
        description:
          "How apprenticeships work for employers, what you'll need to pay and the funding that can help with training costs. A great way to give a young person their start.",
        url: "https://www.gov.uk/employing-an-apprentice",
        type: "guide",
        tags: ["Hiring", "Apprenticeships", "Young people"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "mentoring",
    title: "Mentoring",
    short: "Mentoring",
    description:
      "Someone in your corner. Get matched with an experienced business owner who has been where you are, or give back by mentoring someone else.",
    icon: "HeartHandshake",
    color: "#e0628f",
    ink: "#2a1910",
    resources: [
      {
        id: "mentor-matching",
        title: "Mentor matching",
        provider: BOS,
        description:
          "Tell us about your business and where you're stuck. We'll look for a good match from our growing network of Black business owners and professionals, and make the introduction.",
        type: "bos-service",
        tags: ["Members", "1:1", "Introductions"],
        verified: false,
        sample: false,
      },
      {
        id: "become-a-mentor",
        title: "Become a BOS mentor",
        provider: BOS,
        description:
          "Built something? Your experience could save someone else years. Tell us what you know and how much time you can give, and we'll be in touch when there's a good match.",
        type: "bos-service",
        tags: ["Give back", "Volunteering"],
        verified: false,
        sample: false,
      },
      {
        id: "be-the-business",
        title: "Be the Business",
        provider: "Be the Business",
        description:
          "A not-for-profit set up to help small firms run better, with peer learning, mentoring programmes and practical tools for business leaders.",
        url: "https://www.bethebusiness.com",
        type: "link",
        tags: ["Peer learning", "Mentoring", "Growth"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "networking",
    title: "Networking",
    short: "Networking",
    description:
      "Breakfasts, mixers and business groups where you'll meet other founders, buyers and the people who want to work with you.",
    icon: "Handshake",
    color: "#d19a62",
    ink: "#2a1910",
    resources: [
      {
        id: "bos-networking",
        title: "BOS networking events",
        provider: BOS,
        description:
          "Mixers, socials and networking events for Sheffield's Black business community. Come once and you'll know people. Come twice and you'll be the one doing the introductions.",
        url: "/events?type=networking",
        linkLabel: "See networking events",
        type: "bos-service",
        tags: ["Members", "In person", "Sheffield"],
        verified: true,
        sample: false,
      },
      {
        id: "sheffield-chamber",
        title: "Sheffield Chamber of Commerce",
        provider: "Sheffield Chamber of Commerce & Industry",
        description:
          "Sheffield's chamber of commerce, running networking events, training and support for businesses across the city.",
        url: "https://www.scci.org.uk",
        type: "link",
        tags: ["Sheffield", "Membership", "Events"],
        verified: true,
        sample: false,
      },
      {
        id: "fsb",
        title: "Federation of Small Businesses",
        provider: "FSB",
        description:
          "A membership organisation for the self-employed and small businesses, with local networking events, member helplines and a voice with government. Paid membership.",
        url: "https://www.fsb.org.uk",
        type: "link",
        tags: ["Membership", "Paid", "Local events"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "legal-accounting",
    title: "Legal & accounting support",
    short: "Legal & accounts",
    description:
      "Tax, company admin, staff, contracts and data. The official guidance and free advice that keeps you on the right side of the rules.",
    icon: "Scale",
    color: "#1e3a2d",
    ink: "#fbf5ec",
    resources: [
      {
        id: "companies-house",
        title: "Companies House",
        provider: "GOV.UK",
        description:
          "Register a limited company, file your accounts and confirmation statement, and look up any UK company before you work with it.",
        url: "https://www.gov.uk/government/organisations/companies-house",
        type: "link",
        tags: ["Limited companies", "Filing"],
        verified: true,
        sample: false,
      },
      {
        id: "register-self-assessment",
        title: "Register for Self Assessment",
        provider: "HMRC",
        description:
          "Self-employed as a sole trader or in a partnership? You'll need to register for Self Assessment and file a tax return every year. Here's how, and when.",
        url: "https://www.gov.uk/register-for-self-assessment",
        type: "guide",
        tags: ["Tax", "Sole traders", "Self-employed"],
        verified: true,
        sample: false,
      },
      {
        id: "self-employed-expenses",
        title: "Expenses if you're self-employed",
        provider: "HMRC",
        description:
          "What you can and can't claim as allowable expenses, plus simplified flat rates for things like working from home. Keep your receipts.",
        url: "https://www.gov.uk/expenses-if-youre-self-employed",
        type: "guide",
        tags: ["Tax", "Expenses", "Self-employed"],
        verified: true,
        sample: false,
      },
      {
        id: "register-for-vat",
        title: "Register for VAT",
        provider: "HMRC",
        description: "When you must register for VAT, when you might choose to, and how to do it.",
        url: "https://www.gov.uk/register-for-vat",
        type: "guide",
        tags: ["Tax", "VAT"],
        verified: true,
        sample: false,
      },
      {
        id: "acas",
        title: "Acas",
        provider: "Acas",
        description:
          "Free, impartial advice on employment law for employers and employees: contracts, pay, hiring, holidays and sorting out disagreements. There's a helpline too.",
        url: "https://www.acas.org.uk",
        type: "link",
        tags: ["Employment", "Staff", "Free"],
        verified: true,
        sample: false,
      },
      {
        id: "ico-small-business",
        title: "Data protection for small organisations",
        provider: "Information Commissioner's Office",
        description:
          "The UK's data protection regulator explains, in plain English, what you need to do with customer data and privacy notices, and whether you need to pay the data protection fee.",
        url: "https://ico.org.uk/for-organisations/advice-for-small-organisations/",
        type: "guide",
        tags: ["Data protection", "UK GDPR", "Privacy"],
        verified: true,
        sample: false,
      },
      {
        id: "cic-regulator",
        title: "Office of the Regulator of Community Interest Companies",
        provider: "GOV.UK",
        description:
          "Guidance on setting up and running a CIC, including the community interest statement and the annual CIC report.",
        url: "https://www.gov.uk/government/organisations/office-of-the-regulator-of-community-interest-companies",
        type: "link",
        tags: ["CICs", "Social enterprise", "Filing"],
        verified: true,
        sample: false,
      },
      {
        id: "register-trade-mark",
        title: "Register a trade mark",
        provider: "Intellectual Property Office",
        description:
          "How to protect your business name and logo by registering a trade mark, what it costs and how long it takes.",
        url: "https://www.gov.uk/how-to-register-a-trade-mark",
        type: "guide",
        tags: ["Branding", "Intellectual property"],
        verified: true,
        sample: false,
      },
      {
        id: "lawworks",
        title: "LawWorks",
        provider: "LawWorks",
        description:
          "A charity connecting volunteer lawyers with people and not-for-profit organisations who can't afford legal advice. Small charities and community groups may be able to get free help.",
        url: "https://www.lawworks.org.uk",
        type: "link",
        tags: ["Free", "Not-for-profits", "Legal advice"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing support",
    short: "Marketing",
    description:
      "Get seen by the people who want to buy from you. Honest feedback on your marketing, free tools that work, and the rules to know before you post.",
    icon: "Megaphone",
    color: "#b02a62",
    ink: "#fbf5ec",
    resources: [
      {
        id: "marketing-clinic",
        title: "Marketing clinic",
        provider: BOS,
        description:
          "Bring your Instagram, website, menu or flyer. We'll give you honest, practical feedback on what's working and two or three things to try next.",
        type: "bos-service",
        tags: ["Members", "Social media", "Feedback"],
        verified: false,
        sample: false,
      },
      {
        id: "bos-directory-listing",
        title: "List your business with BOS",
        provider: BOS,
        description:
          "Get your business on the BOS directory and map, so people across Sheffield who want to buy Black-owned can find you.",
        url: "/join/business",
        linkLabel: "Join the directory",
        type: "bos-service",
        requestable: false,
        tags: ["Directory", "Visibility"],
        verified: true,
        sample: false,
      },
      {
        id: "bos-spotlight",
        title: "Business Spotlight",
        provider: BOS,
        description:
          "Got a story worth telling? Put your business forward for our Business Spotlight, shared on the site and across our socials.",
        url: "/spotlight",
        linkLabel: "See the Spotlight",
        type: "bos-service",
        requestable: false,
        tags: ["Stories", "Social media", "Visibility"],
        verified: true,
        sample: false,
      },
      {
        id: "google-business-profile",
        title: "Google Business Profile",
        provider: "Google",
        description:
          "Set up or claim your free profile so you show up on Google Search and Maps with your opening hours, photos and reviews. One of the quickest wins there is.",
        url: "https://www.google.com/business/",
        type: "link",
        tags: ["Free", "Local search", "Reviews"],
        verified: true,
        sample: false,
      },
      {
        id: "asa",
        title: "Advertising rules",
        provider: "Advertising Standards Authority",
        description:
          "The UK's advertising regulator. Check the rules before you run an offer, work with influencers or make claims about what your product does.",
        url: "https://www.asa.org.uk",
        type: "link",
        tags: ["Advertising", "Social media", "Rules"],
        verified: true,
        sample: false,
      },
      {
        id: "marketing-law",
        title: "Marketing and advertising: the law",
        provider: "GOV.UK",
        description:
          "The legal basics, from describing products accurately to the rules on marketing by email, text and phone.",
        url: "https://www.gov.uk/marketing-advertising-law",
        type: "guide",
        tags: ["Law", "Email marketing"],
        verified: true,
        sample: false,
      },
    ],
  },
  {
    id: "resources",
    title: "Useful resources",
    short: "Resources",
    description:
      "Bookmarks worth keeping: tender portals, handy tools, and the BOS pages members use most.",
    icon: "Library",
    color: "#7a4a2e",
    ink: "#fbf5ec",
    resources: [
      {
        id: "bos-opportunities-board",
        title: "Business Opportunities board",
        provider: BOS,
        description:
          "Contracts, tenders, jobs and opportunities shared with Black-owned businesses, kept up to date by the BOS team.",
        url: "/business-support/opportunities",
        linkLabel: "Open the board",
        type: "bos-service",
        requestable: false,
        tags: ["Members", "Contracts", "Jobs"],
        verified: true,
        sample: false,
      },
      {
        id: "contracts-finder",
        title: "Contracts Finder",
        provider: "GOV.UK",
        description:
          "Search and get alerts for public sector contracts in England. A good place to find lower-value opportunities that suit smaller suppliers.",
        url: "https://www.gov.uk/contracts-finder",
        linkLabel: "Search contracts",
        type: "link",
        tags: ["Public sector", "Tenders", "Alerts"],
        verified: true,
        sample: false,
      },
      {
        id: "find-a-tender",
        title: "Find a Tender",
        provider: "GOV.UK",
        description:
          "The UK government's service for public procurement notices. Search upcoming and open tenders and set up alerts for your sector.",
        url: "https://www.find-tender.service.gov.uk",
        linkLabel: "Search tenders",
        type: "link",
        tags: ["Public sector", "Tenders", "Alerts"],
        verified: true,
        sample: false,
      },
      {
        id: "bos-directory",
        title: "Find Black-owned suppliers",
        provider: BOS,
        description:
          "Buy from each other. Search the BOS directory for caterers, designers, trades and services for your next job.",
        url: "/directory",
        linkLabel: "Search the directory",
        type: "link",
        tags: ["Directory", "Suppliers"],
        verified: true,
        sample: false,
      },
      {
        id: "small-business-rate-relief",
        title: "Small business rate relief",
        provider: "GOV.UK",
        description:
          "Got premises? Check whether you qualify for small business rate relief and pay less in business rates, or nothing at all.",
        url: "https://www.gov.uk/business-rates-relief/small-business-rate-relief",
        type: "guide",
        tags: ["Premises", "Business rates"],
        verified: true,
        sample: false,
      },
      {
        id: "minimum-wage-rates",
        title: "National Minimum Wage rates",
        provider: "GOV.UK",
        description:
          "The current minimum wage rates by age and for apprentices. Check them before you set pay for anyone you take on.",
        url: "https://www.gov.uk/national-minimum-wage-rates",
        type: "guide",
        tags: ["Hiring", "Pay", "Staff"],
        verified: true,
        sample: false,
      },
    ],
  },
];

export const supportSectionMap = Object.fromEntries(supportSections.map((s) => [s.id, s])) as Record<
  SupportSectionId,
  SupportSection
>;

export function getSupportSection(id: string): SupportSection | undefined {
  return supportSections.find((s) => s.id === id);
}

export const supportResourceCount = supportSections.reduce((n, s) => n + s.resources.length, 0);
