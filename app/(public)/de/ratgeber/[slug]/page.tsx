import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { DynamicPage } from "@/components/page-renderers";
import {
  buildBreadcrumbSchema,
  buildCanonicalMetadata,
  buildFaqSchema,
  buildHowToSchema,
  buildPageSchema,
  getBreadcrumbItems,
  metadataMap,
} from "@/lib/seo";
import { guidePageSlugs, guidePagesBySlug } from "@/lib/site-content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guidePageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = guidePagesBySlug[slug];

  if (!page) {
    return {};
  }

  return buildCanonicalMetadata(page.path, metadataMap[page.path]);
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = guidePagesBySlug[slug];

  if (!page) {
    notFound();
  }

  const faqSchema = page.faqs?.length ? buildFaqSchema(page.faqs) : null;
  const pageSchema = buildPageSchema(page, page.path);
  const howToSchema = buildHowToSchema(page, page.path);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(getBreadcrumbItems(page.title, page.path))}
      />
      {pageSchema ? <JsonLd data={pageSchema} /> : null}
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      {howToSchema ? <JsonLd data={howToSchema} /> : null}
      <DynamicPage page={page} canonicalPath={page.path} />
    </>
  );
}
