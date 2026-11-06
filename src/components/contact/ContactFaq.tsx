import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { regions } from "@/content/areas";
import { site } from "@/lib/site";

/**
 * Contact page FAQ. Plain <details>/<summary>, so it works without
 * JavaScript and is keyboard and screen-reader friendly out of the box.
 * Answers are plain text so they can double as FAQPage structured data.
 */
const towns = regions.map((r) => r.label);

export const contactFaqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "What's the fastest way to reach you?",
    a: `A DM on Instagram (${site.instagramHandle}) is usually quickest. The form on this page comes straight to the team too, and we'll reply within ${site.replyTime}.`,
  },
  {
    q: "Is it free to list my business?",
    a: "Yes. A Community listing in the directory is free, and it stays free. Add your business with the Join the directory form; it takes about 10 minutes.",
    link: { href: "/join/business", label: "Join the directory" },
  },
  {
    q: "How do I claim or update a listing?",
    a: "Choose “Directory listing (claim/update)” above, tell us the business name and what needs changing, and we'll check it with you before anything goes live.",
  },
  {
    q: "Which areas do you cover?",
    a: `${towns.slice(0, -1).join(", ")} and ${towns.at(-1)}. Online and mobile businesses based in the area are very welcome.`,
  },
  {
    q: "Can I have a stall at one of your markets?",
    a: "We'd love that. Apply with the stall form: tell us what you sell and what you'd need on the day, and we'll reply by email with the details.",
    link: { href: "/events/stall", label: "Apply for a stall" },
  },
  {
    q: "I'm a journalist. Who do I speak to?",
    a: "Choose “Press & media” as your subject and include your deadline. We're always happy to talk about Black-owned business in Sheffield.",
  },
  {
    q: "Can I volunteer or help out?",
    a: "Yes, please. Head to our volunteer page and tell us what you're good at, from events and social media to photography and mentoring.",
    link: { href: "/join/volunteer", label: "Volunteer with us" },
  },
  {
    q: "Can I visit you?",
    a: `Our office is at ${site.office.name}, ${site.office.address}. We're not always in, so message us first and we'll arrange a time.`,
  },
  {
    q: "What happens to the details I send?",
    a: "We only use them to reply to you and follow up on your message. We never sell them or use them for advertising, and you can ask us to delete them at any time.",
    link: { href: "/privacy", label: "Read our privacy notice" },
  },
];

export function ContactFaq() {
  return (
    <>
      <div className="flex flex-col gap-3">
        {contactFaqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-[1.25rem] border-2 border-espresso bg-white transition-shadow open:shadow-pop-sm"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-lg font-bold text-espresso [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-espresso bg-sunflower transition-transform duration-200 group-open:rotate-45 group-open:bg-pink"
              >
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <div className="px-5 pb-5">
              <p className="leading-relaxed text-cocoa">{f.a}</p>
              {f.link && (
                <Link
                  href={f.link.href}
                  className="group/fl mt-2 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
                >
                  {f.link.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/fl:translate-x-0.5" aria-hidden />
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: contactFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
