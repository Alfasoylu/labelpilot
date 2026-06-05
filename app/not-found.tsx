import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Fehler 404</span>
        <h1>Diese Seite wurde nicht gefunden.</h1>
        <p>
          Die aufgerufene Adresse existiert nicht oder wurde verschoben. Über die
          folgenden Wege finden Sie schnell zurück zu unseren PP-Rollenetiketten.
        </p>
        <div className="cta-row">
          <Link href="/de/pp-rollenetiketten" className="cta-link">
            Zu den PP-Rollenetiketten
          </Link>
          <Link href="/de" className="secondary-link">
            Zur Startseite
          </Link>
          <Link href="/de/angebot-anfordern" className="secondary-link">
            Angebot anfordern
          </Link>
        </div>
      </article>
    </div>
  );
}
