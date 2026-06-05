import type { Metadata } from "next";

import { KontoClient } from "./KontoClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kundenkonto | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

export default function KontoPage() {
  return <KontoClient />;
}
