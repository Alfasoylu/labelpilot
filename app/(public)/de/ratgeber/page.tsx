import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { DynamicPage } from "@/components/page-renderers";
import {
  buildBreadcrumbSchema,
  buildCanonicalMetadata,
  buildFaqSchema,
  buildPageSchema,
  getBreadcrumbItems,
  metadataMap,
} from "@/lib/seo";
import { hubPagesBySlug } from "@/lib/site-content";

const page = hubPagesBySlug.ratgeber;

export const metadata: Metadata = buildCanonicalMetadata(
  page.path,
  metadataMap[page.path],
);

export default function GuideHubPage() {
  const faqSchema = page.faqs?.length ? buildFaqSchema(page.faqs) : null;
  const pageSchema = buildPageSchema(page, page.path);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(getBreadcrumbItems(page.title, page.path))}
      />
      {pageSchema ? <JsonLd data={pageSchema} /> : null}
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <DynamicPage page={page} canonicalPath={page.path} />
    </>
  );
}
