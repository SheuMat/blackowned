"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Uses the Web Share API where the browser has it (most phones), otherwise
 * copies the link. If copying is blocked too, shows the link to copy by hand.
 */
export function ShareButton({
  path,
  title,
  text,
  className,
}: {
  /** Site-relative path, e.g. /events/christmas-market-2026 */
  path: string;
  title: string;
  text?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [manualUrl, setManualUrl] = useState("");

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setManualUrl(url);
      setStatus("manual");
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={share}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-espresso bg-white px-5 font-heading text-[15px] font-bold text-espresso transition-all hover:-translate-y-0.5 hover:bg-blush hover:shadow-pop-sm"
      >
        {status === "copied" ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
        {status === "copied" ? "Link copied" : "Share this event"}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? "Link copied to your clipboard" : ""}
      </p>
      {status === "manual" && (
        <label className="mt-3 block text-xs font-semibold text-cocoa">
          Copy this link to share
          <input
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 h-11 w-full rounded-xl border-2 border-espresso/15 bg-cream px-3 text-sm text-espresso"
          />
        </label>
      )}
    </div>
  );
}
