"use client";

import { useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / insecure origins
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ text, label, className }: { text: string; label: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          const ok = await copyText(text);
          setStatus(ok ? "copied" : "failed");
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setStatus("idle"), 2500);
        }}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-espresso px-4 font-heading text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-pop-sm",
          status === "copied" ? "bg-forest text-cream" : "bg-sunflower text-espresso",
          className,
        )}
      >
        {status === "copied" ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : status === "failed" ? (
          <TriangleAlert className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        {status === "copied" ? "Copied!" : status === "failed" ? "Copy failed: select the code below" : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Copied to clipboard." : status === "failed" ? "Copy failed." : ""}
      </span>
    </>
  );
}
