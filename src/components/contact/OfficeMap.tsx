import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Our base at Sadacca, with an OpenStreetMap embed (no API key, no cookies)
 * and a Google Maps directions link.
 */
export function OfficeMap() {
  const { lat, lng, name, address } = site.office;
  const dLng = 0.0065;
  const dLat = 0.0032;
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(6)).join(",");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;
  const larger = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section
      aria-labelledby="office-title"
      className="overflow-hidden rounded-[1.75rem] border-2 border-espresso bg-white shadow-pop"
    >
      <div className="relative aspect-[4/3] w-full border-b-2 border-espresso bg-cream-deep sm:aspect-[16/10] lg:aspect-[4/3]">
        <iframe
          src={embed}
          title={`Map showing ${name}, ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          // Inset ring: the frame is a tab stop, and the card clips anything drawn outside it
          className="absolute inset-0 h-full w-full focus:outline-[3px] focus:outline-offset-[-3px] focus:outline-rose focus:outline-solid"
        />
        <span className="pointer-events-none absolute top-3 left-3 inline-block -rotate-3 rounded-xl border-2 border-espresso bg-pink px-3 py-1 font-display text-sm text-espresso shadow-pop-sm">
          Our base
        </span>
      </div>
      <div className="p-6">
        <h2 id="office-title" className="font-heading text-xl font-extrabold text-espresso">
          Find us at {name}
        </h2>
        <address className="mt-2 flex items-start gap-2 text-cocoa not-italic">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-ink" aria-hidden />
          <span>{address}</span>
        </address>
        <p className="mt-2 text-sm text-cocoa/90">
          Our office is in the Sadacca building on the Wicker. We&apos;re not always in, so message us before you pop by.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-espresso bg-espresso px-5 font-heading text-[15px] font-semibold text-cream transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-pink"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            Get directions
            <span className="sr-only"> (Google Maps, opens in a new tab)</span>
          </a>
          <a
            href={larger}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 font-heading text-sm font-bold text-espresso underline decoration-pink decoration-2 underline-offset-4 hover:decoration-espresso"
          >
            Larger map
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            <span className="sr-only"> (OpenStreetMap, opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
