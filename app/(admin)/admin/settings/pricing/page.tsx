import type { Metadata } from "next";

import {
  formatPricingDate,
  type PricingAuditRecord,
  formatPricingNumber,
  getDefaultPricingMaterial,
  getDefaultPricingSettings,
  getPricingAdminSnapshot,
  PRICING_MATERIAL_KEYS,
} from "@/lib/admin/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preisparameter | Labelpilot Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type PricingSettingsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

const MATERIAL_LABELS: Record<(typeof PRICING_MATERIAL_KEYS)[number], string> = {
  OPAQUE_PP: "Opakes PP",
  TRANSPARENT_PP: "Transparentes PP",
};

export default async function PricingSettingsPage({
  searchParams,
}: PricingSettingsPageProps) {
  const feedback = await searchParams;
  const snapshot = await getPricingAdminSnapshot();

  if (!snapshot) {
    return (
      <article className="legal-card">
        <h2>Preisparameter sind derzeit nicht verfügbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const settings = snapshot.settings ?? getDefaultPricingSettings();

  // Build test result from query params
  const calcResult = feedback.calcNet
    ? {
        matKey: feedback.calcMatKey ?? "",
        widthMm: feedback.calcWidthMm ?? "",
        heightMm: feedback.calcHeightMm ?? "",
        quantity: feedback.calcQuantity ?? "",
        colorCount: feedback.calcColorCount ?? "",
        quoteRequired: feedback.calcQuoteRequired === "true",
        net: feedback.calcNet,
        gross: feedback.calcGross,
        materialCost: feedback.calcMaterialCost,
        ink: feedback.calcInk,
        plate: feedback.calcPlate,
        production: feedback.calcProduction,
        labelArea: feedback.calcLabelArea,
        totalArea: feedback.calcTotalArea,
      }
    : null;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Preisparameter für Custom Size</h2>
        <p className="price-note">
          Nur für den internen Rechner. Keine kundenseitige Freigabe in diesem Schritt.
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

      {/* Testrechner */}
      <article className="surface-card">
        <h2>Testrechner</h2>
        <form
          action="/api/admin/settings/pricing/test"
          method="post"
          className="quote-form"
        >
          <div className="form-grid">
            <div>
              <label htmlFor="materialKey">Material</label>
              <select id="materialKey" name="materialKey" defaultValue="OPAQUE_PP">
                <option value="OPAQUE_PP">Opakes PP</option>
                <option value="TRANSPARENT_PP">Transparentes PP</option>
              </select>
            </div>
            <div>
              <label htmlFor="colorCount">Renk Sayısı (Farbanzahl)</label>
              <input id="colorCount" name="colorCount" type="number" min="1" max="12" defaultValue="4" />
              <p className="field-hint">Weißunterdruck = +1 Farbe hinzurechnen.</p>
            </div>
            <div>
              <label htmlFor="widthMm">Breite in mm</label>
              <input id="widthMm" name="widthMm" type="number" min="1" defaultValue="100" />
            </div>
            <div>
              <label htmlFor="heightMm">Höhe in mm</label>
              <input id="heightMm" name="heightMm" type="number" min="1" defaultValue="200" />
            </div>
            <div>
              <label htmlFor="quantity">Menge</label>
              <input id="quantity" name="quantity" type="number" min="1" defaultValue="1000" />
            </div>
          </div>
          <div className="inline-actions">
            <button type="submit" className="cta-button">
              Preis testen
            </button>
          </div>
        </form>

        {calcResult ? (
          <div className="section-card">
            <h3>Testergebnis</h3>
            <ul className="simple-list">
              <li>Material: {calcResult.matKey}</li>
              <li>Format: {calcResult.widthMm} × {calcResult.heightMm} mm</li>
              <li>Menge: {calcResult.quantity}</li>
              <li>Renk Sayısı: {calcResult.colorCount}</li>
              <li>Quote erforderlich: {calcResult.quoteRequired ? "Ja" : "Nein"}</li>
              <li>Labelfläche: {calcResult.labelArea} m²</li>
              <li>Gesamtfläche inkl. Ausschuss: {calcResult.totalArea} m²</li>
              <li>Materialkosten: €{calcResult.materialCost}</li>
              <li>Boyakosten (Ink): €{calcResult.ink}</li>
              <li>Kalıpkosten (Platten): €{calcResult.plate}</li>
              <li>Produktionskosten gesamt: €{calcResult.production}</li>
              <li><strong>Verkauf netto: €{calcResult.net}</strong></li>
              <li><strong>Verkauf brutto: €{calcResult.gross}</strong></li>
            </ul>
          </div>
        ) : null}
      </article>

      {/* Preisparameter speichern */}
      <article className="surface-card">
        <h2>Preisparameter speichern</h2>

        <div className="section-card">
          <h3>Berechnungsformel (Flexo-Druck)</h3>
          <ol className="simple-list" style={{ fontFamily: "monospace", fontSize: "0.85em", lineHeight: 1.8 }}>
            <li>Labelfläche [m²] = Breite × Höhe ÷ 1.000.000</li>
            <li>Gesamtfläche [m²] = Labelfläche × Menge × (1 + Ausschuss%)</li>
            <li>Materialkosten = Materialkosten/m² × Gesamtfläche</li>
            <li>Boyakosten = Kademe tablosuna göre (Menge-abhängig, pauschal)</li>
            <li>Kalıpkosten = Renk Sayısı × Kalıp/Farbe</li>
            <li>Produktionskosten = Materialkosten + Boyakosten + Kalıpkosten</li>
            <li>Nettopreis = max(Produktionskosten ÷ (1 − Marge%), Mindestauftragswert)</li>
            <li>Nettopreis = aufrunden auf Rundungsschritt</li>
            <li>Bruttopreis = Nettopreis × (1 + MwSt%)</li>
          </ol>
        </div>

        <form action="/api/admin/settings/pricing" method="post" className="quote-form">
          <div className="section-stack">

            {/* Per-material parameters */}
            {PRICING_MATERIAL_KEYS.map((materialKey) => {
              const material =
                snapshot.materials[materialKey] ?? getDefaultPricingMaterial(materialKey);

              return (
                <div key={materialKey} className="section-card">
                  <h3>{MATERIAL_LABELS[materialKey]}</h3>
                  <p className="price-note">
                    Zuletzt aktualisiert: {formatPricingDate(material.updatedAt)} durch{" "}
                    {material.updatedBy ?? "System"}
                  </p>
                  <div className="form-grid">
                    <div>
                      <label htmlFor={`${materialKey}-materialCostPerM2`}>
                        Materialkosten pro m²
                      </label>
                      <input
                        id={`${materialKey}-materialCostPerM2`}
                        name={`${materialKey}.materialCostPerM2`}
                        type="number"
                        min="0.01"
                        step="0.0001"
                        defaultValue={formatPricingNumber(material.materialCostPerM2, 4)}
                      />
                      <p className="field-hint">
                        PP-Folie + Kleber + Liner. Opak PP: 70 €/m², Transparent PP: 80 €/m².
                      </p>
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-wasteFactorPct`}>
                        Produktionsausschuss in %
                      </label>
                      <input
                        id={`${materialKey}-wasteFactorPct`}
                        name={`${materialKey}.wasteFactorPct`}
                        type="number"
                        min="0"
                        max="95"
                        step="0.01"
                        defaultValue={formatPricingNumber(material.wasteFactorPct)}
                      />
                      <p className="field-hint">
                        Materialaufschlag für Einrichten und Anlauf. Empfehlung: 15–20 %.
                      </p>
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-targetMarginPct`}>
                        Ziel-Bruttomarge in %
                      </label>
                      <input
                        id={`${materialKey}-targetMarginPct`}
                        name={`${materialKey}.targetMarginPct`}
                        type="number"
                        min="0.01"
                        max="95"
                        step="0.01"
                        defaultValue={formatPricingNumber(material.targetMarginPct)}
                      />
                      <p className="field-hint">
                        55 % → Nettopreis = Kosten ÷ 0,45.
                      </p>
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-minOrderValueNet`}>
                        Mindestauftragswert netto
                      </label>
                      <input
                        id={`${materialKey}-minOrderValueNet`}
                        name={`${materialKey}.minOrderValueNet`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={formatPricingNumber(material.minOrderValueNet)}
                      />
                      <p className="field-hint">
                        Empfehlung: 75 € (Opak) / 85 € (Transparent).
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Global settings */}
            <div className="section-card">
              <h3>Globale Einstellungen</h3>
              <p className="price-note">
                Zuletzt aktualisiert: {formatPricingDate(snapshot.settings?.updatedAt)} durch{" "}
                {snapshot.settings?.updatedBy ?? "System"}
              </p>

              <h4 style={{ marginTop: "1rem" }}>Kalıp & Boya Maliyetleri</h4>
              <div className="form-grid">
                <div>
                  <label htmlFor="settings-platePerColorCostNet">
                    Kalıp/Farbe netto (Platten pro Farbe)
                  </label>
                  <input
                    id="settings-platePerColorCostNet"
                    name="settings.platePerColorCostNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.platePerColorCostNet)}
                  />
                  <p className="field-hint">
                    40 € pro Farbe. 1 Farbe = 40 €, 4 Farben (CMYK) = 160 €, mit Weißunterdruck 5 Farben = 200 €.
                  </p>
                </div>
                <div>
                  <label htmlFor="settings-inkCostTier1Net">
                    Boya (Ink) Kademe 1 — bis Kademe 1 Menge
                  </label>
                  <input
                    id="settings-inkCostTier1Net"
                    name="settings.inkCostTier1Net"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.inkCostTier1Net)}
                  />
                  <p className="field-hint">Pauschal-Boyakosten bis inkl. Kademe-1-Grenze (Standard: 100 €).</p>
                </div>
                <div>
                  <label htmlFor="settings-inkCostTier1MaxQty">
                    Boya Kademe 1 — Max. Menge
                  </label>
                  <input
                    id="settings-inkCostTier1MaxQty"
                    name="settings.inkCostTier1MaxQty"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.inkCostTier1MaxQty}
                  />
                  <p className="field-hint">Bis zu dieser Menge gilt Kademe 1 (Standard: 10.000).</p>
                </div>
                <div>
                  <label htmlFor="settings-inkCostTier2Net">
                    Boya Kademe 2 — bis Kademe 2 Menge
                  </label>
                  <input
                    id="settings-inkCostTier2Net"
                    name="settings.inkCostTier2Net"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.inkCostTier2Net)}
                  />
                  <p className="field-hint">Pauschal-Boyakosten bis inkl. Kademe-2-Grenze (Standard: 170 €).</p>
                </div>
                <div>
                  <label htmlFor="settings-inkCostTier2MaxQty">
                    Boya Kademe 2 — Max. Menge
                  </label>
                  <input
                    id="settings-inkCostTier2MaxQty"
                    name="settings.inkCostTier2MaxQty"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.inkCostTier2MaxQty}
                  />
                  <p className="field-hint">Bis zu dieser Menge gilt Kademe 2 (Standard: 20.000).</p>
                </div>
                <div>
                  <label htmlFor="settings-inkCostAdditionalPer10kNet">
                    Boya — je weitere 10.000 Stück nach Kademe 2
                  </label>
                  <input
                    id="settings-inkCostAdditionalPer10kNet"
                    name="settings.inkCostAdditionalPer10kNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.inkCostAdditionalPer10kNet)}
                  />
                  <p className="field-hint">
                    Aufschlag pro angefangene 10.000 Stück über Kademe 2. Bsp.: 25.000 Stück = 170 + 70 = 240 € (Standard: 70 €).
                  </p>
                </div>
              </div>

              <h4 style={{ marginTop: "1.5rem" }}>Allgemeine Parameter</h4>
              <div className="form-grid">
                <div>
                  <label htmlFor="settings-vatPct">MwSt. in %</label>
                  <input
                    id="settings-vatPct"
                    name="settings.vatPct"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.vatPct)}
                  />
                  <p className="field-hint">Deutschland: 19 %.</p>
                </div>
                <div>
                  <label htmlFor="settings-roundingStepNet">Rundungsschritt netto</label>
                  <input
                    id="settings-roundingStepNet"
                    name="settings.roundingStepNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.roundingStepNet)}
                  />
                  <p className="field-hint">Preise werden auf diesen Schritt aufgerundet (z. B. 5 → 95 €, 100 €, 105 €…).</p>
                </div>
                <div>
                  <label htmlFor="settings-customMaxWidthMm">Max. Breite in mm</label>
                  <input
                    id="settings-customMaxWidthMm"
                    name="settings.customMaxWidthMm"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.customMaxWidthMm}
                  />
                  <p className="field-hint">Über diesem Wert → manuelles Angebot (quoteRequired).</p>
                </div>
                <div>
                  <label htmlFor="settings-customMaxHeightMm">Max. Höhe in mm</label>
                  <input
                    id="settings-customMaxHeightMm"
                    name="settings.customMaxHeightMm"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.customMaxHeightMm}
                  />
                  <p className="field-hint">Über diesem Wert → manuelles Angebot.</p>
                </div>
                <div>
                  <label htmlFor="settings-customMaxQuantity">Max. Menge</label>
                  <input
                    id="settings-customMaxQuantity"
                    name="settings.customMaxQuantity"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.customMaxQuantity}
                  />
                  <p className="field-hint">Über dieser Stückzahl → manuelles Angebot.</p>
                </div>
              </div>

              <h4 style={{ marginTop: "1.5rem" }}>Zusatzleistungen</h4>
              <div className="form-grid">
                <div>
                  <label htmlFor="settings-designServiceNet">Designservice netto</label>
                  <input
                    id="settings-designServiceNet"
                    name="settings.designServiceNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.designServiceNet)}
                  />
                  <p className="field-hint">Standard: 40 €. Entfällt ab dem unten definierten Schwellenwert.</p>
                </div>
                <div>
                  <label htmlFor="settings-designServiceFreeThresholdNet">
                    Designservice frei ab netto
                  </label>
                  <input
                    id="settings-designServiceFreeThresholdNet"
                    name="settings.designServiceFreeThresholdNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.designServiceFreeThresholdNet)}
                  />
                  <p className="field-hint">Standard: 2.000 €.</p>
                </div>
                <div>
                  <label htmlFor="settings-physicalProofNet">Andruck netto</label>
                  <input
                    id="settings-physicalProofNet"
                    name="settings.physicalProofNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.physicalProofNet)}
                  />
                  <p className="field-hint">Standard: 10 €.</p>
                </div>
                <div>
                  <label htmlFor="settings-expressNet">Express-Aufschlag netto</label>
                  <input
                    id="settings-expressNet"
                    name="settings.expressNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.expressNet)}
                  />
                </div>
                <div>
                  <label htmlFor="settings-extraDesignNet">Extra-Design netto</label>
                  <input
                    id="settings-extraDesignNet"
                    name="settings.extraDesignNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.extraDesignNet)}
                  />
                </div>
              </div>
            </div>

            <div className="inline-actions">
              <button type="submit" className="cta-button">
                Preisparameter speichern
              </button>
            </div>
          </div>
        </form>
      </article>

      {/* Änderungsprotokoll */}
      <article className="surface-card">
        <h2>Änderungsprotokoll</h2>
        {snapshot.audits.length === 0 ? (
          <p className="price-note">Noch keine Änderungen gespeichert.</p>
        ) : (
          <div className="section-stack">
            {snapshot.audits.map((audit: PricingAuditRecord) => (
              <div key={audit.id} className="section-card">
                <h3>
                  {audit.tableName} / {audit.fieldName}
                </h3>
                <p className="price-note">
                  {formatPricingDate(audit.changedAt)} durch {audit.actor}
                </p>
                <p className="field-hint">
                  Alt: {audit.oldValue ?? "leer"} · Neu: {audit.newValue ?? "leer"}
                </p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
