"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CustomSizeCheckoutForm } from "./CustomSizeCheckoutForm";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";
type Finishing = "MATT" | "GLAENZEND";

type KalkulatorInitialProps = {
  initialQuantity?: number;
  initialWidthMm?: number;
  initialHeightMm?: number;
  initialMaterial?: string;
  initialPrint?: string;
};

function mapInitialMaterial(slug?: string): MaterialKey {
  if (slug === "pp-transparent") return "TRANSPARENT_PP";
  return "OPAQUE_PP";
}

type KalkulatorConfig = {
  materialKey: MaterialKey;
  widthMm: number | "";
  heightMm: number | "";
  quantity: number | "";
  finishing: Finishing;
};

type PriceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "configured"; quoteRequired: false; netPrice: number; grossPrice: number }
  | { status: "quote" }
  | { status: "unconfigured" }
  | { status: "error" };

function formatEur(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function configIsValid(cfg: KalkulatorConfig): cfg is KalkulatorConfig & {
  widthMm: number;
  heightMm: number;
  quantity: number;
} {
  return (
    typeof cfg.widthMm === "number" && cfg.widthMm >= 10 &&
    typeof cfg.heightMm === "number" && cfg.heightMm >= 10 &&
    typeof cfg.quantity === "number" && cfg.quantity >= 1
  );
}

export function KalkulatorClient({
  initialQuantity,
  initialWidthMm,
  initialHeightMm,
  initialMaterial,
  initialPrint,
}: KalkulatorInitialProps = {}) {
  const [config, setConfig] = useState<KalkulatorConfig>({
    materialKey: mapInitialMaterial(initialMaterial),
    widthMm: initialWidthMm ?? 100,
    heightMm: initialHeightMm ?? 200,
    quantity: initialQuantity ?? 1000,
    finishing: "MATT",
  });
  const [priceState, setPriceState] = useState<PriceState>({ status: "idle" });
  const [mode, setMode] = useState<"configure" | "checkout">("configure");
  const checkoutRef = useRef<HTMLDivElement>(null);

  const fetchPrice = useCallback(async (cfg: KalkulatorConfig) => {
    if (!configIsValid(cfg)) return;
    setPriceState({ status: "loading" });
    try {
      const res = await fetch("/api/kalkulator/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialKey: cfg.materialKey,
          widthMm: cfg.widthMm,
          heightMm: cfg.heightMm,
          quantity: cfg.quantity,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) { setPriceState({ status: "error" }); return; }
      if (!data.configured) { setPriceState({ status: "unconfigured" }); return; }
      if (data.quoteRequired) { setPriceState({ status: "quote" }); return; }
      setPriceState({ status: "configured", quoteRequired: false, netPrice: data.netPrice, grossPrice: data.grossPrice });
    } catch {
      setPriceState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPrice(config); }, 500);
    return () => clearTimeout(t);
  }, [config, fetchPrice]);

  function handleOrder() {
    setMode("checkout");
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleBack() {
    setMode("configure");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const valid = configIsValid(config);
  const canOrder = valid && priceState.status === "configured";

  return (
    <div className="section-stack">
      {initialPrint === "unbedruckt" && (
        <p className="field-hint">
          Unbedruckte Etiketten sind über diesen Kalkulator nicht bestellbar.{" "}
          <a href="/de/angebot-anfordern" className="secondary-link">Angebot anfordern</a>
        </p>
      )}
      {initialMaterial === "paper-white" && (
        <p className="field-hint">
          Etikettenpapier ist über diesen Kalkulator nicht verfügbar. Format und Menge wurden übernommen;
          als Material wurde PP-Folie weiß vorgewählt.{" "}
          <a href="/de/angebot-anfordern" className="secondary-link">Für Etikettenpapier Angebot anfordern</a>
        </p>
      )}
      <div className="kalkulator-grid">
        {/* Left: Configuration */}
        <article className="surface-card">
          <h2>Format & Konfiguration</h2>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="kalk-quantity">Menge (Stück)</label>
              <input
                id="kalk-quantity"
                name="quantity"
                type="number"
                min={1}
                max={19999}
                value={config.quantity}
                onChange={(e) => {
                  const v = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10);
                  setConfig((c) => ({ ...c, quantity: Number.isNaN(v as number) ? "" : v }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="kalk-material">Material</label>
              <select
                id="kalk-material"
                value={config.materialKey}
                onChange={(e) => setConfig((c) => ({ ...c, materialKey: e.target.value as MaterialKey }))}
              >
                <option value="OPAQUE_PP">Opak PP-Folie (weiß)</option>
                <option value="TRANSPARENT_PP">Transparent PP-Folie</option>
              </select>
            </div>

            <div className="form-group">
              <span className="form-group-title">Format (mm)</span>
            </div>
            <div className="field">
              <label htmlFor="kalk-width">Breite (10–320 mm)</label>
              <input
                id="kalk-width"
                name="widthMm"
                type="number"
                min={10}
                max={320}
                value={config.widthMm}
                onChange={(e) => {
                  const v = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10);
                  setConfig((c) => ({ ...c, widthMm: Number.isNaN(v as number) ? "" : v }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="kalk-height">Höhe (10–700 mm)</label>
              <input
                id="kalk-height"
                name="heightMm"
                type="number"
                min={10}
                max={700}
                value={config.heightMm}
                onChange={(e) => {
                  const v = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10);
                  setConfig((c) => ({ ...c, heightMm: Number.isNaN(v as number) ? "" : v }));
                }}
              />
            </div>

            <div className="field-full">
              <label htmlFor="kalk-finishing">Oberfläche</label>
              <select
                id="kalk-finishing"
                value={config.finishing}
                onChange={(e) => setConfig((c) => ({ ...c, finishing: e.target.value as Finishing }))}
              >
                <option value="MATT">Matt</option>
                <option value="GLAENZEND">Glänzend</option>
              </select>
              <p className="field-hint">Kein Preisunterschied zwischen Matt und Glänzend.</p>
            </div>
          </div>
        </article>

        {/* Right: Price Box */}
        <aside className="kalkulator-price-box">
          <article className="surface-card">
            <h3>Unser Angebot</h3>

            {priceState.status === "idle" && (
              <p className="price-note">Bitte Format und Menge eingeben.</p>
            )}
            {priceState.status === "loading" && (
              <p className="price-note">Preis wird berechnet…</p>
            )}
            {priceState.status === "error" && (
              <p className="price-note">Preisberechnung nicht verfügbar.</p>
            )}
            {priceState.status === "unconfigured" && (
              <p className="price-note">
                Preiskonfiguration noch nicht eingerichtet.{" "}
                <a href="/de/angebot-anfordern" className="secondary-link">
                  Angebot anfordern
                </a>
              </p>
            )}
            {priceState.status === "quote" && (
              <>
                <p className="price-note">
                  Für diese Konfiguration (Menge ≥ 20.000 oder Sonderformat) erstellen wir ein
                  individuelles Angebot.
                </p>
                <div className="inline-actions">
                  <a href="/de/angebot-anfordern" className="cta-button">
                    Angebot anfordern
                  </a>
                </div>
              </>
            )}
            {priceState.status === "configured" && (
              <>
                <ul className="kalkulator-price-list">
                  <li>
                    <span>Basispreis Netto</span>
                    <span>{formatEur(priceState.netPrice)}</span>
                  </li>
                  <li>
                    <span>MwSt. 19 %</span>
                    <span>{formatEur(priceState.grossPrice - priceState.netPrice)}</span>
                  </li>
                  <li className="kalkulator-price-total">
                    <span>Gesamt inkl. MwSt.</span>
                    <span>{formatEur(priceState.grossPrice)}</span>
                  </li>
                  <li className="kalkulator-price-shipping">
                    <span>✓ Inklusive Versand nach Deutschland</span>
                  </li>
                </ul>
                <div className="inline-actions">
                  <button type="button" className="cta-button" onClick={handleOrder}>
                    Jetzt bestellen
                  </button>
                </div>
              </>
            )}

            {!canOrder && priceState.status !== "quote" && priceState.status !== "unconfigured" && (
              <p className="field-hint">
                Ab 20.000 Stück oder bei besonderen Anforderungen:{" "}
                <a href="/de/angebot-anfordern" className="secondary-link">
                  Angebot anfordern
                </a>
              </p>
            )}
          </article>

          <article className="surface-card">
            <h4>Inklusive in jedem Auftrag</h4>
            <ul className="simple-list">
              <li>Technische Druckdatenprüfung</li>
              <li>Digitaler Proof vor Produktion</li>
              <li>Versand nach Deutschland</li>
              <li>Freigegebene Version gespeichert</li>
            </ul>
          </article>
        </aside>
      </div>

      {/* Checkout form (revealed on order click) */}
      {mode === "checkout" && priceState.status === "configured" && (
        <div ref={checkoutRef}>
          <CustomSizeCheckoutForm
            materialKey={config.materialKey}
            widthMm={config.widthMm as number}
            heightMm={config.heightMm as number}
            quantity={config.quantity as number}
            finishing={config.finishing}
            netPrice={priceState.netPrice}
            grossPrice={priceState.grossPrice}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
}
