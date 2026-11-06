import type { MetadataRoute } from "next";
import { businesses } from "@/content/businesses";
import { categories } from "@/content/categories";
import { events } from "@/content/events";
import { stories } from "@/content/stories";
import { site } from "@/lib/site";

const base = site.url.replace(/\/$/, "");
const url = (path: string) => `${base}${path === "/" ? "" : path}`;

type Entry = MetadataRoute.Sitemap[number];

/**
 * Public pages. Members, admin and API routes are deliberately left out, and so
 * is sample content: sample listings, events and stories are noindex, and a
 * sitemap should only list pages we want search engines to index.
 */
const staticRoutes: { path: string; changeFrequency: Entry["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/directory", changeFrequency: "daily", priority: 0.9 },
  { path: "/map", changeFrequency: "weekly", priority: 0.8 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/spotlight", changeFrequency: "monthly", priority: 0.7 },
  { path: "/shop", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/impact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/community", changeFrequency: "monthly", priority: 0.6 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
  { path: "/work-with-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/business-support", changeFrequency: "monthly", priority: 0.6 },
  { path: "/join", changeFrequency: "monthly", priority: 0.7 },
  { path: "/join/business", changeFrequency: "monthly", priority: 0.8 },
  { path: "/join/member", changeFrequency: "monthly", priority: 0.6 },
  { path: "/join/partner", changeFrequency: "monthly", priority: 0.5 },
  { path: "/join/volunteer", changeFrequency: "monthly", priority: 0.5 },
  { path: "/events/stall", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

function latest(dates: (string | undefined)[]) {
  const times = dates.filter(Boolean).map((d) => new Date(d!).getTime()).filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const liveBusinesses = businesses.filter((b) => !b.sample);
  const liveEvents = events.filter((e) => !e.sample);
  const liveStories = stories.filter((s) => !s.sample);
  const directoryUpdated = latest(liveBusinesses.map((b) => b.joined));
  const storiesUpdated = latest(liveStories.map((s) => s.date));

  const pages: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: url(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.path === "/directory" && directoryUpdated ? { lastModified: directoryUpdated } : {}),
    ...(r.path === "/stories" && storiesUpdated ? { lastModified: storiesUpdated } : {}),
  }));

  const businessPages: MetadataRoute.Sitemap = liveBusinesses.map((b) => ({
    url: url(`/directory/${b.slug}`),
    lastModified: new Date(b.joined),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: url(`/directory/category/${c.id}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const eventPages: MetadataRoute.Sitemap = liveEvents.map((e) => ({
    url: url(`/events/${e.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const storyPages: MetadataRoute.Sitemap = liveStories.map((s) => ({
    url: url(`/stories/${s.slug}`),
    lastModified: new Date(s.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...businessPages, ...categoryPages, ...eventPages, ...storyPages];
}
