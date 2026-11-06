"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, Share } from "lucide-react";
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/components/icons/SocialIcons";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

const btn =
  "inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-white px-3 font-heading text-sm font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm active:translate-y-0 active:shadow-none";

/** Copy link + WhatsApp / X / Facebook share links, plus the native share sheet where supported. */
export function ShareButtons({
  url,
  title,
  className,
  stacked = false,
}: {
  url: string;
  title: string;
  className?: string;
  /** Put "Copy link" on its own row at lg+ (for narrow sidebars) */
  stacked?: boolean;
}) {
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, Icon: WhatsAppIcon },
    { label: "X", href: `https://x.com/intent/tweet?text=${text}&url=${u}`, Icon: XIcon },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 2500);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // Cancelled or unsupported: nothing to do
    }
  }

  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2">
        <li className={cn(stacked && "lg:w-full")}>
          <button type="button" onClick={copy} className={cn(btn, stacked && "lg:w-full", copied === "copied" && "bg-blush")}>
            {copied === "copied" ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
            {copied === "copied" ? "Copied" : "Copy link"}
          </button>
        </li>
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={btn} title={`Share on ${label}`}>
              <Icon size={18} />
              <span className="sr-only">Share on {label} (opens in a new tab)</span>
            </a>
          </li>
        ))}
        {canNativeShare && (
          <li>
            <button type="button" onClick={nativeShare} className={btn}>
              <Share className="h-4 w-4" aria-hidden />
              More
              <span className="sr-only"> sharing options</span>
            </button>
          </li>
        )}
      </ul>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold text-cocoa">
        {copied === "copied" && "Link copied to your clipboard."}
        {copied === "failed" && `Couldn't copy automatically. The link is ${url}`}
      </p>
    </div>
  );
}
