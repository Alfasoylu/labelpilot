type ReorderWorkflowBlockProps = {
  title?: string;
  lead?: string;
  steps?: string[];
};

const defaultSteps = [
  "Freigegebene Druckdaten bleiben als klare Version gespeichert.",
  "Material, Maß und letzte freigegebene Menge werden wiederauffindbar.",
  "Eine Erinnerung weist auf den nächsten typischen Abruf hin.",
  "Die nächste Anfrage startet schneller und mit weniger Rückfragen.",
];

export function ReorderWorkflowBlock({
  title = "Gespeicherte Designs statt jedes Mal von vorn",
  lead = "Freigegebene Druckdaten, Material und Maß bleiben gespeichert – die nächste Bestellung startet schneller ohne neue Abstimmung.",
  steps = defaultSteps,
}: ReorderWorkflowBlockProps) {
  return (
    <section className="two-column">
      <div className="surface-card">
        <span className="eyebrow">Nachbestellen</span>
        <h2>{title}</h2>
        <p>{lead}</p>
        <ol className="status-list">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <StoredDesignVisualCard />
    </section>
  );
}

export function StoredDesignVisualCard() {
  return (
    <div className="hero-visual-card">
      <div className="visual-head">
        <div>
          <span className="visual-kicker">Gespeichertes Design</span>
          <h3 className="visual-title">Sommerlinie 2026</h3>
        </div>
        <span className="visual-status">v3 freigegeben</span>
      </div>
      <div className="visual-grid">
        <div className="visual-row">
          <span className="muted-label">Material</span>
          <strong>Transparentes PP</strong>
        </div>
        <div className="visual-row">
          <span className="muted-label">Maß</span>
          <strong>100×200 mm</strong>
        </div>
        <div className="visual-row">
          <span className="muted-label">Nächste Erinnerung</span>
          <strong>25 Tage</strong>
        </div>
      </div>
      <div className="hero-kpi-grid">
        <div className="hero-kpi">
          <span>Letzte Menge</span>
          <strong>5.000 Stück</strong>
        </div>
        <div className="hero-kpi">
          <span>Status</span>
          <strong>bereit für Nachbestellung</strong>
        </div>
      </div>
      <a href="/konto" className="cta-button">
        Im Kundenkonto nachbestellen
      </a>
    </div>
  );
}
