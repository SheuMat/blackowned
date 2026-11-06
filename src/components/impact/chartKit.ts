/**
 * Small toolkit shared by the impact charts. Hand-rolled SVG, no chart library.
 * Pure values and helpers only (safe for server and client). Hooks live in
 * ./useChart.ts.
 *
 * Colours were checked with the dataviz palette validator against the white
 * chart card: rose + caramel pass every categorical check (lightness, chroma,
 * colour-blind separation, contrast). Tangerine passes as a single series.
 */
export const chartColors = {
  /** Live (real) listings */
  live: "#e0628f",
  /** Sample listings while in preview */
  sample: "#a8693d",
  /** Events delivered */
  events: "#ee6a35",
  /** Hairline grid and baseline: one step off the white surface */
  grid: "#efe3d3",
  baseline: "#e2cfb6",
  surface: "#ffffff",
  /** Hover band behind the active row/column */
  hover: "#fbf5ec",
  ink: "#2a1910",
  inkSecondary: "#55321f",
  inkMuted: "#7a5a48",
} as const;

/** Round an axis maximum up to a clean number with ~4 steps */
export function niceScale(max: number, steps = 4) {
  if (max <= 0) return { max: steps, step: 1 };
  const raw = max / steps;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  let step = nice * mag;
  if (step < 1) step = 1;
  return { max: Math.ceil(max / step) * step, step };
}

/** Horizontal bar: square at the baseline (left), 4px rounded data-end (right) */
export function hBarPath(x: number, y: number, w: number, h: number, roundEnd = true) {
  if (w <= 0) return "";
  const r = roundEnd ? Math.min(4, w, h / 2) : 0;
  return `M${x} ${y}h${w - r}${r ? `a${r} ${r} 0 0 1 ${r} ${r}` : ""}v${h - 2 * r}${r ? `a${r} ${r} 0 0 1 ${-r} ${r}` : ""}h${-(w - r)}Z`;
}

/** Column: square at the baseline (bottom), 4px rounded data-end (top) */
export function columnPath(x: number, baseY: number, w: number, h: number) {
  if (h <= 0) return "";
  const r = Math.min(4, h, w / 2);
  return `M${x} ${baseY}v${-(h - r)}a${r} ${r} 0 0 1 ${r} ${-r}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - r}Z`;
}

/** Keep a tooltip of `tipW` inside a chart of `width` */
export function clampTip(x: number, tipW: number, width: number, pad = 4) {
  return Math.max(pad, Math.min(width - tipW - pad, x - tipW / 2));
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
