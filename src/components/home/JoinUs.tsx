import Link from "next/link";
import { ArrowRight, BadgeCheck, Handshake, HeartHandshake, Store, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

type Option = {
  href: string;
  title: string;
  text: string;
  cta: string;
  Icon: LucideIcon;
  accent: string;
  tag?: string;
};

const options: Option[] = [
  {
    href: "/join/business",
    title: "Add your business to the directory",
    text: "Get found by customers across Sheffield, Rotherham, Doncaster and Chesterfield, with your own profile and a pin on the map.",
    cta: "List your business",
    Icon: Store,
    accent: "bg-pink",
    tag: "Free",
  },
  {
    href: "/join/member",
    title: "Become a member",
    text: "Join the network for member events, offers from listed businesses and a community that has your back.",
    cta: "Join as a member",
    Icon: BadgeCheck,
    accent: "bg-sunflower",
  },
  {
    href: "/join/partner",
    title: "Become a partner",
    text: "For organisations, venues and funders who want to back Black-owned business in South Yorkshire.",
    cta: "Partner with us",
    Icon: Handshake,
    accent: "bg-teal",
  },
  {
    href: "/join/volunteer",
    title: "Volunteer with us",
    text: "Lend a hand at a market or event, or share a skill with the community. Every bit of time helps.",
    cta: "Volunteer",
    Icon: HeartHandshake,
    accent: "bg-tangerine",
  },
];

export function JoinUs() {
  return (
    <Section tone="cream" id="join" className="scroll-mt-[72px]">
      <SectionHeading
        align="center"
        eyebrow="Get involved"
        title="Join us"
        description={
          <>
            However you want to be part of <span className="whitespace-nowrap">Black-owned</span> Sheffield,
            there&rsquo;s a place for you.
          </>
        }
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {options.map(({ href, title, text, cta, Icon, accent, tag }, i) => (
          <Reveal as="li" key={href} delay={i * 0.07}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop">
              <div className={cn("relative flex h-20 items-end justify-between border-b-2 border-espresso px-5 pb-4 sm:h-28", accent)}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-espresso bg-cream text-espresso shadow-pop-sm transition-transform duration-300 group-hover:-rotate-6">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                {tag && (
                  <span className="mb-1 inline-flex -rotate-3 items-center rounded-full border-2 border-espresso bg-cream px-3 py-1 font-display text-sm text-espresso">
                    {tag}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-heading text-xl leading-tight font-extrabold text-espresso">
                  <Link href={href} className="after:absolute after:inset-0 after:rounded-[1.5rem]">
                    {title}
                  </Link>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cocoa">{text}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-heading text-sm font-bold text-espresso">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
