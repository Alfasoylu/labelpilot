export function SellerTrustBlock() {
  return (
    <section className="seller-trust-block">
      <div className="seller-trust-block__inner">
        <h2 className="seller-trust-block__heading">Transparenz &amp; Bestellsicherheit</h2>
        <dl className="seller-trust-block__list">
          <div className="seller-trust-block__item">
            <dt>Produktion</dt>
            <dd>
              Unsere PP-Rollenetiketten werden in der Türkei produziert — mit einer festen
              Qualitätsprüfung vor dem Versand.
            </dd>
          </div>
          <div className="seller-trust-block__item">
            <dt>Lieferung DDP nach Deutschland</dt>
            <dd>
              Alle Sendungen gehen DDP (Delivered Duty Paid) direkt an Ihre deutsche Adresse.
              Zoll, Import und Einfuhrsteuer sind im Preis enthalten — kein Aufwand für Sie.
            </dd>
          </div>
          <div className="seller-trust-block__item">
            <dt>Zahlung</dt>
            <dd>
              Alle Zahlungen werden über Stripe abgewickelt — Kreditkarte und SEPA-Lastschrift.
              Auf Rechnung auf Anfrage.
            </dd>
          </div>
          <div className="seller-trust-block__item">
            <dt>Vertragspartner</dt>
            <dd>
              Alfa Soylu Elektronik, Istanbul, Türkei. Anwendbares Recht: Deutschland.{" "}
              <a href="/de/impressum" className="seller-trust-block__link">
                Impressum
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
