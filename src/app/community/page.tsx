import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ClipboardCheck,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Phone,
  PiggyBank,
  Smartphone,
  Sparkles,
  Sprout,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { StoryCard } from "@/components/cards/StoryCard";
import { CommunityArt } from "@/components/community/CommunityArt";
import { LinkCard } from "@/components/community/LinkCard";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Blob, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import {
  collaborationAudiences,
  communityProjects,
  communityResources,
  employmentLinks,
  volunteerRoles,
  youthProgrammes,
} from "@/content/community";
import { events } from "@/content/events";
import { stories } from "@/content/stories";
import { site, ogBase } from "@/lib/site";

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

export const metadata: Metadata = {
  title: "Community: projects, young people, jobs and volunteering",
  description:
    "Black Owned Sheffield is for the whole community, not just businesses. Our community projects, youth programmes, jobs and volunteering, community stories, and ways for groups, schools and faith organisations to work with us.",
  alternates: { canonical: "/community" },
  openGraph: {
    ...ogBase,
    title: "Community | Black Owned Sheffield",
    description: "Projects, young people, jobs, volunteering and local support, from Sheffield's home for Black-owned business.",
    url: "/community",
    // Pages that set openGraph replace the inherited one, so point at the default image explicitly
    images: [ogImage],
  },
  // Likewise for twitter: without this the card shows the site-wide title and description
  twitter: {
    card: "summary_large_image",
    title: "Community | Black Owned Sheffield",
    description: "Projects, young people, jobs, volunteering and local support, from Sheffield's home for Black-owned business.",
    images: [ogImage],
  },
};

const icons: Record<string, LucideIcon> = {
  Store,
  Smartphone,
  Camera,
  Sprout,
  ClipboardCheck,
  PiggyBank,
  Users,
  HeartHandshake,
  GraduationCap,
  Sparkles,
};

const jumpLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#young-people", label: "Young people" },
  { href: "#jobs", label: "Jobs" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "#stories", label: "Stories" },
  { href: "#work-together", label: "Work with us" },
  { href: "#resources", label: "Help & advice" },
];

const mosaic = [
  { motif: "people", color: "#f6bd3c", accent: "#e0628f", word: "Together" },
  { motif: "spark", color: "#f2a0bd", accent: "#167a6f", word: "Youth" },
  { motif: "book", color: "#167a6f", accent: "#f6bd3c", word: "Learning" },
  { motif: "heart", color: "#1f2a63", accent: "#ee6a35", word: "Care" },
] as const;

