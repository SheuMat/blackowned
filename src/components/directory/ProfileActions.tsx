import { Globe, Mail, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import type { Business } from "@/content/types";
import { directionsUrl } from "@/lib/directory-search";
import { cn, telHref } from "@/lib/utils";

type Action = {
  key: string;
  label: string;
  short: string;
  href: string;
  icon: ReactNode;
  external: boolean;
  ariaLabel: string;
};

export function profileActions(b: Business): Action[] {
  const list: Action[] = [];
  const icon = "h-5 w-5";
  if (b.contact.website)
    list.push({
      key: "website",
      label: "Visit website",
      short: "Website",
      href: b.contact.website,
      icon: <Globe className={icon} aria-hidden />,
      external: true,
      // Starts with the visible text so voice control ("click Visit website") works
      ariaLabel: `Visit website for ${b.name} (opens in a new tab)`,
    });
  if (b.contact.phone)
    list.push({
      key: "call",
      label: `Call ${b.contact.phone}`,
      short: "Call",
      href: telHref(b.contact.phone),
      icon: <Phone className={icon} aria-hidden />,
      external: false,
      ariaLabel: `Call ${b.name} on ${b.contact.phone}`,
    });
  if (b.contact.email)
    list.push({
      key: "email",
      label: "Email",
      short: "Email",
      href: `mailto:${b.contact.email}`,
      icon: <Mail className={icon} aria-hidden />,
      external: false,
      ariaLabel: `Email ${b.name}`,
    });
  if (b.socials.instagram)
    list.push({
      key: "instagram",
      label: "Instagram",
      short: "Instagram",
      href: b.socials.instagram,
      icon: <InstagramIcon size={20} />,
      external: true,
      ariaLabel: `Instagram: ${b.name} (opens in a new tab)`,
    });
  const directions = !b.onlineOnly ? directionsUrl(b) : null;
  if (directions)
    list.push({
      key: "directions",
      label: "Get directions",
      short: "Directions",
      href: directions,
      icon: <Navigation className={icon} aria-hidden />,
      external: true,
      ariaLabel: `Get directions to ${b.name} in Google Maps (opens in a new tab)`,
    });
  return list;
}

function ActionLink({ action, className, children }: { action: Action; className: string; children: ReactNode }) {
  return (
    <a
      href={action.href}
      className={className}
      aria-label={action.ariaLabel}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

/** Big buttons under the profile header (tablet and desktop). */
export function ProfileActionBar({ business, className }: { business: Business; className?: string }) {
  const actions = profileActions(business);
  if (!actions.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {actions.map((a, i) => (
        <ActionLink
          key={a.key}
          action={a}
          className={cn(
            "inline-flex h-14 items-center gap-2.5 rounded-full border-2 border-espresso px-6 font-heading text-base font-bold whitespace-nowrap text-espresso transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5",
            i === 0 ? "bg-pink shadow-pop-sm hover:shadow-pop" : "bg-white hover:shadow-pop-sm",
          )}
        >
          {a.icon}
          <span>{a.key === "call" ? "Call" : a.label}</span>
        </ActionLink>
      ))}
    </div>
  );
}

/** Thumb-friendly bar pinned to the bottom of the screen on phones. */
export function ProfileStickyBar({ business }: { business: Business }) {
  const actions = profileActions(business);
  if (!actions.length) return null;
  return (
    <div className="sticky bottom-0 z-40 border-t-2 border-espresso bg-cream/95 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <nav aria-label={`Contact ${business.name}`}>
        <ul className="mx-auto flex max-w-md justify-around gap-1">
          {actions.map((a, i) => (
            <li key={a.key} className="min-w-0 flex-1">
              <ActionLink
                action={a}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-center transition-colors active:bg-espresso/5"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 border-espresso text-espresso",
                    i === 0 ? "bg-pink shadow-pop-sm" : "bg-white",
                  )}
                >
                  {a.icon}
                </span>
                <span className="block w-full truncate text-[11px] font-bold text-espresso">{a.short}</span>
              </ActionLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
