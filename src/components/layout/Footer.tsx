import Link from "next/link";
import { MapPin } from "lucide-react";
import { LogoBadge } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/layout";
import { StripeBand } from "@/components/ui/Shapes";
import { footerNav, site } from "@/lib/site";

export function Footer() {
  const socials = [
    { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.socials.youtube, label: "YouTube", Icon: YouTubeIcon },
  ];
  return (
    <footer className="mt-auto bg-espresso text-cream">
      <StripeBand />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <LogoBadge size={84} alt="" />
              <div>
                <p className="font-heading text-2xl font-extrabold">Black Owned Sheffield</p>
                <p className="text-sm text-cream/70">Community Interest Company</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-cream/80">
              Discovering, promoting and connecting Black-owned businesses across Sheffield, Rotherham, Doncaster
              and Chesterfield since {site.founded}.
            </p>
            <div className="mt-8 rounded-3xl bg-cream/5 p-5 ring-1 ring-cream/10">
              <p className="font-heading text-lg font-bold">Get the good news first</p>
              <p className="mt-1 text-sm text-cream/70">New businesses, events and opportunities. No spam.</p>
              <NewsletterForm className="mt-4" dark />
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-pink">{col.heading}</p>
                <ul className="mt-3 lg:mt-4 lg:space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {/* 44px tall rows on touch screens, the tighter list on desktop */}
                      <Link
                        href={l.href}
                        className="inline-flex min-h-11 items-center py-1 leading-snug text-cream/80 underline-offset-4 transition-colors hover:text-cream hover:underline lg:min-h-0 lg:py-0"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t border-cream/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-pink hover:text-espresso"
              >
                <Icon />
              </a>
            ))}
          </div>
          <p className="inline-flex items-center gap-2 text-sm text-cream/70">
            <MapPin className="h-4 w-4 shrink-0 text-pink" aria-hidden /> Based at {site.office.name}, {site.office.address}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 text-xs text-cream/60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Built with love in Sheffield.
          </p>
          <div className="-my-3 flex gap-5 md:my-0">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/contact", label: "Contact" },
              { href: "/admin", label: "Team login" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 items-center underline-offset-4 hover:text-cream hover:underline md:min-h-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Company details from Companies House. TODO: client to confirm before launch */}
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-cream/60 md:mt-4">
          {site.legalName} is a community interest company, company number {site.companyNumber}. Registered office:{" "}
          {site.registeredOffice}.
        </p>
      </Container>
    </footer>
  );
}
