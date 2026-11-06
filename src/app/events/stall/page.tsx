import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Tag, UtensilsCrossed } from "lucide-react";
import { StallForm, type MarketOption } from "@/components/events/StallForm";
import { eventPath, shortDateLabel } from "@/components/events/eventUtils";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { StripeBand } from "@/components/ui/Shapes";
import { splitEvents } from "@/content/events";
import { site, ogBase } from "@/lib/site";
import { formatDate } from "@/lib/utils";

// Market list depends on today's date
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Apply for a market stall",
  description:
    "Sell at a Black Owned Sheffield market. Tell us about your business, what you sell and what you need, and we'll be in touch about pitches at our next market.",
  alternates: { canonical: "/events/stall" },
  openGraph: {
    ...ogBase,
    title: "Get a stall at a Black Owned Sheffield market",
    description: "Apply for a stall at our next market and sell to a crowd that came out to shop Black-owned.",
    url: "/events/stall",
  },
};

const steps = [
  { title: "Apply here", body: "Tell us about your business, what you sell and what you'd need on the day." },
  { title: "We get back to you", body: "We'll reply by email with the date, venue, set-up times and pitch details." },
  {
    title: "Confirm your pitch",
    body: "You'll know about any stall fee before you commit. Nothing is booked until you say yes.",
  },
];

const tips = [
  {
    icon: ShieldCheck,
    title: "Public liability insurance",
    body: "Most venues ask stallholders to have it. If you're not sure, say so on the form.",
  },
  {
    icon: UtensilsCrossed,
    title: "Selling food?",
    body: "You'll usually need to be registered with your local council as a food business.",
  },
  { icon: CreditCard, title: "Take card and cash", body: "Lots of shoppers pay by card, so bring a card reader if you can." },
  { icon: Tag, title: "Make it pop", body: "Clear prices, a tablecloth and a sign with your name go a long way." },
];

export default function StallPage() {
  const { upcoming, past } = splitEvents(new Date());
  const upcomingMarkets = upcoming.filter((e) => e.type === "market");
  const markets: MarketOption[] = upcomingMarkets.map((e) => ({
    value: e.slug,
    label: `${e.title} · ${shortDateLabel(e.start)}${e.sample ? " (sample)" : ""}`,
  }));
  const pastMarkets = past.filter((e) => e.type === "market" || e.type === "showcase");

  return (
    <>
      <PageHero
        crumbs={[{ label: "Events", href: "/events" }, { label: "Apply for a stall" }]}
        eyebrow="Stallholders"
        accent="sunflower"
        title="Get a stall at our market"
        description="Sell to a crowd that came out to shop Black-owned. Tell us about your business and which market you're after, and we'll be in touch."
      />
      <StripeBand />

      <Section tone="cream" className="py-12 sm:py-16">
        {/* Mobile order: what to expect, form, then the rest. Desktop: form left, panels right. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <aside aria-label="What to expect" className="min-w-0 lg:col-start-2 lg:row-start-1">
            <div className="grain relative overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-sunflower p-6 shadow-pop">
              <h2 className="font-heading text-2xl font-extrabold">What to expect</h2>
              <ol className="mt-5 space-y-4">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-cream font-display text-lg leading-none">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-heading font-extrabold">{s.title}</p>
                      <p className="text-sm text-espresso/85">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <h2 className="sr-only">Stall application form</h2>
            <StallForm markets={markets} />
          </div>

          <aside aria-label="Tips and markets" className="min-w-0 space-y-6 lg:col-start-2 lg:row-start-2">
            <div className="rounded-[1.75rem] border-2 border-espresso bg-white p-6">
              <h2 className="font-heading text-xl font-extrabold">Good to know</h2>
              <ul className="mt-4 space-y-4">
                {tips.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush text-rose-ink">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-heading text-[15px] font-bold">{title}</p>
                      <p className="text-sm text-cocoa">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {(upcomingMarkets.length > 0 || pastMarkets.length > 0) && (
              <div className="rounded-[1.75rem] border-2 border-espresso bg-cream-deep p-6">
                {upcomingMarkets.length > 0 && (
                  <>
                    <h2 className="font-heading text-xl font-extrabold">Coming up</h2>
                    <ul className="mt-3 space-y-2">
                      {upcomingMarkets.map((e) => (
                        <li key={e.slug}>
                          <Link
                            href={eventPath(e)}
                            className="group flex min-h-11 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 transition-colors hover:bg-blush"
                          >
                            <span>
                              <span className="block font-heading text-[15px] font-bold leading-snug">{e.title}</span>
                              <span className="block text-sm text-cocoa">
                                {shortDateLabel(e.start)}
                                {e.sample && " · Sample"}
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {pastMarkets.length > 0 && (
                  <>
                    <h2 className={upcomingMarkets.length > 0 ? "mt-6 font-heading text-xl font-extrabold" : "font-heading text-xl font-extrabold"}>
                      Where we&apos;ve traded
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm text-cocoa">
                      {pastMarkets.map((e) => (
                        <li key={e.slug} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
                          <span>
                            <Link href={eventPath(e)} className="font-semibold text-espresso hover:underline">
                              {e.venue}
                            </Link>
                            , {e.displayDate ?? formatDate(e.start, { weekday: undefined, day: undefined })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-[1.75rem] border-2 border-espresso bg-espresso px-6 py-4 text-cream transition-all hover:-translate-y-0.5 hover:shadow-pop-pink"
            >
              <InstagramIcon className="h-6 w-6 shrink-0 text-pink" />
              <span>
                <span className="block font-heading font-bold">Questions first?</span>
                <span className="block text-sm text-cream/80">Message us on Instagram at {site.instagramHandle}</span>
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </aside>
        </div>
      </Section>
    </>
  );
}
