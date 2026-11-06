import type { Metadata } from "next";
import {
  ArrowRight,
  BadgePercent,
  CalendarClock,
  GraduationCap,
  Lock,
  Megaphone,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Section, SectionHeading } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { FaqList, JoinOptionCards, ProcessSteps, TiersComparison, joinFaqs } from "@/components/join/hub";
import { HeroFacts } from "@/components/join/panels";
import { site, ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join us",
  description:
    "Add your Black-owned business to the free directory, become a member, partner with us or volunteer. Apply online in minutes. Sheffield, Rotherham, Doncaster and Chesterfield.",
  alternates: { canonical: "/join" },
  openGraph: {
    ...ogBase,
    title: "Join Black Owned Sheffield",
    description:
      "List your business for free, become a member, partner with us or volunteer. Every application is online and takes minutes.",
    url: "/join",
  },
};

const memberBenefits = [
  {
    icon: Lock,
    title: "Business Support hub",
    text: "Our members-only hub of guides, tools and support, unlocked with your access code.",
    color: "bg-sunflower",
  },
  {
    icon: GraduationCap,
    title: "Workshops",
    text: "Practical sessions on the things that help you grow, from funding to marketing.",
    color: "bg-white",
  },
  {
    icon: Megaphone,
    title: "Business Opportunities board",
    text: "Grants, tenders, markets and calls for suppliers, gathered in one place.",
    color: "bg-white",
  },
  {
    icon: BadgePercent,
    title: "Member offers",
    text: "Offers from Black-owned businesses and partners, just for members.",
    color: "bg-white",
  },
  {
    icon: Users,
    title: "Community",
    text: "A friendly network to share wins, swap advice and cheer each other on.",
    color: "bg-white",
  },
];

export default function JoinPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Join us" }]}
        eyebrow="Join us"
        accent="sunflower"
        title={
          <>
            Join <ToneText pop className="font-normal">Black Owned</ToneText>{" "}
            <PinkSticker className="font-normal">Sheffield</PinkSticker>
          </>
        }
        description={
          <p>
            List your business for free, become a member, partner with us or give a little time. Every application is
            online and takes minutes. No emails, no paperwork.
          </p>
        }
      >
        <HeroFacts
          items={[
            { icon: Sparkles, label: "Free directory listing" },
            { icon: Timer, label: "Apply in minutes" },
            { icon: CalendarClock, label: `We reply within ${site.replyTime}` },
          ]}
        />
      </PageHero>

      <Section id="options" className="pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Pick your path"
          title="Four ways to be part of it"
          description="Whether you run a business, want to start one, work for an organisation that wants to help, or just have a few hours spare, there's a place for you here."
        />
        <JoinOptionCards />
      </Section>

      <Section tone="deep" id="what-happens-next">
        <SectionHeading
          align="center"
          eyebrow="What happens next"
          title="From form to family in three steps"
        />
        <ProcessSteps />
      </Section>

      <Section id="listings">
        <SectionHeading
          eyebrow="Directory listings"
          title="Start free. Grow when you're ready."
          description="Every Black-owned business can have a Community listing, free, today. Plus and Featured listings arrive in 2027 for businesses that want more reach."
          action={
            <ButtonLink href="/join/business" variant="pink" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Get your free listing
            </ButtonLink>
          }
        />
        <TiersComparison />
        <p className="mt-6 max-w-2xl text-sm text-cocoa">
          Prices for Plus and Featured listings aren&apos;t set yet. Tick the box at the end of the business application
          and we&apos;ll tell you first when they launch.
        </p>
      </Section>

      <Section tone="pink" id="membership" className="grain overflow-hidden">
        <Sunburst color="#f6bd3c" className="absolute -right-20 -bottom-20 h-56 w-56 animate-spin-slow opacity-70" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              className="mb-6 sm:mb-8"
              eyebrow="Membership"
              title="More than a listing"
              description="Members get the support, skills and connections to grow, whether you're trading already or still sketching the idea."
            />
            <p className="inline-flex -rotate-2 items-center gap-2 rounded-2xl border-2 border-espresso bg-sunflower px-4 py-2.5 font-heading text-lg font-extrabold text-espresso shadow-pop-sm">
              <Sparkles className="h-5 w-5" aria-hidden />
              Membership is free while we launch
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/join/member" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Become a member
              </ButtonLink>
              <ButtonLink href="/business-support" variant="outline" size="lg">
                See Business Support
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {memberBenefits.map(({ icon: Icon, title, text, color }, i) => (
              <li
                key={title}
                className={`rounded-[1.5rem] border-2 border-espresso p-5 transition-transform duration-300 hover:-translate-y-1 ${color} ${
                  i === 0 ? "shadow-pop sm:col-span-2" : "shadow-pop-sm"
                }`}
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-espresso bg-cream text-espresso"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-extrabold text-espresso">{title}</h3>
                <p className="mt-1 text-sm text-cocoa">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="deep" id="faq">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              className="mb-6"
              eyebrow="Questions"
              title="Good to know"
              description="The things people ask us most. Anything else, just message us."
            />
            <ButtonLink
              href={site.socials.instagram}
              variant="outline"
              icon={<InstagramIcon size={18} />}
            >
              Message us on Instagram
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <FaqList />
          </div>
        </div>
      </Section>

      <CtaBand
        tone="espresso"
        title="Ready when you are."
        description="Your business, your skills, your support. Sheffield is better with you in it."
        actions={
          <>
            <ButtonLink href="/join/business" variant="pink" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Add your business
            </ButtonLink>
            <ButtonLink href="/join/member" variant="cream" size="lg">
              Become a member
            </ButtonLink>
          </>
        }
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: joinFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
