"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";
type Finishing = "MATT" | "GLAENZEND";
type ArtworkStatus = "artwork_ready" | "upload_after_order" | "needs_help";

type CustomSizeCheckoutFormProps = {
  materialKey: MaterialKey;
  widthMm: number;
  heightMm: number;
  quantity: number;
  mengeProMotiv?: number;
  finishing: Finishing;
  cornerRadius?: number;
  weissunterdruck?: boolean;
  klebertyp?: string;
  tiefkuehlgeeignet?: boolean;
  farbigkeit?: number;
  anzahlSorten?: number;
  uvLack?: string;
  printMethod?: "DIGITAL" | "FLEXO";
  netPrice: number;
  grossPrice: number;
  onBack: () => void;
};

function formatEur(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function getMaterialLabel(key: MaterialKey) {
  return key === "OPAQUE_PP" ? "Opak PP" : "Transparent PP";
}

export function CustomSizeCheckoutForm({
  materialKey,
  widthMm,
  heightMm,
  quantity,
  mengeProMotiv,
  finishing,
  cornerRadius = 2,
  weissunterdruck = false,
  klebertyp = "PERMANENT",
  tiefkuehlgeeignet = false,
  farbigkeit = 4,
  anzahlSorten = 1,
  uvLack = "KEIN",
  printMethod = "DIGITAL",
  netPrice,
  grossPrice,
  onBack,
}: CustomSizeCheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const vatAmount = grossPrice - netPrice;

  const handleSubmit = (formData: FormData) => {
    setErrorMessage("");
    startTransition(async () => {
      const payload = {
        materialKey,
        widthMm,
        heightMm,
        quantity,
        finishing,
        cornerRadius,
        weissunterdruck,
        klebertyp,
        tiefkuehlgeeignet,
        farbigkeit,
        anzahlSorten,
        uvLack,
        companyName: String(formData.get("companyName") ?? ""),
        contactName: String(formData.get("contactName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        vatId: String(formData.get("vatId") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        streetAddress: String(formData.get("streetAddress") ?? ""),
        addressLine2: String(formData.get("addressLine2") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        city: String(formData.get("city") ?? ""),
        country: "DE",
        rollKern: String(formData.get("rollKern") ?? ""),
        abrollrichtung: String(formData.get("abrollrichtung") ?? ""),
        maxRollendurchmesser: String(formData.get("maxRollendurchmesser") ?? ""),
        maschineName: String(formData.get("maschineName") ?? ""),
        artworkStatus: String(formData.get("artworkStatus") ?? "upload_after_order") as ArtworkStatus,
      };

      try {
        const response = await fetch("/api/checkout/create-custom-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

        if (!response.ok || !data?.url) {
          const msg = data?.error ?? "Der Checkout ist nicht verfügbar. Bitte nutzen Sie das Angebotsformular.";
          setErrorMessage(msg);
          toast.error(msg);
          return;
        }
        window.location.assign(data.url);
      } catch {
        const msg = "Der Checkout ist nicht erreichbar. Bitte nutzen Sie das Angebotsformular.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form action={handleSubmit} className="quote-form">
      <div>
        <h2>Bestelldaten eingeben</h2>
        <p className="field-hint">
          Ihre Angaben werden vor der Weiterleitung zu Stripe serverseitig geprüft und als
          Bestellung erfasst.
        </p>
      </div>

      <article className="surface-card">
        <h3>Bestellzusammenfassung</h3>
        <ul className="simple-list">
          <li>Format: {widthMm} × {heightMm} mm (Wunschformat)</li>
          <li>Material: {getMaterialLabel(materialKey)}</li>
          <li>Kleber: {klebertyp === "PERMANENT" ? "Permanent haftend" : "Wiederablösbar"}</li>
          <li>Oberfläche: {finishing === "GLAENZEND" ? "Glänzend" : "Matt"}</li>
          <li>Farbigkeit: {farbigkeit}-farbig{farbigkeit === 4 ? " (CMYK)" : ""}{weissunterdruck ? " + Weißunterdruck" : ""}</li>
          {uvLack !== "KEIN" && <li>UV-Schutzlack: Glänzend</li>}
          {tiefkuehlgeeignet && <li>Tiefkühlgeeignet: Ja</li>}
          <li>Druckmethode: {printMethod === "DIGITAL" ? "Digitaldruck" : "Flexodruck"}</li>
          {anzahlSorten > 1 && mengeProMotiv ? (
            <>
              <li>Verschiedene Motive: {anzahlSorten}</li>
              <li>Menge pro Motiv: {mengeProMotiv.toLocaleString("de-DE")} Stück</li>
              <li>Menge gesamt: {quantity.toLocaleString("de-DE")} Stück</li>
            </>
          ) : (
            <li>Menge: {quantity.toLocaleString("de-DE")} Stück</li>
          )}
          <li>Gesamt Netto: {formatEur(netPrice)}</li>
          <li>MwSt. 19 %: {formatEur(vatAmount)}</li>
          <li>
            <strong>Gesamt brutto: {formatEur(grossPrice)} inkl. 19 % MwSt.</strong>
          </li>
          <li>Versand nach Deutschland: inklusive</li>
        </ul>
        <p className="field-hint">
          Lieferzeit: ca. 10–14 Werktage nach Ihrer Druckdaten-Freigabe (Produktion + Versand nach
          Deutschland). Voraussichtlicher Zeitraum, keine bindende Garantie.
        </p>
      </article>

      <div className="form-grid">
        <div className="form-group">
          <span className="form-group-title">Unternehmen</span>
        </div>
        <div className="field">
          <label htmlFor="cs-companyName">Firmenname</label>
          <input id="cs-companyName" name="companyName" required />
        </div>
        <div className="field">
          <label htmlFor="cs-contactName">Ansprechpartner</label>
          <input id="cs-contactName" name="contactName" required />
        </div>
        <div className="field">
          <label htmlFor="cs-email">E-Mail</label>
          <input id="cs-email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="cs-phone">Telefon</label>
          <input id="cs-phone" name="phone" type="tel" required />
        </div>
        <div className="field">
          <label htmlFor="cs-vatId">USt-IdNr. (optional)</label>
          <input id="cs-vatId" name="vatId" />
        </div>

        <div className="form-group">
          <span className="form-group-title">Lieferadresse</span>
        </div>
        <div className="field-full">
          <label htmlFor="cs-streetAddress">Straße und Hausnummer</label>
          <input id="cs-streetAddress" name="streetAddress" required />
        </div>
        <div className="field-full">
          <label htmlFor="cs-addressLine2">Adresszusatz (optional)</label>
          <input id="cs-addressLine2" name="addressLine2" />
        </div>
        <div className="field">
          <label htmlFor="cs-postalCode">PLZ</label>
          <input id="cs-postalCode" name="postalCode" required />
        </div>
        <div className="field">
          <label htmlFor="cs-city">Ort</label>
          <input id="cs-city" name="city" required />
        </div>

        <div className="form-group">
          <span className="form-group-title">Rollenspezifikationen</span>
        </div>
        <div className="field">
          <label htmlFor="cs-rollKern">Rollenkern (Innendurchmesser)</label>
          <select id="cs-rollKern" name="rollKern" defaultValue="">
            <option value="">Keine Angabe</option>
            <option value="76 mm">76 mm (Standard)</option>
            <option value="40 mm">40 mm (Kleinspule)</option>
            <option value="Nicht sicher / Bitte beraten">Nicht sicher / Bitte beraten</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="cs-abrollrichtung">Abrollrichtung</label>
          <select id="cs-abrollrichtung" name="abrollrichtung" defaultValue="">
            <option value="">Keine Angabe (Standard)</option>
            <option value="Abrollung 1 – von außen, Etikett oben">Abrollung 1 – von außen, Etikett oben</option>
            <option value="Abrollung 2 – von außen, Etikett unten">Abrollung 2 – von außen, Etikett unten</option>
            <option value="Abrollung 3 – von innen, Etikett oben">Abrollung 3 – von innen, Etikett oben</option>
            <option value="Abrollung 4 – von innen, Etikett unten">Abrollung 4 – von innen, Etikett unten</option>
            <option value="Nicht sicher / Bitte beraten">Nicht sicher / Bitte beraten</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="cs-maxRollendurchmesser">Max. Rollendurchmesser (optional)</label>
          <input id="cs-maxRollendurchmesser" name="maxRollendurchmesser" placeholder="z. B. 200 mm" />
        </div>
        <div className="field">
          <label htmlFor="cs-maschineName">Maschine / Etikettenspender (optional)</label>
          <input id="cs-maschineName" name="maschineName" placeholder="z. B. HERMA 400, Zebra ZT411" />
        </div>

        <div className="form-group">
          <span className="form-group-title">Druckdatenstatus</span>
        </div>
        <div className="field-full">
          <label htmlFor="cs-artworkStatus">Wie möchten Sie mit den Druckdaten fortfahren?</label>
          <select id="cs-artworkStatus" name="artworkStatus" defaultValue="upload_after_order">
            <option value="artwork_ready">
              Druckdaten sind bereit – werden direkt nach der Zahlung hochgeladen
            </option>
            <option value="upload_after_order">Druckdaten folgen nach der Bestellung</option>
            <option value="needs_help">Ich brauche Hilfe bei Datei oder Gestaltung</option>
          </select>
        </div>
        <div className="field-full">
          <label htmlFor="cs-notes">Hinweise (optional)</label>
          <textarea
            id="cs-notes"
            name="notes"
            rows={4}
            placeholder="Lieferhinweise, interne Referenz, Druckdatenhinweise oder Fragen."
          />
        </div>
      </div>

      {errorMessage ? <p className="form-status error">{errorMessage}</p> : null}

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={isPending}>
          {isPending ? "Weiter zu Stripe..." : "Zur Zahlung weiter"}
        </button>
        <button type="button" className="secondary-link" onClick={onBack}>
          Zurück zum Kalkulator
        </button>
      </div>
    </form>
  );
}
