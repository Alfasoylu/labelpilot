"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CustomSizeCheckoutForm } from "./CustomSizeCheckoutForm";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";
type Finishing = "MATT" | "GLAENZEND";
type CornerRadius = 0 | 2 | 3;
type Klebertyp = "PERMANENT" | "WIEDERABLOESBAR";
type Farbigkeit = 1 | 2 | 3 | 4;
type UVLack = "KEIN" | "GLAENZEND";

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
  cornerRadius: CornerRadius;
  weissunterdruck: boolean;
  klebertyp: Klebertyp;
  tiefkuehlgeeignet: boolean;
  farbigkeit: Farbigkeit;
  anzahlSorten: number;
  uvLack: UVLack;
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
    cornerRadius: 2,
    weissunterdruck: false,
    klebertyp: "PERMANENT",
    tiefkuehlgeeignet: false,
    farbigkeit: 4,
    anzahlSorten: 1,
    uvLack: "KEIN",
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
            {/* Row 1: Menge + Anzahl der Sorten */}
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
              <label htmlFor="kalk-sorten">Anzahl der Sorten</label>
              <input
                id="kalk-sorten"
                name="anzahlSorten"
                type="number"
                min={1}
                max={20}
                value={config.anzahlSorten}
                onChange={(e) => {
                  const v = Math.max(1, Number.parseInt(e.target.value, 10) || 1);
                  setConfig((c) => ({ ...c, anzahlSorten: v }));
                }}
              />
              <p className="field-hint">Verschiedene Motive in einer Bestellung.</p>
            </div>

            {/* Row 2: Material + Klebertyp */}
            <div className="field">
              <label htmlFor="kalk-material">Material</label>
              <select
                id="kalk-material"
                value={config.materialKey}
                onChange={(e) => setConfig((c) => ({
                  ...c,
                  materialKey: e.target.value as MaterialKey,
                  weissunterdruck: false,
                }))}
              >
                <option value="OPAQUE_PP">Opak PP-Folie (weiß)</option>
                <option value="TRANSPARENT_PP">Transparent PP-Folie</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="kalk-kleber">Klebertyp</label>
              <select
                id="kalk-kleber"
                value={config.klebertyp}
                onChange={(e) => setConfig((c) => ({ ...c, klebertyp: e.target.value as Klebertyp }))}
              >
                <option value="PERMANENT">Permanent haftend</option>
                <option value="WIEDERABLOESBAR">Wiederablösbar</option>
              </select>
            </div>

            {/* Row 2: Breite + Höhe */}
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

            {/* Row 3: Oberfläche + Eckenradius */}
            <div className="field">
              <label htmlFor="kalk-finishing">Oberfläche</label>
              <select
                id="kalk-finishing"
                value={config.finishing}
                onChange={(e) => setConfig((c) => ({ ...c, finishing: e.target.value as Finishing }))}
              >
                <option value="MATT">Matt</option>
                <option value="GLAENZEND">Glänzend</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="kalk-corner">Eckenradius</label>
              <select
                id="kalk-corner"
                value={config.cornerRadius}
                onChange={(e) => setConfig((c) => ({ ...c, cornerRadius: Number(e.target.value) as CornerRadius }))}
              >
                <option value={0}>0 mm – scharfe Ecken</option>
                <option value={2}>2 mm – gerundet (Standard)</option>
                <option value={3}>3 mm – stark gerundet</option>
              </select>
            </div>

            {/* Row 4: Farbigkeit + UV-Schutzlack */}
            <div className="field">
              <label htmlFor="kalk-farbe">Farbigkeit</label>
              <select
                id="kalk-farbe"
                value={config.farbigkeit}
                onChange={(e) => setConfig((c) => ({ ...c, farbigkeit: Number(e.target.value) as Farbigkeit }))}
              >
                <option value={1}>1-farbig</option>
                <option value={2}>2-farbig</option>
                <option value={3}>3-farbig</option>
                <option value={4}>4-farbig – CMYK (Standard)</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="kalk-uvlack">UV-Schutzlack</label>
              <select
                id="kalk-uvlack"
                value={config.uvLack}
                onChange={(e) => setConfig((c) => ({ ...c, uvLack: e.target.value as UVLack }))}
              >
                <option value="KEIN">Kein Lack</option>
                <option value="GLAENZEND">Glänzender Schutzlack</option>
              </select>
            </div>

            {/* Tiefkühlgeeignet checkbox */}
            <div className="field-full">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={config.tiefkuehlgeeignet}
                  onChange={(e) => setConfig((c) => ({ ...c, tiefkuehlgeeignet: e.target.checked }))}
                />
                <span>Tiefkühlgeeignet (bis −20 °C)</span>
              </label>
              <p className="field-hint">
                Für Produkte, die bei Kühl- oder Gefriertemperaturen gelagert werden. Spezialkleber hält auch bei Kälte und Feuchtigkeit.
              </p>
            </div>

            {/* Weißunterdruck — nur für Transparent PP */}
            {config.materialKey === "TRANSPARENT_PP" && (
              <div className="field-full">
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={config.weissunterdruck}
                    onChange={(e) => setConfig((c) => ({ ...c, weissunterdruck: e.target.checked }))}
                  />
                  <span>Weißunterdruck (opake Basis unter dem Motiv)</span>
                </label>
                <p className="field-hint">
                  Druckt eine opake weiße Schicht unter Ihr Design – empfohlen für leuchtende Farben
                  auf dunklen oder farbigen Behältern (Glas, PET, dunkle Dosen).
                </p>
              </div>
            )}
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

          <article className="surface-card kalkulator-config-summary">
            <h4>Konfiguration</h4>
            <ul className="kalkulator-summary-list">
              <li>
                <span>Format</span>
                <span>{config.widthMm || "–"} × {config.heightMm || "–"} mm</span>
              </li>
              <li>
                <span>Material</span>
                <span>{config.materialKey === "OPAQUE_PP" ? "Opak PP" : "Transparent PP"}</span>
              </li>
              <li>
                <span>Kleber</span>
                <span>{config.klebertyp === "PERMANENT" ? "Permanent" : "Wiederablösbar"}</span>
              </li>
              <li>
                <span>Oberfläche</span>
                <span>{config.finishing === "MATT" ? "Matt" : "Glänzend"}</span>
              </li>
              <li>
                <span>Eckenradius</span>
                <span>{config.cornerRadius} mm</span>
              </li>
              <li>
                <span>Farbigkeit</span>
                <span>{config.farbigkeit}-farbig{config.farbigkeit === 4 ? " (CMYK)" : ""}</span>
              </li>
              {config.uvLack !== "KEIN" && (
                <li>
                  <span>UV-Lack</span>
                  <span>Glänzend</span>
                </li>
              )}
              {config.tiefkuehlgeeignet && (
                <li>
                  <span>Tiefkühl</span>
                  <span>Ja</span>
                </li>
              )}
              {config.materialKey === "TRANSPARENT_PP" && (
                <li>
                  <span>Weißunterdruck</span>
                  <span>{config.weissunterdruck ? "Ja" : "Nein"}</span>
                </li>
              )}
              <li>
                <span>Sorten</span>
                <span>{config.anzahlSorten}</span>
              </li>
              <li>
                <span>Menge</span>
                <span>{typeof config.quantity === "number" ? config.quantity.toLocaleString("de-DE") : "–"} Stück</span>
              </li>
            </ul>
          </article>

          <article className="surface-card">
            <h4>Inklusive</h4>
            <ul className="simple-list">
              <li>Druckdatenprüfung</li>
              <li>Digitaler Proof</li>
              <li>Versand nach Deutschland</li>
              <li>Druckdaten gespeichert</li>
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
            cornerRadius={config.cornerRadius}
            weissunterdruck={config.weissunterdruck}
            klebertyp={config.klebertyp}
            tiefkuehlgeeignet={config.tiefkuehlgeeignet}
            farbigkeit={config.farbigkeit}
            anzahlSorten={config.anzahlSorten}
            uvLack={config.uvLack}
            netPrice={priceState.netPrice}
            grossPrice={priceState.grossPrice}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
}