export default function CommunityPage() {
  const communityStories = stories.filter((s) => s.category === "community");
  // Sample programmes follow the site-wide sample switch, and a link to an event
  // page is only shown while that event is published
  const programmes = youthProgrammes
    .filter((y) => site.showSampleContent || !y.sample)
    .map((y) =>
      y.href?.startsWith("/events/") && !events.some((e) => `/events/${e.slug}` === y.href)
        ? { ...y, href: undefined, linkLabel: undefined }
        : y,
    );

  return (
    <>
      <PageHero
        crumbs={[{ label: "Community" }]}
        eyebrow="Community"
        accent="sunflower"
        title={
          <>
            Here for the <PinkSticker className="px-4 text-[0.9em]">whole</PinkSticker> community
          </>
        }
        description={
          <p>
            We started with businesses, but it&apos;s always been about people. Community projects, young people, jobs,
            volunteering, and the groups that hold Sheffield together.
          </p>
        }
      >
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-2">
            {/* The stories section only renders when there are community stories */}
            {jumpLinks
              .filter((l) => l.href !== "#stories" || communityStories.length > 0)
              .map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex h-11 items-center rounded-full border-2 border-espresso bg-cream px-4 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-pink hover:shadow-pop-sm"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </PageHero>
      <StripeBand />

      {/* Poster mosaic: art, not stock photos */}
      <div aria-hidden className="relative z-10 bg-cream pt-10 sm:pt-14">
        <Container>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {mosaic.map((m, i) => (
              <CommunityArt
                key={m.word}
                motif={m.motif}
                color={m.color}
                accent={m.accent}
                word={m.word}
                className={`aspect-[4/3] rounded-[1.5rem] border-2 border-espresso ${i % 2 ? "lg:translate-y-6" : ""}`}
              />
            ))}
          </div>
        </Container>
      </div>

      {/* ───────── Community projects ───────── */}
      <Section id="projects" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Community projects"
          title="What we've been up to"
          description="Real projects, in real places. These are the things we've done, or are doing right now, beyond the directory."
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {communityProjects.map((p) => (
            <li key={p.id}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop has-[a:focus-visible]:-translate-y-1 has-[a:focus-visible]:shadow-pop has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-[3px] has-[a:focus-visible]:outline-rose has-[a:focus-visible]:outline-solid">
                <CommunityArt motif={p.motif} color={p.color} accent={p.accent} word={p.word} className="aspect-[16/10] border-b-2 border-espresso" />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <Badge tone="pink" className="self-start">
                    {p.status}
                  </Badge>
                  <h3 className="mt-3 font-heading text-xl font-extrabold leading-snug text-espresso">
                    {/* The whole card is the link; the card shows the focus ring instead */}
                    <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 font-medium text-espresso">{p.summary}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{p.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-sm font-bold text-espresso">
                    {p.linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      {/* ───────── Youth programmes ───────── */}
      <Section id="young-people" tone="espresso" className="scroll-mt-20 overflow-hidden">
        <Sunburst color="#f6bd3c" className="absolute -top-16 -right-16 hidden h-56 w-56 animate-spin-slow opacity-80 md:block" />
        <Blob color="#55321f" className="absolute -bottom-24 -left-24 h-80 w-80" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Youth programmes"
            title={
              <>
                What we&apos;re <ToneText onDark>building</ToneText>
              </>
            }
            description="One of our biggest goals is helping young people feel confident starting a business. These programmes are in the works. Here's the plan."
          />
          <figure className="mb-10 max-w-3xl rounded-[1.5rem] border-2 border-cream/15 bg-cream/5 p-6 sm:p-8">
            <blockquote className="font-heading text-2xl font-bold leading-snug text-cream sm:text-3xl">
              &ldquo;You can do it, and there&apos;s a community for people to network with here.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-pink">Asha, co-founder, speaking to Exposed Magazine in 2022</figcaption>
          </figure>
          <ul className="grid gap-5 md:grid-cols-3">
            {programmes.map((y) => (
              <li
                key={y.id}
                className="flex flex-col rounded-[1.5rem] border-2 border-espresso bg-cream p-6 text-espresso shadow-[5px_5px_0_0_var(--color-pink)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-espresso px-2.5 py-0.5 text-xs font-bold" style={{ backgroundColor: y.color }}>
                    {y.stage}
                  </span>
                  {y.sample && (
                    <span className="rounded-full bg-espresso/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
                      Sample
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-heading text-2xl font-extrabold leading-tight">{y.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{y.body}</p>
                <ul className="mt-4 space-y-2 text-[15px]">
                  {y.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: y.color === "#f6bd3c" ? "#a8693d" : y.color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                {y.href && (
                  <Link
                    href={y.href}
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-5 font-heading text-sm font-bold text-espresso underline decoration-2 underline-offset-4 hover:decoration-rose"
                  >
                    {y.linkLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-cream/70">
            Parents, carers, teachers and youth workers:{" "}
            <Link href="/join/partner" className="font-semibold text-pink underline underline-offset-2">
              tell us what young people near you need
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* ───────── Employment ───────── */}
      <Section id="jobs" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Employment"
          title="Jobs, skills and employers"
          description="Looking for work, or looking to hire? Start here. Members get our Business Opportunities board; everyone gets the links."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {employmentLinks.map((l) => (
            <li key={l.title}>
              <LinkCard item={l} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ───────── Volunteering ───────── */}
      <Section id="volunteer" tone="pink" className="scroll-mt-20 overflow-hidden">
        <Squiggle color="#ee6a35" className="absolute top-10 right-8 hidden h-10 w-32 md:block" />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              className="mb-6 sm:mb-8"
              eyebrow="Volunteering"
              title="Give a few hours, make a big difference"
              description="Black Owned Sheffield runs on people who care. Help at a market, tell a founder's story, or keep the directory accurate. Aged 16 or over, with any amount of time."
            />
            <ButtonLink href="/join/volunteer" variant="primary" size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
              Volunteer with us
            </ButtonLink>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {volunteerRoles.map((r) => {
              const Icon = icons[r.icon] ?? HandHeart;
              return (
                <li key={r.title} className="flex items-start gap-4 rounded-[1.25rem] border-2 border-espresso bg-white p-4">
                  <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
                    <Icon className="h-5 w-5 text-espresso" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-espresso">{r.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-cocoa">{r.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ───────── Community stories ───────── */}
      {communityStories.length > 0 && (
        <Section id="stories" className="scroll-mt-20">
          <SectionHeading
            eyebrow="Community stories"
            title="From the community"
            action={
              <ButtonLink href="/stories" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
                All stories
              </ButtonLink>
            }
          />
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {communityStories.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
            <li>
              <Link
                href="/contact?subject=story"
                className="group flex h-full min-h-64 flex-col justify-between rounded-[1.5rem] border-2 border-dashed border-espresso/40 bg-cream-deep p-6 transition-all hover:-translate-y-1 hover:border-espresso hover:bg-blush sm:p-8"
              >
                <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-espresso bg-sunflower">
                  <HandHeart className="h-7 w-7 text-espresso" />
                </span>
                <span>
                  <span className="block font-heading text-2xl font-extrabold leading-tight text-espresso">
                    Got a community story?
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-cocoa">
                    A project, a person or a moment that deserves to be seen. Tell us and we might feature it.
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-espresso">
                    Share it with us <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </Section>
      )}

      {/* ───────── Collaboration ───────── */}
      <Section id="work-together" tone="deep" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Collaboration"
          title="Let's do it together"
          description="Community groups, faith groups, schools and youth organisations already do brilliant work. We'd love to bring businesses, markets and founders to it."
          action={
            <ButtonLink href="/join/partner" variant="pink" iconRight={<ArrowRight className="h-4 w-4" />}>
              Become a partner
            </ButtonLink>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collaborationAudiences.map((a) => {
            const Icon = icons[a.icon] ?? Users;
            return (
              <li key={a.title} className="relative overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white p-6">
                <span aria-hidden className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-90" style={{ backgroundColor: a.color }} />
                <span aria-hidden className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso bg-cream">
                  <Icon className="h-6 w-6 text-espresso" />
                </span>
                <h3 className="relative mt-5 font-heading text-xl font-extrabold text-espresso">{a.title}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-cocoa">{a.body}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ───────── Resources ───────── */}
      <Section id="resources" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Resources"
          title="Help and advice"
          description="Trusted public services for money, work, housing and wellbeing. These are external sites we don't run, so they'll open in a new tab."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communityResources.map((r) => (
            <li key={r.title}>
              <LinkCard item={r} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] border-2 border-rose bg-blush p-5 text-espresso">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-rose-ink" aria-hidden />
          <p className="text-[15px] leading-relaxed">
            <strong className="font-heading">Need help right now?</strong> In an emergency, call{" "}
            <a href="tel:999" className="font-bold underline underline-offset-2">
              999
            </a>
            . For someone to talk to, any time, call Samaritans free on{" "}
            <a href="tel:116123" className="font-bold underline underline-offset-2">
              116 123
            </a>
            .
          </p>
        </div>
      </Section>

      <CtaBand
        tone="sunflower"
        className="pt-0 sm:pt-0"
        title="Running something for the community?"
        description="A project, a club, a fundraiser or an idea that needs a hand. Tell us about it and we'll help spread the word."
        actions={
          <>
            <ButtonLink href="/contact" variant="primary" size="lg" iconRight={<ArrowRight className="h-5 w-5" />}>
              Tell us about it
            </ButtonLink>
            <ButtonLink href="/join/volunteer" variant="outline" size="lg">
              Volunteer
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
