"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutGrid, MapPin, Search } from "lucide-react";
import { categories } from "@/content/categories";
import { regions } from "@/content/areas";
import { cn } from "@/lib/utils";

/**
 * "Find a Black-owned business" search for the homepage hero.
 * Builds /directory?q=&category=&region=&area= with only the params that are set.
 * Without JavaScript the form still submits q and category to /directory.
 */

// Each segment is one big tap target: the control fills it and the label sits on top
// (pointer-events-none), so tapping anywhere in the segment focuses or opens the control.
const segment =
  "relative rounded-[1.1rem] transition-colors hover:bg-cream-deep focus-within:bg-cream-deep focus-within:ring-2 focus-within:ring-rose";
const labelCls =
  "pointer-events-none absolute top-2.5 left-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cocoa/80";
const controlCls =
  "h-[62px] w-full appearance-none rounded-[1.1rem] bg-transparent px-4 pt-6 pb-1.5 font-heading text-base font-semibold text-espresso placeholder:font-sans placeholder:font-normal placeholder:text-cocoa/75 focus:outline-none focus-visible:outline-none";
const chevronCls = "pointer-events-none absolute right-4 bottom-[1.05rem] h-4 w-4 text-cocoa";

export function HomeSearch({ className }: { className?: string }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [where, setWhere] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    const kw = q.trim();
    if (kw) params.set("q", kw);
    if (category) params.set("category", category);
    if (where) {
      const [kind, value] = where.split(":");
      if (kind === "region" && value) params.set("region", value);
      if (kind === "area" && value) {
        const region = regions.find((r) => r.areas.some((a) => a.id === value));
        if (region) params.set("region", region.id);
        params.set("area", value);
      }
    }
    const qs = params.toString();
    router.push(qs ? `/directory?${qs}` : "/directory");
  }

  const sheffield = regions.find((r) => r.id === "sheffield");

  return (
    <form
      role="search"
      aria-label="Find a Black-owned business"
      action="/directory"
      method="get"
      onSubmit={onSubmit}
      className={cn("rounded-[1.6rem] border-2 border-espresso bg-white p-2 shadow-pop", className)}
    >
      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-stretch sm:gap-0">
        <div className={cn(segment, "sm:col-span-3 sm:after:absolute sm:after:inset-x-4 sm:after:-bottom-[3px] sm:after:h-0.5 sm:after:bg-espresso/10")}>
          <label htmlFor={`${id}-q`} className={labelCls}>
            <Search className="h-3.5 w-3.5 text-rose" aria-hidden />
            What are you looking for?
          </label>
          <input
            id={`${id}-q`}
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try jollof, braids, accountant…"
            autoComplete="off"
            enterKeyHint="search"
            className={cn(controlCls, "sm:text-lg")}
          />
        </div>

        <div className={cn(segment, "sm:mt-1")}>
          <label htmlFor={`${id}-cat`} className={labelCls}>
            <LayoutGrid className="h-3.5 w-3.5 text-rose" aria-hidden />
            Category
          </label>
          <select
            id={`${id}-cat`}
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(controlCls, "cursor-pointer truncate pr-10")}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className={chevronCls} />
        </div>

        <div className={cn(segment, "sm:mt-1 sm:before:absolute sm:before:inset-y-3 sm:before:left-0 sm:before:w-0.5 sm:before:bg-espresso/10")}>
          <label htmlFor={`${id}-where`} className={labelCls}>
            <MapPin className="h-3.5 w-3.5 text-rose" aria-hidden />
            Where
          </label>
          <select
            id={`${id}-where`}
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className={cn(controlCls, "cursor-pointer truncate pr-10")}
          >
            <option value="">Anywhere</option>
            <optgroup label="Towns">
              {regions.map((r) => (
                <option key={r.id} value={`region:${r.id}`}>
                  {r.id === "sheffield" ? "All of Sheffield" : r.label}
                </option>
              ))}
            </optgroup>
            {sheffield && (
              <optgroup label="Sheffield neighbourhoods">
                {sheffield.areas.map((a) => (
                  <option key={a.id} value={`area:${a.id}`}>
                    {a.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <ChevronDown aria-hidden className={chevronCls} />
        </div>

        <button
          type="submit"
          className="group/btn mt-1 inline-flex h-14 items-center justify-center gap-2 rounded-[1.1rem] border-2 border-espresso bg-espresso px-7 font-heading text-base font-bold text-cream transition-all hover:bg-cocoa sm:ml-1 sm:h-auto sm:min-h-[62px] sm:px-8"
        >
          <Search className="h-5 w-5 transition-transform group-hover/btn:scale-110" aria-hidden />
          Search
        </button>
      </div>
    </form>
  );
}
