import type { Metadata } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { AufRechnungForm } from "./AufRechnungForm";

export const metadata: Metadata = {
  title: "Auf Rechnung bestellen – Netto-15 für Geschäftskunden | Labelpilot.de",
  description:
    "Geprüfte B2B-Kunden können PP-Rollenetiketten auf Rechnung bestellen. Zahlung 15 Tage nach Lieferung. Antrag in 2 Minuten ausfüllen.",
  alternates: {
    canonical: buildAbsoluteUrl("/de/auf-rechnung-beantragen"),
  },
  openGraph: {
    title: "Auf Rechnung bestellen | Labelpilot",
    description: "Netto-15 für geprüfte Geschäftskunden – Antrag in 2 Minuten.",
  },
};

export default function AufRechnungBeantragenPage() {
  return <AufRechnungForm />;
}
