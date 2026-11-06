import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info, Sparkles, Store } from "lucide-react";
import { EventCard } from "@/components/cards/EventCard";
import { BookingForm } from "@/components/events/BookingForm";
import { EventHero } from "@/components/events/EventHero";
import { EventKeyFacts } from "@/components/events/EventKeyFacts";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import {
  absoluteUrl,
  eventPath,
  eventWhen,
  isVenueTbc,
  lowestPrice,
  relatedEvents,
  typeMeta,
} from "@/components/events/eventUtils";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section, SectionHeading } from "@/components/ui/layout";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { events, getEvent, splitEvents } from "@/content/events";
import type { BosEvent } from "@/content/types";
import { site, ogBase } from "@/lib/site";
import { renderInline } from "@/lib/markdown-lite";

// Past/upcoming status is worked out at render time, so refresh hourly
export const revalidate = 3600;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) return { title: "Event not found" };
  const when = eventWhen(event);
  const description = `${when.dateLabel}, ${event.venue}. ${event.summary}`;
  // Shared links to placeholder events must never preview as a real date
  const title = event.sample ? `Sample event: ${event.title}` : event.title;
  return {
    title,
    description,
    alternates: { canonical: eventPath(event) },
    openGraph: { ...ogBase, title, description, url: eventPath(event) },
    twitter: { card: "summary_large_image", title, description },
    // Keep placeholder events out of search results
    robots: event.sample ? { index: false, follow: true } : undefined,
  };
}

