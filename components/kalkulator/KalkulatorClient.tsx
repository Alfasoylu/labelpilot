"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { trackLeadEvent } from "@/lib/analytics/browser";
import { CustomSizeCheckoutForm } from "./CustomSizeCheckoutForm";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";
type Finishing = "MATT" | "GLAENZEND";
type CornerRadius = 0 | 2 | 3;
type Klebertyp = "PERMANENT" | "WIEDERABLOESBAR";
type Farbigkeit = 1 | 2 | 3 | 4;
type UVLack = "KEIN" | "GLAENZEND";
type Form = "RECHTECKIG" | "OVAL";
type Kerndurchmesser = "26" | "40" | "50" | "76";
type Wickelrichtung = "BELIEBIG" | "ABROLLUNG_1" | "ABROLLUNG_2" | "ABROLLUNG_3" | "ABROLLUNG_4";

const OVAL_SURCHARGE_NET = 0.03;

type KalkulatorInitialProps = {
  initialQuantity?: number;
  initialWidthMm?: number;
  initialHeightMm?: number;
  initialMaterial?: string;
  initialPrint?: string;
  initialFarbigkeit?: number;
  designServiceNet?: number;
  designServiceFreeThresholdNet?: number;
};

function mapInitialMaterial(slug?: string): MaterialKey {
  if (slug === "pp-transparent") return "TRANSPARENT_PP";
  return "OPAQUE_PP";
}

type KalkulatorConfig = {
  materialKey: MaterialKey;
  form: Form;
  widthMm: number | "";
  heightMm: number | "";
  mengeProMotiv: number | "";
  anzahlSorten: number;
  finishing: Finishing;
  cornerRadius: CornerRadius;
  weissunterdruck: boolean;
  klebertyp: Klebertyp;
  tiefkuehlgeeignet: boolean;
  farbigkeit: Farbigkeit;
  uvLack: UVLack;
  kerndurchmesser: Kerndurchmesser;
  wickelrichtung: Wickelrichtung;
};

type PriceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "configured"; quoteRequired: false; method: "DIGITAL" | "FLEXO"; netPrice: number; grossPrice: number; inkCostNet: number; plateCostNet: number; digitalPrintingCostNet: number; isHeavyShipment: boolean }
  | { status: "quote" }
  | { status: "unconfigured" }
  | { status: "error" };

