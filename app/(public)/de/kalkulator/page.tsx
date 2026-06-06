import type { Metadata } from "next";
import Link from "next/link";

import { KalkulatorClient } from "@/components/kalkulator/KalkulatorClient";

export const metadata: Metadata = {
  title: "Etiketten Kalkulator – Ihr individueller Preis | Labelpilot.de",
  description:
    "Berechnen Sie sofort den Preis für Ihre PP-Rollenetiketten im Wunschformat. Geben Sie Material, Breite, Höhe und Menge ein – und bestellen Sie direkt.",
};

export default async function KalkulatorPage({
  searchParams,
}: {
  searchParams: Promise<{
    quantity?: string;
    width?: string;
    height?: string;
    material?: string;
    print?: string;
  }>;
}) {
  const sp = await searchParams;

  const initialQuantity = sp.quantity
    ? Math.max(1, Number.parseInt(sp.quantity, 10))
    : undefined;
  const initialWidthMm = sp.width
    ? Math.min(320, Math.max(10, Number.parseInt(sp.width, 10)))
    : undefined;
  const initialHeightMm = sp.height
    ? Math.max(10, Number.parseInt(sp.height, 10))
    : undefined;

  return (
    <div className="container kalkulator-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/de">Startseite</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">Kalkulator</span>
      </nav>

      <div className="kalkulator-page-intro">
        <span className="eyebrow">PP-Rollenetiketten nach Maß</span>
        <h1>Etikettenpreis berechnen</h1>
        <p>Format, Material und Menge eingeben – Preis erscheint sofort. Ab 1 bis 19.999 Stück direkt bestellbar.</p>
      </div>

      <KalkulatorClient
        initialQuantity={initialQuantity}
        initialWidthMm={initialWidthMm}
        initialHeightMm={initialHeightMm}
        initialMaterial={sp.material}
        initialPrint={sp.print}
      />

      <article className="surface-card">
        <h2>Fragen zum Format?</h2>
        <p>
          Für Sonderfälle wie Konturschnitte, Veredelungen, Mehrfachsorten oder Großmengen
          ab 20.000 Stück erstellen wir ein individuelles B2B-Angebot.
        </p>
        <div className="cta-row">
          <Link href="/de/angebot-anfordern" className="cta-link">
            B2B-Angebot anfordern
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            Kontakt
          </Link>
        </div>
      </article>
    </div>
  );
}
