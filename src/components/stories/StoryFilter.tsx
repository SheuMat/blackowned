"use client";

import { useSearchParams } from "next/navigation";
import type { StoryCategory } from "@/content/types";
import { StoryFilterView, type StoryFilterItem, type StoryFilterTab } from "./StoryFilterView";

/**
 * Client-side category filter for /stories. Reads ?category= so the page can
 * stay statically rendered. Wrap in <Suspense> with <StoryFilterView active={null} />
 * as the fallback, so visitors without JavaScript still get every story.
 */
export function StoryFilter({ items, tabs }: { items: StoryFilterItem[]; tabs: StoryFilterTab[] }) {
  const params = useSearchParams();
  const raw = params.get("category");
  const active = tabs.some((t) => t.id === raw) ? (raw as StoryCategory) : null;
  return <StoryFilterView items={items} tabs={tabs} active={active} />;
}
