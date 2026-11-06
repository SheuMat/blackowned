import type { ArtMotif } from "@/content/community";
import { cn } from "@/lib/utils";

/**
 * Poster-style placeholder art for community projects, in the spirit of the
 * Black Owned Market posters. Decorative only: swap for real photos later by
 * replacing this component with an <Image> where a photo exists.
 */
export function CommunityArt({
  motif,
  color,
  accent,
  word,
  className,
}: {
  motif: ArtMotif;
  color: string;
  accent: string;
  word?: string;
  className?: string;
}) {
  const light = isLight(color);
  return (
    <div aria-hidden className={cn("relative overflow-hidden", className)} style={{ backgroundColor: color }}>
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <Motif motif={motif} accent={accent} ink={light ? "#2a1910" : "#fbf5ec"} />
      </svg>
      {word && (
        <span
          className={cn(
            "absolute bottom-4 left-5 -rotate-2 rounded-xl px-3 py-1 font-display text-2xl leading-none shadow-pop-sm sm:text-3xl",
            light ? "bg-espresso text-cream" : "bg-cream text-espresso",
          )}
        >
          {word}
        </span>
      )}
    </div>
  );
}

function isLight(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

function Motif({ motif, accent, ink }: { motif: ArtMotif; accent: string; ink: string }) {
  switch (motif) {
    case "building":
      // Sadacca-ish facade: arched windows under a rising sun
      return (
        <g>
          <circle cx="300" cy="70" r="46" fill={accent} />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x="296" y="0" width="8" height="18" rx="4" fill={accent} transform={`rotate(${i * 36} 300 70) translate(0 -2)`} />
          ))}
          <rect x="70" y="110" width="270" height="160" rx="6" fill={ink} opacity="0.92" />
          <rect x="60" y="98" width="290" height="20" rx="6" fill={accent} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${96 + i * 62} 210v-50a18 18 0 0 1 36 0v50z`} fill="#f2a0bd" opacity={i % 2 ? 0.95 : 0.75} />
          ))}
          <path d="M-10 236c40-22 80-22 120 0s80 22 120 0 80-22 120 0 80 22 120 0" stroke={accent} strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>
      );
    case "market":
      // Bunting + striped stall awning
      return (
        <g>
          <path d="M-10 30 Q200 90 410 30" stroke={ink} strokeWidth="3" fill="none" />
          {Array.from({ length: 9 }).map((_, i) => {
            const x = 10 + i * 46;
            const y = 30 + Math.sin((i / 8) * Math.PI) * 30;
            const fills = [accent, "#f6bd3c", "#167a6f", "#fbf5ec"];
            return <path key={i} d={`M${x} ${y}l28 2-12 34z`} fill={fills[i % fills.length]} />;
          })}
          <g transform="translate(70 120)">
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${i * 45} 0h45v34a22 22 0 0 1-45 0z`} fill={i % 2 ? "#fbf5ec" : "#2a1910"} />
            ))}
            <rect x="12" y="56" width="246" height="90" rx="6" fill={ink} opacity="0.18" />
            <circle cx="70" cy="96" r="20" fill="#f6bd3c" />
            <circle cx="130" cy="100" r="16" fill={accent} />
            <circle cx="186" cy="94" r="22" fill="#167a6f" />
          </g>
        </g>
      );
    case "mic":
      // Microphone with sound waves
      return (
        <g>
          {[60, 95, 130].map((r, i) => (
            <path key={r} d={`M${200 - r} 115a${r} ${r} 0 0 1 ${r * 2} 0`} stroke={i === 1 ? accent : ink} strokeWidth="10" fill="none" strokeLinecap="round" opacity={1 - i * 0.2} />
          ))}
          <rect x="176" y="50" width="48" height="96" rx="24" fill={accent} />
          <path d="M160 120a40 40 0 0 0 80 0" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" />
          <rect x="196" y="160" width="8" height="40" fill={ink} />
          <rect x="166" y="196" width="68" height="10" rx="5" fill={ink} />
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={40 + c * 20} cy={170 + r * 20} r="5" fill="#f6bd3c" />))}
        </g>
      );
    case "spark":
      return (
        <g>
          <circle cx="120" cy="130" r="70" fill={accent} />
          <path d="M290 40l14 40 40 14-40 14-14 40-14-40-40-14 40-14z" fill={ink} />
          <path d="M330 170l8 22 22 8-22 8-8 22-8-22-22-8 22-8z" fill={ink} opacity="0.8" />
          <path d="M-10 230c40-20 80-20 120 0s80 20 120 0 80-20 120 0 80 20 120 0" stroke={ink} strokeWidth="10" fill="none" strokeLinecap="round" />
        </g>
      );
    case "people":
      return (
        <g>
          {[
            [90, "#2a1910"],
            [160, "#7a4a2e"],
            [230, "#d19a62"],
            [300, "#a8693d"],
          ].map(([x, c], i) => (
            <g key={i} transform={`translate(${x} ${i % 2 ? 96 : 110})`}>
              <circle r="26" fill={c as string} />
              <path d="M-40 110v-34a40 40 0 0 1 80 0v34z" fill={c as string} />
            </g>
          ))}
          <circle cx="340" cy="44" r="26" fill={accent} />
        </g>
      );
    case "heart":
      return (
        <g>
          <path d="M200 214c-70-44-112-82-112-124 0-30 22-52 50-52 26 0 46 16 62 40 16-24 36-40 62-40 28 0 50 22 50 52 0 42-42 80-112 124z" fill={accent} />
          <path d="M150 96c0-14 10-24 22-24" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={330 + c * 18} cy={160 + r * 18} r="4.5" fill={ink} opacity="0.75" />))}
          <circle cx="62" cy="54" r="20" fill="#f6bd3c" />
        </g>
      );
    case "book":
      return (
        <g>
          <path d="M80 70h110a10 10 0 0 1 10 10v130a10 10 0 0 0-10-10H80z" fill={ink} />
          <path d="M320 70H210a10 10 0 0 0-10 10v130a10 10 0 0 1 10-10h110z" fill={accent} />
          <circle cx="330" cy="50" r="22" fill="#f6bd3c" />
        </g>
      );
  }
}
