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
  robots: { index: false, follow: false },
};

type PricingSettingsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

const MATERIAL_LABELS: Record<(typeof PRICING_MATERIAL_KEYS)[number], string> = {
  OPAQUE_PP: "PP opak (weiß)",
  TRANSPARENT_PP: "PP transparent",
};

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Row({ label, value, unit }: { label: string; value: string | undefined; unit?: string }) {
  return (
    <tr>
      <td style={{ color: "var(--color-muted, #888)", paddingRight: "1.5rem", whiteSpace: "nowrap" }}>{label}</td>
      <td style={{ fontVariantNumeric: "tabular-nums" }}>
        {unit ? <><strong>{value}</strong> <span style={{ color: "var(--color-muted, #888)" }}>{unit}</span></> : <strong>{value}</strong>}
      </td>
    </tr>
  );
}

function Field({
  id, name, label, hint, value, min = "0.01", max, step = "0.01", suffix,
}: {
  id: string; name: string; label: string; hint?: string;
  value: string; min?: string; max?: string; step?: string; suffix?: string;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input id={id} name={name} type="number" min={min} max={max} step={step} defaultValue={value} />
        {suffix && <span style={{ color: "var(--color-muted, #888)", whiteSpace: "nowrap", fontSize: "0.875rem" }}>{suffix}</span>}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function PricingSettingsPage({ searchParams }: PricingSettingsPageProps) {
  const feedback = await searchParams;
  const snapshot = await getPricingAdminSnapshot();

  if (!snapshot) {
    return (
      <article className="legal-card">
        <h2>Preisparameter derzeit nicht verfügbar.</h2>
        <p>Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const settings = snapshot.settings ?? getDefaultPricingSettings();

  const calcResult = feedback.calcNet
    ? {
        matKey: feedback.calcMatKey ?? "",
        widthMm: feedback.calcWidthMm ?? "",
        heightMm: feedback.calcHeightMm ?? "",
        quantity: feedback.calcQuantity ?? "",
        colorCount: feedback.calcColorCount ?? "",
        sorten: feedback.calcSorten ?? "1",
        quoteRequired: feedback.calcQuoteRequired === "true",
        method: feedback.calcMethod ?? "",
        net: feedback.calcNet,
        gross: feedback.calcGross,
        materialCost: feedback.calcMaterialCost,
        ink: feedback.calcInk,
        plate: feedback.calcPlate,
        digital: feedback.calcDigital,
        multiplier: feedback.calcMultiplier,
        production: feedback.calcProduction,
        labelArea: feedback.calcLabelArea,
        totalArea: feedback.calcTotalArea,
      }
    : null;

  const divider = (
    <hr style={{ border: "none", borderTop: "1px solid var(--color-border, #e5e5e5)", margin: "1.25rem 0" }} />
  );

  return (
    <section className="section-stack">

      {/* ── Header ── */}
      <article className="surface-card" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>Preisparameter</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--color-muted, #888)" }}>
            Letzte Änderung: {formatPricingDate(snapshot.settings?.updatedAt)} durch {snapshot.settings?.updatedBy ?? "System"}
          </span>
        </div>
        {feedback.message && <p className="form-status success" style={{ marginTop: "0.75rem", marginBottom: 0 }}>{feedback.message}</p>}
        {feedback.error   && <p className="form-status error"   style={{ marginTop: "0.75rem", marginBottom: 0 }}>{feedback.error}</p>}
      </article>

      {/* ── Test-Rechner ── */}
      <article className="surface-card">
        <h3 style={{ marginTop: 0 }}>Preisrechner</h3>
        <form action="/api/admin/settings/pricing/test" method="post" className="quote-form">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem 1rem" }}>
            <div>
              <label htmlFor="materialKey">Material</label>
              <select id="materialKey" name="materialKey" defaultValue="OPAQUE_PP">
                <option value="OPAQUE_PP">PP opak</option>
                <option value="TRANSPARENT_PP">PP transparent</option>
              </select>
            </div>
            <div>
              <label htmlFor="widthMm">Breite (mm)</label>
              <input id="widthMm" name="widthMm" type="number" min="1" defaultValue="100" />
            </div>
            <div>
              <label htmlFor="heightMm">Höhe (mm)</label>
              <input id="heightMm" name="heightMm" type="number" min="1" defaultValue="200" />
            </div>
            <div>
              <label htmlFor="quantity">Menge</label>
              <input id="quantity" name="quantity" type="number" min="1" defaultValue="1000" />
            </div>
            <div>
              <label htmlFor="colorCount">Farben</label>
              <input id="colorCount" name="colorCount" type="number" min="1" max="12" defaultValue="4" />
              <p className="field-hint">+1 bei Weißunterdruck</p>
            </div>
            <div>
              <label htmlFor="anzahlSorten">Sorten</label>
              <input id="anzahlSorten" name="anzahlSorten" type="number" min="1" max="20" defaultValue="1" />
              <p className="field-hint">Verschiedene Motive</p>
            </div>
          </div>
          <div className="inline-actions" style={{ marginTop: "1rem" }}>
            <button type="submit" className="cta-button">Preis berechnen</button>
          </div>
        </form>

        {calcResult && (
          <div style={{
            marginTop: "1.25rem",
            background: "var(--color-surface-alt, #f7f6f3)",
            border: "1px solid var(--color-border, #e5e5e5)",
            borderRadius: "0.625rem",
            padding: "1rem 1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <strong style={{ fontSize: "0.9rem" }}>
                {calcResult.quoteRequired ? "⚠ Angebotsanfrage erforderlich" : `Methode: ${calcResult.method}`}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted, #888)" }}>
                {calcResult.widthMm} × {calcResult.heightMm} mm · {Number(calcResult.quantity).toLocaleString("de-DE")} Stk · {calcResult.colorCount} Farben · {calcResult.sorten} Sorte(n) · {calcResult.matKey}
              </span>
            </div>
            {!calcResult.quoteRequired && (
              <table style={{ fontSize: "0.875rem", borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <Row label="Labelfläche" value={calcResult.labelArea} unit="m²/Stk" />
                  <Row label="Gesamtfläche (inkl. Ausschuss)" value={calcResult.totalArea} unit="m²" />
                  {calcResult.method === "DIGITAL" ? (
                    <Row label="Digitaldruck" value={`€ ${calcResult.digital}`} />
                  ) : (
                    <>
                      <Row label="Materialkosten" value={`€ ${calcResult.materialCost}`} />
                      <Row label="Farbenkosten (Flexo)" value={`€ ${calcResult.ink}`} />
                      <Row label="Plattenkosten" value={`€ ${calcResult.plate}`} />
                      <Row label="Aufschlagsfaktor" value={`× ${calcResult.multiplier}`} />
                      <Row label="Produktionskosten" value={`€ ${calcResult.production}`} />
                    </>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "1px solid var(--color-border, #e5e5e5)" }}>
                    <td style={{ paddingTop: "0.5rem", color: "var(--color-muted, #888)" }}>Netto</td>
                    <td style={{ paddingTop: "0.5rem", fontSize: "1.05rem", fontVariantNumeric: "tabular-nums" }}>
                      <strong>€ {calcResult.net}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--color-muted, #888)" }}>Brutto (inkl. {settings.vatPct}% MwSt.)</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}><strong>€ {calcResult.gross}</strong></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        )}
      </article>

      {/* ── Preisparameter-Formular ── */}
      <form action="/api/admin/settings/pricing" method="post">
        <div className="section-stack">

          {/* §1 Materialien */}
          <article className="surface-card">
            <h3 style={{ marginTop: 0 }}>1 — Materialien</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {PRICING_MATERIAL_KEYS.map((materialKey) => {
                const material = snapshot.materials[materialKey] ?? getDefaultPricingMaterial(materialKey);
                return (
                  <div key={materialKey} style={{
                    border: "1px solid var(--color-border, #e5e5e5)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                  }}>
                    <p style={{ fontWeight: 600, margin: "0 0 0.75rem" }}>{MATERIAL_LABELS[materialKey]}</p>
                    <Field
                      id={`${materialKey}-materialCostPerM2`}
                      name={`${materialKey}.materialCostPerM2`}
                      label="Materialkosten (Glanz)"
                      value={formatPricingNumber(material.materialCostPerM2, 4)}
                      min="0.0001" step="0.0001" suffix="€/m²"
                    />
                    <div style={{ marginTop: "0.75rem" }}>
                      <Field
                        id={`${materialKey}-mattMaterialCostPerM2`}
                        name={`${materialKey}.mattMaterialCostPerM2`}
                        label="Materialkosten (Matt)"
                        value={formatPricingNumber(material.mattMaterialCostPerM2, 4)}
                        min="0.0001" step="0.0001" suffix="€/m²"
                        hint="Einkaufspreis des mattierten PP-Films. Leer = wie Glanz."
                      />
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      <Field
                        id={`${materialKey}-freezerMaterialCostPerM2`}
                        name={`${materialKey}.freezerMaterialCostPerM2`}
                        label="Materialkosten (Tiefkühl)"
                        value={formatPricingNumber(material.freezerMaterialCostPerM2, 4)}
                        min="0.0001" step="0.0001" suffix="€/m²"
                        hint="Einkaufspreis der tiefkühlgeeigneten PP-Rolle (Spezialkleber bis −20 °C). Leer = wie Standard."
                      />
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      <Field
                        id={`${materialKey}-wasteFactorPct`}
                        name={`${materialKey}.wasteFactorPct`}
                        label="Ausschuss"
                        value={formatPricingNumber(material.wasteFactorPct)}
                        min="0" max="95" step="0.1" suffix="%"
                        hint="Materialaufschlag für Einrichtung und Anlauf."
                      />
                    </div>
                    <div style={{ marginTop: "0.75rem" }}>
                      <Field
                        id={`${materialKey}-minOrderValueNet`}
                        name={`${materialKey}.minOrderValueNet`}
                        label="Mindestauftragswert"
                        value={formatPricingNumber(material.minOrderValueNet)}
                        suffix="€ netto"
                      />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-muted, #888)", margin: "0.75rem 0 0" }}>
                      Geändert: {formatPricingDate(material.updatedAt)} · {material.updatedBy ?? "System"}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>

          {/* §2 Druckmethoden */}
          <article className="surface-card">
            <h3 style={{ marginTop: 0 }}>2 — Druckmethoden</h3>
            <p className="field-hint" style={{ marginBottom: "1.25rem" }}>
              Die günstigere Methode wird automatisch gewählt. Digital: fester €/m²-Preis, kein Aufschlag.
              Flexo: Kosten × Aufschlagsfaktor (Sektion 3).
            </p>

            {/* Digital + Flexo nebeneinander */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>

              {/* Digital */}
              <div style={{ border: "1px solid var(--color-border, #e5e5e5)", borderRadius: "0.5rem", padding: "1rem" }}>
                <p style={{ fontWeight: 600, margin: "0 0 0.125rem" }}>Digitaldruck</p>
                <p className="field-hint" style={{ margin: "0 0 0.875rem" }}>
                  Preis = Verkaufspreis/m² × Gesamtfläche + Versand
                </p>
                <Field
                  id="settings-digitalCostPerM2Net"
                  name="settings.digitalCostPerM2Net"
                  label="Kosten (all-in)"
                  value={formatPricingNumber(settings.digitalCostPerM2Net)}
                  suffix="€/m²"
                  hint="Unsere Kosten inkl. Material."
                />
                <div style={{ marginTop: "0.75rem" }}>
                  <Field
                    id="settings-digitalSellingPricePerM2Net"
                    name="settings.digitalSellingPricePerM2Net"
                    label="Verkaufspreis"
                    value={formatPricingNumber(settings.digitalSellingPricePerM2Net)}
                    suffix="€/m²"
                    hint="Kundenseitige Netto-Rate — Marge hier eingebettet."
                  />
                </div>
                {settings.digitalCostPerM2Net > 0 && settings.digitalSellingPricePerM2Net > 0 && (
                  <p style={{ fontSize: "0.8rem", marginTop: "0.75rem", color: "var(--color-muted, #888)" }}>
                    Marge: {(((settings.digitalSellingPricePerM2Net - settings.digitalCostPerM2Net) / settings.digitalCostPerM2Net) * 100).toFixed(0)} % auf Kosten
                  </p>
                )}
              </div>

              {/* Flexo */}
              <div style={{ border: "1px solid var(--color-border, #e5e5e5)", borderRadius: "0.5rem", padding: "1rem" }}>
                <p style={{ fontWeight: 600, margin: "0 0 0.125rem" }}>Flexodruck</p>
                <p className="field-hint" style={{ margin: "0 0 0.875rem" }}>
                  Farbenkosten = €/m²/Farbe × Farbanzahl × Gesamtfläche
                </p>
                <Field
                  id="settings-inkCostPerM2PerColorNet"
                  name="settings.inkCostPerM2PerColorNet"
                  label="Farbenkosten"
                  value={formatPricingNumber(settings.inkCostPerM2PerColorNet, 4)}
                  min="0.0001" step="0.0001" suffix="€/m²/Farbe"
                  hint="Beispiel: 4 Farben × 23 m² × 0,33 € = 30,36 €"
                />
                <div style={{ marginTop: "0.75rem" }}>
                  <Field
                    id="settings-platePerColorCostNet"
                    name="settings.platePerColorCostNet"
                    label="Plattenkosten"
                    value={formatPricingNumber(settings.platePerColorCostNet)}
                    suffix="€/Farbe/Sorte"
                    hint="Beispiel: 4 Farben × 2 Sorten × 40 € = 320 €"
                  />
                </div>
              </div>
            </div>

          </article>

          {/* §3 Aufschlagsstaffel */}
          <article className="surface-card">
            <h3 style={{ marginTop: 0 }}>3 — Aufschlagsstaffel (Flexo)</h3>
            <p className="field-hint" style={{ marginBottom: "1rem" }}>
              Kosten × Faktor = Nettopreis. Gilt nur für Flexo — bei Digital ist der Aufschlag im Verkaufspreis/m² eingebettet.
            </p>

            {/* Tier-Tabelle */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "0.875rem", width: "100%" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--color-border, #e5e5e5)" }}>
                    <th style={{ textAlign: "left", padding: "0.5rem 1rem 0.5rem 0", fontWeight: 600 }}>Stufe</th>
                    <th style={{ textAlign: "left", padding: "0.5rem 1rem 0.5rem 0", fontWeight: 600 }}>Menge bis</th>
                    <th style={{ textAlign: "left", padding: "0.5rem 0", fontWeight: 600 }}>Aufschlagsfaktor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0", color: "var(--color-muted, #888)" }}>Tier 1</td>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          id="settings-markupTier1MaxQty"
                          name="settings.markupTier1MaxQty"
                          type="number" min="1" step="1"
                          defaultValue={settings.markupTier1MaxQty}
                          style={{ width: "100px" }}
                        />
                        <span style={{ color: "var(--color-muted, #888)", fontSize: "0.8rem" }}>Stk</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.625rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--color-muted, #888)" }}>×</span>
                        <input
                          id="settings-markupTier1Multiplier"
                          name="settings.markupTier1Multiplier"
                          type="number" min="1" step="0.01"
                          defaultValue={formatPricingNumber(settings.markupTier1Multiplier)}
                          style={{ width: "80px" }}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0", color: "var(--color-muted, #888)" }}>Tier 2</td>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          id="settings-markupTier2MaxQty"
                          name="settings.markupTier2MaxQty"
                          type="number" min="1" step="1"
                          defaultValue={settings.markupTier2MaxQty}
                          style={{ width: "100px" }}
                        />
                        <span style={{ color: "var(--color-muted, #888)", fontSize: "0.8rem" }}>Stk</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.625rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--color-muted, #888)" }}>×</span>
                        <input
                          id="settings-markupTier2Multiplier"
                          name="settings.markupTier2Multiplier"
                          type="number" min="1" step="0.01"
                          defaultValue={formatPricingNumber(settings.markupTier2Multiplier)}
                          style={{ width: "80px" }}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0", color: "var(--color-muted, #888)" }}>Tier 3</td>
                    <td style={{ padding: "0.625rem 1rem 0.625rem 0", color: "var(--color-muted, #888)", fontSize: "0.8rem" }}>
                      über Tier-2-Grenze
                    </td>
                    <td style={{ padding: "0.625rem 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "var(--color-muted, #888)" }}>×</span>
                        <input
                          id="settings-markupTier3Multiplier"
                          name="settings.markupTier3Multiplier"
                          type="number" min="1" step="0.01"
                          defaultValue={formatPricingNumber(settings.markupTier3Multiplier)}
                          style={{ width: "80px" }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          {/* §4 Allgemein */}
          <article className="surface-card">
            <h3 style={{ marginTop: 0 }}>4 — Allgemeine Parameter</h3>
            <div className="form-grid">
              <Field id="settings-vatPct" name="settings.vatPct" label="MwSt."
                value={formatPricingNumber(settings.vatPct)} min="0" max="100" suffix="%" />
              <Field id="settings-roundingStepNet" name="settings.roundingStepNet" label="Rundungsschritt netto"
                value={formatPricingNumber(settings.roundingStepNet)} suffix="€"
                hint="Preise werden auf diesen Betrag aufgerundet. 1 = ganzer Euro." />
              <Field id="settings-customMaxWidthMm" name="settings.customMaxWidthMm" label="Max. Breite"
                value={String(settings.customMaxWidthMm)} min="1" step="1" suffix="mm"
                hint="Über diesem Wert → manuelles Angebot." />
              <Field id="settings-customMaxHeightMm" name="settings.customMaxHeightMm" label="Max. Höhe"
                value={String(settings.customMaxHeightMm)} min="1" step="1" suffix="mm" />
              <Field id="settings-customMaxQuantity" name="settings.customMaxQuantity" label="Max. Menge"
                value={String(settings.customMaxQuantity)} min="1" step="1" suffix="Stk"
                hint="Über dieser Stückzahl → manuelles Angebot." />
            </div>
          </article>

          {/* §5 Versand (einklappbar) */}
          <details>
            <summary style={{
              cursor: "pointer",
              padding: "1rem 1.5rem",
              background: "var(--color-surface, #fff)",
              border: "1px solid var(--color-border, #e5e5e5)",
              borderRadius: "0.625rem",
              fontWeight: 600,
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span>5 — Versandkosten</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--color-muted, #888)" }}>aufklappen</span>
            </summary>
            <div style={{
              border: "1px solid var(--color-border, #e5e5e5)",
              borderTop: "none",
              borderRadius: "0 0 0.625rem 0.625rem",
              padding: "1.25rem 1.5rem",
              background: "var(--color-surface, #fff)",
            }}>
              <p className="field-hint" style={{ marginBottom: "1rem" }}>
                Versand wird in den Nettopreis eingerechnet. Progressive Staffel — jeder Anteil wird zum Stufentarif berechnet.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem 1rem" }}>
                <Field id="settings-labelWeightPerM2Grams" name="settings.labelWeightPerM2Grams" label="Etikettengewicht"
                  value={formatPricingNumber(settings.labelWeightPerM2Grams)} min="1" step="1" suffix="g/m²" />
                <Field id="settings-shippingMinCostEur" name="settings.shippingMinCostEur" label="Mindestversand"
                  value={formatPricingNumber(settings.shippingMinCostEur)} min="0" suffix="€"
                  hint="Untergrenze der Versandkosten." />
                <Field id="settings-shippingHeavyThresholdKg" name="settings.shippingHeavyThresholdKg" label="Schwersendung ab"
                  value={formatPricingNumber(settings.shippingHeavyThresholdKg)} min="1" step="1" suffix="kg"
                  hint="Über diesem Gewicht: längere Lieferzeit." />
              </div>
              {divider}
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", fontSize: "0.875rem", width: "100%" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border, #e5e5e5)" }}>
                      <th style={{ textAlign: "left", padding: "0.4rem 1rem 0.4rem 0", fontWeight: 600 }}>Stufe</th>
                      <th style={{ textAlign: "left", padding: "0.4rem 1rem 0.4rem 0", fontWeight: 600 }}>Bis (kg)</th>
                      <th style={{ textAlign: "left", padding: "0.4rem 0", fontWeight: 600 }}>Rate (€/kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Stufe 1", maxId: "settings-shippingTier1MaxKg", maxName: "settings.shippingTier1MaxKg", maxVal: formatPricingNumber(settings.shippingTier1MaxKg), rateId: "settings-shippingTier1RateEur", rateName: "settings.shippingTier1RateEur", rateVal: formatPricingNumber(settings.shippingTier1RateEur) },
                      { label: "Stufe 2", maxId: "settings-shippingTier2MaxKg", maxName: "settings.shippingTier2MaxKg", maxVal: formatPricingNumber(settings.shippingTier2MaxKg), rateId: "settings-shippingTier2RateEur", rateName: "settings.shippingTier2RateEur", rateVal: formatPricingNumber(settings.shippingTier2RateEur) },
                    ].map((row) => (
                      <tr key={row.label} style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
                        <td style={{ padding: "0.5rem 1rem 0.5rem 0", color: "var(--color-muted, #888)" }}>{row.label}</td>
                        <td style={{ padding: "0.5rem 1rem 0.5rem 0" }}>
                          <input id={row.maxId} name={row.maxName} type="number" min="1" step="1" defaultValue={row.maxVal} style={{ width: "90px" }} />
                        </td>
                        <td style={{ padding: "0.5rem 0" }}>
                          <input id={row.rateId} name={row.rateName} type="number" min="0" step="0.01" defaultValue={row.rateVal} style={{ width: "80px" }} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td style={{ padding: "0.5rem 1rem 0.5rem 0", color: "var(--color-muted, #888)" }}>Stufe 3</td>
                      <td style={{ padding: "0.5rem 1rem 0.5rem 0", color: "var(--color-muted, #888)", fontSize: "0.8rem" }}>über Stufe-2-Grenze</td>
                      <td style={{ padding: "0.5rem 0" }}>
                        <input id="settings-shippingTier3RateEur" name="settings.shippingTier3RateEur" type="number" min="0" step="0.01" defaultValue={formatPricingNumber(settings.shippingTier3RateEur)} style={{ width: "80px" }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          {/* §6 Zusatzleistungen (einklappbar) */}
          <details>
            <summary style={{
              cursor: "pointer",
              padding: "1rem 1.5rem",
              background: "var(--color-surface, #fff)",
              border: "1px solid var(--color-border, #e5e5e5)",
              borderRadius: "0.625rem",
              fontWeight: 600,
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span>6 — Zusatzleistungen</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--color-muted, #888)" }}>aufklappen</span>
            </summary>
            <div style={{
              border: "1px solid var(--color-border, #e5e5e5)",
              borderTop: "none",
              borderRadius: "0 0 0.625rem 0.625rem",
              padding: "1.25rem 1.5rem",
              background: "var(--color-surface, #fff)",
            }}>
              <div className="form-grid">
                <Field id="settings-designServiceNet" name="settings.designServiceNet" label="Designservice"
                  value={formatPricingNumber(settings.designServiceNet)} suffix="€ netto"
                  hint="Entfällt ab dem Schwellenwert unten." />
                <Field id="settings-designServiceFreeThresholdNet" name="settings.designServiceFreeThresholdNet" label="Designservice frei ab"
                  value={formatPricingNumber(settings.designServiceFreeThresholdNet)} suffix="€ Auftragswert" />
                <Field id="settings-physicalProofNet" name="settings.physicalProofNet" label="Andruck"
                  value={formatPricingNumber(settings.physicalProofNet)} suffix="€ netto" />
                <Field id="settings-expressNet" name="settings.expressNet" label="Express-Aufschlag"
                  value={formatPricingNumber(settings.expressNet)} suffix="€ netto" />
                <Field id="settings-extraDesignNet" name="settings.extraDesignNet" label="Extra-Design"
                  value={formatPricingNumber(settings.extraDesignNet)} suffix="€ netto" />
              </div>
            </div>
          </details>

          {/* Speichern */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="cta-button">Preisparameter speichern</button>
          </div>

        </div>
      </form>

      {/* ── Änderungsprotokoll ── */}
      <article className="surface-card">
        <h3 style={{ marginTop: 0 }}>Änderungsprotokoll</h3>
        {snapshot.audits.length === 0 ? (
          <p className="field-hint">Noch keine Änderungen protokolliert.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: "0.8rem", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border, #e5e5e5)" }}>
                  <th style={{ textAlign: "left", padding: "0.4rem 1rem 0.4rem 0", fontWeight: 600, whiteSpace: "nowrap" }}>Zeitpunkt</th>
                  <th style={{ textAlign: "left", padding: "0.4rem 1rem 0.4rem 0", fontWeight: 600 }}>Feld</th>
                  <th style={{ textAlign: "left", padding: "0.4rem 1rem 0.4rem 0", fontWeight: 600 }}>Alt</th>
                  <th style={{ textAlign: "left", padding: "0.4rem 0", fontWeight: 600 }}>Neu</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.audits.map((audit: PricingAuditRecord) => (
                  <tr key={audit.id} style={{ borderBottom: "1px solid var(--color-border, #e5e5e5)" }}>
                    <td style={{ padding: "0.4rem 1rem 0.4rem 0", color: "var(--color-muted, #888)", whiteSpace: "nowrap" }}>
                      {formatPricingDate(audit.changedAt)}
                    </td>
                    <td style={{ padding: "0.4rem 1rem 0.4rem 0", fontFamily: "monospace" }}>
                      {audit.fieldName}
                    </td>
                    <td style={{ padding: "0.4rem 1rem 0.4rem 0", color: "var(--color-muted, #888)" }}>
                      {audit.oldValue ?? "—"}
                    </td>
                    <td style={{ padding: "0.4rem 0", fontWeight: 500 }}>
                      {audit.newValue ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

    </section>
  );
}
