import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  formatPricingDate,
  type PricingAuditRecord,
  formatPricingNumber,
  getDefaultPricingMaterial,
  getDefaultPricingSettings,
  getPricingAdminSnapshot,
  PRICING_MATERIAL_KEYS,
} from "@/lib/admin/pricing";
import { explainCustomSizePrice } from "@/lib/pricing/custom-size";

// Oval/round form surcharge per label (mirrors checkout create-custom-session).
const OVAL_SURCHARGE_NET_PER_LABEL = 0.03;

function eur(value: number) {
  return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function num(value: number, digits = 2) {
  return value.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

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

function FormulaBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-muted, #888)", margin: "0 0 0.35rem" }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>{children}</div>
    </div>
  );
}

function FLine({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-mono-stack, ui-monospace, monospace)", fontSize: "0.8rem", lineHeight: 1.55, color: "var(--color-text, #222)", wordBreak: "break-word" }}>
      {children}
    </div>
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

  // ── Price tester (GET form → in-page computation) ──
  const t = {
    material: feedback.t_material === "TRANSPARENT_PP" ? "TRANSPARENT_PP" : "OPAQUE_PP",
    w: Number(feedback.t_w ?? 100),
    h: Number(feedback.t_h ?? 200),
    qty: Number(feedback.t_qty ?? 1000),
    colors: Number(feedback.t_colors ?? 4),
    weiss: feedback.t_weiss === "1",
    sorten: Number(feedback.t_sorten ?? 1),
    finishing: feedback.t_finishing === "MATT" ? "MATT" : "GLAENZEND",
    tiefkuehl: feedback.t_tiefkuehl === "1",
    form: feedback.t_form === "OVAL" ? "OVAL" : "RECHTECKIG",
  } as const;

  const testInputsValid =
    Number.isFinite(t.w) && t.w > 0 &&
    Number.isFinite(t.h) && t.h > 0 &&
    Number.isFinite(t.qty) && t.qty > 0 &&
    Number.isFinite(t.colors) && t.colors >= 1 &&
    Number.isFinite(t.sorten) && t.sorten >= 1;

  const effColors = Math.min(12, Math.round(t.colors) + (t.weiss ? 1 : 0));
  const testMaterial = snapshot.materials[t.material] ?? getDefaultPricingMaterial(t.material);

  let explanation: ReturnType<typeof explainCustomSizePrice> | null = null;
  if (testInputsValid) {
    try {
      explanation = explainCustomSizePrice({
        materialKey: t.material,
        widthMm: Math.round(t.w),
        heightMm: Math.round(t.h),
        quantity: Math.round(t.qty),
        colorCount: effColors,
        anzahlSorten: Math.round(t.sorten),
        finishing: t.finishing,
        tiefkuehlgeeignet: t.tiefkuehl,
        params: testMaterial,
        settings,
      });
    } catch {
      explanation = null;
    }
  }

  const ovalSurchargeNet = t.form === "OVAL" ? OVAL_SURCHARGE_NET_PER_LABEL * Math.round(t.qty) : 0;
  const finalNet = explanation && !explanation.quoteRequired ? explanation.netPrice + ovalSurchargeNet : 0;
  const finalGross = explanation ? finalNet * (1 + explanation.vatPct / 100) : 0;

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

      {/* ── Test-Rechner + Formel-Aufschlüsselung ── */}
      <article className="surface-card">
        <h3 style={{ marginTop: 0 }}>Preisrechner & Formel-Aufschlüsselung</h3>
        <p className="field-hint" style={{ marginTop: 0 }}>
          Alle Optionen wie im Kalkulator. Unten steht die vollständige Berechnung für Flexo- und Digitaldruck.
        </p>
        <form method="get" className="quote-form">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem 1rem" }}>
            <div>
              <label htmlFor="t_material">Material</label>
              <select id="t_material" name="t_material" defaultValue={t.material}>
                <option value="OPAQUE_PP">PP opak</option>
                <option value="TRANSPARENT_PP">PP transparent</option>
              </select>
            </div>
            <div><label htmlFor="t_w">Breite (mm)</label><input id="t_w" name="t_w" type="number" min="1" defaultValue={t.w} /></div>
            <div><label htmlFor="t_h">Höhe (mm)</label><input id="t_h" name="t_h" type="number" min="1" defaultValue={t.h} /></div>
            <div><label htmlFor="t_qty">Menge</label><input id="t_qty" name="t_qty" type="number" min="1" defaultValue={t.qty} /></div>
            <div>
              <label htmlFor="t_colors">Farben</label>
              <input id="t_colors" name="t_colors" type="number" min="1" max="11" defaultValue={t.colors} />
            </div>
            <div>
              <label htmlFor="t_sorten">Sorten</label>
              <input id="t_sorten" name="t_sorten" type="number" min="1" max="20" defaultValue={t.sorten} />
              <p className="field-hint">Verschiedene Motive</p>
            </div>
            <div>
              <label htmlFor="t_finishing">Oberfläche</label>
              <select id="t_finishing" name="t_finishing" defaultValue={t.finishing}>
                <option value="GLAENZEND">Glänzend</option>
                <option value="MATT">Matt</option>
              </select>
            </div>
            <div>
              <label htmlFor="t_form">Form</label>
              <select id="t_form" name="t_form" defaultValue={t.form}>
                <option value="RECHTECKIG">Rechteckig</option>
                <option value="OVAL">Oval / Rund</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "0.85rem" }}>
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" name="t_weiss" value="1" defaultChecked={t.weiss} />
              <span>Weißunterdruck (+1 Farbe)</span>
            </label>
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" name="t_tiefkuehl" value="1" defaultChecked={t.tiefkuehl} />
              <span>Tiefkühlgeeignet (−20 °C)</span>
            </label>
          </div>
          <div className="inline-actions" style={{ marginTop: "1rem" }}>
            <button type="submit" className="cta-button">Preis berechnen</button>
          </div>
        </form>

        {explanation && (
          <div style={{
            marginTop: "1.25rem",
            background: "var(--color-surface-alt, #f7f6f3)",
            border: "1px solid var(--color-border, #e5e5e5)",
            borderRadius: "0.625rem",
            padding: "1rem 1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "0.95rem" }}>
                {explanation.quoteRequired ? "⚠ Angebotsanfrage erforderlich (Maße/Menge über Limit)" : `Gewählte Methode: ${explanation.chosenMethod === "DIGITAL" ? "Digitaldruck" : "Flexodruck"}`}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted, #888)" }}>
                {Math.round(t.w)} × {Math.round(t.h)} mm · {Math.round(t.qty).toLocaleString("de-DE")} Stk · {effColors} Farben{t.weiss ? " (inkl. Weiß)" : ""} · {t.sorten} Sorte(n) · {t.finishing === "MATT" ? "Matt" : "Glanz"} · {t.form === "OVAL" ? "Oval" : "Rechteckig"}{t.tiefkuehl ? " · Tiefkühl" : ""}
              </span>
            </div>

            {!explanation.quoteRequired && (
              <>
                {/* Gemeinsame Größen */}
                <FormulaBlock title="Flächen">
                  <FLine>Labelfläche = (Breite × Höhe) / 1.000.000 = ({Math.round(t.w)} × {Math.round(t.h)}) / 1.000.000 = <b>{num(explanation.labelAreaM2, 6)} m²/Stk</b></FLine>
                  <FLine>Gesamtfläche = Labelfläche × Menge × (1 + Ausschuss%) = {num(explanation.labelAreaM2, 6)} × {Math.round(t.qty).toLocaleString("de-DE")} × (1 + {num(explanation.wasteFactorPct, 0)}%) = <b>{num(explanation.totalAreaM2, 3)} m²</b></FLine>
                  <FLine>Versand = Gewichts-Staffel({num(explanation.shippingWeightKg, 3)} kg) = <b>{eur(explanation.shippingCost)} €</b></FLine>
                </FormulaBlock>

                {/* Flexo */}
                <FormulaBlock title={`Flexodruck${explanation.chosenMethod === "FLEXO" ? " ✓ gewählt" : ""}`}>
                  <FLine>Material = Materialrate ({t.finishing === "MATT" ? "Matt" : "Glanz"}) × Gesamtfläche = {num(explanation.materialRatePerM2, 4)} × {num(explanation.totalAreaM2, 3)} = <b>{eur(explanation.flexo.materialCost)} €</b></FLine>
                  <FLine>Farben = Farbkosten/m²/Farbe × Farben × Gesamtfläche = {num(explanation.flexo.inkCostPerM2PerColor, 4)} × {effColors} × {num(explanation.totalAreaM2, 3)} = <b>{eur(explanation.flexo.inkCost)} €</b></FLine>
                  <FLine>Platten = Farben × Plattenkosten/Farbe × Sorten = {effColors} × {num(explanation.flexo.platePerColor, 2)} × {t.sorten} = <b>{eur(explanation.flexo.plateCost)} €</b></FLine>
                  <FLine>Produktionskosten = Material + Farben + Platten + Versand = <b>{eur(explanation.flexo.productionCost)} €</b></FLine>
                  <FLine>Aufschlag (Mengenstaffel) = <b>× {num(explanation.flexo.multiplier, 2)}</b></FLine>
                  <FLine>Flexo-Verkaufspreis = Produktionskosten × Aufschlag = {eur(explanation.flexo.productionCost)} × {num(explanation.flexo.multiplier, 2)} = <b>{eur(explanation.flexo.sellingPrice)} €</b></FLine>
                </FormulaBlock>

                {/* Digital */}
                <FormulaBlock title={`Digitaldruck${explanation.chosenMethod === "DIGITAL" ? " ✓ gewählt" : ""}`}>
                  <FLine>Digital-Kosten (intern) = Kosten/m² × Gesamtfläche + Versand = {num(explanation.digital.costPerM2, 4)} × {num(explanation.totalAreaM2, 3)} + {eur(explanation.shippingCost)} = <b>{eur(explanation.digital.cost)} €</b></FLine>
                  <FLine>Digital-Verkaufspreis = Preis/m² × Gesamtfläche + Versand = {num(explanation.digital.sellingPricePerM2, 4)} × {num(explanation.totalAreaM2, 3)} + {eur(explanation.shippingCost)} = <b>{eur(explanation.digital.sellingPrice)} €</b></FLine>
                </FormulaBlock>

                {/* Auswahl & Aufschläge */}
                <FormulaBlock title="Methodenwahl & Aufschläge">
                  <FLine>Gewählt wird die Methode mit den niedrigeren Produktionskosten → <b>{explanation.chosenMethod === "DIGITAL" ? "Digitaldruck" : "Flexodruck"}</b></FLine>
                  <FLine>Basis-Verkaufspreis = <b>{eur(explanation.baseSellingPrice)} €</b></FLine>
                  {t.tiefkuehl && explanation.freezerApplied ? (
                    <FLine>Tiefkühl-Aufpreis = (Tiefkühlrate − Standardrate) × Gesamtfläche × Aufschlag = ({num(explanation.freezerRatePerM2 ?? 0, 4)} − {num(explanation.materialRatePerM2, 4)}) × {num(explanation.totalAreaM2, 3)} × {num(explanation.chosenMethod === "DIGITAL" ? 1 : explanation.flexo.multiplier, 2)} = <b>{eur(explanation.freezerPremium)} €</b></FLine>
                  ) : t.tiefkuehl ? (
                    <FLine>Tiefkühl gewählt, aber keine Tiefkühlrate für dieses Material hinterlegt → kein Aufpreis.</FLine>
                  ) : null}
                  {ovalSurchargeNet > 0 ? (
                    <FLine>Sonderform (Oval/Rund) = {num(OVAL_SURCHARGE_NET_PER_LABEL, 2)} €/Stk × Menge = {num(OVAL_SURCHARGE_NET_PER_LABEL, 2)} × {Math.round(t.qty).toLocaleString("de-DE")} = <b>{eur(ovalSurchargeNet)} €</b></FLine>
                  ) : null}
                  <FLine>Mindestauftragswert = {eur(explanation.minOrderValueNet)} € · Rundungsschritt = {num(explanation.roundingStepNet, 2)} €</FLine>
                </FormulaBlock>

                {/* Ergebnis */}
                <table style={{ fontSize: "0.9rem", borderCollapse: "collapse", width: "100%", marginTop: "0.5rem" }}>
                  <tfoot>
                    <tr style={{ borderTop: "1px solid var(--color-border, #e5e5e5)" }}>
                      <td style={{ paddingTop: "0.5rem", color: "var(--color-muted, #888)" }}>
                        Netto{ovalSurchargeNet > 0 ? " (inkl. Sonderform)" : ""}
                      </td>
                      <td style={{ paddingTop: "0.5rem", fontSize: "1.1rem", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                        <strong>{eur(finalNet)} €</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--color-muted, #888)" }}>Brutto (inkl. {num(explanation.vatPct, 0)}% MwSt.)</td>
                      <td style={{ fontVariantNumeric: "tabular-nums", textAlign: "right" }}><strong>{eur(finalGross)} €</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </>
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
