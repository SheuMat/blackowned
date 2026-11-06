"use client";

import type { ComponentProps, ReactNode } from "react";
import { BadgePercent, Check, ChevronDown, Clock, Columns2, LayoutGrid, List, Map as MapIcon, Sparkles, Truck } from "lucide-react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { regionMap, regions } from "@/content/areas";
import type { Category, RegionId } from "@/content/types";
import type { DirectoryQuery, DirectoryView } from "@/lib/directory-search";
import { cn } from "@/lib/utils";

/** Category chip with its colour and icon. Selected = espresso, like ChoiceChips. */
export function CategoryChip({
  category,
  selected,
  count,
  onToggle,
  className,
}: {
  category: Category;
  selected: boolean;
  count?: number;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 py-1.5 pr-3.5 pl-1.5 text-sm font-semibold whitespace-nowrap transition-all",
        selected
          ? "border-espresso bg-espresso text-cream shadow-pop-sm"
          : "border-espresso/15 bg-white text-espresso hover:border-espresso/60",
        className,
      )}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-espresso"
        style={{ backgroundColor: category.color, color: category.ink }}
      >
        {selected ? <Check className="h-3.5 w-3.5" aria-hidden /> : <CategoryIcon id={category.id} className="h-3.5 w-3.5" />}
      </span>
      {category.label}
      {count != null && (
        <span className={cn("text-xs font-bold", selected ? "text-cream/80" : "text-cocoa/80")}>
          {count}
          <span className="sr-only">{count === 1 ? " listing" : " listings"}</span>
        </span>
      )}
    </button>
  );
}

const toggleMeta = {
  hasOffer: { label: "Has a BOS offer", Icon: BadgePercent },
  openNow: { label: "Open now", Icon: Clock },
  featured: { label: "Featured", Icon: Sparkles },
  online: { label: "Online & delivery", Icon: Truck },
} as const;

export type ToggleKey = keyof typeof toggleMeta;
export const toggleKeys = Object.keys(toggleMeta) as ToggleKey[];

export function ToggleChip({
  name,
  pressed,
  onToggle,
  className,
}: {
  name: ToggleKey;
  pressed: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const { label, Icon } = toggleMeta[name];
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 text-sm font-semibold whitespace-nowrap transition-all",
        pressed
          ? "border-espresso bg-sunflower text-espresso shadow-pop-sm"
          : "border-espresso/15 bg-white text-espresso hover:border-espresso/60",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-espresso transition-colors",
          pressed ? "bg-espresso" : "bg-cream-deep",
        )}
      >
        <span
          className={cn(
            "absolute h-3 w-3 rounded-full transition-all",
            pressed ? "left-[18px] bg-sunflower" : "left-[2px] bg-espresso/60",
          )}
        />
      </span>
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

/** Native select dressed in the brand style (keeps mobile pickers and a11y for free). */
export function SelectControl({
  label,
  hideLabel,
  className,
  selectClassName,
  children,
  ...rest
}: Omit<ComponentProps<"select">, "className"> & {
  label: string;
  hideLabel?: boolean;
  className?: string;
  selectClassName?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className={cn("font-heading text-xs font-bold tracking-wide text-cocoa uppercase", hideLabel && "sr-only")}>{label}</span>
      <span className="relative">
        <select
          className={cn(
            "h-11 w-full cursor-pointer appearance-none rounded-full border-2 border-espresso/15 bg-white pr-10 pl-4 text-sm font-semibold text-espresso transition-colors hover:border-espresso/60 focus:border-espresso",
            selectClassName,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-espresso" />
      </span>
    </label>
  );
}

export function RegionSelect({
  value,
  onChange,
  hideLabel,
  className,
}: {
  value: RegionId | null;
  onChange: (region: RegionId | null) => void;
  hideLabel?: boolean;
  className?: string;
}) {
  return (
    <SelectControl
      label="Town"
      hideLabel={hideLabel}
      className={className}
      value={value ?? ""}
      onChange={(e) => onChange((e.target.value || null) as RegionId | null)}
    >
      <option value="">All towns</option>
      {regions.map((r) => (
        <option key={r.id} value={r.id}>
          {r.label}
        </option>
      ))}
    </SelectControl>
  );
}

/** Neighbourhood picker. Lists Sheffield areas unless another town with areas is chosen. */
export function AreaSelect({
  region,
  value,
  onChange,
  hideLabel,
  className,
}: {
  region: RegionId | null;
  value: string | null;
  onChange: (area: string | null) => void;
  hideLabel?: boolean;
  className?: string;
}) {
  const source = regionMap[region ?? "sheffield"];
  const options = source.areas.length > 1 ? source.areas : regionMap.sheffield.areas;
  const disabled = region != null && source.areas.length <= 1;
  return (
    <SelectControl
      label="Neighbourhood"
      hideLabel={hideLabel}
      className={className}
      value={disabled ? "" : (value ?? "")}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">{disabled ? `All of ${source.label}` : "Any neighbourhood"}</option>
      {!disabled &&
        options.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
    </SelectControl>
  );
}

const viewMeta: Record<DirectoryView, { label: string; Icon: typeof List; desktopOnly?: boolean }> = {
  grid: { label: "Grid", Icon: LayoutGrid },
  list: { label: "List", Icon: List },
  map: { label: "Map", Icon: MapIcon },
  split: { label: "List and map", Icon: Columns2, desktopOnly: true },
};

export function ViewSwitcher({
  value,
  onChange,
  className,
  showLabels = false,
}: {
  value: DirectoryView;
  onChange: (v: DirectoryView) => void;
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div role="group" aria-label="Choose a view" className={cn("inline-flex rounded-full border-2 border-espresso bg-white p-0.5 lg:p-1", className)}>
      {(Object.keys(viewMeta) as DirectoryView[]).map((v) => {
        const { label, Icon, desktopOnly } = viewMeta[v];
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(v)}
            title={label}
            className={cn(
              // 44px to tap on phones, a touch smaller beside the desktop sort menu
              "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm font-semibold transition-colors lg:h-10 lg:min-w-10",
              active ? "bg-espresso text-cream" : "text-espresso hover:bg-espresso/5",
              // "List and map" shows as a list on small screens
              v === "list" && value === "split" && "max-lg:bg-espresso max-lg:text-cream",
              desktopOnly && "hidden lg:inline-flex",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className={cn(!showLabels && "sr-only")}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function patchForRegion(query: DirectoryQuery, region: RegionId | null): Partial<DirectoryQuery> {
  const keepArea = query.area && region && regionMap[region].areas.some((a) => a.id === query.area);
  return { region, area: keepArea ? query.area : null };
}

export function patchForArea(area: string | null): Partial<DirectoryQuery> {
  if (!area) return { area: null };
  const region = regions.find((r) => r.areas.some((a) => a.id === area))?.id ?? null;
  return { area, region };
}
