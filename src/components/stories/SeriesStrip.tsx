import Link from "next/link";
import { ArrowUpRight, Award, ListOrdered, Mic, Rocket, type LucideIcon } from "lucide-react";
import { Squiggle, Sunburst, Dots, Blob } from "@/components/ui/Shapes";
import { cn } from "@/lib/utils";

type Series = {
  title: string;
  kicker: string;
  description: string;
  href: string;
  linkLabel: string;
  Icon: LucideIcon;
  panel: string;
  ink: string;
  Shape: "squiggle" | "sunburst" | "dots" | "blob";
};

const series: Series[] = [
  {
    title: "Meet the Founder",
    kicker: "Interviews",
    description:
      "Sit-down conversations with the people behind Sheffield's Black-owned businesses: why they started, what keeps them going and what's next.",
    href: "/stories?category=meet-the-founder#latest",
    linkLabel: "Read the interviews",
    Icon: Mic,
    panel: "bg-tangerine",
    ink: "text-espresso",
    Shape: "squiggle",
  },
  {
    title: "Business Spotlight",
    kicker: "Black Business of the Month",
    description:
      "One business, a whole month in the spotlight: a feature here, posts across Instagram and TikTok, and a permanent place in our archive.",
    href: "/spotlight",
    linkLabel: "See this month's Spotlight",
    Icon: Award,
    panel: "bg-pink",
    ink: "text-espresso",
    Shape: "sunburst",
  },
  {
    title: "5 Black-owned businesses to discover",
    kicker: "Guides & lists",
    description:
      "Short, themed lists (gifts, food, self-care, services) that link straight to directory profiles, so you can go from reading to buying.",
    href: "/stories?category=guides#latest",
    linkLabel: "Browse the guides",
    Icon: ListOrdered,
    panel: "bg-sunflower",
    ink: "text-espresso",
    Shape: "dots",
  },
  {
    title: "Launch news",
    kicker: "New & next",
    description:
      "New shop, new menu, new service? We share launches from Black-owned businesses across Sheffield, Rotherham, Doncaster and Chesterfield.",
    href: "/stories?category=launches#latest",
    linkLabel: "See launch news",
    Icon: Rocket,
    panel: "bg-navy",
    ink: "text-cream",
    Shape: "blob",
  },
];

function Decoration({ shape }: { shape: Series["Shape"] }) {
  switch (shape) {
    case "squiggle":
      // Top right, so it never runs into the title along the bottom of the panel
      return <Squiggle color="#2a1910" className="absolute top-7 right-5 h-7 w-24 opacity-25" />;
    case "sunburst":
      return <Sunburst color="#fbf5ec" className="absolute -top-6 -right-6 h-28 w-28 opacity-60" />;
    case "dots":
      return <Dots color="#2a1910" className="absolute top-4 right-4 h-12 w-12 opacity-25" />;
    case "blob":
      return <Blob color="#f2a0bd" className="absolute -right-10 -bottom-12 h-36 w-36 opacity-40" />;
  }
}

/** The four recurring editorial series, each with a short explainer. */
export function SeriesStrip() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {series.map((s, i) => (
        <li key={s.title} className="h-full">
          <article
            className={cn(
              "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-espresso bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-pop has-[a:focus-visible]:shadow-pop",
              i % 2 ? "lg:mt-6" : "",
            )}
          >
            <div className={cn("relative flex min-h-40 flex-col justify-between overflow-hidden p-5", s.panel, s.ink)}>
              <Decoration shape={s.Shape} />
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-espresso bg-cream text-espresso">
                <s.Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="relative mt-6">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] opacity-80">{s.kicker}</p>
                <h3 className="mt-1 font-display text-2xl leading-[1.05]">{s.title}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[15px] leading-relaxed text-cocoa">{s.description}</p>
              <Link
                href={s.href}
                className="mt-auto inline-flex min-h-11 items-center gap-1 pt-4 font-heading text-sm font-bold text-espresso after:absolute after:inset-0"
              >
                {s.linkLabel}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
