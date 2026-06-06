import type { Metadata } from "next";
import Link from "next/link";

import { KalkulatorClient } from "@/components/kalkulator/KalkulatorClient";

export const metadata: Metadata = {
  title: "Etiketten Kalkulator – Ihr individueller Preis | Labelpilot.de",
  description:
    "Berechnen Sie sofort den Preis für Ihre PP-Rollenetiketten im Wunschformat. Geben Sie Material, Breite, Höhe und Menge ein – und bestellen Sie direkt.",
};

export default function KalkulatorPage() {
  return (
    <div className="container section-stack">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/de">Startseite</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">Kalkulator</span>
      </nav>

      <article className="legal-card">
        <span className="eyebrow">Wunschformat</span>
        <h1>Etiketten Kalkulator</h1>
        <p>
          Geben Sie Ihr Format, Material und Menge ein – wir berechnen den Preis sofort.
          Fertigung nach Maß, Versand nach Deutschland inklusive.
        </p>
        <ul className="simple-list">
          <li>Breite bis 320 mm, Höhe frei wählbar</li>
          <li>Opak PP oder Transparent PP</li>
          <li>Matt oder Glänzend – kein Preisaufschlag</li>
          <li>Ab 1 Stück bis 19.999 Stück direkt bestellbar</li>
          <li>Ab 20.000 Stück: individuelles B2B-Angebot</li>
        </ul>
      </article>

      <KalkulatorClient />

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
