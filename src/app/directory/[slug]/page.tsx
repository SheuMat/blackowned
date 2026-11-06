import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  CalendarCheck,
  Check,
  ChevronRight,
  Globe,
  Info,
  Mail,
  MapPin,
  Navigation,
  PencilLine,
  Phone,
  Quote,
  Sparkles,
  Truck,
} from "lucide-react";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { BusinessCover, BusinessLogo } from "@/components/cards/BusinessArt";
import { OpeningHoursTable, OpenStatusPill } from "@/components/directory/OpeningHours";
import { ProfileActionBar, ProfileStickyBar } from "@/components/directory/ProfileActions";
import { CopyCode, ShareButton } from "@/components/directory/ShareButton";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { socialMeta } from "@/components/icons/SocialIcons";
import { BusinessMap } from "@/components/map/BusinessMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Squiggle } from "@/components/ui/Shapes";
import { areaMap, regionMap } from "@/content/areas";
import { businesses, getBusiness } from "@/content/businesses";
import { categoryMap } from "@/content/categories";
import type { Business, Socials } from "@/content/types";
import { directionsUrl, isPinnable, placeLabel, relatedBusinesses } from "@/lib/directory-search";
import { site, ogBase } from "@/lib/site";
import { cn, displayUrl, formatLongDate, telHref } from "@/lib/utils";

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

// Rebuild each profile daily so an offer drops off soon after its expiry date
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<"/directory/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return { title: "Business not found" };
  const cat = categoryMap[b.category];
  const where = b.onlineOnly ? regionMap[b.region].label : placeLabel(b);
  // Shared links to demo listings must never preview as a real business
  const prefix = b.sample ? "Sample listing: " : "";
  const title = `${prefix}${b.name} · ${cat.label} in ${where}`;
  const description = `${b.tagline} ${b.summary}`.slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: `/directory/${b.slug}` },
    // Sample listings are demo content: keep them out of search results
    robots: b.sample ? { index: false, follow: true } : undefined,
    openGraph: {
    ...ogBase,
      type: "website",
      title: `${prefix}${b.name} | ${site.name}`,
      description: b.summary,
      url: `/directory/${b.slug}`,
      images: b.cover ? [{ url: b.cover, alt: `${b.name}` }] : ogBase.images,
    },
  };
}

const schemaDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function localBusinessJsonLd(b: Business) {
  const sameAs = Object.values(b.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/directory/${b.slug}`,
    name: b.name,
    ...(b.legalName ? { legalName: b.legalName } : {}),
    description: b.summary,
    slogan: b.tagline,
    url: b.contact.website ?? `${site.url}/directory/${b.slug}`,
    ...(b.contact.phone ? { telephone: b.contact.phone } : {}),
    ...(b.contact.email ? { email: b.contact.email } : {}),
    ...(b.logo || b.icon ? { logo: `${site.url}${b.logo ?? b.icon}` } : {}),
    ...(b.cover ? { image: `${site.url}${b.cover}` } : {}),
    ...(b.address || b.postcode
      ? {
          address: {
            "@type": "PostalAddress",
            ...(b.address ? { streetAddress: b.address.replace(/,\s*Sheffield$/i, "") } : {}),
            addressLocality: regionMap[b.region].label,
            ...(b.postcode ? { postalCode: b.postcode } : {}),
            addressCountry: "GB",
          },
        }
      : {}),
    ...(b.coords ? { geo: { "@type": "GeoCoordinates", latitude: b.coords.lat, longitude: b.coords.lng } } : {}),
    ...(b.serviceArea ? { areaServed: b.serviceArea } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(b.hours?.some((h) => !h.closed && h.open && h.close)
      ? {
          openingHoursSpecification: b.hours
            .filter((h) => !h.closed && h.open && h.close)
            .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: schemaDays[h.day], opens: h.open, closes: h.close })),
        }
      : {}),
  };
}

function Card({ title, icon, children, className, id }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className={cn("rounded-[1.5rem] border-2 border-espresso bg-white p-5 sm:p-6", className)}>
      <h2 id={id} className="flex scroll-mt-28 items-center gap-2 font-heading text-xl font-extrabold">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function OfferCard({ offer, id, className }: { offer: NonNullable<Business["offer"]>; id: string; className?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative scroll-mt-28 overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-pink p-6 shadow-pop", className)}
    >
      <Blob color="#fadbe6" className="absolute -top-16 -right-16 h-44 w-44 opacity-80" />
      <div className="relative">
        {offer.exclusive ? (
          <p className="inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-espresso px-3 py-1 text-xs font-bold tracking-wider text-cream uppercase">
            <Sparkles className="h-3.5 w-3.5 text-sunflower" aria-hidden />
            {/* The long version wraps to two lines inside the pill on phones */}
            <span className="sm:hidden">BOS exclusive</span>
            <span className="hidden sm:inline">Exclusive to Black Owned Sheffield</span>
          </p>
        ) : (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-wider text-espresso uppercase">
            <BadgePercent className="h-3.5 w-3.5" aria-hidden /> Special offer
          </p>
        )}
        <h2 id={`${id}-title`} className="mt-4 font-heading text-2xl font-extrabold text-espresso sm:text-3xl">
          {offer.title}
        </h2>
        <p className="mt-2 text-espresso/90">{offer.details}</p>
        {offer.code && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold tracking-wider text-espresso uppercase">Your code</p>
            <CopyCode code={offer.code} />
          </div>
        )}
        <p className="mt-5 text-sm font-semibold text-espresso/85">
          {offer.expires ? `Ends ${formatLongDate(offer.expires)}. ` : ""}
          {offer.code ? "Use the code when you book or order." : "Mention Black Owned Sheffield when you book or order."}
        </p>
      </div>
    </section>
  );
}

function ShareBox({ business: b, wide = false, className }: { business: Business; wide?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[1.5rem] border-2 border-dashed border-espresso/30 bg-cream-deep p-5 sm:p-6",
        wide && "gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="font-heading text-lg font-extrabold">Spread the word</p>
        <p className="mt-1 text-sm text-cocoa">Know someone who&rsquo;d love {b.name}? Send them this page.</p>
        <ShareButton
          className={cn("mt-4", wide ? "w-full sm:w-auto" : "w-full")}
          title={b.name}
          text={`${b.name}: ${b.tagline}`}
          path={`/directory/${b.slug}`}
        />
      </div>
      <div className={cn(wide ? "shrink-0 sm:text-right" : "mt-5 border-t-2 border-espresso/10 pt-5")}>
        <p className={cn("flex items-center gap-2 font-heading font-extrabold", wide && "sm:justify-end")}>
          <PencilLine className="h-4 w-4" aria-hidden /> Is this your business?
        </p>
        <Link
          href={`/contact?subject=listing&business=${encodeURIComponent(b.slug)}`}
          className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-rose-ink underline decoration-2 underline-offset-4"
        >
          Claim or update this listing <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export default async function BusinessProfilePage({ params }: PageProps<"/directory/[slug]">) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) notFound();

  const cat = categoryMap[b.category];
  const area = areaMap[b.area];
  const region = regionMap[b.region];
  const related = relatedBusinesses(businesses, b, 3);
  const paragraphs = b.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const socials = (Object.entries(b.socials) as [keyof Socials, string | undefined][]).filter(
    (e): e is [keyof Socials, string] => !!e[1],
  );
  const directions = directionsUrl(b);
  const pinnable = isPinnable(b);
  const categoryIds = [b.category, ...(b.secondaryCategories ?? [])];
  const offerExpired = b.offer?.expires ? b.offer.expires < new Date().toISOString().slice(0, 10) : false;

  return (
    <div className="relative">
      {!b.sample && <JsonLd data={localBusinessJsonLd(b)} />}

      {/* ───── Header ───── */}
      <section className="grain relative overflow-hidden bg-cream-deep pt-8 pb-12 sm:pt-10 lg:pb-16">
        <Blob color={cat.color} className="absolute -top-40 -right-40 h-[30rem] w-[30rem] opacity-40" />
        <Squiggle color={cat.color === "#e7c39c" ? "#a8693d" : cat.color} className="absolute bottom-8 left-[42%] hidden h-10 w-32 opacity-70 lg:block" />
        <Container className="relative">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-cocoa/80">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <Link href="/directory" className="hover:underline">
                  Directory
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <Link href={`/directory/category/${cat.id}`} className="hover:underline">
                  {cat.label}
                </Link>
              </li>
              <li className="flex min-w-0 items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span aria-current="page" className="truncate text-espresso">
                  {b.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="order-2 lg:order-1 lg:col-span-6">
              <div className="flex items-end gap-4">
                <BusinessLogo business={b} size={96} className="rounded-[1.5rem] shadow-pop" />
                <div className="flex flex-wrap gap-2 pb-1">
                  {b.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal px-3 py-1 text-xs font-bold text-cream">
                      <BadgeCheck className="h-4 w-4" aria-hidden /> Verified
                    </span>
                  )}
                  {(b.tier === "featured" || b.featured) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-espresso bg-sunflower px-3 py-0.5 text-xs font-bold text-espresso">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden /> Featured
                    </span>
                  )}
                  {b.sample && (
                    <span className="inline-flex items-center rounded-full bg-espresso px-3 py-1 text-[11px] font-bold tracking-wider text-cream uppercase">
                      Sample
                    </span>
                  )}
                </div>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Categories">
                {categoryIds.map((id, i) => {
                  const c = categoryMap[id];
                  return (
                    <li key={id}>
                      <Link
                        href={`/directory/category/${id}`}
                        className={cn(
                          "inline-flex min-h-10 items-center gap-2 rounded-full border-2 py-1 pr-3.5 pl-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5",
                          i === 0 ? "border-espresso bg-white text-espresso shadow-pop-sm" : "border-espresso/15 bg-cream text-cocoa hover:border-espresso/50",
                        )}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-espresso" style={{ backgroundColor: c.color, color: c.ink }}>
                          <CategoryIcon id={id} className="h-3 w-3" />
                        </span>
                        {c.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h1 className="mt-4 font-heading text-4xl leading-[1.02] font-extrabold text-espresso sm:text-5xl lg:text-6xl">{b.name}</h1>
              <p className="mt-3 font-heading text-xl leading-snug font-semibold text-cocoa sm:text-2xl">{b.tagline}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-cocoa">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  {b.onlineOnly ? <Truck className="h-4 w-4 text-rose" aria-hidden /> : <MapPin className="h-4 w-4 text-rose" aria-hidden />}
                  {b.onlineOnly ? (b.serviceArea ?? "Online & delivery") : placeLabel(b)}
                </span>
                {b.established && <span className="font-semibold">Since {b.established}</span>}
                <OpenStatusPill hours={b.hours} kind={b.hoursKind} />
              </div>

              <ProfileActionBar business={b} className="mt-8 hidden md:flex" />
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-espresso"
                  // Real covers sit on the category colour; generated covers already are it, so use espresso
                  style={{ backgroundColor: b.cover ? cat.color : "#2a1910" }}
                />
                <div className="relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-white">
                  <BusinessCover business={b} className="aspect-[1200/630]" sizes="(min-width: 1024px) 50vw, 100vw" priority />
                </div>
                {b.offer && !offerExpired && (
                  <a
                    href="#offer"
                    className="absolute -bottom-4 left-4 inline-flex min-h-11 -rotate-3 items-center gap-2 rounded-2xl border-2 border-espresso bg-pink px-4 py-2 font-heading text-sm font-extrabold text-espresso shadow-pop-sm transition-transform hover:rotate-0"
                  >
                    <BadgePercent className="h-4 w-4" aria-hidden />
                    {b.offer.exclusive ? "BOS exclusive offer" : "Special offer"}
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Body ───── */}
      <Section tone="cream" className="pt-12 sm:pt-16">
        {b.sample && (
          <div className="mb-10 flex items-start gap-3 rounded-[1.25rem] border-2 border-dashed border-espresso/30 bg-cream-deep p-4 text-sm text-cocoa">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-espresso" aria-hidden />
            <p>
              <strong className="text-espresso">This is a sample listing.</strong> It shows how profiles look while the directory fills up.
              The business, phone number and email are made up, so please don&rsquo;t contact them.
            </p>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7">
            {/* The offer leads the main column, so it is the first thing under the header */}
            {b.offer && !offerExpired && <OfferCard offer={b.offer} id="offer" />}
            <section aria-labelledby="about">
              <h2 id="about" className="font-heading text-3xl font-extrabold sm:text-4xl">
                About {b.name}
              </h2>
              <div className="prose-bos mt-5">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {b.services.length > 0 && (
              <section aria-labelledby="services">
                <h2 id="services" className="font-heading text-2xl font-extrabold">
                  Services
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {b.services.map((s) => (
                    <li key={s} className="inline-flex items-center gap-2 rounded-full border-2 border-espresso/15 bg-white px-4 py-2 text-[15px] font-semibold text-espresso">
                      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color === "#e7c39c" ? "#a8693d" : cat.color }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {b.highlights && b.highlights.length > 0 && (
              <section aria-labelledby="highlights">
                <h2 id="highlights" className="font-heading text-2xl font-extrabold">
                  Good to know
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {b.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 rounded-2xl bg-cream-deep px-4 py-3 font-semibold text-espresso">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
                        <Check className="h-4 w-4" aria-hidden />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {b.founder && (
              <figure className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-blush p-6 shadow-pop sm:p-10">
                <Quote className="h-10 w-10 text-rose" aria-hidden />
                {b.founder.quote && (
                  <blockquote className="mt-4 font-heading text-2xl leading-snug font-bold text-espresso sm:text-3xl">
                    &ldquo;{b.founder.quote}&rdquo;
                  </blockquote>
                )}
                <figcaption className="mt-6 flex items-center gap-4">
                  {b.founder.photo && (
                    <Image
                      src={b.founder.photo}
                      alt={b.founder.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full border-2 border-espresso object-cover"
                    />
                  )}
                  <span>
                    <span className="block font-heading text-lg font-extrabold">{b.founder.name}</span>
                    <span className="block text-sm text-cocoa">
                      {b.founder.role}, {b.name}
                    </span>
                  </span>
                </figcaption>
              </figure>
            )}

            {b.photos && b.photos.length > 0 && (
              <section aria-labelledby="photos">
                <h2 id="photos" className="font-heading text-2xl font-extrabold">
                  Photos
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {b.photos.map((photo, i) => (
                    <li
                      key={photo.src}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border-2 border-espresso bg-sand",
                        i === 0 && b.photos!.length > 2 ? "col-span-2 row-span-2 aspect-square" : "aspect-square",
                      )}
                    >
                      <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Desktop: here, so the two columns end at about the same height */}
            <ShareBox business={b} wide className="hidden lg:flex" />
          </div>

          <aside className="space-y-6 lg:col-span-5" aria-label={`${b.name} details`}>
            <Card title={b.hoursKind === "office" ? "Office hours" : "Opening hours"} id="hours">
              <OpeningHoursTable hours={b.hours} note={b.hoursNote} kind={b.hoursKind} />
            </Card>

            <Card title="Location" id="location">
              {pinnable ? (
                <>
                  <BusinessMap
                    businesses={[b]}
                    single
                    zoom={15}
                    label={`Map showing where ${b.name} is`}
                    className="aspect-[4/3] rounded-2xl border-2 border-espresso"
                  />
                  <address className="mt-4 text-[15px] leading-relaxed text-espresso not-italic">
                    <span className="font-semibold">{b.address}</span>
                    {b.postcode && <span className="block text-cocoa">{b.postcode}</span>}
                    {area && area.label !== region.label && (
                      <span className="block text-sm text-cocoa">
                        {area.label}, {region.label}
                      </span>
                    )}
                  </address>
                </>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl bg-cream-deep p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
                    <Truck className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-[15px] text-espresso">
                    <span className="block font-heading font-extrabold">Online, delivery or mobile</span>
                    {b.onlineOnly ? "No shopfront to visit." : `Based in ${placeLabel(b)}.`}
                  </p>
                </div>
              )}
              {b.serviceArea && (
                <p className="mt-4 text-sm text-cocoa">
                  <span className="font-bold text-espresso">Serves:</span> {b.serviceArea}
                </p>
              )}
              {directions && !b.onlineOnly && (
                <ButtonLink href={directions} variant="outline" className="mt-5 w-full" icon={<Navigation className="h-4 w-4" />}>
                  Get directions
                </ButtonLink>
              )}
            </Card>

            <Card title="Get in touch" id="contact">
              <ul className="space-y-3 text-[15px]">
                {b.contact.phone && (
                  <li>
                    <a href={telHref(b.contact.phone)} className="group flex items-center gap-3 font-semibold text-espresso">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep group-hover:bg-blush">
                        <Phone className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="underline-offset-4 group-hover:underline">{b.contact.phone}</span>
                    </a>
                  </li>
                )}
                {b.contact.email && (
                  <li>
                    <a href={`mailto:${b.contact.email}`} className="group flex items-center gap-3 font-semibold break-all text-espresso">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-deep group-hover:bg-blush">
                        <Mail className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="underline-offset-4 group-hover:underline">{b.contact.email}</span>
                    </a>
                  </li>
                )}
                {b.contact.website && (
                  <li>
                    <a href={b.contact.website} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 font-semibold text-espresso">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-deep group-hover:bg-blush">
                        <Globe className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="underline-offset-4 group-hover:underline">{displayUrl(b.contact.website)}</span>
                    </a>
                  </li>
                )}
                {b.contact.bookingUrl && b.contact.bookingUrl !== b.contact.website && (
                  <li>
                    <a href={b.contact.bookingUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 font-semibold text-espresso">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-deep group-hover:bg-blush">
                        <CalendarCheck className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="underline-offset-4 group-hover:underline">Book or make an enquiry</span>
                    </a>
                  </li>
                )}
              </ul>
              {socials.length > 0 && (
                <>
                  <p className="mt-6 font-heading text-sm font-bold tracking-wide text-cocoa uppercase">Follow</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {socials.map(([key, url]) => {
                      const { label, Icon } = socialMeta[key];
                      return (
                        <li key={key}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-white px-4 text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-blush hover:shadow-pop-sm"
                            aria-label={`${b.name} on ${label} (opens in a new tab)`}
                          >
                            <Icon size={18} />
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {!b.contact.phone && !b.contact.email && !b.contact.website && socials.length === 0 && (
                <p className="text-sm text-cocoa">Contact details coming soon.</p>
              )}
            </Card>

            {/* On phones it closes the sidebar; on desktop it sits under the main column (below) */}
            <ShareBox business={b} className="lg:hidden" />
          </aside>
        </div>
      </Section>

      {/* ───── Related ───── */}
      {related.length > 0 && (
        <Section tone="deep">
          <SectionHeading
            eyebrow="Keep exploring"
            title={`More like ${b.name}`}
            description={`More in ${cat.label.toLowerCase()}, plus other Black-owned businesses near ${area?.label ?? region.label}.`}
            action={
              <ButtonLink href={`/directory/category/${cat.id}`} variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                All {cat.label.toLowerCase()}
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <BusinessCard business={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ProfileStickyBar business={b} />
    </div>
  );
}
