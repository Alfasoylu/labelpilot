import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { sitemapEntries } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries.map((entry) => ({
    url: buildAbsoluteUrl(entry.path),
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
