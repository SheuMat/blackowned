import type { Area, Region, RegionId } from "./types";

/**
 * Regions and neighbourhoods used for filtering and the map.
 * Centres come from postcodes.io outcode / postcode centroids.
 */
export const regions: Region[] = [
  {
    id: "sheffield",
    label: "Sheffield",
    center: { lat: 53.3811, lng: -1.4701 },
    zoom: 13,
    areas: [
      { id: "city-centre", label: "City Centre", region: "sheffield", center: { lat: 53.3800, lng: -1.4713 } },
      { id: "kelham-island", label: "Kelham Island & Neepsend", region: "sheffield", center: { lat: 53.3905, lng: -1.4745 } },
      { id: "wicker", label: "Wicker & Castlegate", region: "sheffield", center: { lat: 53.3867, lng: -1.4628 } },
      { id: "sharrow", label: "Sharrow & Nether Edge", region: "sheffield", center: { lat: 53.3655, lng: -1.4800 } },
      { id: "ecclesall-road", label: "Ecclesall Road & Broomhill", region: "sheffield", center: { lat: 53.3685, lng: -1.4960 } },
      { id: "burngreave", label: "Burngreave & Pitsmoor", region: "sheffield", center: { lat: 53.3985, lng: -1.4600 } },
      { id: "firth-park", label: "Firth Park & Page Hall", region: "sheffield", center: { lat: 53.4140, lng: -1.4510 } },
      { id: "hillsborough", label: "Hillsborough & Walkley", region: "sheffield", center: { lat: 53.4010, lng: -1.5000 } },
      { id: "attercliffe", label: "Attercliffe & Darnall", region: "sheffield", center: { lat: 53.3920, lng: -1.4230 } },
      { id: "abbeydale", label: "Abbeydale & Heeley", region: "sheffield", center: { lat: 53.3560, lng: -1.4840 } },
    ],
  },
  {
    id: "rotherham",
    label: "Rotherham",
    center: { lat: 53.4309, lng: -1.3568 },
    zoom: 13,
    areas: [{ id: "rotherham-town", label: "Rotherham", region: "rotherham", center: { lat: 53.4309, lng: -1.3568 } }],
  },
  {
    id: "doncaster",
    label: "Doncaster",
    center: { lat: 53.5214, lng: -1.1306 },
    zoom: 13,
    areas: [{ id: "doncaster-town", label: "Doncaster", region: "doncaster", center: { lat: 53.5214, lng: -1.1306 } }],
  },
  {
    id: "chesterfield",
    label: "Chesterfield",
    center: { lat: 53.2350, lng: -1.4210 },
    zoom: 13,
    areas: [{ id: "chesterfield-town", label: "Chesterfield", region: "chesterfield", center: { lat: 53.2350, lng: -1.4210 } }],
  },
];

/** Whole-patch view that fits Sheffield, Rotherham, Doncaster and Chesterfield */
export const southYorkshireView = { center: { lat: 53.405, lng: -1.33 }, zoom: 10 };

export const areas: Area[] = regions.flatMap((r) => r.areas);

export const areaMap = Object.fromEntries(areas.map((a) => [a.id, a])) as Record<string, Area>;

export const regionMap = Object.fromEntries(regions.map((r) => [r.id, r])) as Record<RegionId, Region>;

export function getAreaLabel(areaId: string) {
  return areaMap[areaId]?.label ?? areaId;
}