function eventJsonLd(event: BosEvent, finished: boolean) {
  const url = absoluteUrl(eventPath(event));
  const price = lowestPrice(event.price);
  const postcode = event.address?.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i)?.[0];
  const isBos = /black owned sheffield/i.test(event.organiser ?? site.name);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.start,
    endDate: event.end,
    url,
    image: [absoluteUrl("/brand/bos-logo.jpg")],
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: event.online
      ? { "@type": "VirtualLocation", url }
      : {
          "@type": "Place",
          name: event.venue,
          address: {
            "@type": "PostalAddress",
            streetAddress: event.address?.split(",")[0],
            addressLocality: "Sheffield",
            postalCode: postcode,
            addressCountry: "GB",
          },
          geo:
            event.coords && !isVenueTbc(event)
              ? { "@type": "GeoCoordinates", latitude: event.coords.lat, longitude: event.coords.lng }
              : undefined,
        },
    offers: {
      "@type": "Offer",
      url: event.ticketUrl ?? url,
      price,
      priceCurrency: "GBP",
      description: event.price,
      availability: finished ? undefined : "https://schema.org/InStock",
    },
    organizer: {
      "@type": "Organization",
      name: event.organiser ?? site.name,
      url: isBos ? site.url : undefined,
    },
  };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) notFound();

  const now = new Date();
  const { upcoming } = splitEvents(now);
  const finished = new Date(event.end ?? event.start).getTime() < now.getTime();
  // Sample events are placeholders, so they never take bookings
  const bookingHref = finished || event.sample ? undefined : (event.ticketUrl ?? "#book");
  const related = relatedEvents(event, upcoming);
  const paragraphs = event.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const t = typeMeta(event.type);
  const bookingTitle = event.sample
    ? "Bookings not open yet"
    : event.ticketUrl
      ? "Get your tickets"
      : (event.ticketLabel ?? "Book a place");

  return (
    <>
      <EventHero event={event} finished={finished} bookingHref={bookingHref} />

      <Section tone="cream" className="py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="min-w-0">
            <article aria-labelledby="about-heading">
              <h2 id="about-heading" className="font-heading text-3xl font-extrabold sm:text-4xl">
                About this event
              </h2>
              <div className="prose-bos mt-5 max-w-2xl">
                {paragraphs.map((p, i) => (
                  <p key={i}>{renderInline(p, `p${i}`)}</p>
                ))}
              </div>

              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading text-lg font-extrabold">Highlights</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {event.highlights.map((h) => (
                      <li
                        key={h}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 py-2 text-sm font-semibold text-espresso shadow-pop-sm"
                      >
                        <Sparkles className="h-4 w-4" style={{ color: t.color }} aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {finished ? (
              <section
                aria-labelledby="finished-heading"
                className="mt-12 rounded-[2rem] border-2 border-espresso bg-sand p-6 sm:p-8"
              >
                <h2 id="finished-heading" className="font-heading text-2xl font-extrabold sm:text-3xl">
                  This event has finished
                </h2>
                <p className="mt-3 max-w-xl text-cocoa">
                  Thanks to everyone who came along.{" "}
                  {event.video ? "Catch the recap below, then see what's coming up next." : "See what's coming up next, or follow us for new dates."}
                </p>
                {event.video && (
                  <div id="recap" className="mt-6 scroll-mt-28">
                    {/* Recap thumbnails carry their own title text, so skip the overlay caption */}
                    <YouTubeEmbed id={event.video.youtubeId} title={event.video.title} showTitle={false} />
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/events" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                    See what&apos;s coming up
                  </ButtonLink>
                  <ButtonLink href={site.socials.instagram} variant="outline" icon={<InstagramIcon className="h-4 w-4" />}>
                    Follow {site.instagramHandle}
                  </ButtonLink>
                </div>
              </section>
            ) : (
              <section
                id="book"
                aria-labelledby="book-heading"
                className="mt-12 scroll-mt-28 rounded-[2rem] border-2 border-espresso bg-blush p-6 shadow-pop sm:p-8"
              >
                <h2 id="book-heading" className="font-heading text-2xl font-extrabold sm:text-3xl">
                  {bookingTitle}
                </h2>
                {event.sample && (
                  <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm text-cocoa">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    This is a sample event while our new website is in preview, so the date and details are placeholders.
                  </p>
                )}
                {event.membersOnly && (
                  <p className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-cocoa">
                    This event is for Black Owned Sheffield members.{" "}
                    <Link href="/join/member" className="font-semibold text-rose-ink underline underline-offset-2">
                      Become a member
                    </Link>
                    .
                  </p>
                )}
                <div className="mt-6">
                  {event.sample ? (
                    <div>
                      <p className="text-cocoa">
                        Bookings open once this event is confirmed. Join the mailing list to hear first.
                      </p>
                      <NewsletterForm className="mt-5 max-w-md" source={`event:${event.slug}`} />
                      <ButtonLink
                        href={site.socials.instagram}
                        variant="outline"
                        className="mt-4"
                        icon={<InstagramIcon className="h-4 w-4" />}
                      >
                        Or follow {site.instagramHandle}
                      </ButtonLink>
                    </div>
                  ) : event.ticketUrl ? (
                    <div>
                      <p className="text-cocoa">Booking for this event is handled on an external site.</p>
                      <ButtonLink
                        href={event.ticketUrl}
                        variant="primary"
                        size="lg"
                        className="mt-5"
                        iconRight={<ArrowRight className="h-5 w-5" />}
                      >
                        {event.ticketLabel ?? "Get tickets"}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </ButtonLink>
                    </div>
                  ) : (
                    <BookingForm event={event} />
                  )}
                </div>
              </section>
            )}
          </div>

          <aside aria-label="Event details" className="min-w-0">
            <EventKeyFacts event={event} finished={finished} />
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="deep" className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="More from the diary"
            title={finished ? "Coming up next" : "You might also like"}
            action={
              <ButtonLink href="/events" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                All events
              </ButtonLink>
            }
          />
          <ul className="grid gap-4 lg:grid-cols-3">
            {related.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} className="h-full" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {event.type === "market" && !finished && !event.sample ? (
        <CtaBand
          tone="sunflower"
          title="Want a stall at this market?"
          description="Tell us about your business and what you'd like to sell, and we'll be in touch about pitches."
          actions={
            <ButtonLink
              href={`/events/stall?market=${event.slug}`}
              variant="primary"
              size="lg"
              icon={<Store className="h-5 w-5" />}
            >
              Apply for a stall
            </ButtonLink>
          }
        />
      ) : (
        <CtaBand
          tone="pink"
          title="Never miss what's on"
          description="Follow us on Instagram for new dates, market news and photos from the day."
          actions={
            <>
              <ButtonLink href={site.socials.instagram} variant="primary" size="lg" icon={<InstagramIcon className="h-5 w-5" />}>
                Follow {site.instagramHandle}
              </ButtonLink>
              <ButtonLink href="/events" variant="cream" size="lg" className="border-espresso">
                Browse all events
              </ButtonLink>
            </>
          }
        />
      )}

      {/* Approximate-date events ("October 2023") are left out so we never publish a guessed date */}
      {/* Sample events are placeholders, so they never get Event markup either */}
      {!event.displayDate && !event.sample && <JsonLd data={eventJsonLd(event, finished)} />}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Events", item: absoluteUrl("/events") },
            { "@type": "ListItem", position: 3, name: event.title, item: absoluteUrl(eventPath(event)) },
          ],
        }}
      />
    </>
  );
}
