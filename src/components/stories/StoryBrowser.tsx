import { Suspense } from "react";
import { StoryCard } from "@/components/cards/StoryCard";
import { storyCategories } from "@/content/stories";
import type { Story } from "@/content/types";
import { storyCardImage } from "./cardFocus";
import { StoryFilter } from "./StoryFilter";
import { StoryFilterView, type StoryFilterItem, type StoryFilterTab } from "./StoryFilterView";

/**
 * Story grid with category tabs. The static HTML shows every story (works
 * without JavaScript); the client then narrows it to ?category=<id>.
 */
export function StoryBrowser({ stories, featuredSlug }: { stories: Story[]; featuredSlug?: string }) {
  const tabs: StoryFilterTab[] = storyCategories.map((c) => ({
    id: c.id,
    label: c.label,
    count: stories.filter((s) => s.category === c.id).length,
  }));

  const items: StoryFilterItem[] = stories.map((s) => ({
    slug: s.slug,
    category: s.category,
    hideInAll: s.slug === featuredSlug,
    node: <StoryCard story={s} imageClassName={storyCardImage} />,
  }));

  return (
    <Suspense fallback={<StoryFilterView items={items} tabs={tabs} active={null} />}>
      <StoryFilter items={items} tabs={tabs} />
    </Suspense>
  );
}
