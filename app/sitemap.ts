import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { isSitemapEligiblePath } from "@/lib/seo/governance";
import { sitemapEntries } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries
    .filter((entry) => isSitemapEligiblePath(entry.path))
    .map((entry) => ({
      url: buildAbsoluteUrl(entry.path),
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
}