function formatEur(amount: number | null | undefined) {
  if (amount == null || Number.isNaN(amount)) return "–";
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function configIsValid(cfg: KalkulatorConfig): cfg is KalkulatorConfig & {
  widthMm: number;
  heightMm: number;
  mengeProMotiv: number;
} {
  return (
    typeof cfg.widthMm === "number" && cfg.widthMm >= 10 &&
    typeof cfg.heightMm === "number" && cfg.heightMm >= 10 &&
    typeof cfg.mengeProMotiv === "number" && cfg.mengeProMotiv >= 1
  );
}

export function KalkulatorClient({
  initialQuantity,
  initialWidthMm,
  initialHeightMm,
  initialMaterial,
  initialPrint,
  initialFarbigkeit,
  designServiceNet = 40,
  designServiceFreeThresholdNet = 2000,
}: KalkulatorInitialProps = {}) {
  const validFarbigkeit = (initialFarbigkeit && [1,2,3,4].includes(initialFarbigkeit))
    ? initialFarbigkeit as Farbigkeit
    : 4 as Farbigkeit;

  const initialMaterialKey = mapInitialMaterial(initialMaterial);
  const [config, setConfig] = useState<KalkulatorConfig>({
    materialKey: initialMaterialKey,
    form: "RECHTECKIG",
    widthMm: initialWidthMm ?? 100,
    heightMm: initialHeightMm ?? 200,
    mengeProMotiv: initialQuantity ?? 1000,
    anzahlSorten: 1,
    finishing: "GLAENZEND",
    cornerRadius: 2,
    weissunterdruck: initialMaterialKey === "TRANSPARENT_PP",
    klebertyp: "PERMANENT",
    tiefkuehlgeeignet: false,
    farbigkeit: validFarbigkeit,
    uvLack: "KEIN",
    kerndurchmesser: "76",
    wickelrichtung: "BELIEBIG",
  });
  const [priceState, setPriceState] = useState<PriceState>({ status: "idle" });
  const [hasOwnArtwork, setHasOwnArtwork] = useState(true);
  const [mode, setMode] = useState<"configure" | "checkout">("configure");
  const checkoutRef = useRef<HTMLDivElement>(null);
  const lastTrackedRef = useRef<string>("");

  const fetchPrice = useCallback(async (cfg: KalkulatorConfig) => {
    if (!configIsValid(cfg)) return;
    setPriceState({ status: "loading" });
    const colorCount = cfg.farbigkeit + (cfg.weissunterdruck ? 1 : 0);
    const totalQuantity = (cfg.mengeProMotiv as number) * cfg.anzahlSorten;
    try {
      const res = await fetch("/api/kalkulator/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialKey: cfg.materialKey,
          widthMm: cfg.widthMm,
          heightMm: cfg.heightMm,
          quantity: totalQuantity,
          colorCount,
          anzahlSorten: cfg.anzahlSorten,
          finishing: cfg.finishing,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) { setPriceState({ status: "error" }); return; }
      if (!data.configured) { setPriceState({ status: "unconfigured" }); return; }
      if (data.quoteRequired) { setPriceState({ status: "quote" }); return; }
      setPriceState({
        status: "configured",
        quoteRequired: false,
        method: data.method ?? "FLEXO",
        netPrice: data.netPrice ?? 0,
        grossPrice: data.grossPrice ?? 0,
        inkCostNet: data.breakdown?.inkCostNet ?? 0,
        plateCostNet: data.breakdown?.plateCostNet ?? 0,
        digitalPrintingCostNet: data.breakdown?.digitalPrintingCostNet ?? 0,
        isHeavyShipment: data.isHeavyShipment ?? false,
      });
      // Funnel signal: which configuration/price the visitor actually saw.
      // De-duplicated so fiddling with one field doesn't flood events.
      const signature = `${cfg.materialKey}|${cfg.widthMm}x${cfg.heightMm}|${totalQuantity}|${colorCount}|${cfg.finishing}`;
      if (signature !== lastTrackedRef.current) {
        lastTrackedRef.current = signature;
        trackLeadEvent("configurator_price_calculated", {
          material: cfg.materialKey,
          widthMm: cfg.widthMm,
          heightMm: cfg.heightMm,
          quantity: totalQuantity,
          colorCount,
          finishing: cfg.finishing,
          method: data.method ?? "FLEXO",
          netPrice: data.netPrice ?? 0,
        });
      }
    } catch {
      setPriceState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPrice(config); }, 500);
    return () => clearTimeout(t);
  }, [config, fetchPrice]);

  function handleOrder() {
    trackLeadEvent("configurator_order_click", {
      material: config.materialKey,
      widthMm: config.widthMm,
      heightMm: config.heightMm,
      quantity: typeof config.mengeProMotiv === "number" ? config.mengeProMotiv * config.anzahlSorten : null,
      finishing: config.finishing,
      netPrice: priceState.status === "configured" ? priceState.netPrice : null,
    });
    setMode("checkout");
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleBack() {
    setMode("configure");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const finalNetPrice = priceState.status === "configured" ? priceState.netPrice : 0;
  const finalGrossPrice = priceState.status === "configured" ? priceState.grossPrice : 0;
  const inkCostNet = priceState.status === "configured" ? priceState.inkCostNet : 0;
  const plateCostNet = priceState.status === "configured" ? priceState.plateCostNet : 0;
  const digitalPrintingCostNet = priceState.status === "configured" ? priceState.digitalPrintingCostNet : 0;
  const printMethod = priceState.status === "configured" ? priceState.method : null;
  const isHeavyShipment = priceState.status === "configured" ? priceState.isHeavyShipment : false;
  const colorCount = config.farbigkeit + (config.weissunterdruck ? 1 : 0);
  const totalQuantity = typeof config.mengeProMotiv === "number" ? config.mengeProMotiv * config.anzahlSorten : 0;
  const ovalSurchargeNet = config.form === "OVAL" ? OVAL_SURCHARGE_NET * totalQuantity : 0;
  const ovalSurchargeGross = Math.round(ovalSurchargeNet * 1.19 * 100) / 100;
  const displayNetPrice = finalNetPrice + ovalSurchargeNet;
  const displayGrossPrice = finalGrossPrice + ovalSurchargeGross;

  const designFeeNet = !hasOwnArtwork && priceState.status === "configured" && displayNetPrice < designServiceFreeThresholdNet
    ? designServiceNet
    : 0;
  const designFeeGross = Math.round(designFeeNet * 1.19 * 100) / 100;
  const totalNetPrice = displayNetPrice + designFeeNet;
  const totalGrossPrice = displayGrossPrice + designFeeGross;
  // What the design fee would be if the user selected design service (regardless of current selection)
  const prospectiveDesignFeeNet = priceState.status === "configured" && displayNetPrice < designServiceFreeThresholdNet
    ? designServiceNet
    : 0;

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
            {/* Row 1: Menge pro Motiv + Anzahl Motive */}
            <div className="field">
              <label htmlFor="kalk-menge-pro-motiv">Menge pro Motiv (Stück)</label>
              <input
                id="kalk-menge-pro-motiv"
                name="mengeProMotiv"
                type="number"
                min={1}
                value={config.mengeProMotiv}
                onChange={(e) => {
                  const v = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10);
                  setConfig((c) => ({ ...c, mengeProMotiv: Number.isNaN(v as number) ? "" : v }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="kalk-sorten">Anzahl verschiedener Motive</label>
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
              {config.anzahlSorten > 1 ? (
                <p className="field-hint">
                  {config.anzahlSorten} Motive × {typeof config.mengeProMotiv === "number" ? config.mengeProMotiv.toLocaleString("de-DE") : "–"} Stück = <strong>{totalQuantity > 0 ? totalQuantity.toLocaleString("de-DE") : "–"} Stück gesamt</strong>
                </p>
              ) : (
                <p className="field-hint">Verschiedene Motive werden als separate Druckjobs produziert.</p>
              )}
            </div>

            {/* Row 2: Material + Oberfläche */}
            <div className="field">
              <label htmlFor="kalk-material">Material</label>
              <select
                id="kalk-material"
                value={config.materialKey}
                onChange={(e) => {
                  const mat = e.target.value as MaterialKey;
                  setConfig((c) => ({
                    ...c,
                    materialKey: mat,
                    weissunterdruck: mat === "TRANSPARENT_PP" ? true : c.weissunterdruck,
                    finishing: mat === "TRANSPARENT_PP" ? "GLAENZEND" : c.finishing,
                  }));
                }}
              >
                <option value="OPAQUE_PP">Opak PP-Folie (weiß)</option>
                <option value="TRANSPARENT_PP">Transparent PP-Folie</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="kalk-finishing">Oberfläche</label>
              <select
                id="kalk-finishing"
                value={config.finishing}
                disabled={config.materialKey === "TRANSPARENT_PP"}
                onChange={(e) => setConfig((c) => ({ ...c, finishing: e.target.value as Finishing }))}
              >
                <option value="GLAENZEND">Glänzend</option>
                <option value="MATT" disabled={config.materialKey === "TRANSPARENT_PP"}>Matt</option>
              </select>
              {config.materialKey === "TRANSPARENT_PP" && (
                <p className="field-hint">Transparent PP ist immer glänzend.</p>
              )}
            </div>

            {/* Row 3: Form + Klebertyp */}
            <div className="field">
              <label htmlFor="kalk-form">Form</label>
              <select
                id="kalk-form"
                value={config.form}
                onChange={(e) => setConfig((c) => ({ ...c, form: e.target.value as Form }))}
              >
                <option value="RECHTECKIG">Rechteckig (Standard)</option>
                <option value="OVAL">Oval / Rund (+0,03 € / Stück)</option>
              </select>
              {config.form === "OVAL" && (
                <p className="field-hint">Motiv muss oval gestaltet sein. Rechteckige Druckdaten werden automatisch oval ausgestanzt.</p>
              )}
            </div>

            {/* Row 3: Klebertyp + Kerndurchmesser */}
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
            <div className="field">
              <label htmlFor="kalk-kern">Kerndurchmesser</label>
              <select
                id="kalk-kern"
                value={config.kerndurchmesser}
                onChange={(e) => setConfig((c) => ({ ...c, kerndurchmesser: e.target.value as Kerndurchmesser }))}
              >
                <option value="76">76 mm – Standard</option>
                <option value="40">40 mm</option>
                <option value="50">50 mm</option>
                <option value="26">26 mm</option>
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

            {/* Eckenradius (nur bei Rechteckig) */}
            {config.form === "RECHTECKIG" && (
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
            )}

            {/* Farbigkeit + UV-Schutzlack */}
            <div className="field">
              <label htmlFor="kalk-farbe">Farbigkeit</label>
              <select
                id="kalk-farbe"
                value={config.farbigkeit}
                onChange={(e) => setConfig((c) => ({ ...c, farbigkeit: Number(e.target.value) as Farbigkeit }))}
              >
                <option value={1}>1-farbig, Sonderfarbe</option>
                <option value={2}>2-farbig, Sonderfarben</option>
                <option value={3}>3-farbig, Sonderfarben</option>
                <option value={4}>4-farbig, Euroskala (CMYK)</option>
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

            {/* Wickelrichtung */}
            <div className="field-full">
              <label htmlFor="kalk-wickel">Wickelrichtung</label>
              <select
                id="kalk-wickel"
                value={config.wickelrichtung}
                onChange={(e) => setConfig((c) => ({ ...c, wickelrichtung: e.target.value as Wickelrichtung }))}
              >
                <option value="BELIEBIG">Wickelrichtung beliebig (Standard)</option>
                <option value="ABROLLUNG_1">Abrollung 1 – von außen, Etikett oben</option>
                <option value="ABROLLUNG_2">Abrollung 2 – von außen, Etikett unten</option>
                <option value="ABROLLUNG_3">Abrollung 3 – von innen, Etikett oben</option>
                <option value="ABROLLUNG_4">Abrollung 4 – von innen, Etikett unten</option>
              </select>
              <p className="field-hint">Passend zu Ihrer Etikettiermaschine. Im Zweifel: Wickelrichtung beliebig lassen.</p>
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

            {/* Weißunterdruck */}
            <div className="field-full">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={config.weissunterdruck}
                  onChange={(e) => setConfig((c) => ({ ...c, weissunterdruck: e.target.checked }))}
                />
                <span>Weißunterdruck (weiße Grundschicht)</span>
              </label>
              <p className="field-hint">
                {config.materialKey === "TRANSPARENT_PP"
                  ? "Empfohlen für Transparent PP – opake Basisschicht damit Farben leuchten und nicht durchscheinen. Zählt als +1 Druckfarbe im Preis."
                  : "Opake Basisschicht unter dem Motiv für maximale Farbdeckkraft – zählt als +1 Druckfarbe im Preis."}
              </p>
            </div>
            {/* Druckdaten / Designservice */}
            <div className="field-full">
              <div className="artwork-option-group">
                <label className={`artwork-option${hasOwnArtwork ? " artwork-option--active" : ""}`}>
                  <input
                    type="radio"
                    name="artworkChoice"
                    checked={hasOwnArtwork}
                    onChange={() => setHasOwnArtwork(true)}
                  />
                  <div>
                    <span className="artwork-option__label">
                      Druckdaten vorhanden
                      <span className="info-tooltip">
                        i
                        <span className="info-tooltip__popup">
                          Wir akzeptieren PDF, AI, EPS oder TIFF (min. 300 dpi, CMYK, 3 mm Beschnitt, Texte in Pfade). Upload nach Bestellung möglich.
                        </span>
                      </span>
                    </span>
                    <span className="artwork-option__hint">Ich lade meine Druckdatei selbst hoch.</span>
                  </div>
                </label>
                <label className={`artwork-option${!hasOwnArtwork ? " artwork-option--active" : ""}`}>
                  <input
                    type="radio"
                    name="artworkChoice"
                    checked={!hasOwnArtwork}
                    onChange={() => setHasOwnArtwork(false)}
                  />
                  <div>
                    <span className="artwork-option__label">
                      Designservice buchen
                      <span className="info-tooltip">
                        i
                        <span className="info-tooltip__popup">
                          Unser Team gestaltet Ihr Etikett nach Vorlage oder Briefing. {designServiceNet} € netto · kostenlos ab {designServiceFreeThresholdNet} € Bestellwert.
                        </span>
                      </span>
                    </span>
                    <span className="artwork-option__hint">
                      {priceState.status === "configured"
                        ? prospectiveDesignFeeNet > 0
                          ? `+${formatEur(prospectiveDesignFeeNet)} Designgebühr`
                          : "Im Bestellwert inbegriffen"
                        : `+${designServiceNet} € Designgebühr`}
                    </span>
                  </div>
                </label>
              </div>
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
                  Für dieses Sonderformat erstellen wir ein individuelles Angebot.
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
                  {printMethod === "DIGITAL" ? (
                    <li>
                      <span>Digitaldruck ({colorCount} Farben, {config.anzahlSorten} Sorte{config.anzahlSorten > 1 ? "n" : ""})</span>
                      <span>{formatEur(digitalPrintingCostNet)}</span>
                    </li>
                  ) : (
                    <li>
                      <span>Flexodruck ({colorCount} Farben, {config.anzahlSorten} Sorte{config.anzahlSorten > 1 ? "n" : ""})</span>
                      <span>{formatEur(inkCostNet + plateCostNet)}</span>
                    </li>
                  )}
                  {config.form === "OVAL" && ovalSurchargeNet > 0 && (
                    <li>
                      <span>Ovale Stanzform ({totalQuantity.toLocaleString("de-DE")} × 0,03 €)</span>
                      <span>{formatEur(ovalSurchargeNet)}</span>
                    </li>
                  )}
                  {designFeeNet > 0 && (
                    <li>
                      <span>Designservice</span>
                      <span>{formatEur(designFeeNet)}</span>
                    </li>
                  )}
                  <li>
                    <span>Gesamt Netto</span>
                    <span>{formatEur(totalNetPrice)}</span>
                  </li>
                  <li>
                    <span>MwSt. 19 %</span>
                    <span>{formatEur(totalGrossPrice - totalNetPrice)}</span>
                  </li>
                  <li className="kalkulator-price-total">
                    <span>Gesamt inkl. MwSt.</span>
                    <span>{formatEur(totalGrossPrice)}</span>
                  </li>
                  <li className="kalkulator-price-shipping">
                    <span>✓ Inklusive Versand nach Deutschland</span>
                  </li>
                  <li className="kalkulator-price-shipping">
                    <span>Lieferzeit: ca. {isHeavyShipment ? "21–28" : "7–14"} Werktage nach Druckdaten-Freigabe</span>
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
                <span>Form</span>
                <span>{config.form === "OVAL" ? "Oval / Rund" : "Rechteckig"}</span>
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
              {config.form === "RECHTECKIG" && (
                <li>
                  <span>Eckenradius</span>
                  <span>{config.cornerRadius} mm</span>
                </li>
              )}
              <li>
                <span>Farbigkeit</span>
                <span>
                  {config.farbigkeit === 1 ? "1-farbig, Sonderfarbe" :
                   config.farbigkeit === 2 ? "2-farbig, Sonderfarben" :
                   config.farbigkeit === 3 ? "3-farbig, Sonderfarben" :
                   "4-farbig, CMYK"}
                </span>
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
              <li>
                <span>Weißunterdruck</span>
                <span>{config.weissunterdruck ? "Ja" : "Nein"}</span>
              </li>
              <li>
                <span>Kerndurchmesser</span>
                <span>{config.kerndurchmesser} mm</span>
              </li>
              {config.wickelrichtung !== "BELIEBIG" && (
                <li>
                  <span>Wickelrichtung</span>
                  <span>Abrollung {config.wickelrichtung.split("_")[1]}</span>
                </li>
              )}
              {config.anzahlSorten > 1 ? (
                <>
                  <li>
                    <span>Motive</span>
                    <span>{config.anzahlSorten}</span>
                  </li>
                  <li>
                    <span>Stück / Motiv</span>
                    <span>{typeof config.mengeProMotiv === "number" ? config.mengeProMotiv.toLocaleString("de-DE") : "–"}</span>
                  </li>
                  <li>
                    <span>Menge gesamt</span>
                    <span>{totalQuantity > 0 ? totalQuantity.toLocaleString("de-DE") : "–"} Stück</span>
                  </li>
                </>
              ) : (
                <li>
                  <span>Menge</span>
                  <span>{typeof config.mengeProMotiv === "number" ? config.mengeProMotiv.toLocaleString("de-DE") : "–"} Stück</span>
                </li>
              )}
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
            form={config.form}
            widthMm={config.widthMm as number}
            heightMm={config.heightMm as number}
            quantity={totalQuantity}
            mengeProMotiv={config.mengeProMotiv as number}
            finishing={config.finishing}
            cornerRadius={config.cornerRadius}
            weissunterdruck={config.weissunterdruck}
            klebertyp={config.klebertyp}
            tiefkuehlgeeignet={config.tiefkuehlgeeignet}
            farbigkeit={config.farbigkeit}
            anzahlSorten={config.anzahlSorten}
            uvLack={config.uvLack}
            kerndurchmesser={config.kerndurchmesser}
            wickelrichtung={config.wickelrichtung}
            printMethod={printMethod ?? "DIGITAL"}
            netPrice={displayNetPrice}
            grossPrice={displayGrossPrice}
            isHeavyShipment={isHeavyShipment}
            onBack={handleBack}
          />
          {/* plateCostNet passed for order summary display; already included in netPrice */}
        </div>
      )}
    </div>
  );
}
