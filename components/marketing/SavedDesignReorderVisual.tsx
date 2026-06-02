const SPEC_ROWS: { label: string; value: string }[] = [
  { label: "Produkt", value: "Supplement Dose" },
  { label: "Material", value: "PP opak" },
  { label: "Format", value: "100×200 mm" },
  { label: "Letzte Bestellung", value: "5.000 Stück" },
];

const STEPS: string[] = [
  "Druckdatei hochladen",
  "Proof freigeben",
  "Design speichern",
  "Menge wählen",
  "Nachbestellen",
];

export function SavedDesignReorderVisual() {
  return (
    <div className="lpv-reorder">
      {/* (1) Saved design card */}
      <div className="lpv-reorder-card">
        <div className="lpv-reorder-thumb" aria-hidden="true">
          <div className="lpv-reorder-thumb-shape">
            <span className="lpv-reorder-thumb-line lpv-reorder-thumb-line--wide" />
            <span className="lpv-reorder-thumb-line" />
            <span className="lpv-reorder-thumb-line lpv-reorder-thumb-line--short" />
          </div>
        </div>

        <p className="lpv-reorder-eyebrow">Nachbestellbar</p>
        <h3 className="lpv-reorder-heading">Gespeichertes Design</h3>

        <dl className="lpv-reorder-specs">
          {SPEC_ROWS.map((row) => (
            <div className="lpv-reorder-spec" key={row.label}>
              <dt className="lpv-reorder-spec-label">{row.label}</dt>
              <dd className="lpv-reorder-spec-value">{row.value}</dd>
            </div>
          ))}
          <div className="lpv-reorder-spec">
            <dt className="lpv-reorder-spec-label">Status</dt>
            <dd className="lpv-reorder-spec-value">
              <span className="lpv-reorder-pill">Freigegeben</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* (2) Reorder timeline */}
      <div className="lpv-reorder-timeline">
        <p className="lpv-reorder-timeline-title">Nachbestellung in fünf Schritten</p>
        <ol className="lpv-reorder-track">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            return (
              <li
                className={
                  isLast
                    ? "lpv-reorder-node lpv-reorder-node--active"
                    : "lpv-reorder-node"
                }
                key={step}
              >
                <span className="lpv-reorder-marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="lpv-reorder-step">{step}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
