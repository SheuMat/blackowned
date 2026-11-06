import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The BOS logo badge (from Instagram, 150px source). Keep rendered size ≤ 150px.
 * Swap /public/brand/bos-logo.jpg for a high-res PNG/SVG when available.
 */
export function LogoBadge({
  size = 48,
  className,
  priority,
  alt = "Black Owned Sheffield logo",
}: {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Pass "" when the name is already written next to the badge */
  alt?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-espresso/90 bg-[#f3e4da]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/bos-logo.jpg"
        alt={alt}
        width={150}
        height={150}
        preload={priority}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="Black Owned Sheffield home">
      <LogoBadge size={46} priority className="transition-transform duration-300 group-hover:-rotate-12" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading text-[17px] font-extrabold tracking-tight", dark ? "text-cream" : "text-espresso")}>
          Black Owned
        </span>
        <span className="mt-0.5 font-heading text-[13px] font-bold uppercase tracking-[0.22em] text-rose">
          Sheffield
        </span>
      </span>
    </Link>
  );
}
