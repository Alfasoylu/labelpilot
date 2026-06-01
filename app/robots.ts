import type { MetadataRoute } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/de", "/de/"],
        disallow: ["/account/", "/admin/", "/api/", "/lp/"],
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
    host: buildAbsoluteUrl("/"),
  };
}
