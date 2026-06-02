export function MaterialComparisonShowcase() {
  return (
    <div className="lpv-mat">
      <div className="lpv-mat__stack">
        <article className="lpv-mat__panel lpv-mat__panel--opaque">
          <div className="lpv-mat__chip" aria-hidden="true">
            <span className="lpv-mat__swatch lpv-mat__swatch--opaque" />
          </div>
          <div className="lpv-mat__body">
            <span className="lpv-mat__tag">PP · opak</span>
            <h3 className="lpv-mat__name">Opake PP-Etiketten</h3>
            <p className="lpv-mat__use">Deckend für Dosen, Beutel, Gläser.</p>
          </div>
        </article>

        <article className="lpv-mat__panel lpv-mat__panel--clear">
          <div className="lpv-mat__chip" aria-hidden="true">
            <span className="lpv-mat__swatch lpv-mat__swatch--clear" />
          </div>
          <div className="lpv-mat__body">
            <span className="lpv-mat__tag">PP · transparent</span>
            <h3 className="lpv-mat__name">Transparente PP-Etiketten</h3>
            <p className="lpv-mat__use">Klar für Flaschen, Gläser, Premium.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
