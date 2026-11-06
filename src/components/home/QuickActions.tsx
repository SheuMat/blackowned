import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, Handshake, Search, Store, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

type Action = {
  href: string;
  label: string;
  hint: string;
  Icon: LucideIcon;
  tone: string;
  iconTone: string;
  hintTone: string;
  wide?: boolean;
};

const actions: Action[] = [
  {
    href: "/directory",
    label: "Find a Business",
    hint: "Search the directory",
    Icon: Search,
    tone: "bg-espresso text-cream",
    iconTone: "bg-pink text-espresso",
    hintTone: "text-cream/75",
    wide: true,
  },
  {
    href: "/join/business",
    label: "Join the Directory",
    hint: "List your business free",
    Icon: Store,
    tone: "bg-pink text-espresso",
    iconTone: "bg-cream text-espresso",
    hintTone: "text-espresso/75",
  },
  {
    href: "/join/member",
    label: "Become a Member",
    hint: "Be part of the network",
    Icon: BadgeCheck,
    tone: "bg-sunflower text-espresso",
    iconTone: "bg-cream text-espresso",
    hintTone: "text-espresso/75",
  },
  {
    href: "/events",
    label: "Upcoming Events",
    hint: "Markets, mixers, workshops",
    Icon: CalendarDays,
    tone: "bg-navy text-cream",
    iconTone: "bg-sunflower text-espresso",
    hintTone: "text-cream/75",
  },
  {
    href: "/work-with-us",
    label: "Work With Us",
    hint: "Partner or sponsor",
    Icon: Handshake,
    tone: "bg-tangerine text-espresso",
    iconTone: "bg-cream text-espresso",
    // Full espresso: 80% drops below 4.5:1 on tangerine
    hintTone: "text-espresso",
  },
];

/** The five big, obvious next steps, straight after the hero. */
export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title" className="relative bg-cream py-10 sm:py-14">
      <Container>
        <h2 id="quick-actions-title" className="sr-only">
          Get started
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-cols-5">
          {actions.map(({ href, label, hint, Icon, tone, iconTone, hintTone, wide }, i) => (
            <li
              key={href}
              className={cn(
                "lg:col-span-1",
                wide ? "col-span-2 sm:col-span-3" : i === 1 ? "sm:col-span-3" : "sm:col-span-2",
              )}
            >
              <Link
                href={href}
                className={cn(
                  "group relative flex h-full min-h-[148px] flex-col justify-between gap-6 rounded-[1.5rem] border-2 border-espresso p-4 shadow-pop-sm transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-pop sm:p-5",
                  tone,
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-espresso transition-transform duration-300 group-hover:-rotate-6",
                      iconTone,
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
                <span>
                  <span className="block font-heading text-lg leading-tight font-extrabold sm:text-xl">{label}</span>{" "}
                  <span className={cn("mt-1 block text-[13px] font-medium sm:text-sm", hintTone)}>{hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
