import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Home, Mail, Search, Store } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, StripeBand, Sunburst } from "@/components/ui/Shapes";
import { PinkSticker, ToneText } from "@/components/ui/ToneText";

export const metadata: Metadata = {
  title: "Page not found",
  // No robots here: Next already adds <meta name="robots" content="noindex"> to 404 responses
  description: "We couldn't find that page. Search the Black Owned Sheffield directory or head back home.",
};

const links = [
  { href: "/", label: "Home", body: "Back to the start", icon: Home, color: "#f2a0bd" },
  { href: "/directory", label: "Directory", body: "Find a Black-owned business", icon: Store, color: "#f6bd3c" },
  { href: "/events", label: "Events", body: "Markets, networking and socials", icon: CalendarDays, color: "#167a6f" },
  { href: "/contact", label: "Contact", body: "Tell us what you were after", icon: Mail, color: "#ee6a35" },
];

const bunting = ["#ee6a35", "#f6bd3c", "#167a6f", "#f2a0bd", "#1f2a63", "#d19a62", "#ee6a35", "#f6bd3c", "#167a6f", "#f2a0bd"];

export default function NotFound() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-cream-deep pt-6 pb-16 sm:pb-24">
        {/* Market bunting */}
        <svg aria-hidden viewBox="0 0 1200 90" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-14 w-full sm:h-20">
          <path d="M0 10 Q600 70 1200 10" stroke="#2a1910" strokeWidth="2.5" fill="none" />
          {bunting.map((c, i) => {
            const x = 40 + i * 118;
            const t = x / 1200;
            const y = 10 + 120 * t * (1 - t); // on the curve above
            return <path key={i} d={`M${x - 26} ${y}L${x + 26} ${y + 2}L${x} ${y + 46}Z`} fill={c} />;
          })}
        </svg>
        <Blob color="#f2a0bd" className="absolute -right-28 bottom-0 h-80 w-80 opacity-50 sm:h-[28rem] sm:w-[28rem]" />
        <Sunburst color="#f6bd3c" className="absolute top-24 -left-12 hidden h-36 w-36 animate-spin-slow opacity-80 md:block" />
        <Dots color="#167a6f" className="absolute right-[18%] bottom-16 hidden h-14 w-14 opacity-70 lg:block" />
        <Squiggle color="#ee6a35" className="absolute bottom-10 left-[8%] hidden h-10 w-32 md:block" />

        <Container className="relative pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="flex items-center justify-center gap-3">
              <ToneText pop className="text-[6.5rem] leading-none sm:text-[10rem]">404</ToneText>
            </p>
            <PinkSticker className="mt-2 text-xl sm:text-2xl">Oops!</PinkSticker>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] text-espresso sm:text-5xl lg:text-6xl">
              This page has gone off to Fargate market
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cocoa sm:text-xl">
              It might have moved, or the link might be wrong. While it browses the stalls, try searching the directory
              instead.
            </p>

            <form action="/directory" method="get" role="search" className="mx-auto mt-8 max-w-xl">
              <label htmlFor="notfound-q" className="sr-only">
                Search the directory
              </label>
              {/* The input hides its own outline, so the pill shows the focus ring instead */}
              <div className="flex items-center gap-1 rounded-full border-2 border-espresso bg-white p-1.5 shadow-pop focus-within:shadow-pop-pink has-[input:focus]:outline-[3px] has-[input:focus]:outline-offset-[3px] has-[input:focus]:outline-rose has-[input:focus]:outline-solid">
                <Search className="ml-3 h-5 w-5 shrink-0 text-cocoa" aria-hidden />
                <input
                  id="notfound-q"
                  name="q"
                  type="search"
                  placeholder="Barbers, jollof, cakes…"
                  autoComplete="off"
                  className="h-11 min-w-0 flex-1 bg-transparent px-2 text-base text-espresso placeholder:text-cocoa/60 focus:outline-none focus-visible:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-espresso px-5 font-heading text-[15px] font-semibold text-cream transition-colors hover:bg-cocoa"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <nav aria-label="Popular pages" className="mx-auto mt-12 max-w-4xl">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex h-full flex-col rounded-[1.25rem] border-2 border-espresso bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-pop sm:p-5"
                  >
                    <span
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso"
                      style={{ backgroundColor: l.color }}
                    >
                      <l.icon className="h-5 w-5 text-espresso" />
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 font-heading text-lg font-extrabold text-espresso">
                      {l.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    <span className="mt-0.5 text-sm text-cocoa">{l.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>
      <StripeBand />
    </>
  );
}
