import { ArrowRight, BriefcaseBusiness, CheckCircle2, KeyRound, Lock, LogIn, MailCheck, UserPlus } from "lucide-react";
import { supportResourceCount, supportSections } from "@/content/support";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, StripeBand } from "@/components/ui/Shapes";
import { PinkSticker } from "@/components/ui/ToneText";
import { LockedPreview } from "./LockedPreview";
import { MemberPass } from "./MemberPass";
import { OpportunitiesTile, SectionTile } from "./SectionTile";

const LOGIN_HREF = "/members/login?next=/business-support";

const steps = [
  {
    Icon: UserPlus,
    title: "Join as a member",
    body: "Tell us a bit about you and your business. Membership is free while we launch.",
  },
  {
    Icon: MailCheck,
    title: "Get your access code",
    body: "Once your membership is approved, we'll email you an access code.",
  },
  {
    Icon: KeyRound,
    title: "Come on in",
    body: "Log in to browse resources, request 1:1 help and see opportunities as they land.",
  },
];

/** Public view of /business-support for anyone who isn't signed in */
export function SupportTeaser({ signedOut = false }: { signedOut?: boolean }) {
  return (
    <>
      <section className="grain relative overflow-hidden bg-espresso pt-10 pb-16 text-cream sm:pt-14 sm:pb-24">
        <Blob color="#f2a0bd" className="absolute -top-28 -right-24 h-80 w-80 opacity-30 sm:h-[28rem] sm:w-[28rem]" />
        <Blob color="#7a4a2e" className="absolute -bottom-32 -left-24 h-80 w-80 opacity-60" />
        <Squiggle color="#f6bd3c" className="absolute right-[8%] bottom-10 hidden h-10 w-32 md:block lg:hidden" />
        <Dots color="#f2a0bd" className="absolute top-12 left-[46%] hidden h-12 w-12 opacity-60 lg:block" />
        <Container className="relative">
          {signedOut && (
            <p
              role="status"
              className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-cream/20 bg-cream/10 px-4 py-2 text-sm font-semibold text-cream"
            >
              <CheckCircle2 className="h-4 w-4 text-pink" aria-hidden />
              You&apos;ve signed out. See you soon.
            </p>
          )}
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] xl:gap-20">
            <div className="max-w-3xl">
              <Eyebrow dark>
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Members&apos; area
              </Eyebrow>
              <h1 className="mt-4 font-heading text-5xl font-extrabold leading-[0.98] sm:text-6xl lg:text-7xl">
                Business Support{" "}
                <PinkSticker className="mt-3 align-middle text-2xl sm:mt-0 sm:text-4xl">(members only)</PinkSticker>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80 sm:text-xl">
                Funding, advice, mentoring and live opportunities for Black-owned businesses across Sheffield, Rotherham,
                Doncaster and Chesterfield. Handpicked, checked and in one place, with real people behind it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <span className="relative inline-flex">
                  <ButtonLink
                    href="/join/member"
                    variant="pink"
                    size="lg"
                    className="w-full"
                    iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}
                  >
                    Become a member <span className="sr-only">(free while we launch)</span>
                  </ButtonLink>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-3 -right-2 rotate-6 rounded-full border-2 border-espresso bg-sunflower px-2.5 py-0.5 font-heading text-[11px] font-extrabold uppercase tracking-wide text-espresso shadow-pop-sm"
                  >
                    Free while we launch
                  </span>
                </span>
                <ButtonLink
                  href={LOGIN_HREF}
                  variant="outline"
                  size="lg"
                  icon={<LogIn className="h-5 w-5" aria-hidden />}
                  className="border-cream/60 text-cream hover:border-cream hover:bg-cream hover:text-espresso"
                >
                  Member login
                </ButtonLink>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-cream/80">
                <li className="inline-flex items-center gap-2">
                  <span className="font-display text-2xl text-pink">{supportSections.length}</span> support areas
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="font-display text-2xl text-sunflower">{supportResourceCount}</span> handpicked resources
                </li>
                <li className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-latte" aria-hidden /> Business Opportunities board
                </li>
              </ul>
            </div>
            <MemberPass className="mx-auto hidden w-full max-w-sm lg:block" />
          </div>
        </Container>
      </section>
      <StripeBand />

      <Section tone="cream">
        <SectionHeading
          eyebrow="What's inside"
          title="Everything you need to start, run and grow"
          description="Ten support areas, each with links we've checked, guides worth reading and BOS services you can request with one click."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {supportSections.map((s) => (
            <li key={s.id}>
              <SectionTile section={s} locked />
            </li>
          ))}
          {/* Spans two columns so the last row fills at 2, 3 and 4 columns (10 sections + this) */}
          <li className="sm:col-span-2">
            <OpportunitiesTile locked />
          </li>
        </ul>
      </Section>

      <Section tone="deep">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>A peek inside</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] text-espresso sm:text-4xl lg:text-5xl">
              Your members&apos; lounge for business
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cocoa">
              Think of it as a well-stocked back office, run by people who want you to win. No jargon, no sifting
              through dead links, no gatekeeping once you&apos;re in.
            </p>
            <ul className="mt-6 space-y-3 text-cocoa">
              {[
                "Funding finders, grants and a second read of your application",
                "1:1 advice sessions and mentor matching, on request",
                "Workshops and training, with what's coming up next",
                "Contracts, tenders and jobs with live deadline countdowns",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <LockedPreview loginHref={LOGIN_HREF} />
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="How it works" title="Three steps and you're in" align="center" />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(({ Icon, title, body }, i) => (
            <li key={title} className="relative rounded-[1.5rem] border-2 border-espresso bg-white p-6 pt-8">
              <span className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-espresso bg-sunflower font-display text-lg text-espresso shadow-pop-sm">
                {i + 1}
              </span>
              <Icon className="h-8 w-8 text-rose" aria-hidden />
              <h3 className="mt-4 font-heading text-xl font-extrabold text-espresso">{title}</h3>
              <p className="mt-2 text-cocoa">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        tone="espresso"
        title="Ready to come in?"
        description="Join free while we launch, or log in with the access code from your membership email."
        actions={
          <>
            <ButtonLink href="/join/member" variant="pink" size="lg">
              Become a member
            </ButtonLink>
            <ButtonLink href={LOGIN_HREF} variant="cream" size="lg" icon={<LogIn className="h-5 w-5" aria-hidden />}>
              Member login
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
