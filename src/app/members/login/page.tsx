import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Coffee, HandCoins, HeartHandshake, LockKeyhole, Mail } from "lucide-react";
import { getSession, hasRole } from "@/lib/session";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { Blob, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { ToneText } from "@/components/ui/ToneText";
import { LogoBadge } from "@/components/brand/Logo";
import { LoginForm } from "@/components/support/LoginForm";
import { SignOutButton } from "@/components/support/SignOutButton";
import { safeNext } from "@/components/support/safe-next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member login",
  description:
    "Log in to Black Owned Sheffield's members-only Business Support area with the access code from your membership email.",
  robots: { index: false, follow: true },
};

const perks = [
  { Icon: HandCoins, text: "Funding finders, grants and application reviews" },
  { Icon: Coffee, text: "1:1 advice sessions and mentor matching" },
  { Icon: BriefcaseBusiness, text: "Contracts, tenders and jobs, kept up to date by the BOS team" },
  { Icon: HeartHandshake, text: "Workshops, training and networking" },
];

export default async function MemberLoginPage(props: PageProps<"/members/login">) {
  const searchParams = await props.searchParams;
  const next = safeNext(searchParams.next);
  const signedIn = await hasRole("member");
  const session = signedIn ? await getSession() : null;

  return (
    <section className="grain relative overflow-hidden bg-cream-deep py-10 sm:py-16 lg:py-20">
      <Blob color="#f2a0bd" className="absolute -top-24 -right-24 h-72 w-72 opacity-50 sm:h-96 sm:w-96" />
      <Squiggle color="#ee6a35" className="absolute bottom-10 left-[6%] hidden h-10 w-32 md:block" />
      <Container className="relative">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border-2 border-espresso bg-white shadow-pop lg:grid-cols-[1fr_1.1fr]">
          {/* Form panel */}
          <div className="p-6 sm:p-10">
            {signedIn ? (
              <div className="flex h-full flex-col justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-espresso bg-sunflower shadow-pop-sm">
                  <CheckCircle2 className="h-7 w-7 text-espresso" aria-hidden />
                </span>
                <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight break-words text-espresso sm:text-4xl">
                  You&apos;re signed in{session?.name ? `, ${session.name}` : ""}
                </h1>
                <p className="mt-3 text-cocoa">Your members&apos; area is ready when you are.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <ButtonLink href={next} size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
                    {next === "/business-support" ? "Go to Business Support" : "Carry on where you were"}
                  </ButtonLink>
                  <SignOutButton size="md" />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-heading text-3xl font-extrabold leading-tight text-espresso sm:text-4xl">
                  Member login
                </h1>
                <p className="mt-3 text-cocoa">
                  Members get an access code by email when their membership is approved. Pop it in below.
                </p>
                <div className="mt-8">
                  <LoginForm next={next} />
                </div>
                <div className="mt-8 rounded-2xl bg-blush p-5">
                  <p className="font-heading font-extrabold text-espresso">Not a member yet?</p>
                  <p className="mt-1 text-sm text-cocoa">
                    Join free while we launch. Tell us about you and your business, and we&apos;ll email your access
                    code once you&apos;re approved.
                  </p>
                  <Link
                    href="/join/member"
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-rose-ink underline-offset-4 hover:underline"
                  >
                    Become a member
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <p className="mt-6 flex items-start gap-2 text-sm text-cocoa/90">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
                  <span>
                    Lost your code? Email{" "}
                    <a href={`mailto:${site.email}`} className="font-semibold text-rose-ink underline underline-offset-4">
                      {site.email}
                    </a>{" "}
                    or{" "}
                    <Link href="/contact" className="font-semibold text-rose-ink underline underline-offset-4">
                      get in touch
                    </Link>
                    .
                  </span>
                </p>
              </>
            )}
          </div>
          {/* Lounge panel */}
          <div className="grain relative overflow-hidden bg-espresso p-6 text-cream sm:p-10 lg:order-first">
            <Sunburst color="#f6bd3c" className="absolute -right-10 -bottom-10 h-40 w-40 animate-spin-slow opacity-70" />
            <Blob color="#e0628f" className="absolute -top-16 -left-20 h-56 w-56 opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <LogoBadge size={52} />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1 text-xs font-bold uppercase tracking-wider text-espresso">
                  <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
                  Members only
                </span>
              </div>
              <p className="mt-8 font-heading text-sm font-bold uppercase tracking-[0.18em] text-pink">
                Business Support
              </p>
              <p className="mt-2 font-heading text-3xl font-extrabold leading-[1.05] sm:text-4xl">
                The <ToneText onDark>members&apos;</ToneText> lounge
              </p>
              <p className="mt-4 text-cream/80">
                A well-stocked back office for Black-owned businesses in South Yorkshire, run by people who want you to
                win.
              </p>
              <ul className="mt-8 space-y-3">
                {perks.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-[15px] text-cream/90">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cream/10">
                      <Icon className="h-4 w-4 text-pink" aria-hidden />
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Container>
      <StripeBand className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
