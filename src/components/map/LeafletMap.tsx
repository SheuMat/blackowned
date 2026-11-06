"use client";

/**
 * The Leaflet implementation behind <BusinessMap />. Never import this
 * directly: it touches `window` at import time, so BusinessMap loads it with
 * next/dynamic and ssr: false.
 */
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "./map.css";
import L from "leaflet";
import "leaflet.markercluster";
import { useEffect, useEffectEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { southYorkshireView } from "@/content/areas";
import { isPinnable } from "@/lib/directory-search";
import { clusterHtml, originHtml, pinHtml, pinSize, pinSizeLarge, popupHtml } from "./markup";
import type { BusinessMapProps } from "./types";

/**
 * Tiles: CARTO Voyager. CARTO now needs a (free) basemaps key, added as ?key=.
 * Set NEXT_PUBLIC_CARTO_BASEMAPS_KEY in the environment. Without a key we fall
 * back to standard OpenStreetMap tiles so the map still works in preview.
 * NEXT_PUBLIC_MAP_TILE_URL overrides everything (any {s}/{z}/{x}/{y} template).
 */
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_KEY;
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
const TILES = process.env.NEXT_PUBLIC_MAP_TILE_URL
  ? { url: process.env.NEXT_PUBLIC_MAP_TILE_URL, attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? OSM_ATTRIBUTION, subdomains: "abc", warm: false }
  : CARTO_KEY
    ? {
        url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_KEY)}`,
        attribution: `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>`,
        subdomains: "abcd",
        warm: false,
      }
    : { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: OSM_ATTRIBUTION, subdomains: "abc", warm: true };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makePinIcon(large: boolean, html: string) {
  const s = large ? pinSizeLarge : pinSize;
  return L.divIcon({
    html,
    className: "bos-pin-icon",
    iconSize: [s.w, s.h],
    iconAnchor: [s.w / 2, s.anchorY],
    popupAnchor: [0, -s.anchorY + 4],
  });
}

function clusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count < 5 ? 40 : count < 20 ? 48 : 56;
  return L.divIcon({
    html: clusterHtml(count),
    className: "bos-cluster-icon",
    iconSize: [size, size],
  });
}

/** Read the overlay insets the parent sets as CSS variables (full-screen map). */
function readInsets(el: HTMLElement) {
  const style = getComputedStyle(el);
  const px = (name: string) => Number.parseFloat(style.getPropertyValue(name)) || 0;
  return { top: px("--map-top-inset"), bottom: px("--map-bottom-inset") };
}

export default function LeafletMap({
  businesses,
  selectedSlug = null,
  onSelect,
  highlightSlug = null,
  center,
  zoom,
  single = false,
  interactive = true,
  fitToBusinesses = false,
  focus = null,
  origin = null,
  onViewChange,
  scrollWheelZoom = false,
  cluster,
  label,
}: BusinessMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.FeatureGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const openSlugRef = useRef<string | null>(null);
  const router = useRouter();

  const useCluster = cluster ?? !single;
  const markersKey = businesses
    .filter(isPinnable)
    .map((b) => b.slug)
    .join("|");

  // Effect events always see the latest props without re-running effects
  const emitSelect = useEffectEvent((slug: string | null) => onSelect?.(slug));
  const emitView = useEffectEvent(() => {
    const map = mapRef.current;
    if (!map || !onViewChange) return;
    const bounds = map.getBounds();
    const visible: string[] = [];
    markersRef.current.forEach((m, slug) => {
      if (bounds.contains(m.getLatLng())) visible.push(slug);
    });
    onViewChange(visible);
  });
  const navigate = useEffectEvent((href: string) => router.push(href));
  const readInitial = useEffectEvent(() => ({ center, zoom, single, interactive, scrollWheelZoom, useCluster }));
  const readMarkers = useEffectEvent(() => ({ businesses, single, interactive, fitToBusinesses, zoom }));
  const readFocus = useEffectEvent(() => focus);
  const readSelected = useEffectEvent(() => selectedSlug);

  // ── Create the map once ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const opts = readInitial();
    const reduced = prefersReducedMotion();
    const canDrag = opts.interactive && !(opts.single && L.Browser.mobile);

    const map = L.map(el, {
      zoomControl: false,
      scrollWheelZoom: opts.interactive && opts.scrollWheelZoom,
      dragging: canDrag,
      touchZoom: opts.interactive,
      doubleClickZoom: opts.interactive,
      boxZoom: opts.interactive,
      keyboard: opts.interactive,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
      minZoom: 6,
      maxZoom: 19,
    });
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');
    if (opts.interactive) {
      L.control.zoom({ position: "bottomright", zoomInTitle: "Zoom in", zoomOutTitle: "Zoom out" }).addTo(map);
    }
    L.tileLayer(TILES.url, {
      subdomains: TILES.subdomains,
      maxZoom: TILES.warm ? 19 : 20,
      attribution: TILES.attribution,
      className: TILES.warm ? "bos-tiles--warm" : undefined,
    }).addTo(map);

    const start = opts.center ?? southYorkshireView.center;
    map.setView([start.lat, start.lng], opts.zoom ?? (opts.center ? 13 : southYorkshireView.zoom), { animate: false });

    const layer: L.FeatureGroup = opts.useCluster
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 46,
          animate: !reduced,
          iconCreateFunction: clusterIcon,
        })
      : L.featureGroup();
    layer.addTo(map);

    mapRef.current = map;
    layerRef.current = layer;
    const markers = markersRef.current;

    map.on("moveend", () => emitView());

    // Popup "View profile" links navigate client-side
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[data-internal]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = link.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      navigate(href);
    };
    el.addEventListener("click", onClick, true);

    // Keep tiles and popups right when the container changes size (view toggles, sheets)
    let frame = 0;
    const applyInsets = () => {
      const { top, bottom } = readInsets(el);
      markersRef.current.forEach((m) => {
        const popup = m.getPopup();
        if (!popup) return;
        popup.options.autoPanPaddingTopLeft = L.point(16, top + 16);
        popup.options.autoPanPaddingBottomRight = L.point(16, bottom + 16);
      });
    };
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
        applyInsets();
      });
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("click", onClick, true);
      map.off();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
      openSlugRef.current = null;
    };
  }, []);

  // ── Pins ──
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    const el = containerRef.current;
    if (!map || !layer || !el) return;
    const { businesses: list, single: isSingle, interactive: canInteract, fitToBusinesses: fit, zoom: z } = readMarkers();
    const reduced = prefersReducedMotion();
    const insets = readInsets(el);

    layer.clearLayers();
    markersRef.current.clear();
    openSlugRef.current = null;

    const pins = list.filter(isPinnable);
    const markers = pins.map((b) => {
      const marker = L.marker([b.coords.lat, b.coords.lng], {
        icon: makePinIcon(isSingle, pinHtml(b, { large: isSingle })),
        title: b.name,
        alt: b.name,
        keyboard: canInteract && !isSingle,
        interactive: !isSingle,
        riseOnHover: true,
      });
      if (!isSingle) {
        marker.bindPopup(popupHtml(b), {
          className: "bos-popup-wrap",
          maxWidth: 300,
          minWidth: 240,
          autoPanPaddingTopLeft: L.point(16, insets.top + 16),
          autoPanPaddingBottomRight: L.point(16, insets.bottom + 16),
        });
        marker.on("popupopen", () => {
          openSlugRef.current = b.slug;
          marker.getElement()?.classList.add("is-selected");
          emitSelect(b.slug);
        });
        marker.on("popupclose", () => {
          marker.getElement()?.classList.remove("is-selected");
          if (openSlugRef.current === b.slug) {
            openSlugRef.current = null;
            emitSelect(null);
          }
        });
      }
      markersRef.current.set(b.slug, marker);
      return marker;
    });

    if (layer instanceof L.MarkerClusterGroup) layer.addLayers(markers);
    else markers.forEach((m) => layer.addLayer(m));

    if (isSingle && pins[0]) {
      map.setView([pins[0].coords.lat, pins[0].coords.lng], z ?? 15, { animate: false });
    } else if (fit && pins.length) {
      const bounds = L.latLngBounds(pins.map((p) => [p.coords.lat, p.coords.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.05), {
        padding: [40, 40],
        paddingTopLeft: [40, insets.top + 40],
        paddingBottomRight: [40, insets.bottom + 40],
        maxZoom: 14,
        animate: !reduced,
      });
    }
    emitView();
    // Any open popup closed with the old pins; tell the parent so selection stays in sync
    if (readSelected()) emitSelect(null);
  }, [markersKey, single, interactive]);

  // ── Selection: fly to the pin and open its popup ──
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    if (!selectedSlug) {
      if (openSlugRef.current) map.closePopup();
      return;
    }
    if (openSlugRef.current === selectedSlug) return;
    const marker = markersRef.current.get(selectedSlug);
    if (!marker) return;
    const open = () => marker.openPopup();
    const reduced = prefersReducedMotion();

    if (layer instanceof L.MarkerClusterGroup) {
      const visible = layer.getVisibleParent(marker) === marker;
      if (visible && map.getBounds().pad(-0.1).contains(marker.getLatLng())) open();
      else if (visible) {
        map.once("moveend", open);
        if (reduced) map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), { animate: false });
        else map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 15), { duration: 0.8 });
      }
      // Still inside a cluster: let markercluster zoom (or spiderfy) until the pin shows.
      // The group was created with animate: !reduced, so this is instant for reduced motion.
      else layer.zoomToShowLayer(marker, open);
      return;
    }
    const ll = marker.getLatLng();
    if (map.getBounds().pad(-0.1).contains(ll)) open();
    else {
      map.once("moveend", open);
      if (reduced) map.setView(ll, Math.max(map.getZoom(), 14), { animate: false });
      else map.flyTo(ll, Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
  }, [selectedSlug, markersKey]);

  // ── Hover highlight (pin, or the cluster holding it) ──
  useEffect(() => {
    const layer = layerRef.current;
    if (!highlightSlug || !layer) return;
    const marker = markersRef.current.get(highlightSlug);
    if (!marker) return;
    const target = layer instanceof L.MarkerClusterGroup ? layer.getVisibleParent(marker) : marker;
    const node = target?.getElement();
    node?.classList.add("is-highlighted");
    marker.setZIndexOffset(1000);
    return () => {
      node?.classList.remove("is-highlighted");
      marker.setZIndexOffset(0);
    };
  }, [highlightSlug, markersKey]);

  // ── Programmatic moves (region chips, place search, "use my location") ──
  const focusKey = focus?.key ?? null;
  useEffect(() => {
    const map = mapRef.current;
    const f = readFocus();
    if (!map || !f || focusKey == null) return;
    map.closePopup();
    const z = f.zoom ?? map.getZoom();
    if (prefersReducedMotion()) map.setView([f.lat, f.lng], z, { animate: false });
    else map.flyTo([f.lat, f.lng], z, { duration: 1.1 });
  }, [focusKey]);

  // ── Origin marker ──
  const originLat = origin?.lat;
  const originLng = origin?.lng;
  const originKind = origin?.kind;
  const originLabel = origin?.label;
  useEffect(() => {
    const map = mapRef.current;
    if (!map || originLat == null || originLng == null || !originKind) return;
    const marker = L.marker([originLat, originLng], {
      icon: L.divIcon({ html: originHtml(originKind), className: "bos-origin-icon", iconSize: [28, 28], iconAnchor: [14, 14] }),
      keyboard: false,
      interactive: true,
      zIndexOffset: -100,
      title: originKind === "me" ? "You are here" : (originLabel ?? "Searched place"),
    });
    marker.bindTooltip(originKind === "me" ? "You are here" : (originLabel ?? "Searched place"), {
      direction: "top",
      offset: [0, -12],
    });
    marker.addTo(map);
    return () => {
      marker.remove();
    };
  }, [originLat, originLng, originKind, originLabel]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      role="region"
      aria-label={label ?? (single ? "Location map" : "Map of Black-owned businesses")}
    />
  );
}
