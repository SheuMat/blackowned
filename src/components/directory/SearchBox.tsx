"use client";

import { useEffect, useEffectEvent, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, MapPin, Search, X } from "lucide-react";
import { BusinessLogo } from "@/components/cards/BusinessArt";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { categoryMap } from "@/content/categories";
import type { Business } from "@/content/types";
import { autocomplete, type Suggestion } from "@/lib/directory-search";
import { cn } from "@/lib/utils";

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q.length >= 2 ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-blush text-espresso">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function SuggestionIcon({ s }: { s: Suggestion }) {
  if (s.kind === "business") return <BusinessLogo business={s.business} size={36} className="rounded-xl" />;
  if (s.kind === "category") {
    const c = categoryMap[s.id];
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-espresso"
        style={{ backgroundColor: c.color, color: c.ink }}
      >
        <CategoryIcon id={s.id} className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-espresso/15 bg-white text-espresso">
      {s.kind === "area" ? <MapPin className="h-4 w-4 text-rose" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
    </span>
  );
}

/**
 * Big directory search with type-ahead (businesses, categories, places and
 * services). Accessible combobox: arrow keys move, Enter picks, Escape closes.
 */
export function SearchBox({
  value,
  onChange,
  onSubmit,
  onPick,
  businesses,
  size = "lg",
  placeholder = "Try “jollof”, “braids”, “accountant” or “S11”",
  label = "Search Black-owned businesses",
  className,
  portal = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onPick: (s: Suggestion) => void;
  businesses: Business[];
  size?: "lg" | "md";
  placeholder?: string;
  label?: string;
  className?: string;
  /** Render suggestions in a portal (use inside containers with overflow: hidden, like PageHero) */
  portal?: boolean;
}) {
  const id = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const measure = () => {
    if (!portal) return;
    const r = boxRef.current?.getBoundingClientRect();
    if (r) setRect({ top: r.bottom + window.scrollY, left: r.left + window.scrollX, width: r.width });
  };
  const onResize = useEffectEvent(() => measure());
  const inputId = `${id}-input`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  // Active option is tied to the text it was chosen for, so typing resets it without an effect
  const [active, setActive] = useState<{ for: string; index: number }>({ for: "", index: -1 });
  const suggestions = useMemo(() => autocomplete(businesses, value, 8), [businesses, value]);
  const activeIndex = active.for === value ? active.index : -1;
  const expanded = open && suggestions.length > 0;

  useEffect(() => {
    if (!expanded || !portal) return;
    const handler = () => onResize();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [expanded, portal]);

  const pick = (s: Suggestion) => {
    setOpen(false);
    onPick(s);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!suggestions.length) return;
      e.preventDefault();
      measure();
      setOpen(true);
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = activeIndex < 0 ? (dir === 1 ? 0 : suggestions.length - 1) : (activeIndex + dir + suggestions.length) % suggestions.length;
      setActive({ for: value, index: next });
    } else if (e.key === "Enter") {
      if (expanded && activeIndex >= 0) {
        e.preventDefault();
        pick(suggestions[activeIndex]);
      } else setOpen(false);
    } else if (e.key === "Escape") {
      if (expanded) {
        e.preventDefault();
        setOpen(false);
      } else if (value) {
        e.preventDefault();
        onChange("");
      }
    }
  };

  const lg = size === "lg";

  const listbox = (
    <ul
      id={listId}
      role="listbox"
      aria-label="Suggestions"
      style={portal && rect ? { top: rect.top, left: rect.left, width: rect.width } : undefined}
      className={cn(
        "z-40 mt-3 max-h-[min(420px,60vh)] overflow-y-auto rounded-[1.5rem] border-2 border-espresso bg-cream p-2 text-espresso shadow-pop",
        portal ? "absolute" : "absolute inset-x-0 top-full",
        !expanded && "hidden",
      )}
    >
      {suggestions.map((s, i) => (
        <li
          key={`${s.kind}-${s.id}`}
          id={`${listId}-${i}`}
          role="option"
          aria-selected={i === activeIndex}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => pick(s)}
          onMouseMove={() => i !== activeIndex && setActive({ for: value, index: i })}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
            i === activeIndex ? "bg-blush" : "hover:bg-blush/60",
          )}
        >
          <SuggestionIcon s={s} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-heading text-[15px] font-bold text-espresso">
              <Highlight text={s.label} query={value} />
            </span>
            {/* Two lines, not one, so a trailing "· Sample" is never cut off on phones */}
            <span className="line-clamp-2 text-xs text-cocoa">{s.detail}</span>
          </span>
          <span className="hidden shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-cocoa sm:inline">
            {s.kind === "business" ? "Profile" : s.kind === "category" ? "Category" : s.kind === "area" ? "Place" : "Search"}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
        onSubmit(value);
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        ref={boxRef}
        className={cn(
          "relative flex items-center rounded-full border-2 border-espresso bg-white transition-shadow focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-rose",
          lg ? "h-16 pr-2 pl-5 shadow-pop sm:h-[72px] sm:pl-6" : "h-12 pr-1.5 pl-4",
        )}
      >
        <Search aria-hidden className={cn("shrink-0 text-espresso", lg ? "h-6 w-6" : "h-5 w-5")} />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={expanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            measure();
            setOpen(true);
          }}
          onFocus={() => {
            measure();
            setOpen(true);
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-3 text-espresso placeholder:text-cocoa/70 focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden",
            lg ? "text-base sm:text-lg" : "text-[15px]",
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-espresso/5 hover:text-espresso"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-espresso bg-pink font-heading font-bold text-espresso transition-all hover:-translate-y-0.5 hover:shadow-pop-sm",
            lg ? "h-12 w-12 sm:h-14 sm:w-auto sm:px-7" : "h-9 w-9 sm:w-auto sm:px-4",
          )}
        >
          <span className={cn("hidden sm:inline", !lg && "text-sm")}>Search</span>
          <ArrowRight className="h-5 w-5 sm:hidden" aria-hidden />
          <span className="sr-only sm:hidden">Search</span>
        </button>
      </div>

      {portal ? (expanded && rect ? createPortal(listbox, document.body) : null) : listbox}
    </form>
  );
}
