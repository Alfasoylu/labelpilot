import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { HomePage } from "@/components/page-renderers";
import {
  buildCanonicalMetadata,
  buildOrganizationSchema,
  buildWebSiteSchema,
  metadataMap,
} from "@/lib/seo";
import { homePageData, siteNavigation } from "@/lib/site-content";

export const metadata: Metadata = buildCanonicalMetadata("/de", metadataMap["/de"]);

export default function GermanHomePage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
      <HomePage page={homePageData} navigation={siteNavigation} />
    </>
  );
}
