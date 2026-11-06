import type { MediaItem } from "./types";

/**
 * Press, video and podcast appearances. Add Instagram reels here as `kind: "instagram"`
 * with the reel URL once the Christmas market, rebrand mixer and Cutlery Works clips are located.
 */
export const media: MediaItem[] = [
  {
    id: "exposed-2022",
    kind: "press",
    title: "Providing a Platform: interview with owners of Black Owned Sheffield",
    outlet: "Exposed Magazine",
    date: "2022-12-08",
    url: "https://www.exposedmagazine.co.uk/arts-culture/providing-a-platform-interview-with-owners-of-black-owned-sheffield/",
    description:
      "Ahead of our festive pop-up on Fargate, co-founders Asha and Rakaia spoke to Exposed about how the platform started and where it's heading.",
  },
  {
    id: "northside-black-expedition-2022",
    kind: "video",
    title: "Black Owned Sheffield | Black Expedition 2022",
    outlet: "Northside Media TV",
    date: "2022-10-31",
    url: "https://www.youtube.com/watch?v=Ynx7h2ijapE",
    youtubeId: "Ynx7h2ijapE",
    description: "Northside Media's film of our first market at Events Central on Fargate.",
  },
  {
    id: "daily-devotion-1",
    kind: "podcast",
    title: "“We Wanted To Do More For Black Business” (Part 1)",
    outlet: "Daily Devotion Podcast",
    date: "2022-12-04",
    url: "https://www.youtube.com/watch?v=R1KtvbOwWG4&t=210s",
    youtubeId: "R1KtvbOwWG4",
    youtubeStart: 210,
    description: "Why we started Black Owned Sheffield, and what we wanted to do for Black business in the city.",
  },
  {
    id: "daily-devotion-2",
    kind: "podcast",
    title: "“We Are So In Sync” (Part 2)",
    outlet: "Daily Devotion Podcast",
    date: "2022-12-06",
    url: "https://www.youtube.com/watch?v=OWz_Y5dExPE&t=1056s",
    youtubeId: "OWz_Y5dExPE",
    youtubeStart: 1056,
    description: "On running BOS together, the partnership behind the platform, and keeping each other going.",
  },
  {
    id: "daily-devotion-3",
    kind: "podcast",
    title: "“Just DO It” (Part 3)",
    outlet: "Daily Devotion Podcast",
    date: "2022-12-08",
    url: "https://www.youtube.com/watch?v=jfaqvC1guF8&t=512s",
    youtubeId: "jfaqvC1guF8",
    youtubeStart: 512,
    description: "Advice for anyone sitting on a business idea: start before you feel ready.",
  },
];

export const youtubeThumb = (id: string, quality: "hq" | "maxres" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;
