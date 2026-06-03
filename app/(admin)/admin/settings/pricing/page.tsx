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
        <h2>Preisparameter sind derzeit nicht verfuegbar.</h2>
        <p>Die Datenbankverbindung fehlt.</p>
      </article>
    );
  }

  const settings = snapshot.settings ?? getDefaultPricingSettings();
  const calcResult = feedback.calcMethod
    ? {
        material: feedback.calcMaterial ?? "",
        widthMm: feedback.calcWidthMm ?? "",
        heightMm: feedback.calcHeightMm ?? "",
        quantity: feedback.calcQuantity ?? "",
        quoteRequired: feedback.calcQuoteRequired === "true",
        method: feedback.calcMethod,
        net: feedback.calcNet,
        gross: feedback.calcGross,
        digital: feedback.calcDigital,
        flexo: feedback.calcFlexo,
        production: feedback.calcProduction,
        labelArea: feedback.calcLabelArea,
        totalArea: feedback.calcTotalArea,
      }
    : null;

  return (
    <section className="section-stack">
      <article className="surface-card">
        <h2>Preisparameter fuer Custom Size</h2>
        <p className="price-note">
          Nur fuer den internen Rechner. Keine kundenseitige Freigabe in diesem Schritt.
        </p>
        {feedback.message ? <p className="form-status success">{feedback.message}</p> : null}
        {feedback.error ? <p className="form-status error">{feedback.error}</p> : null}
      </article>

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
              <label htmlFor="widthMm">Breite in mm</label>
              <input id="widthMm" name="widthMm" type="number" min="1" defaultValue="100" />
            </div>
            <div>
              <label htmlFor="heightMm">Hoehe in mm</label>
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
              <li>Material: {calcResult.material}</li>
              <li>
                Format: {calcResult.widthMm} × {calcResult.heightMm} mm
              </li>
              <li>Menge: {calcResult.quantity}</li>
              <li>Quote erforderlich: {calcResult.quoteRequired ? "Ja" : "Nein"}</li>
              <li>Gewaehlte Methode: {calcResult.method}</li>
              <li>Digitalkosten: €{calcResult.digital} netto</li>
              <li>Flexokosten: €{calcResult.flexo} netto</li>
              <li>Produktionskosten: €{calcResult.production} netto</li>
              <li>Labelflaeche: {calcResult.labelArea} m²</li>
              <li>Gesamtflaeche inkl. Ausschuss: {calcResult.totalArea} m²</li>
              <li>Verkauf netto: €{calcResult.net}</li>
              <li>Verkauf brutto: €{calcResult.gross}</li>
            </ul>
          </div>
        ) : null}
      </article>

      <article className="surface-card">
        <h2>Preisparameter speichern</h2>
        <form action="/api/admin/settings/pricing" method="post" className="quote-form">
          <div className="section-stack">
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
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-digitalPrintCostPerM2`}>
                        Digitalkosten pro m²
                      </label>
                      <input
                        id={`${materialKey}-digitalPrintCostPerM2`}
                        name={`${materialKey}.digitalPrintCostPerM2`}
                        type="number"
                        min="0.01"
                        step="0.0001"
                        defaultValue={formatPricingNumber(material.digitalPrintCostPerM2, 4)}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-flexoPrintCostPerM2`}>
                        Flexokosten pro m²
                      </label>
                      <input
                        id={`${materialKey}-flexoPrintCostPerM2`}
                        name={`${materialKey}.flexoPrintCostPerM2`}
                        type="number"
                        min="0.01"
                        step="0.0001"
                        defaultValue={formatPricingNumber(material.flexoPrintCostPerM2, 4)}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-flexoPlateCost`}>
                        Flexo-Klischee netto
                      </label>
                      <input
                        id={`${materialKey}-flexoPlateCost`}
                        name={`${materialKey}.flexoPlateCost`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={formatPricingNumber(material.flexoPlateCost)}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-wasteFactorPct`}>
                        Ausschuss in %
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
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-targetMarginPct`}>
                        Zielmarge in %
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
                    </div>
                    <div>
                      <label htmlFor={`${materialKey}-setupFeeNet`}>
                        Setup-Fee netto
                      </label>
                      <input
                        id={`${materialKey}-setupFeeNet`}
                        name={`${materialKey}.setupFeeNet`}
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={formatPricingNumber(material.setupFeeNet)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="section-card">
              <h3>Globale Einstellungen</h3>
              <p className="price-note">
                Zuletzt aktualisiert: {formatPricingDate(snapshot.settings?.updatedAt)} durch{" "}
                {snapshot.settings?.updatedBy ?? "System"}
              </p>
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
                </div>
                <div>
                  <label htmlFor="settings-customMaxHeightMm">Max. Hoehe in mm</label>
                  <input
                    id="settings-customMaxHeightMm"
                    name="settings.customMaxHeightMm"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={settings.customMaxHeightMm}
                  />
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
                </div>
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
                    defaultValue={formatPricingNumber(
                      settings.designServiceFreeThresholdNet,
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="settings-physicalProofNet">Physischer Andruck netto</label>
                  <input
                    id="settings-physicalProofNet"
                    name="settings.physicalProofNet"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={formatPricingNumber(settings.physicalProofNet)}
                  />
                </div>
                <div>
                  <label htmlFor="settings-expressNet">Express netto</label>
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

      <article className="surface-card">
        <h2>Aenderungsprotokoll</h2>
        {snapshot.audits.length === 0 ? (
          <p className="price-note">Noch keine Aenderungen gespeichert.</p>
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
