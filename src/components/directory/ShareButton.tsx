"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

function useFlag(ms = 2500) {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = () => {
    setOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), ms);
  };
  return [on, flash] as const;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Web Share API on phones, copy-link fallback everywhere else. */
export function ShareButton({
  title,
  text,
  path,
  className,
  label = "Share this business",
}: {
  title: string;
  text?: string;
  /** Path to share, e.g. /directory/care-cove. Defaults to the current page. */
  path?: string;
  className?: string;
  label?: string;
}) {
  const [copied, flash] = useFlag();
  const onClick = async () => {
    const url = path ? new URL(path, window.location.origin).toString() : window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    if (await copyText(url)) flash();
    else window.prompt("Copy this link", url);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-white px-5 font-heading text-[15px] font-semibold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4 text-teal" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      <span>{copied ? "Link copied" : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to your clipboard" : ""}
      </span>
    </button>
  );
}

/** Tap-to-copy discount code */
export function CopyCode({ code }: { code: string }) {
  const [copied, flash] = useFlag();
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(code)) flash();
      }}
      className="group inline-flex h-12 items-center gap-3 rounded-2xl border-2 border-dashed border-espresso bg-cream px-4 font-mono text-lg font-bold tracking-widest text-espresso transition-colors hover:bg-white"
      aria-label={`Copy code ${code}`}
    >
      {code}
      <span className="inline-flex items-center gap-1 font-sans text-xs font-bold tracking-normal text-cocoa">
        {copied ? <Check className="h-4 w-4 text-teal" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Code copied" : ""}
      </span>
    </button>
  );
}
