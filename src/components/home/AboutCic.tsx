import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Mic, Newspaper, Tv } from "lucide-react";
import { Reveal } from "./Reveal";
import { MISSION } from "@/components/about/data";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Dots, Sunburst } from "@/components/ui/Shapes";
import { media } from "@/content/media";
import type { MediaItem } from "@/content/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Keeps "Black-owned" from breaking at its hyphen */
const blackOwned = <span className="whitespace-nowrap">Black-owned</span>;

/** The same, inside a plain string such as the shared mission statement */
function keepBlackOwned(text: string): ReactNode[] {
  return text
    .split("Black-owned")
    .flatMap((part, i) => (i === 0 ? [part] : [<span key={i} className="whitespace-nowrap">Black-owned</span>, part]));
}

/** "To discover, promote…" reads on from "Our mission is" */
const mission = keepBlackOwned(MISSION.charAt(0).toLowerCase() + MISSION.slice(1));

const milestones: { year: string; text: ReactNode; tone: string }[] = [
  {
    year: "2020",
    text: <>Asha and Rakaia start a free Instagram page promoting {blackOwned} businesses in Sheffield.</>,
    tone: "bg-pink text-espresso",
  },
  {
    year: "2022",
    text: "Our first pop-up market at Events Central on Fargate, then a festive market that December.",
    tone: "bg-sunflower text-espresso",
  },
  { year: "2023", text: "A Black History Month market at Cutlery Works.", tone: "bg-navy text-cream" },
  {
    year: "2024",
    text: "The Sadacca Bar re-launch party on the Wicker, where our office is now based. That October we became a Community Interest Company.",
    tone: "bg-tangerine text-espresso",
  },
  {
    year: "Now",
    text: <>Launching Sheffield&rsquo;s online hub for {blackOwned} business.</>,
    tone: "bg-espresso text-cream",
  },
];

const kindMeta: Record<MediaItem["kind"], { label: string; Icon: typeof Mic }> = {
  press: { label: "Interview", Icon: Newspaper },
  video: { label: "Film", Icon: Tv },
  podcast: { label: "Podcast", Icon: Mic },
  instagram: { label: "Reel", Icon: Tv },
};

export function AboutCic() {
  // One entry per outlet (Exposed Magazine, Northside Media TV, Daily Devotion Podcast)
  const outlets = media.filter((m, i, all) => all.findIndex((x) => x.outlet === m.outlet) === i && m.kind !== "instagram");
  const [first, second] = site.founders;

  return (
    <section aria-labelledby="about-title" className="grain relative overflow-clip bg-blush py-16 sm:py-20 lg:py-24">
      <Sunburst color="#f2a0bd" className="absolute -right-16 -bottom-16 h-64 w-64 animate-spin-slow opacity-60" />
      <Dots color="#b02a62" className="absolute top-12 left-[48%] hidden h-12 w-12 opacity-40 lg:block" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Eyebrow>About the CIC</Eyebrow>
            <h2 id="about-title" className="mt-3 font-heading text-3xl leading-[1.05] font-extrabold text-espresso sm:text-4xl lg:text-5xl">
              It started with one question
            </h2>
            <p className="mt-6 inline-block -rotate-1 rounded-2xl border-2 border-espresso bg-cream px-5 py-3 font-display text-3xl leading-tight text-espresso shadow-pop sm:text-4xl">
              &ldquo;What can we do to help?&rdquo;
            </p>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-cocoa">
              <p>
                In {site.founded}, after the George Floyd protests, co-founders {first} and {second} asked themselves
                that question. Their answer was a free Instagram page promoting {blackOwned} businesses in Sheffield.
              </p>
              <p>
                The page grew into pop-up markets, starting at Events Central on Fargate. Today we&rsquo;re a Community
                Interest Company based at Sadacca on the Wicker, and this website is the next chapter.
              </p>
            </div>
            <p className="mt-8 border-l-4 border-rose pl-5 font-heading text-xl leading-snug font-bold text-espresso sm:text-2xl">
              Our mission is {mission}
            </p>
            <div className="mt-8">
              <ButtonLink href="/about" size="lg" iconRight={<ArrowRight className="h-5 w-5" aria-hidden />}>
                Read our story
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="rounded-[2rem] border-2 border-espresso bg-white p-6 shadow-pop sm:p-8">
              <h3 className="font-heading text-xl font-extrabold text-espresso">How we got here</h3>
              <ol className="relative mt-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[1.65rem] before:w-0.5 before:bg-espresso/15">
                {milestones.map((m) => (
                  <li key={m.year} className="relative flex gap-4">
                    <span
                      className={cn(
                        "relative z-10 flex h-[3.3rem] w-[3.3rem] shrink-0 items-center justify-center rounded-full border-2 border-espresso font-display text-sm",
                        m.tone,
                      )}
                    >
                      {m.year}
                    </span>
                    <p className="pt-3 text-[15px] leading-relaxed text-cocoa">{m.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14 sm:mt-16">
          <div className="flex flex-col gap-5 border-t-2 border-espresso/15 pt-8 lg:flex-row lg:items-center lg:gap-10">
            <p className="shrink-0 font-heading text-xs font-bold tracking-[0.18em] text-rose-ink uppercase">
              As seen in &amp; heard on
            </p>
            <ul className="grid flex-1 gap-3 sm:grid-cols-3">
              {outlets.map((m) => {
                const { label, Icon } = kindMeta[m.kind];
                return (
                  <li key={m.id}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-center gap-3 rounded-2xl border-2 border-espresso/15 bg-cream px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-espresso hover:shadow-pop-sm"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso text-cream">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-base leading-tight font-extrabold text-espresso">{m.outlet}</span>{" "}
                        <span className="block text-xs font-medium text-cocoa">{label}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-cocoa transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
