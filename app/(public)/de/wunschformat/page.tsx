import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomSizePriceForm } from "@/components/custom-size-price-form";
import { isCustomSizeEnabled } from "@/lib/pricing/custom-size-feature";
import { buildCanonicalMetadata, metadataMap } from "@/lib/seo";

export function generateMetadata(): Metadata {
  if (!isCustomSizeEnabled()) {
    return {};
  }

  return buildCanonicalMetadata(
    "/de/wunschformat",
    metadataMap["/de/wunschformat"],
  );
}

export default function CustomSizePage() {
  if (!isCustomSizeEnabled()) {
    notFound();
  }

  return <CustomSizePriceForm />;
}
