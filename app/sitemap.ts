import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { isSitemapEligiblePath } from "@/lib/seo/governance";
import { sitemapEntries } from "@/lib/site-content";

// Computed once at module load (build/cold start) rather than per request, so
// every crawl no longer sees every page as "modified today" — a demonstrably
// inaccurate lastmod that Google ignores, forfeiting the freshness signal.
const LAST_BUILD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries
    .filter((entry) => isSitemapEligiblePath(entry.path))
    .map((entry) => ({
      url: buildAbsoluteUrl(entry.path),
      lastModified: LAST_BUILD,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
}
