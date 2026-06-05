"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Fehler</span>
        <h1>Es ist ein technischer Fehler aufgetreten.</h1>
        <p>
          Bitte versuchen Sie es erneut. Falls das Problem bestehen bleibt, nutzen Sie
          das Angebotsformular oder kontaktieren Sie uns – Ihre Daten bleiben sicher.
        </p>
        <div className="cta-row">
          <button type="button" className="cta-link" onClick={() => reset()}>
            Erneut versuchen
          </button>
          <Link href="/de" className="secondary-link">
            Zur Startseite
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            Kontakt
          </Link>
        </div>
      </article>
    </div>
  );
}
