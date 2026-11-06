import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const base = site.url.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Members-only and team areas. "/business-support/" (with the slash) blocks
      // the members' subpages but keeps the public /business-support landing page.
      disallow: ["/admin", "/api/", "/members", "/business-support/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
