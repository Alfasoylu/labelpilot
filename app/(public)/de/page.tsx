import type { Metadata } from "next";

import { HomePage } from "@/components/page-renderers";
import { buildCanonicalMetadata, metadataMap } from "@/lib/seo";
import { homePageData, siteNavigation } from "@/lib/site-content";

export const metadata: Metadata = buildCanonicalMetadata("/de", metadataMap["/de"]);

// Organization and WebSite schema live in the public layout so every public page
// carries the entity nodes that page-level schema references by @id.
export default function GermanHomePage() {
  return <HomePage page={homePageData} navigation={siteNavigation} />;
}
