export function LabelRollVisual() {
  return (
    <div className="lpv-roll" aria-label="Etikettenrolle aus PP-Folie mit gespeichertem Design">
      <div className="lpv-roll-stage">
        {/* Label roll + unrolled strip with die-cut outlines */}
        <svg
          className="lpv-roll-art"
          viewBox="0 0 360 300"
          role="img"
          aria-label="Etikettenrolle mit teilweise abgewickeltem Etikettenstreifen"
        >
          <defs>
            <linearGradient id="lpvRollFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--surface)" />
              <stop offset="1" stopColor="var(--surface-strong)" />
            </linearGradient>
            <linearGradient id="lpvRollEdge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--accent-soft)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>

          {/* unrolled strip (liner) */}
          <g aria-hidden="true">
            <path
              d="M60 250 L300 250 Q318 232 300 214 L60 214 Z"
              fill="var(--surface)"
              stroke="var(--line)"
              strokeWidth="1.5"
            />
            {/* die-cut label outlines on the strip */}
            <rect x="96" y="220" width="58" height="24" rx="5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.85" />
            <rect x="170" y="220" width="58" height="24" rx="5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.85" />
            <rect x="244" y="220" width="44" height="24" rx="5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.55" />
          </g>

          {/* the roll body */}
          <g aria-hidden="true">
            <ellipse cx="150" cy="120" rx="98" ry="96" fill="url(#lpvRollEdge)" opacity="0.35" />
            <circle cx="150" cy="120" r="92" fill="url(#lpvRollFace)" stroke="var(--line)" strokeWidth="1.5" />
            <circle cx="150" cy="120" r="92" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
            {/* wound layers */}
            <circle cx="150" cy="120" r="74" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.7" />
            <circle cx="150" cy="120" r="58" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.6" />
            {/* core */}
            <circle cx="150" cy="120" r="40" fill="var(--bg-soft)" stroke="var(--line)" strokeWidth="1.5" />
            <circle cx="150" cy="120" r="40" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.45" />
            <circle cx="150" cy="120" r="22" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Saved design mini-card */}
        <div className="lpv-roll-design" aria-label="Gespeichertes Design, 100 mal 200 Millimeter, Freigegeben">
          <span className="lpv-roll-design-title">Gespeichertes Design</span>
          <span className="lpv-roll-dim">100×200 mm</span>
          <span className="lpv-roll-pill lpv-roll-pill-status">Freigegeben</span>
        </div>

        {/* Material swatches */}
        <div className="lpv-roll-swatches" aria-hidden="false">
          <div className="lpv-roll-swatch">
            <span className="lpv-roll-chip lpv-roll-chip-opak" aria-hidden="true" />
            <span className="lpv-roll-chip-label">PP opak</span>
          </div>
          <div className="lpv-roll-swatch">
            <span className="lpv-roll-chip lpv-roll-chip-transparent" aria-hidden="true" />
            <span className="lpv-roll-chip-label">PP transparent</span>
          </div>
        </div>

        {/* Proof / measurement label */}
        <div className="lpv-roll-proof" aria-label="Maß 100 mal 200 Millimeter, Nachbestellbar">
          <span className="lpv-roll-proof-dim">100×200 mm</span>
          <span className="lpv-roll-pill lpv-roll-pill-reorder">Nachbestellbar</span>
        </div>
      </div>
    </div>
  );
}
