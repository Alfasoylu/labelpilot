import type { Metadata } from "next";

import { DesignDetailClient } from "./DesignDetailClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design-Details | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ designId: string }>;
}) {
  const { designId } = await params;
  return <DesignDetailClient designId={designId} />;
}
