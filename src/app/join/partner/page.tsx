import type { Metadata } from "next";
import { ArrowRight, CalendarClock, Handshake, MessageCircle, Timer } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { PartnerForm } from "@/components/join/PartnerForm";
import { HeroFacts, JoinFormLayout, SidePanel, TickList } from "@/components/join/panels";
import { site, ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a partner",
  description:
    "Partner with Black Owned Sheffield: sponsorship, events, venues, funding, supplier diversity, corporate volunteering, media and research. Start the conversation online.",
  alternates: { canonical: "/join/partner" },
  openGraph: {
    ...ogBase,
    title: "Partner with Black Owned Sheffield",
    description: "Put real support behind Black-owned business in Sheffield and South Yorkshire.",
    url: "/join/partner",
  },
};

export default function JoinPartnerPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Join us", href: "/join" }, { label: "Become a partner" }]}
        eyebrow="Partnerships"
        accent="navy"
        title="Become a partner"
        description={
          <p>
            Back Black-owned businesses across Sheffield, Rotherham, Doncaster and Chesterfield. Sponsorship, events,
            procurement, volunteering: tell us what you have in mind and we&apos;ll find the right fit together.
          </p>
        }
      >
        <HeroFacts
          items={[
            { icon: Timer, label: "About 5 minutes" },
            { icon: MessageCircle, label: "No commitment" },
            { icon: CalendarClock, label: `Reply within ${site.replyTime}` },
          ]}
        />
      </PageHero>

      <Section className="pt-10 sm:pt-14">
        <JoinFormLayout
          form={<PartnerForm />}
          aside={
            <>
              <SidePanel tone="espresso" icon={Handshake} eyebrow="Why partner with us" title="Real reach, real impact">
                <TickList
                  dark
                  items={[
                    "Connect with Black-owned businesses across Sheffield, Rotherham, Doncaster and Chesterfield",
                    "Show up in the community, not just on a logo wall",
                    "Help young people feel confident starting businesses",
                    "Support employment, education and access to grants",
                    "Work with a team that has been on the ground since 2020",
                  ]}
                />
              </SidePanel>
              <SidePanel tone="cream" title="Find out more first">
                <p>See how organisations already work with us, and the ways you can get involved.</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <ButtonLink href="/work-with-us" variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
                    Work with us
                  </ButtonLink>
                  <ButtonLink href="/partners" variant="outline">
                    Our partners
                  </ButtonLink>
                </div>
              </SidePanel>
            </>
          }
        />
      </Section>
    </>
  );
}
