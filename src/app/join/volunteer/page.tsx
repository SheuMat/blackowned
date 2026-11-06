import type { Metadata } from "next";
import { HeartHandshake, Megaphone, Smile, Timer, UserRound } from "lucide-react";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { VolunteerForm } from "@/components/join/VolunteerForm";
import { HeroFacts, JoinFormLayout, SidePanel, TickList } from "@/components/join/panels";
import { ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Volunteer with us",
  description:
    "Volunteer with Black Owned Sheffield: markets and events, social media, photography, admin, mentoring, web, fundraising and research. Ages 16 and over welcome.",
  alternates: { canonical: "/join/volunteer" },
  openGraph: {
    ...ogBase,
    title: "Volunteer with Black Owned Sheffield",
    description: "Give a few hours and help Black-owned business in Sheffield thrive.",
    url: "/join/volunteer",
  },
};

export default function JoinVolunteerPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Join us", href: "/join" }, { label: "Volunteer" }]}
        eyebrow="Volunteering"
        accent="tangerine"
        title="Volunteer with us"
        description={
          <p>
            Markets, events, content, research or a bit of admin. Give a few hours and help Black-owned business in
            Sheffield thrive.
          </p>
        }
      >
        <HeroFacts
          items={[
            { icon: UserRound, label: "Ages 16 and over" },
            { icon: Timer, label: "About 4 minutes" },
            { icon: Smile, label: "Any amount of time helps" },
          ]}
        />
      </PageHero>

      <Section className="pt-10 sm:pt-14">
        <JoinFormLayout
          form={<VolunteerForm />}
          aside={
            <>
              <SidePanel tone="pink" icon={HeartHandshake} eyebrow="Volunteering" title="What volunteers do">
                <TickList
                  items={[
                    "Help set up and run our markets and events",
                    "Create content, take photos and grow our socials",
                    "Keep the directory and the Business Opportunities board up to date",
                    "Support research, funding bids and fundraising",
                    "Mentor young people and new founders",
                  ]}
                />
              </SidePanel>
              <SidePanel tone="sunflower" icon={Megaphone} eyebrow="Volunteer role" title="Opportunities board champion">
                <p>
                  Our Business Opportunities board lists grants, tenders, markets and calls for suppliers. It only works
                  if it&apos;s kept fresh, so it needs regular updating.
                </p>
                <p className="mt-2">
                  Like digging out opportunities and have an hour or two a week? Pick <strong>Research</strong> or{" "}
                  <strong>Admin &amp; data</strong> in the form and tell us you&apos;re interested.
                </p>
              </SidePanel>
            </>
          }
        />
      </Section>
    </>
  );
}
