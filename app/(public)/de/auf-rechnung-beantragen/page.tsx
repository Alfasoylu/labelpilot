import type { Metadata } from "next";

import { buildAbsoluteUrl } from "@/lib/seo";
import { AufRechnungForm } from "./AufRechnungForm";

export const metadata: Metadata = {
  title: "Auf Rechnung bestellen – B2B-Netto-15 | Labelpilot.de",
  description:
    "Geprüfte B2B-Kunden können PP-Rollenetiketten auf Rechnung bestellen (Netto-15). Antrag in 2 Minuten – wir prüfen und melden uns innerhalb von 1–2 Werktagen.",
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
