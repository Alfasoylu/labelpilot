import type { Metadata } from "next";

import { BestellungDetailClient } from "./BestellungDetailClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bestelldetails | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BestellungDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <BestellungDetailClient orderId={orderId} />;
}
