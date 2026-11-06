"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

/**
 * Measure an element's content width. Starts at `fallback` until mounted:
 * small enough to sit inside a chart card on a 375px phone before hydration.
 */
export function useWidth<T extends HTMLElement>(fallback = 280) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Hover + keyboard state for "one active mark at a time" charts */
export function useActiveIndex(count: number) {
  const [active, setActive] = useState<number | null>(null);

  function onKeyDown(e: KeyboardEvent) {
    if (count === 0) return;
    const keys: Record<string, (i: number) => number> = {
      ArrowRight: (i) => Math.min(count - 1, i + 1),
      ArrowDown: (i) => Math.min(count - 1, i + 1),
      ArrowLeft: (i) => Math.max(0, i - 1),
      ArrowUp: (i) => Math.max(0, i - 1),
      Home: () => 0,
      End: () => count - 1,
    };
    if (e.key === "Escape") {
      setActive(null);
      return;
    }
    const move = keys[e.key];
    if (!move) return;
    e.preventDefault();
    setActive((i) => move(i ?? 0));
  }

  return {
    active,
    setActive,
    containerProps: {
      tabIndex: 0,
      onKeyDown,
      onFocus: () => setActive((i) => i ?? 0),
      onBlur: () => setActive(null),
      onPointerLeave: () => setActive(null),
    },
  };
}
