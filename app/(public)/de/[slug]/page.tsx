import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { DynamicPage } from "@/components/page-renderers";
import {
  buildBreadcrumbSchema,
  buildCanonicalMetadata,
  buildFaqSchema,
  buildPageSchema,
  metadataMap,
} from "@/lib/seo";
import { publicPageSlugs, publicPagesBySlug } from "@/lib/site-content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return publicPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = publicPagesBySlug[slug];

  if (!page) {
    return {};
  }

  return buildCanonicalMetadata(`/de/${slug}`, metadataMap[`/de/${slug}`]);
}

export default async function GermanPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = publicPagesBySlug[slug];

  if (!page) {
    notFound();
  }

  const canonicalPath = `/de/${slug}`;
  const faqSchema = page.faqs?.length ? buildFaqSchema(page.faqs) : null;
  const pageSchema = buildPageSchema(page, canonicalPath);

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(page.title, canonicalPath)} />
      {pageSchema ? <JsonLd data={pageSchema} /> : null}
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <DynamicPage page={page} canonicalPath={canonicalPath} />
    </>
  );
}
