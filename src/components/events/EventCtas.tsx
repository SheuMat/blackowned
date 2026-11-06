import { ArrowRight, Megaphone, Store } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { Blob, Dots, Squiggle, Sunburst } from "@/components/ui/Shapes";

/** Paired calls to action: market stalls and (coming soon) event promotion */
export function EventCtas() {
  return (
    <section aria-label="Get involved with our events" className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-sunflower p-7 text-espresso shadow-pop sm:p-10">
            <Sunburst color="#ee6a35" className="absolute -top-10 -right-10 h-40 w-40 animate-spin-slow opacity-90" />
            <Dots color="#2a1910" className="absolute right-8 bottom-8 h-12 w-12 opacity-20" />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-espresso bg-cream shadow-pop-sm">
                <Store className="h-7 w-7" aria-hidden />
              </span>
              <h2 className="mt-6 max-w-md font-heading text-3xl font-extrabold leading-[1.05] sm:text-4xl">
                Want a stall at our next market?
              </h2>
              <p className="mt-4 max-w-md text-lg text-espresso/85">
                Sell to a crowd that came out to shop Black-owned. Tell us about your business and we&apos;ll be in touch
                about upcoming markets.
              </p>
              <ButtonLink
                href="/events/stall"
                variant="primary"
                size="lg"
                className="mt-8"
                iconRight={<ArrowRight className="h-5 w-5" />}
              >
                Apply for a stall
              </ButtonLink>
            </div>
          </div>

          <div className="grain relative overflow-hidden rounded-[2rem] border-2 border-espresso bg-navy p-7 text-cream shadow-pop sm:p-10">
            <Blob color="#e0628f" className="absolute -right-16 -bottom-20 h-64 w-64 opacity-80" />
            <Squiggle color="#f6bd3c" className="absolute top-10 right-10 h-8 w-28" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-espresso bg-pink text-espresso shadow-pop-sm">
                  <Megaphone className="h-7 w-7" aria-hidden />
                </span>
                <span className="rounded-full bg-sunflower px-3 py-1 text-xs font-bold uppercase tracking-wider text-espresso">
                  Coming soon
                </span>
              </div>
              <h2 className="mt-6 max-w-md font-heading text-3xl font-extrabold leading-[1.05] sm:text-4xl">
                Promote your event with us
              </h2>
              <p className="mt-4 max-w-md text-lg text-cream/85">
                Running something for Black-owned businesses or the wider community? We&apos;re putting together ways to
                feature events on this calendar and across our channels. Register your interest and we&apos;ll talk it through.
              </p>
              <ButtonLink
                href="/work-with-us"
                variant="pink"
                size="lg"
                className="mt-8"
                iconRight={<ArrowRight className="h-5 w-5" />}
              >
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
