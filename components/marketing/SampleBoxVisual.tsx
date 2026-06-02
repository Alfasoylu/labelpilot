export function SampleBoxVisual() {
  return (
    <div className="lpv-sample" aria-hidden="true">
      <div className="lpv-sample-stage">
        <div className="lpv-sample-box">
          <div className="lpv-sample-box-flap" />
          <div className="lpv-sample-box-label">
            <span className="lpv-sample-box-tag">Musterbox</span>
            <span className="lpv-sample-box-spec">PP-Folie</span>
          </div>

          <div className="lpv-sample-strips">
            <div className="lpv-sample-strip lpv-sample-strip--opaque">
              <span className="lpv-sample-strip-chip">opak</span>
            </div>
            <div className="lpv-sample-strip lpv-sample-strip--transparent">
              <span className="lpv-sample-strip-chip">transparent</span>
            </div>
            <div className="lpv-sample-strip lpv-sample-strip--brass">
              <span className="lpv-sample-strip-chip">opak</span>
            </div>
          </div>
        </div>

        <div className="lpv-sample-dim">100×200 mm</div>
      </div>
    </div>
  );
}
