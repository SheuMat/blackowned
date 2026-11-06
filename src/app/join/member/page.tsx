import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, GraduationCap, KeyRound, Lock, Megaphone, Sparkles, Timer, Users } from "lucide-react";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { MemberForm } from "@/components/join/MemberForm";
import { BenefitList, HeroFacts, JoinFormLayout, SidePanel } from "@/components/join/panels";
import { ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a member",
  description:
    "Join Black Owned Sheffield as a member: the members-only Business Support hub, workshops, the Business Opportunities board, member offers and community. Free while we launch.",
  alternates: { canonical: "/join/member" },
  openGraph: {
    ...ogBase,
    title: "Become a Black Owned Sheffield member",
    description: "Support, skills and connections to help you grow. Membership is free while we launch.",
    url: "/join/member",
  },
};

export default function JoinMemberPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Join us", href: "/join" }, { label: "Become a member" }]}
        eyebrow="Membership"
        accent="pink"
        title="Become a member"
        description={
          <p>
            For founders, dreamers and supporters. Get into the members-only Business Support hub, workshops and
            opportunities, with a community behind you.
          </p>
        }
      >
        <HeroFacts
          items={[
            { icon: Sparkles, label: "Free while we launch" },
            { icon: Timer, label: "About 3 minutes" },
            { icon: KeyRound, label: "Access code by email" },
          ]}
        />
      </PageHero>

      <Section className="pt-10 sm:pt-14">
        <JoinFormLayout
          form={<MemberForm />}
          aside={
            <>
              <SidePanel tone="pink" eyebrow="Membership benefits" title="What members get">
                <BenefitList
                  className="mt-1"
                  items={[
                    {
                      icon: Lock,
                      title: "Business Support hub",
                      text: "Members-only guides, tools and support, unlocked with your access code.",
                    },
                    { icon: GraduationCap, title: "Workshops", text: "Practical sessions to help you grow." },
                    {
                      icon: Megaphone,
                      title: "Business Opportunities board",
                      text: "Grants, tenders, markets and calls for suppliers.",
                    },
                    { icon: BadgePercent, title: "Member offers", text: "From Black-owned businesses and partners." },
                    { icon: Users, title: "Community", text: "Mixers, meet-ups and people who get it." },
                  ]}
                />
              </SidePanel>
              <SidePanel tone="sunflower" icon={Sparkles} title="Membership is free while we launch">
                <p>
                  We&apos;re building this with our members, so there&apos;s no fee right now. Just apply and we&apos;ll
                  be in touch.
                </p>
              </SidePanel>
              <SidePanel icon={KeyRound} title="Already a member?">
                <p>
                  Use the access code we emailed you to{" "}
                  <Link href="/members/login" className="font-semibold text-rose-ink underline underline-offset-4">
                    sign in to Business Support
                  </Link>
                  .
                </p>
              </SidePanel>
            </>
          }
        />
      </Section>
    </>
  );
}
