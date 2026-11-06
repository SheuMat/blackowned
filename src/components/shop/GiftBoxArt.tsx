import type { GiftBox } from "@/content/shop";
import { cn } from "@/lib/utils";

const INK = "#2a1910";
const CREAM = "#fbf5ec";

/**
 * Poster-style gift box illustration. Pure SVG, no stock imagery.
 * Decorative: the card around it carries the box name as text.
 */
export function GiftBoxArt({ box, className }: { box: GiftBox; className?: string }) {
  const { art } = box;
  const clip = `giftbox-body-${box.id}`;
  return (
    <svg aria-hidden viewBox="0 0 400 300" className={cn("block h-full w-full", className)} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={art.bg} />

      {/* Poster shapes behind the box */}
      <g opacity="0.95">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="327" y="18" width="8" height="26" rx="4" fill={art.ribbon} transform={`rotate(${i * 30} 331 66)`} />
        ))}
        <circle cx="331" cy="66" r="18" fill={art.ribbon} />
        <circle cx="54" cy="86" r="40" fill={art.box} opacity="0.25" />
        {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={36 + c * 16} cy={218 + r * 16} r="4.5" fill={INK} opacity="0.5" />))}
        <path d="M300 262c10-14 20-14 28 0s18 14 28 0 20-14 28 0" stroke={art.lid} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>

      {/* Pop shadow */}
      <rect x="116" y="146" width="180" height="120" rx="10" fill={INK} />
      <rect x="104" y="118" width="204" height="38" rx="10" fill={INK} />

      {/* Box body with pattern */}
      <clipPath id={clip}>
        <rect x="110" y="140" width="180" height="120" rx="10" />
      </clipPath>
      <rect x="110" y="140" width="180" height="120" rx="10" fill={art.box} stroke={INK} strokeWidth="4" />
      <g clipPath={`url(#${clip})`} opacity="0.28" fill={CREAM} stroke={CREAM}>
        <Pattern kind={art.pattern} />
      </g>
      <rect x="110" y="140" width="180" height="120" rx="10" fill="none" stroke={INK} strokeWidth="4" />

      {/* Ribbon */}
      <rect x="188" y="140" width="24" height="120" fill={art.ribbon} stroke={INK} strokeWidth="3" />

      {/* Lid */}
      <rect x="98" y="112" width="204" height="38" rx="10" fill={art.lid} stroke={INK} strokeWidth="4" />
      <rect x="186" y="112" width="28" height="38" fill={art.ribbon} stroke={INK} strokeWidth="3" />

      {/* Bow */}
      <path d="M200 110c-14-30-56-40-58-14-2 20 34 22 58 14z" fill={art.ribbon} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M200 110c14-30 56-40 58-14 2 20-34 22-58 14z" fill={art.ribbon} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M194 112l-16 26M206 112l16 26" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="109" r="10" fill={art.ribbon} stroke={INK} strokeWidth="4" />

      {/* Tilted label */}
      <g transform="rotate(-6 158 205)">
        <rect x="104" y="184" width="108" height="42" rx="10" fill={CREAM} stroke={INK} strokeWidth="3.5" />
        <text
          x="158"
          y="206"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display"
          fontSize="24"
          fill={INK}
        >
          {art.word}
        </text>
      </g>
    </svg>
  );
}

function Pattern({ kind }: { kind: GiftBox["art"]["pattern"] }) {
  switch (kind) {
    case "dots":
      return (
        <g stroke="none">
          {Array.from({ length: 6 }).flatMap((_, r) =>
            Array.from({ length: 10 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={118 + c * 20 + (r % 2) * 10} cy={150 + r * 20} r="4" />
            )),
          )}
        </g>
      );
    case "stars":
      return (
        <g stroke="none">
          {Array.from({ length: 4 }).flatMap((_, r) =>
            Array.from({ length: 6 }).map((__, c) => {
              const x = 124 + c * 34 + (r % 2) * 17;
              const y = 158 + r * 30;
              return <path key={`${r}-${c}`} d={`M${x} ${y - 8}l2.6 5.4 5.4 2.6-5.4 2.6-2.6 5.4-2.6-5.4-5.4-2.6 5.4-2.6z`} />;
            }),
          )}
        </g>
      );
    case "zigzag":
      return (
        <g fill="none" strokeWidth="6" strokeLinejoin="round">
          {[0, 1, 2, 3].map((r) => (
            <path key={r} d={`M100 ${160 + r * 30}${Array.from({ length: 20 }).map((_, i) => `l10 ${i % 2 ? -12 : 12}`).join("")}`} />
          ))}
        </g>
      );
    case "stripes":
      return (
        <g stroke="none">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={90 + i * 26} y="120" width="10" height="170" transform={`rotate(20 ${95 + i * 26} 200)`} />
          ))}
        </g>
      );
  }
}
