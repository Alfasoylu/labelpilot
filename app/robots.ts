import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { ROBOTS_ALLOW_PATHS, ROBOTS_DISALLOW_PATHS } from "@/lib/seo/governance";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [...ROBOTS_ALLOW_PATHS],
        disallow: [...ROBOTS_DISALLOW_PATHS],
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
    host: buildAbsoluteUrl("/"),
  };
}
