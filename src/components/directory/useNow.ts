"use client";

import { useSyncExternalStore } from "react";

/**
 * The current time, rounded to the minute, on the client only.
 * Returns null during server rendering and hydration so time-dependent UI
 * ("Open now", today's row) never causes a hydration mismatch.
 */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  const onVisible = () => document.visibilityState === "visible" && onChange();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

const getSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerSnapshot = () => null;

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
