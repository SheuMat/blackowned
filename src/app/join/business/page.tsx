import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ClipboardList, CloudCheck, Heart, Store, Timer } from "lucide-react";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/ui/PageHero";
import { BusinessApplication } from "@/components/join/BusinessForm";
import { HeroFacts, JoinFormLayout, NextSteps, SidePanel, TickList } from "@/components/join/panels";
import { site, ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Add your business to the directory",
  description:
    "List your Black-owned business in the Black Owned Sheffield directory for free. Apply online in about 10 minutes: Sheffield, Rotherham, Doncaster and Chesterfield.",
  alternates: { canonical: "/join/business" },
  openGraph: {
    ...ogBase,
    title: "Add your business to Black Owned Sheffield",
    description: "A free listing in the directory and on the map. Apply online in about 10 minutes.",
    url: "/join/business",
  },
};

export default function JoinBusinessPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Join us", href: "/join" }, { label: "Add your business" }]}
        eyebrow="Free directory listing"
        accent="sunflower"
        title="Add your business to the directory"
        description={
          <p>
            Get found by people across Sheffield, Rotherham, Doncaster and Chesterfield who want to buy Black-owned. A
            Community listing is free, and you can do it all right here.
          </p>
        }
      >
        <HeroFacts
          items={[
            { icon: Heart, label: "Free" },
            { icon: Timer, label: "About 10 minutes" },
            { icon: CloudCheck, label: "Saves as you go" },
            { icon: CalendarClock, label: `Reply within ${site.replyTime}` },
          ]}
        />
      </PageHero>

      <Section className="pt-10 sm:pt-14">
        <JoinFormLayout
          form={<BusinessApplication />}
          aside={
            <>
              <SidePanel tone="pink" icon={Store} eyebrow="Community listing" title="What you get, free">
                <TickList
                  items={[
                    "Your own profile page with links, hours and offers",
                    "A pin on the map of Black-owned Sheffield",
                    "A place in search and category pages",
                    "A link you can share with customers",
                    "A chance to be shared with our Instagram community",
                  ]}
                />
              </SidePanel>
              <SidePanel icon={ClipboardList} title="Handy to have ready">
                <TickList
                  items={[
                    "A few lines about what you do",
                    "Your website and social handles",
                    "Your opening hours",
                    "Links to your logo and photos (or we'll email you)",
                  ]}
                />
              </SidePanel>
              <SidePanel tone="espresso" eyebrow="After you apply" title="What happens next">
                <NextSteps
                  dark
                  steps={[
                    { title: "We check your details", text: "A real person reads every application." },
                    { title: "We say hello", text: `Within ${site.replyTime}.` },
                    { title: "You go live", text: "In the directory and on the map." },
                  ]}
                />
              </SidePanel>
              <p className="px-2 text-sm text-cocoa">
                Questions first? Read the{" "}
                <Link href="/join#faq" className="font-semibold text-rose-ink underline underline-offset-4">
                  FAQs
                </Link>{" "}
                or message{" "}
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-rose-ink underline underline-offset-4"
                >
                  {site.instagramHandle}
                </a>
                .
              </p>
            </>
          }
        />
      </Section>
    </>
  );
}
