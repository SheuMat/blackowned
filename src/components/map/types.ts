import type { Business } from "@/content/types";

export type LatLng = { lat: number; lng: number };

/** A one-off instruction to move the map. Change `key` to trigger it again. */
export type MapFocus = LatLng & { zoom?: number; key: string | number };

/** Where distances are measured from: the viewer ("me") or a searched place */
export type MapOrigin = LatLng & { kind: "me" | "place"; label?: string };

export type BusinessMapProps = {
  businesses: Business[];
  /** Opens this business's popup (flying to it if needed) */
  selectedSlug?: string | null;
  /** Called when a popup opens (slug) or closes (null) */
  onSelect?: (slug: string | null) => void;
  /** Lifts and rings a pin, e.g. while its card is hovered */
  highlightSlug?: string | null;
  center?: LatLng;
  zoom?: number;
  /** One business, one big pin, no clustering or popups (profile pages) */
  single?: boolean;
  /** Sizing and decoration for the wrapper. Give it a height. */
  className?: string;
  /** false renders a static-feeling map (no drag, zoom or keyboard) */
  interactive?: boolean;
  /** Fit the view to the pins whenever the list changes */
  fitToBusinesses?: boolean;
  focus?: MapFocus | null;
  origin?: MapOrigin | null;
  /** Slugs of the pins inside the current view, after every move */
  onViewChange?: (visibleSlugs: string[]) => void;
  scrollWheelZoom?: boolean;
  /** Group nearby pins. Defaults to true unless `single`. */
  cluster?: boolean;
  /** Accessible name for the map region */
  label?: string;
};
