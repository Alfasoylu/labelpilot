import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { isSitemapEligiblePath } from "@/lib/seo/governance";
import { sitemapEntries } from "@/lib/site-content";

// Computed once at module load (build/cold start) rather than per request, so
// every crawl no longer sees every page as "modified today" — a demonstrably
// inaccurate lastmod that Google ignores, forfeiting the freshness signal.
const LAST_BUILD = new Date();

// Entries that declare a real content-review date get that date as lastmod, so
// a rebuild no longer resets the freshness signal on pages nobody touched. The
// build date stays the fallback for pages without a recorded review date.
function resolveLastModified(lastModified: string | undefined) {
  if (!lastModified) {
    return LAST_BUILD;
  }

  const parsed = new Date(`${lastModified}T00:00:00.000Z`);

  return Number.isNaN(parsed.getTime()) ? LAST_BUILD : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries
    .filter((entry) => isSitemapEligiblePath(entry.path))
    .map((entry) => ({
      url: buildAbsoluteUrl(entry.path),
      lastModified: resolveLastModified(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
}
