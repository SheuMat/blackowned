"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessMapProps } from "./types";

export type { BusinessMapProps, LatLng, MapFocus, MapOrigin } from "./types";

/** Shown while Leaflet loads (and in the server HTML). */
export function MapSkeleton({ className, label = "Loading the map" }: { className?: string; label?: string }) {
  return (
    <div
      className={cn("dot-grid absolute inset-0 flex items-center justify-center bg-cream-deep", className)}
      role="status"
      aria-live="polite"
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full text-sand" preserveAspectRatio="none" viewBox="0 0 400 300">
        <path d="M-10 210C60 170 110 240 190 200s120-90 220-60" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path d="M70-10c20 80-10 140 40 210s30 90 10 110" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
        <path d="M-10 80c90 10 150-20 230 10s140 20 200-10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </svg>
      <div className="relative flex flex-col items-center gap-3">
        <span className="relative flex h-14 w-14 animate-bounce items-center justify-center rounded-full border-2 border-espresso bg-pink shadow-pop-sm">
          <MapPin className="h-6 w-6 text-espresso" aria-hidden />
        </span>
        <span className="rounded-full bg-cream/90 px-3 py-1 font-heading text-sm font-bold text-espresso">{label}…</span>
      </div>
    </div>
  );
}

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

/**
 * Reusable map of businesses: category-coloured pins, on-brand clusters and
 * popups. Give it a height with `className`.
 *
 *   <BusinessMap businesses={list} className="h-[420px] rounded-[1.5rem]" fitToBusinesses />
 *   <BusinessMap businesses={[business]} single className="aspect-[4/3]" />
 */
export function BusinessMap({ className, ...props }: BusinessMapProps) {
  return (
    <div className={cn("bos-map relative isolate z-0 overflow-hidden bg-cream-deep", className)}>
      <LeafletMap {...props} />
    </div>
  );
}
