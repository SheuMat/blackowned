import Link from "next/link";
import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { Blob } from "@/components/ui/Shapes";

export default function BusinessNotFound() {
  return (
    <section className="grain relative overflow-hidden bg-cream-deep py-20 sm:py-28">
      <Blob color="#f2a0bd" className="absolute -top-24 -right-24 h-80 w-80 opacity-60" />
      <Container className="relative max-w-2xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-espresso bg-sunflower shadow-pop-sm">
          <SearchX className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold sm:text-5xl">We can&rsquo;t find that business</h1>
        <p className="mt-4 text-lg text-cocoa">
          The listing may have moved or been taken down. Have a search of the directory, or tell us about a business we&rsquo;re
          missing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/directory" variant="primary" size="lg">
            Search the directory
          </ButtonLink>
          <ButtonLink href="/contact?subject=suggest" variant="pink" size="lg">
            Suggest a business
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-cocoa">
          Or explore the <Link href="/map" className="font-bold text-rose-ink underline underline-offset-4">map of Black-owned Sheffield</Link>.
        </p>
      </Container>
    </section>
  );
}
