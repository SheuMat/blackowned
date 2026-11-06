import type { Metadata } from "next";
import { Suspense } from "react";
import { MapExplorer, MapExplorerFromUrl } from "@/components/map/MapExplorer";
import { ogBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Map of Black-owned Sheffield",
  description:
    "Discover Black-owned businesses near you on the map of Sheffield, Rotherham, Doncaster and Chesterfield. Search by postcode or place, or use your location.",
  alternates: { canonical: "/map" },
  openGraph: {
    ...ogBase,
    title: "Map of Black-owned Sheffield | Black Owned Sheffield",
    description: "Discover Black-owned businesses near you across Sheffield and South Yorkshire.",
    url: "/map",
  },
};

export default function MapPage() {
  return (
    // The explorer reads ?region= and ?category= on the client; the fallback is the default view.
    <Suspense fallback={<MapExplorer />}>
      <MapExplorerFromUrl />
    </Suspense>
  );
}
