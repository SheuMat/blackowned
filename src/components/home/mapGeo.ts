/**
 * Geometry for the homepage's stylised map teaser (not Leaflet).
 * A simple equirectangular projection of the patch into a square viewBox.
 * Rivers and the M1 are hand-picked approximate waypoints: decorative, not survey-grade.
 */
import type { RegionId } from "@/content/types";

export const MAP_BOUNDS = { north: 53.56, south: 53.2, west: -1.56, east: -1.08 } as const;
export const MAP_SIZE = 440;

type LatLng = { lat: number; lng: number };

export function project({ lat, lng }: LatLng) {
  const { north, south, west, east } = MAP_BOUNDS;
  return {
    x: ((lng - west) / (east - west)) * MAP_SIZE,
    y: ((north - lat) / (north - south)) * MAP_SIZE,
  };
}

/** Catmull-Rom spline through the points, as an SVG path (gentle river curves). */
export function smoothPath(points: [lat: number, lng: number][]) {
  const p = points.map(([lat, lng]) => project({ lat, lng }));
  if (p.length < 2) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(p[0]!.x)} ${f(p[0]!.y)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]!;
    const p1 = p[i]!;
    const p2 = p[i + 1]!;
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

/** River Don: down from the north-west, through the city, out past Rotherham to Doncaster */
export const riverDon = smoothPath([
  [53.47, -1.56],
  [53.435, -1.53],
  [53.405, -1.5],
  [53.387, -1.466],
  [53.395, -1.43],
  [53.415, -1.41],
  [53.435, -1.36],
  [53.49, -1.28],
  [53.48, -1.23],
  [53.525, -1.14],
  [53.56, -1.08],
]);

/** River Rother: north from Chesterfield to meet the Don at Rotherham */
export const riverRother = smoothPath([
  [53.2, -1.4],
  [53.235, -1.415],
  [53.27, -1.35],
  [53.32, -1.315],
  [53.355, -1.335],
  [53.395, -1.365],
  [53.432, -1.36],
]);

export const motorwayM1 = smoothPath([
  [53.2, -1.31],
  [53.3, -1.33],
  [53.36, -1.31],
  [53.39, -1.37],
  [53.41, -1.4],
  [53.45, -1.43],
  [53.5, -1.46],
  [53.56, -1.5],
]);

/** Where each town's label and soft "urban area" blob sit, in viewBox units */
export const townLayout: Record<
  RegionId,
  { blob: { r: number }; label: { dx: number; dy: number; anchor: "start" | "middle" | "end" } }
> = {
  sheffield: { blob: { r: 50 }, label: { dx: 2, dy: 68, anchor: "middle" } },
  rotherham: { blob: { r: 22 }, label: { dx: 16, dy: 6, anchor: "start" } },
  doncaster: { blob: { r: 24 }, label: { dx: -22, dy: -12, anchor: "end" } },
  chesterfield: { blob: { r: 20 }, label: { dx: -14, dy: 8, anchor: "end" } },
};
