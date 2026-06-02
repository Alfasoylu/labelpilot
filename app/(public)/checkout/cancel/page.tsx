import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Checkout</span>
        <h1>Zahlung wurde nicht abgeschlossen.</h1>
        <p>Sie koennen den Checkout erneut starten oder stattdessen ein Angebot anfordern.</p>
        <div className="cta-row">
          <Link href="/de/opake-pp-etiketten" className="cta-link">
            Erneut versuchen
          </Link>
          <Link href="/de/angebot-anfordern" className="secondary-link">
            Angebot anfordern
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            Kontakt
          </Link>
        </div>
      </article>
    </div>
  );
}
