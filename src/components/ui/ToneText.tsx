import { cn } from "@/lib/utils";

/**
 * Colours each letter through the skin-tone spectrum from the BOS logo.
 * Use with the display font for brand moments (hero words, big numbers).
 */
const TONES = ["#2a1910", "#7a4a2e", "#d19a62", "#55321f", "#a8693d", "#e7c39c"];
const TONES_ON_DARK = ["#e7c39c", "#d19a62", "#f2a0bd", "#a8693d", "#fadbe6", "#f5ebdd"];

export function ToneText({
  children,
  className,
  onDark = false,
  offset = 0,
  pop = false,
}: {
  children: string;
  className?: string;
  onDark?: boolean;
  offset?: number;
  /** Espresso drop shadow so the lighter letters (latte, honey) read on cream */
  pop?: boolean;
}) {
  const palette = onDark ? TONES_ON_DARK : TONES;
  let i = offset;
  return (
    <span className={cn("font-display", pop && "[text-shadow:0.04em_0.04em_0_var(--color-espresso)]", className)}>
      {/* Screen readers get the word once, not letter by letter */}
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {children.split("").map((ch, idx) => {
          if (ch === " ") return <span key={idx}> </span>;
          const color = palette[i++ % palette.length];
          return (
            <span key={idx} style={{ color }}>
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** Pink tilted "sticker" text, echoing SHEFFIELD in the logo */
export function PinkSticker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block -rotate-3 rounded-xl bg-pink px-3 py-0.5 font-display text-espresso shadow-pop-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
