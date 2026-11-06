import Image from "next/image";
import type { Partner } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * A partner "logo". Until we have real logo files, each partner gets a
 * wordmark tile in its own colour so the wall still reads as a logo wall.
 *
 * LOGO FILES: drop them in /public/partners/<slug>.svg (or .png) and set
 * `logo: "/partners/<slug>.svg"` on the partner in src/content/partners.ts.
 * Wide logos on a transparent background work best. Ask each partner for
 * permission (and their brand guidelines) before adding their logo.
 */

const CREAM = "#fbf5ec";
const ESPRESSO = "#2a1910";

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** Cream or espresso, whichever has the better contrast on `bg` */
export function inkFor(bg: string) {
  const l = luminance(bg);
  const onCream = (luminance(CREAM) + 0.05) / (l + 0.05);
  const onEspresso = (l + 0.05) / (luminance(ESPRESSO) + 0.05);
  return onCream >= onEspresso ? CREAM : ESPRESSO;
}

/** Pick a wordmark style so the tiles don't all look the same */
function wordmarkStyle(text: string) {
  const isCaps = text === text.toUpperCase() && /[A-Z]/.test(text);
  if (isCaps) return "font-heading font-extrabold uppercase tracking-[0.16em]";
  const words = text.trim().split(/\s+/).length;
  if (words <= 2) return "font-display tracking-tight";
  return "font-heading font-extrabold tracking-tight";
}

export function PartnerLogo({
  partner,
  size = "lg",
  className,
}: {
  partner: Partner;
  size?: "sm" | "lg";
  className?: string;
}) {
  const bg = partner.color ?? ESPRESSO;
  const ink = inkFor(bg);
  const text = partner.wordmark ?? partner.name;
  const sm = size === "sm";

  if (partner.logo) {
    return (
      <span
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-white",
          sm ? "h-16 rounded-2xl px-4" : "h-32 rounded-[1.25rem] px-6 sm:h-36",
          className,
        )}
      >
        <Image
          src={partner.logo}
          // Decorative: the partner name is always given as text nearby
          alt=""
          width={sm ? 160 : 280}
          height={sm ? 48 : 96}
          className={cn("h-auto w-auto object-contain", sm ? "max-h-10 max-w-[8.5rem]" : "max-h-20 max-w-[85%]")}
        />
      </span>
    );
  }

  return (
    <span
      // The visible wordmark is decorative: the partner name is always given as text nearby
      aria-hidden
      style={{ backgroundColor: bg, color: ink }}
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden text-center",
        sm ? "h-16 rounded-2xl px-4" : "h-32 rounded-[1.25rem] px-6 sm:h-36",
        className,
      )}
    >
      {/* Soft ring + dot so the tile reads as a mark, not a label */}
      <span
        className={cn(
          "absolute -z-10 rounded-full border-[6px] opacity-15",
          sm ? "-right-5 -bottom-7 h-14 w-14" : "-right-12 -bottom-14 h-36 w-36",
        )}
        style={{ borderColor: ink }}
      />
      <span
        className={cn("absolute rounded-full opacity-60", sm ? "top-2 left-2 h-1.5 w-1.5" : "top-4 left-4 h-2.5 w-2.5")}
        style={{ backgroundColor: ink }}
      />
      <span
        className={cn(
          "leading-[1.05] text-balance",
          wordmarkStyle(text),
          sm ? "text-sm" : text.length > 16 ? "text-2xl sm:text-[1.7rem]" : "text-3xl sm:text-4xl",
        )}
      >
        {text}
      </span>
    </span>
  );
}
