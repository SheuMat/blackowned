import { cn } from "@/lib/utils";

/**
 * Decorative shapes inspired by the Black Owned Market posters.
 * Purely visual: aria-hidden, pointer-events-none. Position with className.
 */

export function Squiggle({ className, color = "#ee6a35" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 40" fill="none" className={cn("pointer-events-none", className)}>
      <path
        d="M4 28c10-18 20-18 28 0s18 18 28 0 20-18 28 0 18 18 28 0"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({ className, color = "#f2a0bd" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cn("pointer-events-none", className)}>
      <path
        fill={color}
        d="M43.6,-58.7C55.1,-50.8,62.4,-36.6,67.1,-21.6C71.8,-6.6,73.9,9.2,68.9,22.4C63.9,35.7,51.8,46.4,38.4,55.3C25,64.2,10.3,71.3,-4.9,72.4C-20.1,73.5,-35.9,68.6,-48.2,59C-60.5,49.3,-69.3,34.9,-72.6,19.3C-75.9,3.7,-73.7,-13.1,-66.2,-26.9C-58.7,-40.7,-45.9,-51.5,-32.2,-58.9C-18.6,-66.3,-4,-70.3,9.7,-69.3C23.4,-68.3,32.1,-66.6,43.6,-58.7Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export function Sunburst({ className, color = "#f6bd3c" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn("pointer-events-none", className)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="47"
          y="4"
          width="6"
          height="22"
          rx="3"
          fill={color}
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="14" fill={color} />
    </svg>
  );
}

export function Dots({ className, color = "#167a6f" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 60 60" className={cn("pointer-events-none", className)}>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => <circle key={`${r}-${c}`} cx={10 + c * 20} cy={10 + r * 20} r="5" fill={color} />),
      )}
    </svg>
  );
}

export function Arc({ className, color = "#1f2a63" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 60" fill="none" className={cn("pointer-events-none", className)}>
      <path d="M8 56a42 42 0 0 1 84 0" stroke={color} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export function StripeBand({ className }: { className?: string }) {
  return <div aria-hidden className={cn("stripe-band h-3 w-full", className)} />;
}
