export function VariableDataBlock() {
  return (
    <section className="surface-card">
      <span className="eyebrow">Späterer Workflow</span>
      <h2>Variable Daten für Supplement-Marken strukturiert mitdenken</h2>
      <p>
        Diese Phase implementiert noch kein Backend für variable Daten. Die UI
        macht aber sichtbar, dass Lotnummer, SKT und Excel-Upload später in
        einen kontrollierten Workflow gehören.
      </p>
      <div className="card-grid">
        <article className="feature-card">
          <h3>Lotnummer</h3>
          <p>
            Wiederkehrende Chargen benötigen klare Versionslogik statt
            manueller Einzelkorrekturen.
          </p>
        </article>
        <article className="feature-card">
          <h3>SKT</h3>
          <p>
            MHD-nahe Informationen gehören in einen nachvollziehbaren
            Prüfprozess, nicht in spontane Dateihandarbeit.
          </p>
        </article>
        <article className="feature-card">
          <h3>Excel-Upload später</h3>
          <p>
            Die Oberfläche signalisiert bereits, dass variable Daten später
            systematisch verarbeitet werden, ohne diese Phase zu überbauen.
          </p>
        </article>
      </div>
    </section>
  );
}
